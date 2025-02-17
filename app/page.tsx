"use client";
import { useEffect, useState } from "react";
import { Button, Page, Text, useToasts } from "@geist-ui/core";
import Image from "next/image";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import AddVulnerabilityModal from "@/components/AddVulnerabilityModal";
import { Vulnerability } from "./vulnerabilities/types";
import {
  EMPTY_VULNERABILITY,
  VULNERABILITY_STATUSES,
} from "./vulnerabilities/constants";
import logo from "@/public/assets/icons/logo.svg";
import { Github, Plus } from "@geist-ui/icons";
import Link from "next/link";
import VulnerabilityCardSkeleton from "@/components/VulnerabilityCardSkeleton";
import VulnerabilityDetailsModal from "@/components/VulnerabilityDetailsModal";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { getStatusColor } from "@/utils/assets";
import DraggableVulnerabilityCard from "@/components/DraggableVulnerabilityCard";
import DroppableStatusColumn from "@/components/DroppableStatusColumn";

export default function Vulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalUpdating, setIsModalUpdating] = useState(false);
  const [formData, setFormData] = useState(EMPTY_VULNERABILITY);
  const [activeVuln, setActiveVuln] = useState<Vulnerability | null>(null);
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<Vulnerability | null>(null);

  const { setToast } = useToasts();
  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  const fetchVulnerabilities = () => {
    fetch("/api/vulnerabilities")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    setIsModalUpdating(true);
    const response = await fetch("/api/vulnerabilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setIsAddModalOpen(false);
      setIsModalUpdating(false);
      setFormData(EMPTY_VULNERABILITY);
      fetchVulnerabilities();
    }
  };

  const handleEdit = async (updatedData?: Vulnerability) => {
    setIsModalUpdating(true);
    try {
      const response = await fetch(`/api/vulnerabilities/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData || formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update vulnerability");
      }

      setIsDetailsModalOpen(false);
      setIsModalUpdating(false);
      setFormData(EMPTY_VULNERABILITY);
      setSelectedVulnerability(null);
      fetchVulnerabilities();
    } catch {
      setToast({
        text: (
          <div className="hyphens-auto">
            Ooops! Something happened while updating the vulnerability. Please
            try again.
          </div>
        ),
        type: "error",
        delay: 3000,
      });
    } finally {
      setIsModalUpdating(false);
      setLoading(true);
    }
  };

  const handleVulnerabilityClick = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setFormData(vulnerability);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async () => {
    setIsModalUpdating(true);
    const response = await fetch(
      `/api/vulnerabilities/${selectedVulnerability?.id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      setIsDetailsModalOpen(false);
      setIsModalUpdating(false);
      setFormData(EMPTY_VULNERABILITY);
      setSelectedVulnerability(null);
      fetchVulnerabilities();
    }
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

  const colorVariants = {
    gray: "bg-gray-50",
    pink: "bg-pink-50",
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    red: "bg-red-50",
    green: "bg-green-50",
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const vuln = data.find((v: Vulnerability) => v.id === event.active.id);
    if (vuln) {
      setActiveVuln(vuln);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const vuln = data.find((v: Vulnerability) => v.id === active.id);
    const newStatus = over.id as string;

    if (!vuln || (vuln as Vulnerability).status === newStatus) {
      setActiveVuln(null);
      return;
    }

    // Validate status change
    if (newStatus === "In Progress" && !(vuln as Vulnerability).assignedTo) {
      setToast({
        text: (
          <div className="hypens-auto">
            You must assign an <b>user</b> before moving to <b>{newStatus}</b>
          </div>
        ),
        type: "error",
        delay: 3000,
      });
      setActiveVuln(null);
      return;
    }

    if (["Validation", "False Positive", "Solved"].includes(newStatus)) {
      if (
        !(vuln as Vulnerability).assignedTo ||
        !(vuln as Vulnerability).evidence
      ) {
        setToast({
          text: (
            <div className="hypens-auto">
              You must assign an <b>user</b> and provide <b>evidence</b> before
              moving to <b>{newStatus}</b>
            </div>
          ),
          type: "error",
          delay: 3000,
        });
        setActiveVuln(null);
        return;
      }
    }

    // Update vulnerability
    const updatedVuln = { ...(vuln as Vulnerability), status: newStatus };
    setLoading(true);
    try {
      const response = await fetch(
        `/api/vulnerabilities/${(vuln as Vulnerability).id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVuln),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vulnerability status");
      }

      // Mantener loading mientras se obtienen los nuevos datos
      await fetchVulnerabilities();
    } catch {
      setToast({
        text: (
          <div className="hyphens-auto">
            Ooops! Something happened while updating the vulnerability. Please
            try again.
          </div>
        ),
        type: "error",
        delay: 3000,
      });
      setLoading(false);
    } finally {
      setActiveVuln(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                iconRight={<Plus />}
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
                <DroppableStatusColumn
                  key={status.id}
                  id={status.name}
                  color={status.color}
                  className={`flex-shrink-0 shadow w-[440px] rounded-[10px] p-4 border border-gray-400 ${
                    colorVariants[status.color as keyof typeof colorVariants]
                  }`}
                >
                  <Text h4 style={{ marginBottom: "1rem" }}>
                    {status.name}
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      minHeight: "200px",
                    }}
                  >
                    {!loading
                      ? data
                          .filter(
                            (vuln: Vulnerability) => vuln.status === status.name
                          )
                          .map((vuln: Vulnerability) => (
                            <DraggableVulnerabilityCard
                              key={vuln.id}
                              vulnerability={vuln}
                              color={status.color}
                              onClick={() => handleVulnerabilityClick(vuln)}
                            />
                          ))
                      : Array(4)
                          .fill(null)
                          .map((_, index) => (
                            <VulnerabilityCardSkeleton key={index} />
                          ))}
                  </div>
                </DroppableStatusColumn>
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeVuln ? (
              <VulnerabilityCard
                {...activeVuln}
                color={getStatusColor(activeVuln.status)}
                onClick={() => {}}
              />
            ) : null}
          </DragOverlay>
        </Page.Content>
        <AddVulnerabilityModal
          isOpen={isAddModalOpen}
          isUpdating={isModalUpdating}
          handleClose={handleAddModalClose}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
        <VulnerabilityDetailsModal
          isOpen={isDetailsModalOpen}
          isUpdating={isModalUpdating}
          handleClose={handleDetailsModalClose}
          handleSubmit={handleEdit}
          handleDelete={handleDelete}
          formData={formData}
          setFormData={setFormData}
          isEditing={true}
        />
      </Page>
    </DndContext>
  );
}
