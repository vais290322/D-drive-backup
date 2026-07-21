export const guardianInformationPageSteps = [
  {
    target: ".searchBox",
    content: "Search for guardian by name or code using this search bar.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: "table",
    content:
      "View all guardians in this table. You can see guardian names, codes and available actions.",
    placement: "top",
    disableBeacon: true,
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages and adjust how many guardians to display per page.",
    placement: "top",
    disableBeacon: true,
  },
];

export const studentInfoPageSteps = [
  {
    target: ".searchBox",
    content: "Search for guardian by name or code using this search bar.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".studensAvailabe",
    content: "View number of available students and their details.",
    placement: "top",
  },
  {
    target: "table",
    content:
      "View all guardians in this table. You can see guardian names, codes and available actions.",
    placement: "top",
    disableBeacon: true,
  },
  {
    target: ".viewButton",
    content: "Click here to view student information.",
    placement: "left",
  },
  {
    target: ".editButton",
    content: "Click here to edit student information.",
    placement: "left",
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages and adjust how many guardians to display per page.",
    placement: "top",
  },
];
