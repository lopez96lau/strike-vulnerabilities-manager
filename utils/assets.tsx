import {
  CriticalSeverity,
  HighSeverity,
  LowSeverity,
  MediumSeverity,
} from "@/components/SeverityIcons/SeverityIcons";

export const getSeverityIcon = (severity: number) => {
  if (severity < 4) {
    return <LowSeverity />;
  } else if (severity < 7) {
    return <MediumSeverity />;
  } else if (severity < 9) {
    return <HighSeverity />;
  } else {
    return <CriticalSeverity />;
  }
};

export const getSeverityColor = (severity: number) => {
  if (severity < 4) {
    return "blue";
  } else if (severity < 7) {
    return "gray";
  } else if (severity < 9) {
    return "amber";
  } else {
    return "red";
  }
};

export const getSeverityValue = (severity: string) => {
  if (severity === "Low") {
    return 1;
  } else if (severity === "Medium") {
    return 4;
  } else if (severity === "High") {
    return 7;
  } else {
    return 9;
  }
};
