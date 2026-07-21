export const admitCardPageSteps = [
  {
    target: "h1",
    content:
      "This is the Admit Card Management section where you can generate and download admit cards for students' exams.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: "form",
    content:
      "Search for students by selecting class, section, and exam type to generate admit cards.",
    placement: "bottom",
  },
  {
    target: ".SelectTrigger",
    content:
      "Select the class, section, and exam type from these dropdown menus.",
    placement: "bottom",
  },
  {
    target: "button[type='submit']",
    content:
      "Click here to search for students based on your selected criteria.",
    placement: "left",
  },
  {
    target: "table",
    content:
      "View all students in this table. You can see their details and download admit cards.",
    placement: "top",
  },
  {
    target: "button:has(.Download)",
    content: "Click here to download the admit card for a specific student.",
    placement: "left",
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages and adjust how many students to display per page.",
    placement: "top",
  },
];

export const idCardPageSteps = [
  {
    target: "h1",
    content:
      "This is the ID Card Management section where you can generate and download ID cards for students.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: "form",
    content:
      "Search for students by selecting class and section to generate ID cards.",
    placement: "bottom",
  },
  {
    target: ".SelectTrigger",
    content: "Select the class and section from these dropdown menus.",
    placement: "bottom",
  },
  {
    target: "button[type='submit']",
    content:
      "Click here to search for students based on your selected criteria.",
    placement: "left",
  },
  {
    target: "table",
    content:
      "View all students in this table. You can see their details and download ID cards.",
    placement: "top",
  },
  {
    target: "button:has(.Download)",
    content: "Click here to download the ID card for a specific student.",
    placement: "left",
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages and adjust how many students to display per page.",
    placement: "top",
  },
];
