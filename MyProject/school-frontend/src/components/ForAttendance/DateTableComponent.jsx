import React from "react";

const DateTableComponent = ({ month, year }) => {
  // Generate all dates for the given month and year
  const generateDates = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the month
    return Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create an array from 1 to daysInMonth
  };

  const dates = generateDates(month, year);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${dates.length}, 1fr)`,
        gap: "8px",
        padding: "4px 0",
      }}
    >
      {dates.map((date) => (
        <span
          key={date}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
            border: "1px solid #ccc", // Optional: Border to define the cell
            minWidth: "30px", // Ensures all cells have the same width
            textAlign: "center",
          }}
        >
          {date}
        </span>
      ))}
    </div>
  );
};

export default DateTableComponent;
