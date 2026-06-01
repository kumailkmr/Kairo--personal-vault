import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBGoalData {
  owner_id: string;
  objective: string;
  description?: string;
  time_horizon: string;
  progress: number;
  status: string;
}

export const GoalRepository = {
  async getGoals() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      title: item.objective,
      status: item.status.toLowerCase() as any,
      category: (item.description?.includes("business") ? "business" : item.description?.includes("ai") ? "ai" : "personal") as any,
      progress: item.progress,
      targetDate: item.time_horizon
    }));
  },

  async createGoal(data: DBGoalData & { id?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("goals")
      .insert({
        owner_id: data.owner_id,
        objective: data.objective,
        description: data.description || "",
        time_horizon: data.time_horizon,
        progress: data.progress,
        status: data.status.toUpperCase()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateGoalProgress(id: string, progress: number, status?: string) {
    const client = await createKairoServerClient();
    const updatePayload: any = { progress };
    if (status) updatePayload.status = status.toUpperCase();
    if (progress === 100) updatePayload.status = "COMPLETED";

    const { data, error } = await client
      .from("goals")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Roadmap items
  async getRoadmapItems(goalId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("roadmap_items")
      .select("*")
      .eq("goal_id", goalId)
      .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async createRoadmapItem(data: { goal_id: string; title: string; due_date: string; status?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("roadmap_items")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  // Execution tasks
  async getExecutionTasks(goalId?: string) {
    const client = await createKairoServerClient();
    const baseQuery = client.from("execution_tasks").select("*");
    const { data, error } = goalId ? await baseQuery.eq("goal_id", goalId) : await baseQuery;

    if (error) throw new Error(error.message);
    return data;
  },

  async createExecutionTask(data: { goal_id: string; title: string; status?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("execution_tasks")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async toggleExecutionTask(taskId: string) {
    const client = await createKairoServerClient();
    const { data: task } = await client
      .from("execution_tasks")
      .select("status")
      .eq("id", taskId)
      .single();

    const nextStatus = task?.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    const { data: dbData, error } = await client
      .from("execution_tasks")
      .update({ status: nextStatus })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  }
};
