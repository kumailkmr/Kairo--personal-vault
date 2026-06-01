import { ProjectRepository, DBProjectData } from "@/repositories/ProjectRepository";
import { CRMRepository } from "@/repositories/CRMRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";
import { logger } from "@/lib/logger";

export const ProjectService = {
  async getProjects() {
    return await ProjectRepository.getProjects();
  },

  async getProjectById(id: string) {
    return await ProjectRepository.getProjectById(id);
  },

  async createProject(data: DBProjectData & { id?: string }, creatorId: string) {
    // 1. Create project
    const project = await ProjectRepository.createProject(data);

    // 2. Log crm activity log on client profile
    await CRMRepository.logActivity(
      data.client_id,
      "PROJECT_CREATED",
      { project_name: data.name, budget: data.budget },
      creatorId
    );

    // 3. Send workspace notification
    await NotificationRepository.createNotification({
      user_id: creatorId,
      title: "Project Milestone Initiated",
      message: `Strategic project '${data.name}' successfully launched. Roadmap is active.`,
      priority: "MEDIUM",
      is_read: false
    });

    return project;
  },

  async updateProject(id: string, data: Partial<DBProjectData>, modifierId: string) {
    const project = await ProjectRepository.updateProject(id, data);
    
    // Log activity
    if (data.status) {
      const projInfo = await ProjectRepository.getProjectById(id);
      if (projInfo) {
        await CRMRepository.logActivity(
          (projInfo as any).client_id || "global",
          "PROJECT_STATUS_UPDATE",
          { project_name: (projInfo as any).name, status: data.status },
          modifierId
        );
      }
    }

    return project;
  },

  async deleteProject(id: string, operatorId: string) {
    const project = await ProjectRepository.getProjectById(id);
    const projectName = project ? (project as any).name : "Unknown Project";
    const clientId = project ? (project as any).client_id : "global";

    await ProjectRepository.deleteProject(id);

    await CRMRepository.logActivity(
      clientId,
      "PROJECT_DELETED",
      { project_name: projectName },
      operatorId
    );

    return true;
  },

  // Task management + automatic project progress calculation
  async createTask(projectId: string, taskData: any, authorId: string) {
    const task = await ProjectRepository.createTask({
      project_id: projectId,
      ...taskData,
      status: taskData.status || "TODO",
      priority: taskData.priority || "MEDIUM"
    });

    // Re-calculate project progress
    await this.calculateAndSyncProjectProgress(projectId);

    return task;
  },

  async updateTask(projectId: string, taskId: string, taskData: any, modifierId: string) {
    const task = await ProjectRepository.updateTask(taskId, taskData);

    // Re-calculate project progress
    await this.calculateAndSyncProjectProgress(projectId);

    return task;
  },

  async calculateAndSyncProjectProgress(projectId: string) {
    // 1. Get all tasks for this project
    const tasks = await ProjectRepository.getTasks(projectId);

    if (!tasks || tasks.length === 0) {
      return;
    }

    // 2. Compute completed tasks ratio
    const completedTasks = tasks.filter(t => t.status === "DONE" || t.status === "done" || (t as any).is_completed);
    const progressPercent = Math.round((completedTasks.length / tasks.length) * 100);

    // 3. Update the main project record with the computed progress
    await ProjectRepository.updateProject(projectId, { progress: progressPercent });

    logger.info("CRUD", `Synced project progress: ${progressPercent}% on Project: ${projectId}`);
  }
};
