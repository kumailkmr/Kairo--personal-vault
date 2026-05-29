export interface WhatsAppService {
  sendMessage: (phone: string, text: string) => Promise<{ success: boolean; messageId: string }>;
  sendAlertNotification: (phone: string, type: string, params: Record<string, string>) => Promise<{ success: boolean }>;
}

/**
 * Service to orchestrate real-time WhatsApp Business APIs communication layer.
 */
export const whatsAppService: WhatsAppService = {
  sendMessage: async (_phone, _text) => {
    console.log(`[Mock] sendTextMessage: phone=${_phone}, text=${_text}`);
    return {
      success: true,
      messageId: `wa-${Math.random().toString(36).substr(2, 9)}`,
    };
  },
  
  sendAlertNotification: async (_phone, _type, _params) => {
    console.log(`[Mock] sendAlertNotification: phone=${_phone}, type=${_type}, params=${JSON.stringify(_params)}`);
    return { success: true };
  }
};
