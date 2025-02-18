import { useDroppable } from "@dnd-kit/core";
import { Text, Select, Button } from "@geist-ui/core";
import DraggableVulnerabilityCard from "../DraggableVulnerabilityCard";
import VulnerabilityCardSkeleton from "../VulnerabilityCardSkeleton";
import { VULNERABILITY_SEVERITIES } from "@/constants";
import { getSeverityIcon, getSeverityValue } from "@/utils/assets";
import { Vulnerability } from "@/types";

interface StatusColumnProps {
  status: {
    id: string;
    name: string;
    color: string;
  };
  vulnerabilities: Vulnerability[];
  loading: boolean;
  filters: Record<string, { severity?: string; sortBy?: string }>;
  onFilterChange: (
    statusName: string,
    type: "severity" | "sortBy",
    value: string
  ) => void;
  onClearFilters: (statusName: string) => void;
  onVulnerabilityClick: (vulnerability: Vulnerability) => void;
}

const colorVariants = {
  gray: "bg-gray-50",
  pink: "bg-pink-50",
  amber: "bg-amber-50",
  blue: "bg-blue-50",
  red: "bg-red-50",
  green: "bg-green-50",
};

const badgeColorVariants = {
  gray: "bg-gray-200 text-gray-900",
  pink: "bg-pink-200 text-pink-900",
  amber: "bg-amber-200 text-amber-900",
  blue: "bg-blue-200 text-blue-900",
  red: "bg-red-200 text-red-900",
  green: "bg-green-200 text-green-900",
};

const borderColorVariants = {
  gray: "border-gray-900",
  pink: "border-pink-900",
  amber: "border-amber-900",
  blue: "border-blue-900",
  red: "border-red-900",
  green: "border-green-900",
};

export function StatusColumn({
  status,
  vulnerabilities,
  loading,
  filters,
  onFilterChange,
  onClearFilters,
  onVulnerabilityClick,
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.name,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 shadow w-[-webkit-fill-available] sm:w-[440px] rounded-[10px] p-4 border ${
        isOver
          ? `${
              borderColorVariants[
                status.color as keyof typeof borderColorVariants
              ]
            } border-2`
          : "border-gray-400"
      } ${colorVariants[status.color as keyof typeof colorVariants]}`}
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
              } rounded-full px-2`}
            >
              <Text h5 className="!m-0 text-white">
                {vulnerabilities.length}
              </Text>
            </div>
          </div>
          <div className="flex w-full gap-3 flex-wrap sm:flex-nowrap">
            <Select
              scale={2 / 3}
              placeholder="Filter"
              value={filters[status.name]?.severity}
              className="!w-full"
              onChange={(val) => {
                onFilterChange(status.name, "severity", val as string);
              }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {VULNERABILITY_SEVERITIES.map((severity) => (
                <Select.Option value={severity.name} key={severity.id}>
                  <div className="flex gap-2 items-center">
                    {getSeverityIcon(getSeverityValue(severity.name))}
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
                onFilterChange(status.name, "sortBy", val as string);
              }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Select.Option value="severity">Severity</Select.Option>
              <Select.Option value="date">Date</Select.Option>
              <Select.Option value="title">Title</Select.Option>
            </Select>
          </div>
          {(filters[status.name]?.severity || filters[status.name]?.sortBy) && (
            <Button
              scale={2 / 3}
              auto
              px={0.6}
              onClick={() => onClearFilters(status.name)}
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
      <div className="flex flex-col gap-4 min-h-[200px]">
        {!loading
          ? vulnerabilities.map((vuln) => (
              <DraggableVulnerabilityCard
                key={vuln.id}
                vulnerability={vuln}
                color={status.color}
                onClick={() => onVulnerabilityClick(vuln)}
              />
            ))
          : Array(4)
              .fill(null)
              .map((_, index) => <VulnerabilityCardSkeleton key={index} />)}
      </div>
    </div>
  );
}
