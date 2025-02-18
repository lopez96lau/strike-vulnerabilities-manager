import { useState } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Vulnerability } from "@/app/vulnerabilities/types";
import { useToasts } from "@geist-ui/core";

export function useDragAndDrop(
  onVulnerabilityUpdate: (vuln: Vulnerability) => Promise<boolean>,
  setLoading: (loading: boolean) => void
) {
  const [activeVuln, setActiveVuln] = useState<Vulnerability | null>(null);
  const { setToast } = useToasts();

  const handleDragStart = (
    event: DragStartEvent,
    vulnerabilities: Vulnerability[]
  ) => {
    const vuln = vulnerabilities.find((v) => v.id === event.active.id);
    if (vuln) setActiveVuln(vuln);
  };

  const handleDragEnd = async (
    event: DragEndEvent,
    vulnerabilities: Vulnerability[]
  ) => {
    const { active, over } = event;
    if (!over) return;

    const vuln = vulnerabilities.find((v) => v.id === active.id);
    const newStatus = over.id as string;

    if (!vuln || vuln.status === newStatus) {
      setActiveVuln(null);
      return;
    }

    // Validate status change
    if (newStatus === "In Progress" && !vuln.assignedTo) {
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
      if (!vuln.assignedTo || !vuln.evidence) {
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

    try {
      setLoading(true);
      const success = await onVulnerabilityUpdate({
        ...vuln,
        status: newStatus,
      });

      if (!success) {
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
      }
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

  return {
    activeVuln,
    handleDragStart,
    handleDragEnd,
  };
}
