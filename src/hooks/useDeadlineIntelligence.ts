import { useState, useEffect } from "react";
import { Project, GoalItem, Meeting } from "@/types";
import { dbService } from "@/services/db.service";

export interface DeadlineWarning {
  id: string;
  entityId: string;
  entityType: "project" | "goal" | "meeting";
  title: string;
  urgency: "critical" | "high" | "medium";
  dueDate: string;
  daysRemaining: number;
}

export function useDeadlineIntelligence() {
  const [warnings, setWarnings] = useState<DeadlineWarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function evaluateDeadlines() {
      try {
        const [projects, meetings] = await Promise.all([
          dbService.getProjects(),
          dbService.getMeetings(),
          // Assume dbService.getGoals() might be added later, for now just these two
        ]);

        if (!mounted) return;

        const newWarnings: DeadlineWarning[] = [];
        const now = new Date();
        const nowTime = now.getTime();
        const MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Evaluate Projects
        projects.forEach(project => {
          if (project.status === "completed") return;
          const due = new Date(project.dueDate);
          const diffDays = Math.ceil((due.getTime() - nowTime) / MS_PER_DAY);
          
          if (diffDays <= 7 && diffDays >= 0) {
            newWarnings.push({
              id: `proj-warn-${project.id}`,
              entityId: project.id,
              entityType: "project",
              title: `Project "${project.name}" due soon`,
              urgency: diffDays <= 2 ? "critical" : diffDays <= 4 ? "high" : "medium",
              dueDate: project.dueDate,
              daysRemaining: diffDays
            });
          } else if (diffDays < 0) {
            newWarnings.push({
              id: `proj-warn-${project.id}`,
              entityId: project.id,
              entityType: "project",
              title: `Project "${project.name}" is overdue`,
              urgency: "critical",
              dueDate: project.dueDate,
              daysRemaining: diffDays
            });
          }
        });

        // Evaluate Meetings (today/tomorrow)
        meetings.forEach(meeting => {
          // meeting.startTime is often HH:MM, but if we assume they are today:
          // In a real scenario we'd use exact ISO strings, but for now this is just an example engine
          // If the system upgrades, we'll refine this.
        });

        setWarnings(newWarnings.sort((a, b) => a.daysRemaining - b.daysRemaining));
      } catch (error) {
        console.error("Deadline Intelligence Error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    evaluateDeadlines();
    
    // Check every hour
    const interval = setInterval(evaluateDeadlines, 3600000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { warnings, loading };
}
