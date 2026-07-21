import { useState, useEffect } from "react";

const TOUR_COMPLETED_KEY = "school_app_tour_completed";

export const useTour = (tourId = "main") => {
  const storageKey = `${TOUR_COMPLETED_KEY}_${tourId}`;
  const [isTourCompleted, setIsTourCompleted] = useState(() => {
    const completed = localStorage.getItem(storageKey);
    return completed === "true";
  });
  
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Initialize tour state on component mount
  useEffect(() => {
    // Only auto-start tour if it hasn't been completed before
    if (!isTourCompleted) {
      // Small delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTourCompleted]);

  const completeTour = () => {
    localStorage.setItem(storageKey, "true");
    setIsTourCompleted(true);
    setRunTour(false);
    setStepIndex(0);
  };

  const resetTour = () => {
    localStorage.removeItem(storageKey);
    setIsTourCompleted(false);
    setStepIndex(0);
    setRunTour(true);
  };

  const startTour = () => {
    setStepIndex(0);
    setRunTour(true);
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if (type === 'step:after') {
      // Check if the action is "prev" (back button) or "next"
      if (action === "prev") {
        // Going back to the previous step
        setStepIndex(index - 1);
      } else {
        // Going forward to the next step
        setStepIndex(index + 1);
      }
    } else if (status === 'finished' || status === 'skipped') {
      // Tour is complete
      completeTour();
    }
  };

  return {
    isTourCompleted,
    runTour,
    stepIndex,
    completeTour,
    resetTour,
    startTour,
    handleJoyrideCallback
  };
};