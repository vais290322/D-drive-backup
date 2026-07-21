import React, { useEffect } from "react";
import TourGuide from "./TourGuide";
import { useTour } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa";

const TcApplicationTour = () => {
  const { 
    runTour, 
    stepIndex, 
    startTour, 
    handleJoyrideCallback 
  } = useTour("tc_application");

  // Updated steps with more precise selectors that match the actual DOM
  const steps = [
    {
      target: "h1",
      content: "This is the Transfer Certificate Applications section where you can manage all TC requests.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: "input[placeholder*='Search by name, admission number...']",
      content: "Search for specific applications by name, admission number, or class.",
      placement: "bottom",
    },
    
    {
      target: ".SelectTrigger",
      content: "Filter applications by their status - All, Pending, Approved, or Rejected.",
      placement: "left",
    },
    {
      target: ".restBtn",
      content: "Reset all filters and sorting to their default values.",
      placement: "bottom",
    },
    {
      target: "table",
      content: "View all TC applications in this table. Click on column headers to sort the data.",
      placement: "top",
    },
    {
      target: ".DropdownMenuTrigger",
      content: "Perform actions like viewing details, approving, or rejecting applications and download certificate for status approved.",
      placement: "left",
    },

    {
        target: ".pagination-component",
        content: "Navigate between pages and adjust how many items to display per page.",
        placement: "top",
      },
    
  ];

  // Enhanced debugging
  useEffect(() => {
    // console.log("TcApplicationTour mounted, steps:", steps.length);
    
    // Check if elements exist in DOM
    steps.forEach((step, index) => {
      const element = document.querySelector(step.target);
    //   console.log(`Step ${index + 1} target "${step.target}" exists:`, !!element);
    });
    
    return () => console.log("TcApplicationTour unmounted");
  }, []);

  useEffect(() => {
    if (runTour) {
    //   console.log("Tour is running", { runTour, stepIndex, totalSteps: steps.length });
    }
  }, [runTour, stepIndex]);

  const handleStartTour = () => {
    // console.log("Starting tour manually");
    startTour();
  };

  return (
    <>
      <Button 
        onClick={handleStartTour} 
        variant="ghost" 
        size="sm"
        className="ml-2 bg-[#452B90] text-white hover:bg-[#c29732]"
        id="help-button"
      >
        <FaQuestionCircle className="mr-2" /> Help
      </Button>
      <TourGuide 
        steps={steps} 
        run={runTour} 
        stepIndex={stepIndex}
        onCallback={handleJoyrideCallback} 
        continuous={true}
        showSkipButton={true}
        showProgress={true}
      />
    </>
  );
};

export default TcApplicationTour;