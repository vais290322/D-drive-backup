import React from "react";
import TourGuide from "./TourGuide";
import { useTour } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa";

const DashboardTour = () => {
  const { runTour, completeTour, resetTour, startTour } = useTour("dashboard");

  const steps = [
    {
      target: ".sidebar",
      content: "This is the main navigation menu. You can access different sections of the application from here.",
      disableBeacon: true,
      placement: "right",
    },
    {
      target: ".user-profile",
      content: "View and manage your profile settings here.",
      placement: "bottom",
    },
    {
      target: ".dashboard-stats",
      content: "Get a quick overview of important statistics and metrics.",
      placement: "bottom",
    },
    {
      target: ".notifications",
      content: "Check your notifications and updates here.",
      placement: "bottom-start",
    },
    {
      target: ".search-bar",
      content: "Search for students, classes, or any other information.",
      placement: "bottom",
    },
  ];

  return (
    <>
      <Button 
        onClick={startTour} 
        variant="ghost" 
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-[#452B90] text-white hover:bg-[#c29732]"
      >
        <FaQuestionCircle className="mr-2" /> Help Tour
      </Button>
      <TourGuide steps={steps} run={runTour} onFinish={completeTour} />
    </>
  );
};

export default DashboardTour;