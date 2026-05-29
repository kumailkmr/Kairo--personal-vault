export interface EmailService {
  sendSystemAlert: (to: string, subject: string, body: string) => Promise<{ success: boolean; messageId: string }>;
  queueCampaign: (recipientEmails: string[], templateId: string) => Promise<{ success: boolean; queuedCount: number }>;
}

/**
 * Service to orchestrate email automation workflows.
 */
export const emailService: EmailService = {
  sendSystemAlert: async (_to, _subject, _body) => {
    console.log(`[Mock] sendSystemAlert: to=${_to}, subject=${_subject}, body=${_body}`);
    return {
      success: true,
      messageId: `msg-${Math.random().toString(36).substr(2, 9)}`,
    };
  },
  
  queueCampaign: async (recipientEmails, _templateId) => {
    console.log(`[Mock] queueCampaign: templateId=${_templateId}, recipientCount=${recipientEmails.length}`);
    return {
      success: true,
      queuedCount: recipientEmails.length,
    };
  }
};
