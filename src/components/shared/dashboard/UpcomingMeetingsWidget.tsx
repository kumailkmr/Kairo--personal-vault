import React from "react";
import { Calendar, Video } from "lucide-react";
import { MOCK_MEETINGS } from "@/mock";

export const UpcomingMeetingsWidget: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-kairo-blue" /> Schedule
        </h3>
        <span className="text-[10px] font-bold text-kairo-blue bg-blue-50 px-2 py-0.5 rounded-full uppercase">
          {MOCK_MEETINGS.length} Today
        </span>
      </div>
      
      <div className="flex flex-col gap-1 relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-100" />
        
        {MOCK_MEETINGS.slice(0, 3).map((meeting, idx) => (
          <div key={meeting.id} className="flex gap-4 relative py-2 group cursor-pointer">
            <div className="w-8 flex flex-col items-center shrink-0 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-kairo-blue z-10 group-hover:scale-125 transition-transform" />
            </div>
            <div className="flex-1 bg-slate-50 group-hover:bg-blue-50/50 p-3 rounded-xl border border-transparent group-hover:border-kairo-blue/20 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-900">{meeting.title}</p>
                {meeting.platform === "google_meet" && <Video className="w-3.5 h-3.5 text-slate-400 group-hover:text-kairo-blue transition-colors" />}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {meeting.startTime} - {meeting.endTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
