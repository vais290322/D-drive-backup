import {
  DisplayVolunteers,
  HeroSection,
  ReusableVolunteerForm,
  VolunteerForm,
  WhatYouGetSection,
} from "@/V2/components";
import {
  Rectangle4Copy
} from "../assets";
import { useScrollSection } from "../hooks/useScrollSection";


export function Volunteer() {
  const scrollToSection = useScrollSection();

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        img={Rectangle4Copy}
        heading={
          <>
            Make a Difference,
            <br />
            One Step at a Time
          </>
        }
        description={`Join our growing community of passionate individuals who are driving real change across communities. Whether you’re a student, professional, or retiree — your time, skills, and energy can transform lives.`}
        buttons={
          <>
            <button
              onClick={() => scrollToSection("apply-form")}
              className="cursor-pointer px-6 py-3 rounded-md text-white bg-[var(--secondary-color)] hover:bg-transparent hover:border-2 hover:border-[var(--secondary-color)] hover:text-[var(--secondary-color)] transition-colors"
            >
              Apply Now
            </button>
            <button className="cursor-pointer px-6 py-3 rounded-md text-white hover:bg-[var(--secondary-color)] bg-transparent border-2 border-[var(--secondary-color)] hover:text-white transition-colors">
              Download Guide
            </button>
          </>
        }
      />

      {/* volunteer from  */}
      <VolunteerForm />

      {/* display volunteers  */}
      <DisplayVolunteers />

      {/* What You’ll Get as a Volunteer */}
      <WhatYouGetSection />
    </>
  );
}
