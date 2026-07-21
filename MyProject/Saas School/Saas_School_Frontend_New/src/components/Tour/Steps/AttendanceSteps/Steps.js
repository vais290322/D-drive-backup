export const attendancePageSteps = [
  {
    target: ".searchBox",
    content: "Search for students by entering class, section, or keywords.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: "table",
    content: "View attendance details for all students.",
    placement: "top",
  },
  {
    target: ".pagination-component",
    content: "Navigate between pages using the pagination buttons.",
    placement: "top",
  },
];

export const attendanceReportPageSteps = [
  {
    target: "form",
    content:
      "Search for attendance records by selecting class, section, and month.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".download-button",
    content: "Download the attendance report as a PDF file.",
    placement: "left",
  },
  {
    target: "#forpdf",
    content:
      "View detailed attendance statistics and records for the selected class and month.",
    placement: "top",
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages of student records using the pagination controls.",
    placement: "top",
  },
];

export const markAttendancePageSteps = [
  {
    target: "form",
    content:
      "Search for students by selecting class and section to mark attendance.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".attendance-stats",
    content:
      "View real-time attendance statistics including present count and percentage.",
    placement: "top",
  },
  {
    target: "table",
    content:
      "View student details and mark attendance using the toggle buttons.",
    placement: "top",
  },
  {
    target: ".mark-all-buttons",
    content:
      "Quickly mark all students as present or absent with these buttons.",
    placement: "left",
  },
  {
    target: "button[onClick='handleSaveAttendance']",
    content: "Save the attendance record for the selected class and date.",
    placement: "left",
  },
  {
    target: ".pagination-component",
    content:
      "Navigate between pages of student records using the pagination controls.",
    placement: "top",
  },
];
