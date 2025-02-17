import { Vulnerability } from "./types";

export const VULNERABILITY_STATUSES = [
  {
    id: "reported",
    name: "Reported",
    color: "gray",
  },
  {
    id: "pending",
    name: "Pending Fix",
    color: "pink",
  },
  {
    id: "in_progress",
    name: "In Progress",
    color: "amber",
  },
  {
    id: "validation",
    name: "Validation",
    color: "blue",
  },
  {
    id: "false_positive",
    name: "False Positive",
    color: "red",
  },
  {
    id: "solved",
    name: "Solved",
    color: "green",
  },
];

export const VULNERABILITY_SEVERITIES = [
  {
    id: "low",
    name: "Low",
    color: "blue",
  },
  {
    id: "medium",
    name: "Medium",
    color: "gray",
  },
  {
    id: "high",
    name: "High",
    color: "amber",
  },
  {
    id: "critical",
    name: "Critical",
    color: "red",
  },
];

export const EMPTY_VULNERABILITY = {
  title: "",
  description: "",
  severity: "",
  cwe: "",
  status: "Reported",
} as Vulnerability;

export const USERS = [
  {
    id: 1,
    name: "John Doe",
    src: "https://i.pravatar.cc/64?img=68",
  },
  {
    id: 2,
    name: "Jane Doe",
    src: "https://i.pravatar.cc/64?img=32",
  },
  {
    id: 3,
    name: "John Smith",
    src: "https://i.pravatar.cc/64?img=59",
  },
  {
    id: 4,
    name: "Jane Smith",
    src: "https://i.pravatar.cc/64?img=25",
  },
];
