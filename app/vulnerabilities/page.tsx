"use client";
import { useEffect, useState } from "react";
import { Button, Text } from "@geist-ui/core";
import { Vulnerability } from "./types";
import { VULNERABILITY_STATUSES } from "./constants";
import { VulnerabilityCard } from "@/components/VulnerabilityCard/VulnerabilityCard";
import { AddVulnerabilityModal } from "@/components/AddVulnerabilityModal/AddVulnerabilityModal";

export default function Vulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdating, setIsModalUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
    cwe: "",
    status: "Reported",
  });

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
      setIsModalOpen(false);
      setIsModalUpdating(false);
      setFormData({
        title: "",
        description: "",
        severity: "Low",
        cwe: "",
        status: "Reported",
      });
      fetchVulnerabilities();
    }
  };

  const closeHandler = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Text>Cargando...</Text>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const colorVariants = {
    gray: "bg-gray-50",
    pink: "bg-pink-50",
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    red: "bg-red-50",
    green: "bg-green-50",
  };

  return (
    <div className="p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <Text h2>Vulnerabilidades</Text>
        <Button
          auto
          shadow
          type="secondary"
          onClick={() => setIsModalOpen(true)}
        >
          Nueva Vulnerabilidad
        </Button>
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-row gap-4 p-4 overflow-x-auto h-full">
          {VULNERABILITY_STATUSES.map((status) => (
            <div
              key={status.id}
              className={`flex-shrink-0 shadow w-[440px] rounded-[10px] p-4 border border-gray-400 ${
                colorVariants[status.color]
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
                }}
              >
                {data
                  .filter((vuln: Vulnerability) => vuln.status === status.name)
                  .map((vuln: Vulnerability) => (
                    <VulnerabilityCard
                      {...vuln}
                      color={status.color}
                      key={vuln.id}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddVulnerabilityModal
        isOpen={isModalOpen}
        isUpdating={isModalUpdating}
        handleClose={closeHandler}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
      />
    </div>
  );
}
