export const viewAllTcPageSteps = [
  {
    target: "h1",
    content:
      "This is the Transfer Certificate Applications section where you can manage all TC requests.",
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: "input[placeholder*='Search by name, admission number...']",
    content:
      "Search for specific applications by name, admission number, or class.",
    placement: "bottom",
  },

  {
    target: ".SelectTrigger",
    content:
      "Filter applications by their status - All, Pending, Approved, or Rejected.",
    placement: "left",
  },
  {
    target: ".restBtn",
    content: "Reset all filters and sorting to their default values.",
    placement: "bottom",
  },
  {
    target: "table",
    content:
      "View all TC applications in this table. Click on column headers to sort the data.",
    placement: "top",
  },
  {
    target: ".DropdownMenuTrigger",
    content:
      "Perform actions like viewing details, approving, or rejecting applications and download certificate for status approved.",
    placement: "left",
  },

  {
    target: ".pagination-component",
    content:
      "Navigate between pages and adjust how many items to display per page.",
    placement: "top",
  },
];
