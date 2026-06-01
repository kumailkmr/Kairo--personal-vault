import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBProjectData {
  client_id: string;
  name: string;
  description?: string;
  status: "PLANNING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "ARCHIVED" | "planning" | "in_progress" | "review" | "completed" | "archived";
  progress: number;
  budget: number;
  due_date: string;
}

export const ProjectRepository = {
  async getProjects() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("projects")
      .select("*, clients(company_name)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      name: item.name,
      clientName: (item.clients as any)?.company_name || "Unknown Client",
      status: item.status.toLowerCase() as any,
      progress: item.progress,
      budget: parseFloat(item.budget as any),
      dueDate: item.due_date.split("T")[0],
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  },

  async getProjectById(id: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("projects")
      .select("*, clients(company_name)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async createProject(data: DBProjectData & { id?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("projects")
      .insert({
        client_id: data.client_id,
        name: data.name,
        description: data.description || "",
        status: data.status.toUpperCase(),
        progress: data.progress,
        budget: data.budget,
        due_date: data.due_date
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateProject(id: string, data: Partial<DBProjectData>) {
    const client = await createKairoServerClient();
    const updatePayload: any = {};
    if (data.client_id) updatePayload.client_id = data.client_id;
    if (data.name) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.status) updatePayload.status = data.status.toUpperCase();
    if (data.progress !== undefined) updatePayload.progress = data.progress;
    if (data.budget !== undefined) updatePayload.budget = data.budget;
    if (data.due_date) updatePayload.due_date = data.due_date;

    const { data: dbData, error } = await client
      .from("projects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async deleteProject(id: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  // Milestones
  async getMilestones(projectId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("target_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async createMilestone(data: { project_id: string; title: string; description?: string; target_date: string; status?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("project_milestones")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateMilestone(id: string, data: Partial<{ title: string; description?: string; target_date: string; status: string; completed_at?: string }>) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("project_milestones")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  // Tasks
  async getTasks(projectId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createTask(data: { project_id: string; milestone_id?: string; assignee_id?: string; title: string; description?: string; due_date?: string; status: string; priority: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("project_tasks")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateTask(id: string, data: Partial<{ title: string; description?: string; due_date?: string; status: string; priority: string; assignee_id?: string; milestone_id?: string }>) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("project_tasks")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async deleteTask(id: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("project_tasks")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  }
};
