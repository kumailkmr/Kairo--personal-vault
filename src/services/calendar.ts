import { Meeting } from "@/types";

export interface GoogleCalendarService {
  listUpcomingMeetings: (limit?: number) => Promise<Meeting[]>;
  createEvent: (meeting: Omit<Meeting, "id">) => Promise<Meeting>;
  syncCalendar: () => Promise<{ success: boolean; syncedEvents: number }>;
}

/**
 * Service to orchestrate future Google Calendar APIs integration.
 */
export const googleCalendarService: GoogleCalendarService = {
  listUpcomingMeetings: async (_limit = 5) => {
    console.log(`[Mock] getUpcomingMeetings: limit=${_limit}`);
    // Return empty array / mock structure to fulfill compilation and build.
    // Replace with Google OAuth and API requests in phase 2.
    return [];
  },
  
  createEvent: async (meeting) => {
    return {
      ...meeting,
      id: `gcal-${Math.random().toString(36).substr(2, 9)}`,
    };
  },
  
  syncCalendar: async () => {
    return { success: true, syncedEvents: 0 };
  }
};
