"use client";
import { useEffect, useState } from "react";
import { Button, Page, Text } from "@geist-ui/core";
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

export default function Vulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdating, setIsModalUpdating] = useState(false);
  const [formData, setFormData] = useState(EMPTY_VULNERABILITY);

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
      setFormData(EMPTY_VULNERABILITY);
      fetchVulnerabilities();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
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
              onClick={() => setIsModalOpen(true)}
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
              <div
                key={status.id}
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
                  }}
                >
                  {!loading
                    ? data
                        .filter(
                          (vuln: Vulnerability) => vuln.status === status.name
                        )
                        .map((vuln: Vulnerability) => (
                          <VulnerabilityCard
                            {...vuln}
                            color={status.color}
                            key={vuln.id}
                          />
                        ))
                    : Array(4)
                        .fill(null)
                        .map((_, index) => (
                          <VulnerabilityCardSkeleton key={index} />
                        ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddVulnerabilityModal
          isOpen={isModalOpen}
          isUpdating={isModalUpdating}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </Page.Content>
    </Page>
  );
}
