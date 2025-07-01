import React, { useState } from 'react';

interface Activity {
  icon?: string;
  description: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities = [] }) => {
  const [displayCount, setDisplayCount] = useState(5);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
        <div className="text-center dark:text-white text-sm py-8">No Recent Activities</div>
      </div>
    );
  }

  return (
    <div className="dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-xl p-6">
      <h2 className="text-xl font-semibold dark:text-white mb-4">Recent Activities</h2>

      <div className="flex flex-col gap-4">
        {activities.slice(0, displayCount).map((activity, index) => (
          <div key={index} className="flex items-start gap-4 border-b border-primary-border dark:border-dark-border pb-3">
            <div className="w-10 h-10 rounded-full bg-primary-lightest dark:bg-primary flex items-center justify-center">
              <img
                src="/icons/active-users.svg"
                alt="activity icon"
                className="w-5 h-5"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm dark:text-white mb-1">{activity.description}</p>
              <span className="text-xs dark:text-white">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {activities.length > displayCount && (
        <button
          className="w-full mt-4 py-2 border border-blue-100 rounded-full text-gray-800 text-sm hover:bg-blue-50 transition duration-300"
          onClick={handleShowMore}
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default RecentActivities;
