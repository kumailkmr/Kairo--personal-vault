import React from "react";
import { NotificationItem } from "@/types";
import { Bell, AlertCircle, Calendar, Cpu, Briefcase, FileText, CheckCircle2, DollarSign, Users, MessageSquare, Info } from "lucide-react";

interface NotificationCardProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDismiss }) => {
  let Icon = Bell;
  let iconClass = "text-slate-500 bg-slate-100";

  switch (notification.type) {
    case "ai": Icon = Cpu; iconClass = "text-purple-600 bg-purple-50"; break;
    case "deadline": Icon = Calendar; iconClass = "text-orange-500 bg-orange-50"; break;
    case "alert": Icon = AlertCircle; iconClass = "text-red-500 bg-red-50"; break;
    case "activity": Icon = CheckCircle2; iconClass = "text-green-500 bg-green-50"; break;
    case "project": Icon = Briefcase; iconClass = "text-kairo-blue bg-blue-50"; break;
    case "revenue": Icon = DollarSign; iconClass = "text-emerald-500 bg-emerald-50"; break;
    case "client": Icon = Users; iconClass = "text-indigo-500 bg-indigo-50"; break;
    case "document": Icon = FileText; iconClass = "text-amber-500 bg-amber-50"; break;
    case "communication": Icon = MessageSquare; iconClass = "text-sky-500 bg-sky-50"; break;
    case "meeting": Icon = Calendar; iconClass = "text-kairo-blue bg-blue-50"; break;
    case "system": Icon = Info; iconClass = "text-slate-500 bg-slate-100"; break;
  }

  let cardBorder = "border-transparent";
  let titleColor = "text-gray-900";
  
  if (!notification.read) {
    cardBorder = "border-kairo-blue/20 bg-blue-50/20";
  }

  if (notification.priority === "critical") {
    cardBorder = "border-red-200 bg-red-50/30";
    titleColor = "text-red-700";
    iconClass = "text-red-600 bg-red-100";
  } else if (notification.priority === "important") {
    cardBorder = "border-orange-200 bg-orange-50/30";
  }

  return (
    <div className={`p-4 rounded-xl border ${cardBorder} transition-all hover:shadow-sm cursor-pointer group`}>
      <div className="flex gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-semibold font-heading truncate ${titleColor}`}>
                  {notification.title}
                </h4>
                {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-kairo-blue shrink-0" />}
                {notification.priority === "critical" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-red-100 text-red-600">Critical</span>
                )}
                {notification.priority === "important" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-orange-100 text-orange-600">Important</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
              {notification.time}
            </span>
          </div>

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actions.map((action, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    action.primary 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
