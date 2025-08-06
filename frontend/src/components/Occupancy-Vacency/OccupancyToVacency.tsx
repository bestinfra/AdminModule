import React from "react";
import PageC from "@/components/global/PageC";

interface OccupancyToVacencyProps {
  HeaderTest: React.ComponentType<any>;
}

const OccupancyToVacency: React.FC<OccupancyToVacencyProps> = ({ HeaderTest }) => {
  return (
    <div className="h-screen overflow-hidden scroll-y-hidden">
      <PageC
        sections={[
          {
            layout: {
              type: "row",
              className: "bg-white border-b border-gray-200 px-6 py-4",
              gap: "gap-4",
            },
            components: [
              {
                name: "HeaderTest",
                props: {
                  title: "Occupancy Management",
                  subtitle: "Manage consumer occupancy status and process vacancy requests",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default OccupancyToVacency;
