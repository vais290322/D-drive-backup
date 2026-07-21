import { useTour } from "@/hooks/useTour";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import TourGuide from "./TourGuide";
import { FaQuestionCircle } from "react-icons/fa";

const TourButton = ({ steps, tourName }) => {
  const { runTour, stepIndex, startTour, handleJoyrideCallback } =
    useTour(tourName);

  const handleStartTour = () => {
    // console.log("Starting tour manually");
    startTour();
  };

  return (
    <>
      <Button
        onClick={handleStartTour}
        variant="ghost"
        className=" bg-[#452B90] text-white hover:bg-[#c29732]"
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

export default TourButton;
