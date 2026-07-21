export const feesPageSteps = [
  {
    target: ".addClass",
    content: "Click here to add new tuition fees for a class.",
    placement: "left",
    disableBeacon: true,
  },
  {
    target: "table",
    content: "This table displays all the tuition fees for each class.",
    placement: "top",
  },
  {
    target: ".pagination-component",
    content: "Use these controls to navigate between pages of fee records.",
    placement: "top",
  },
  {
    target: ".editClass",
    content: "Update the fee collection mode for your school here.",
    placement: "top",
  },
  {
    target: ".deleteClass",
    content: "Delete the fee collection mode for your school here.",
    placement: "top",
  },
  {
    target: ".shadow-lg",
    content:
      "This section lets you view and update the Fee Collection Mode for your school.",
    placement: "top",
    disableBeacon: true,
  },
  {
    target: ".shadow-lg .font-bold",
    content: "Here you see the current Fee Collection Mode.",
    placement: "top",
  },
  {
    target: ".shadow-lg .grid",
    content: "Select a new fee collection mode from these options.",
    placement: "top",
  },
  {
    target: ".shadow-lg button[type='submit']",
    content:
      "Click here to update the fee collection mode after selecting a new option.",
    placement: "left",
  },
];

export const addStudentFeesPageSteps = [
  {
    target: ".searchBox",
    content: "Search for a student by their name, ID, or contact number.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".addFees",
    content: "Click here to add a new fee for the selected student.",
    placement: "left",
  },
  {
    target: ".feesAvailble",
    content:
      "This section displays the available fees for the selected student.",
    placement: "bottom",
  },
  {
    target: "table",
    content:
      "This table shows the fees that have already been paid by the student.",
    placement: "top",
  },
  {
    target: ".editButton",
    content: "Click here to edit the student's fee details.",
    placement: "left",
  },
  {
    target: ".viewButton",
    content: "Click here to view the student's fee details.",
    placement: "left",
  },
  {
    target: ".deleteClass",
    content: "Click here to delete the student's fee details.",
    placement: "left",
  },
  {
    target: ".pagination-component",
    content: "Use these controls to navigate between pages of fee records.",
    placement: "top",
  },
];
