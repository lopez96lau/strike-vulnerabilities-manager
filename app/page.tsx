"use client";
import { useEffect, useState } from "react";
import { Button, Page, Select, Text, useToasts } from "@geist-ui/core";
import Image from "next/image";
import VulnerabilityCard from "@/components/VulnerabilityCard";
import AddVulnerabilityModal from "@/components/AddVulnerabilityModal";
import { Vulnerability } from "./vulnerabilities/types";
import {
  EMPTY_VULNERABILITY,
  VULNERABILITY_SEVERITIES,
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
import {
  getSeverityIcon,
  getSeverityValue,
  getStatusColor,
} from "@/utils/assets";
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
  const [filters, setFilters] = useState<
    Record<string, { severity?: string; sortBy?: string }>
  >({});
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

  const filterAndSortVulnerabilities = (
    vulnerabilities: Vulnerability[],
    statusName: string
  ) => {
    let filtered = [...vulnerabilities];
    const columnFilters = filters[statusName] || {};

    // Aplicar filtro por severity
    if (columnFilters.severity) {
      filtered = filtered.filter((v) => v.severity === columnFilters.severity);
    }

    // Aplicar ordenamiento
    if (columnFilters.sortBy) {
      filtered.sort((a, b) => {
        switch (columnFilters.sortBy) {
          case "severity":
            return b.severity.localeCompare(a.severity);
          case "date":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return filtered;
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

  const badgeColorVariants = {
    gray: "bg-gray-700",
    pink: "bg-pink-700",
    amber: "bg-amber-700",
    blue: "bg-blue-700",
    red: "bg-red-700",
    green: "bg-green-700",
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
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex w-full justify-between items-center">
                        <Text h4 className="!m-0">
                          {status.name}
                        </Text>
                        <div
                          className={`${
                            badgeColorVariants[
                              status.color as keyof typeof badgeColorVariants
                            ]
                          } text-black rounded-full px-2`}
                        >
                          <Text h5 className="!m-0 text-white">
                            {
                              data.filter(
                                (vuln: Vulnerability) =>
                                  vuln.status === status.name
                              ).length
                            }
                          </Text>
                        </div>
                      </div>
                      <div className="flex w-full gap-3">
                        <Select
                          scale={2 / 3}
                          placeholder="Filter"
                          value={filters[status.name]?.severity}
                          className="!w-full"
                          onChange={(val) => {
                            setFilters((prev) => ({
                              ...prev,
                              [status.name]: {
                                ...prev[status.name],
                                severity: val as string,
                              },
                            }));
                          }}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {VULNERABILITY_SEVERITIES.map((severity) => (
                            <Select.Option
                              value={severity.name}
                              key={severity.id}
                            >
                              <div className="flex gap-2 items-center">
                                {getSeverityIcon(
                                  getSeverityValue(severity.name)
                                )}
                                {severity.name}
                              </div>
                            </Select.Option>
                          ))}
                        </Select>
                        <Select
                          scale={2 / 3}
                          placeholder="Sort by"
                          value={filters[status.name]?.sortBy}
                          className="!w-full"
                          onChange={(val) => {
                            setFilters((prev) => ({
                              ...prev,
                              [status.name]: {
                                ...prev[status.name],
                                sortBy: val as string,
                              },
                            }));
                          }}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <Select.Option value="severity">
                            Severity
                          </Select.Option>
                          <Select.Option value="date">Date</Select.Option>
                          <Select.Option value="title">Title</Select.Option>
                        </Select>
                      </div>
                      {(filters[status.name]?.severity ||
                        filters[status.name]?.sortBy) && (
                        <Button
                          scale={2 / 3}
                          auto
                          px={0.6}
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              [status.name]: {
                                severity: "",
                                sortBy: "",
                              },
                            }));
                          }}
                          type="secondary"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!loading
                      ? filterAndSortVulnerabilities(
                          data.filter(
                            (vuln: Vulnerability) => vuln.status === status.name
                          ),
                          status.name
                        ).map((vuln: Vulnerability) => (
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
