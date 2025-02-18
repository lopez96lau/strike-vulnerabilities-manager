"use client";
import { useState } from "react";
import { Button, Page, Text } from "@geist-ui/core";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import Image from "next/image";
import Link from "next/link";
import { Github, Plus } from "@geist-ui/icons";
import StatusColumn from "@/components/StatusColumn";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import AddVulnerabilityModal from "@/components/AddVulnerabilityModal";
import VulnerabilityDetailsModal from "@/components/VulnerabilityDetailsModal";
import { Vulnerability } from "./vulnerabilities/types";
import { getStatusColor } from "@/utils/assets";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { useVulnerabilityFilters } from "@/hooks/useVulnerabilityFilters";
import logo from "@/public/assets/icons/logo.svg";
import {
  EMPTY_VULNERABILITY,
  VULNERABILITY_STATUSES,
} from "./vulnerabilities/constants";

export default function Vulnerabilities() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalUpdating, setIsModalUpdating] = useState(false);
  const [formData, setFormData] = useState(EMPTY_VULNERABILITY);
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<Vulnerability | null>(null);

  const { data, loading, setLoading, handleSubmit, handleEdit, handleDelete } =
    useVulnerabilities();
  const { filters, setFilters, filterAndSortVulnerabilities } =
    useVulnerabilityFilters();
  const { activeVuln, handleDragStart, handleDragEnd } = useDragAndDrop(
    handleEdit,
    setLoading
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleVulnerabilityClick = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setFormData(vulnerability);
    setIsDetailsModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setFormData(EMPTY_VULNERABILITY);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedVulnerability(null);
    setFormData(EMPTY_VULNERABILITY);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => handleDragStart(e, data)}
      onDragEnd={(e) => handleDragEnd(e, data)}
    >
      <Page className="!m-0 !p-0 !w-full">
        <Page.Header className="!sticky">
          <div className="flex justify-between items-center p-4 border border-b-gray-400">
            <div className="flex gap-2 items-center">
              <Image src={logo} alt="logo" height={16} />
              <Text h3 className="!m-0">
                Strike Vulnerabilities Manager
              </Text>
            </div>
            <div className="flex gap-4 items-center">
              <Link
                href="https://github.com/lopez96lau/strike-vulnerabilities-manager"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github color="gray" size={20} />
              </Link>
              <Button
                auto
                type="secondary"
                onClick={() => setIsAddModalOpen(true)}
                iconRight={<Plus />}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Add Vulnerability
              </Button>
            </div>
          </div>
        </Page.Header>
        <Page.Content className="!p-0">
          <div className="overflow-hidden">
            <div className="flex flex-row gap-4 overflow-x-auto h-full p-4">
              {VULNERABILITY_STATUSES.map((status) => (
                <StatusColumn
                  key={status.id}
                  status={status}
                  vulnerabilities={filterAndSortVulnerabilities(
                    data.filter(
                      (vuln: Vulnerability) => vuln.status === status.name
                    ),
                    status.name
                  )}
                  loading={loading}
                  filters={filters}
                  onFilterChange={(statusName, type, value) => {
                    setFilters((prev) => ({
                      ...prev,
                      [statusName]: { ...prev[statusName], [type]: value },
                    }));
                  }}
                  onClearFilters={(statusName) => {
                    setFilters((prev) => ({
                      ...prev,
                      [statusName]: { severity: "", sortBy: "" },
                    }));
                  }}
                  onVulnerabilityClick={handleVulnerabilityClick}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeVuln && (
              <VulnerabilityCard
                {...activeVuln}
                color={getStatusColor(activeVuln.status)}
                onClick={() => {}}
              />
            )}
          </DragOverlay>
        </Page.Content>

        <AddVulnerabilityModal
          isOpen={isAddModalOpen}
          isUpdating={isModalUpdating}
          handleClose={handleAddModalClose}
          handleSubmit={async () => {
            setIsModalUpdating(true);
            const success = await handleSubmit(formData);
            if (success) {
              setIsAddModalOpen(false);
              setFormData(EMPTY_VULNERABILITY);
            }
            setIsModalUpdating(false);
          }}
          formData={formData}
          setFormData={setFormData}
        />

        <VulnerabilityDetailsModal
          isOpen={isDetailsModalOpen}
          isUpdating={isModalUpdating}
          handleClose={handleDetailsModalClose}
          handleSubmit={async (updatedData?: Vulnerability) => {
            setIsModalUpdating(true);
            const success = await handleEdit(updatedData || formData);
            if (success) {
              setIsDetailsModalOpen(false);
              setSelectedVulnerability(null);
              setFormData(EMPTY_VULNERABILITY);
            }
            setIsModalUpdating(false);
          }}
          handleDelete={async () => {
            if (selectedVulnerability) {
              setIsModalUpdating(true);
              const success = await handleDelete(
                selectedVulnerability.id.toString()
              );
              if (success) {
                setIsDetailsModalOpen(false);
                setSelectedVulnerability(null);
                setFormData(EMPTY_VULNERABILITY);
              }
              setIsModalUpdating(false);
            }
          }}
          formData={formData}
          setFormData={setFormData}
          isEditing={true}
        />
      </Page>
    </DndContext>
  );
}
