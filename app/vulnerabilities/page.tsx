"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  Card,
  Text,
  Spacer,
  Grid,
} from "@geist-ui/core";

interface Vulnerability {
  id: number;
  title: string;
  description: string;
  severity: string;
  cwe: string;
  status: string;
}

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
          auto={true}
          shadow={true}
          type="secondary"
          onClick={() => setIsModalOpen(true)}
          placeholder=""
        >
          Nueva Vulnerabilidad
        </Button>
      </div>

      <Grid.Container gap={2}>
        {data.map((vuln: Vulnerability) => (
          <Grid xs={24} sm={12} md={8} key={vuln.id}>
            <Card shadow width="100%">
              <Text h4 style={{ margin: 0 }}>
                {vuln.title}
              </Text>
              <Text type="secondary">{vuln.status}</Text>
              <Text small>{vuln.description}</Text>
              <Spacer h={0.5} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text small type="success">
                  CWE: {vuln.cwe}
                </Text>
                <Text
                  small
                  type={
                    vuln.severity.toLowerCase() === "critical"
                      ? "error"
                      : "secondary"
                  }
                >
                  {vuln.severity}
                </Text>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
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
