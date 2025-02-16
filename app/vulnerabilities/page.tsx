"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  Text,
  Spacer,
} from "@geist-ui/core";
import { VULNERABILITY_STATUSES } from "./constants";
import { VulnerabilityCard } from "@/components/VulnerabilityCard/VulnerabilityCard";
import { Vulnerability } from "./types";

export default function Vulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
    cwe: "",
    status: "Pending Fix",
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
    const response = await fetch("/api/vulnerabilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        severity: "Low",
        cwe: "",
        status: "Pending Fix",
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

      {/* Modal remains the same */}
      <Modal visible={isModalOpen} onClose={closeHandler}>
        <Modal.Title>Nueva Vulnerabilidad</Modal.Title>
        <Modal.Content>
          <form id="vulnerability-form">
            <Input
              width="100%"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
              required
            />
            <Spacer h={0.5} />
            <Textarea
              width="100%"
              title="Description"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              required
            />
            <Spacer h={0.5} />
            <Select
              width="100%"
              placeholder="Severity"
              value={formData.severity}
              onChange={(val) =>
                setFormData({ ...formData, severity: val as string })
              }
            >
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Critical">Critical</Select.Option>
            </Select>
            <Spacer h={0.5} />
            <Input
              width="100%"
              placeholder="CWE"
              name="cwe"
              value={formData.cwe}
              onChange={(e) => handleChange(e)}
              required
            />
            <Spacer h={0.5} />
            <Select
              width="100%"
              placeholder="Status"
              value={formData.status}
              onChange={(val) =>
                setFormData({ ...formData, status: val as string })
              }
            >
              <Select.Option value="Pending Fix">Pending Fix</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Solved">Solved</Select.Option>
            </Select>
          </form>
        </Modal.Content>
        <Modal.Action passive onClick={closeHandler}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={handleSubmit}>Save</Modal.Action>
      </Modal>
    </div>
  );
}
