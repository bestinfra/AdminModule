import React, { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
}

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  const [activeTab, setActiveTab] = useState<"Unread" | "Tickets" | "All">("All");

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b text-sm font-medium">
        {["Unread", "Tickets", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-2 px-4 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="p-4 overflow-y-auto h-[calc(100%-110px)]">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between p-3 border rounded-md mb-3 hover:bg-gray-50"
            >
              <div>
                <p
                  className={`font-medium text-sm ${
                    n.type === "error" ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-xs text-gray-500">{n.message}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSidebar;
