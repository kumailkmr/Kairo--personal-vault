import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBAIAgentData {
  name: string;
  agent_type: string;
  description?: string;
  status: string;
  success_rate?: number;
}

export const AIRepository = {
  async getAIAgents() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("ai_agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createAIAgent(data: DBAIAgentData) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("ai_agents")
      .insert({
        name: data.name,
        agent_type: data.agent_type,
        description: data.description || "",
        status: data.status,
        success_rate: data.success_rate || 100.0
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async getWorkflowRuns() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("workflow_runs")
      .select("*")
      .order("executed_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createWorkflowRun(data: { workflow_id: string; status: string; execution_time_ms: number; metadata?: Record<string, any> }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("workflow_runs")
      .insert({
        workflow_id: data.workflow_id,
        status: data.status,
        execution_time_ms: data.execution_time_ms,
        metadata: data.metadata || {},
        executed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  }
};
