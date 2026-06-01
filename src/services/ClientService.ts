import { CRMRepository, DBClientData } from "@/repositories/CRMRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";

export const ClientService = {
  async getClients() {
    return await CRMRepository.getClients();
  },

  async getClientById(id: string) {
    return await CRMRepository.getClientById(id);
  },

  async createClient(data: DBClientData & { id?: string }, creatorId: string) {
    // 1. Persist the client via Repository
    const client = await CRMRepository.createClient(data);

    // 2. Automatically trigger an operational Activity Log
    await CRMRepository.logActivity(
      client.id,
      "CLIENT_INGRESS",
      { company: data.company_name, email: data.email },
      creatorId
    );

    // 3. Automatically trigger a Workspace Notification
    await NotificationRepository.createNotification({
      user_id: creatorId,
      title: "Client Intake Success",
      message: `Relationship established with ${data.company_name}. Client profile is active.`,
      priority: "MEDIUM",
      is_read: false
    });

    return client;
  },

  async updateClient(id: string, data: Partial<DBClientData>, modifierId: string) {
    // 1. Perform client updates
    const client = await CRMRepository.updateClient(id, data);

    // 2. Automatically log the activity with diff details
    await CRMRepository.logActivity(
      id,
      "CLIENT_UPDATE",
      { updated_fields: Object.keys(data) },
      modifierId
    );

    return client;
  },

  async deleteClient(id: string, operatorId: string) {
    const client = await CRMRepository.getClientById(id);
    const companyName = client ? (client as any).company_name || (client as any).company : "Unknown Client";

    // 1. Remove the client profile
    await CRMRepository.deleteClient(id);

    // 2. Trigger critical workspace notification alert
    await NotificationRepository.createNotification({
      user_id: operatorId,
      title: "Client Account Terminated",
      message: `Account details and contacts for '${companyName}' were deleted by security admin override.`,
      priority: "CRITICAL",
      is_read: false
    });

    return true;
  },

  async archiveClient(id: string, operatorId: string) {
    // 1. Change status to TERMINATED
    const client = await CRMRepository.updateClient(id, { retainer_status: "TERMINATED" });

    // 2. Log archive event
    await CRMRepository.logActivity(
      id,
      "CLIENT_ARCHIVED",
      { status: "TERMINATED" },
      operatorId
    );

    // 3. Trigger notification
    await NotificationRepository.createNotification({
      user_id: operatorId,
      title: "Client Retainer Paused",
      message: `Retainer agreement with '${(client as any).company_name || (client as any).company}' archived.`,
      priority: "HIGH",
      is_read: false
    });

    return client;
  }
};
