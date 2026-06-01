import { GoalRepository, DBGoalData } from "@/repositories/GoalRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";

export const GoalService = {
  async getGoals() {
    return await GoalRepository.getGoals();
  },

  async createGoal(data: DBGoalData & { id?: string }, creatorId: string) {
    const goal = await GoalRepository.createGoal(data);

    await NotificationRepository.createNotification({
      user_id: creatorId,
      title: "Life OS Objective Initiated",
      message: `Strategic objective '${data.objective}' added to your personal roadmap.`,
      priority: "MEDIUM",
      is_read: false
    });

    return goal;
  },

  async updateGoalProgress(id: string, progress: number, status?: string, operatorId = "c76fb973-ec63-41c4-b816-56be794c483d") {
    const goal = await GoalRepository.updateGoalProgress(id, progress, status);

    if (progress === 100) {
      await NotificationRepository.createNotification({
        user_id: operatorId,
        title: "Objective Achieved 🏆",
        message: `Outstanding! Personal objective completed successfully.`,
        priority: "HIGH",
        is_read: false
      });
    }

    return goal;
  },

  async getRoadmapItems(goalId: string) {
    return await GoalRepository.getRoadmapItems(goalId);
  },

  async createRoadmapItem(data: any) {
    return await GoalRepository.createRoadmapItem(data);
  },

  async getExecutionTasks(goalId?: string) {
    return await GoalRepository.getExecutionTasks(goalId);
  },

  async createExecutionTask(data: any) {
    return await GoalRepository.createExecutionTask(data);
  },

  async toggleExecutionTask(taskId: string) {
    return await GoalRepository.toggleExecutionTask(taskId);
  }
};
