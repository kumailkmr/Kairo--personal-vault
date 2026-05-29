export type PipelineStage = "New Inquiry" | "Discovery Scheduled" | "Requirement Analysis" | "Proposal Sent" | "Negotiation" | "Payment Pending" | "Closed Won" | "Closed Lost";

export const MOCK_CALENDAR_EVENTS = [
  {
    id: "evt-1",
    title: "Q3 Roadmap Alignment",
    client: "Acme Corp",
    time: "09:00 AM - 10:00 AM",
    date: new Date().toISOString(),
    type: "Strategy",
    hasMeet: true
  },
  {
    id: "evt-2",
    title: "Initial Discovery Call",
    client: "Nexus Industries",
    time: "11:30 AM - 12:00 PM",
    date: new Date().toISOString(),
    type: "Discovery",
    hasMeet: true
  },
  {
    id: "evt-3",
    title: "Design Sign-off",
    client: "Stark Labs",
    time: "02:00 PM - 03:00 PM",
    date: new Date().toISOString(),
    type: "Review",
    hasMeet: false
  },
  {
    id: "evt-4",
    title: "Contract Negotiation",
    client: "Wayne Enterprises",
    time: "04:30 PM - 05:00 PM",
    date: new Date().toISOString(),
    type: "Closing",
    hasMeet: true
  }
];

export const MOCK_PIPELINE_DEALS = [
  {
    id: "deal-1",
    client: "Nexus Industries",
    value: 45000,
    stage: "Discovery Scheduled" as PipelineStage,
    lastContact: "2 hrs ago"
  },
  {
    id: "deal-2",
    client: "Ouroboros Tech",
    value: 120000,
    stage: "Proposal Sent" as PipelineStage,
    lastContact: "1 day ago"
  },
  {
    id: "deal-3",
    client: "Wayne Enterprises",
    value: 85000,
    stage: "Negotiation" as PipelineStage,
    lastContact: "4 hrs ago"
  },
  {
    id: "deal-4",
    client: "Cyberdyne",
    value: 12000,
    stage: "New Inquiry" as PipelineStage,
    lastContact: "10 mins ago"
  },
  {
    id: "deal-5",
    client: "Umbrella Corp",
    value: 250000,
    stage: "Payment Pending" as PipelineStage,
    lastContact: "3 days ago"
  }
];
