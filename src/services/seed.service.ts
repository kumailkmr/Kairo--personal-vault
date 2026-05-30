import { createKairoAdminClient } from "@/lib/supabase/admin";
import { isMockMode } from "@/lib/supabase/env";

/**
 * Enterprise-grade development database seeding orchestration system.
 * Safeguards execution strictly within development/sandbox environments.
 */
export const seedService = {
  /**
   * Seeds development database with test clients, projects, meetings, notifications, and goals.
   * Enforces security bounds to prevent production pollution.
   */
  async seedDevelopmentDatabase(): Promise<{ success: boolean; seededCount: number; error: string | null }> {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        seededCount: 0,
        error: "Execution aborted. Seeding is prohibited inside production environments.",
      };
    }

    if (isMockMode) {
      console.log("ℹ️ Kairo OS Seeder: Sandbox mock mode is active. DB seeding skipped.");
      return {
        success: true,
        seededCount: 0,
        error: null,
      };
    }

    const admin = createKairoAdminClient();
    let seededCount = 0;

    try {
      console.log("⏳ Seeding Kairo OS Relational Database...");

      // 1. Fetch first available user profile to act as owner/author
      const { data: profiles, error: profileError } = await admin
        .from("user_profiles")
        .select("id")
        .limit(1);

      if (profileError || !profiles || profiles.length === 0) {
        throw new Error("No active user profiles found. Create at least one user before seeding.");
      }

      const ownerId = profiles[0].id;

      // 2. Seed Development Active Clients
      const testClients = [
        {
          owner_id: ownerId,
          company_name: "Stark Labs",
          contact_name: "Tony Stark",
          email: "tony@starklabs.com",
          monthly_retainer: 15000.0,
          retainer_status: "ACTIVE",
        },
        {
          owner_id: ownerId,
          company_name: "Wayne Enterprises",
          contact_name: "Bruce Wayne",
          email: "bruce@wayne.com",
          monthly_retainer: 25000.0,
          retainer_status: "ACTIVE",
        },
      ];

      for (const client of testClients) {
        // Upsert to prevent duplicate conflicts
        const { data, error } = await admin
          .from("clients")
          .upsert(client, { onConflict: "email" })
          .select("id")
          .single();

        if (error) throw error;
        seededCount++;

        // 3. Seed Projects linked to newly seeded Clients
        if (data) {
          const testProjects = [
            {
              client_id: data.id,
              name: `${client.company_name} AI Core Platform`,
              description: "Engineering Next-gen autonomous operational systems.",
              status: "IN_PROGRESS",
              progress: 45,
              budget: 75000.0,
              due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ];

          for (const proj of testProjects) {
            const { data: projData, error: projError } = await admin
              .from("projects")
              .insert(proj)
              .select("id")
              .single();

            if (projError) throw projError;
            seededCount++;

            // 4. Seed closing pipeline deal card
            if (projData) {
              await admin.from("closing_pipeline").insert({
                client_id: data.id,
                stage: "Requirement Analysis",
                projected_revenue: 75000.0,
              });
              seededCount++;
            }
          }
        }
      }

      // 5. Seed Goals OS parameters
      const testGoals = [
        {
          owner_id: ownerId,
          objective: "Deploy Kairo OS Production Cluster",
          description: "Initialize, verify migrations, and configure real-time Supabase publications.",
          time_horizon: "Q3",
          progress: 80,
          status: "ACTIVE",
        },
      ];

      for (const goal of testGoals) {
        const { error } = await admin.from("goals").insert(goal);
        if (error) throw error;
        seededCount++;
      }

      // 6. Seed System Notifications
      const testNotifications = [
        {
          user_id: ownerId,
          title: "Supabase Relational Cluster Active",
          message: "Versioned database migrations executed cleanly. Realtime publications configured.",
          priority: "HIGH",
          is_read: false,
        },
      ];

      for (const notif of testNotifications) {
        const { error } = await admin.from("notifications").insert(notif);
        if (error) throw error;
        seededCount++;
      }

      console.log(`✅ Kairo OS Seeder Complete! Seeded ${seededCount} database entities successfully.`);

      return {
        success: true,
        seededCount,
        error: null,
      };
    } catch (err: any) {
      console.error("❌ Kairo OS Seeder Failure:", err);
      return {
        success: false,
        seededCount: 0,
        error: err.message || "An unexpected error occurred during database seeding.",
      };
    }
  },
};
