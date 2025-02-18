import { useState, useEffect } from "react";
import { Vulnerability } from "@/types";
import { useToasts } from "@geist-ui/core";

export function useVulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setToast } = useToasts();

  const fetchVulnerabilities = () => {
    fetch("/api/vulnerabilities")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (formData: Vulnerability) => {
    const response = await fetch("/api/vulnerabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      fetchVulnerabilities();
      return true;
    }
    return false;
  };

  const handleEdit = async (vulnerability: Vulnerability) => {
    try {
      const response = await fetch(`/api/vulnerabilities/${vulnerability.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vulnerability),
      });

      if (!response.ok) {
        throw new Error("Failed to update vulnerability");
      }

      fetchVulnerabilities();
      return true;
    } catch {
      setToast({
        text: "Failed to update vulnerability",
        type: "error",
        delay: 3000,
      });
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/vulnerabilities/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchVulnerabilities();
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  return {
    data,
    loading,
    setLoading,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
}
