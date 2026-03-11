const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PFITZ_18_55 = [
  {
    week: 1,
    totalMiles: 33,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 5 },
      { day: "Wednesday", workout: "Medium long run", miles: 9 },
      { day: "Thursday", workout: "Recovery run", miles: 4 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 10 },
      { day: "Sunday", workout: "Recovery run", miles: 5 }
    ]
  },
  {
    week: 2,
    totalMiles: 37,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 6 },
      { day: "Wednesday", workout: "Medium long run", miles: 10 },
      { day: "Thursday", workout: "Recovery run", miles: 5 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 12 },
      { day: "Sunday", workout: "Recovery + strides", miles: 4 }
    ]
  },
  {
    week: 3,
    totalMiles: 41,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Hill repeats + easy", miles: 6 },
      { day: "Wednesday", workout: "Medium long run", miles: 11 },
      { day: "Thursday", workout: "Recovery run", miles: 5 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 13 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 4,
    totalMiles: 36,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 5 },
      { day: "Wednesday", workout: "Medium long run", miles: 8 },
      { day: "Thursday", workout: "Recovery run", miles: 4 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 12 },
      { day: "Sunday", workout: "General aerobic", miles: 7 }
    ]
  },
  {
    week: 5,
    totalMiles: 43,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Lactate threshold workout", miles: 7 },
      { day: "Wednesday", workout: "Medium long run", miles: 11 },
      { day: "Thursday", workout: "Recovery run", miles: 5 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 14 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 6,
    totalMiles: 47,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 8 },
      { day: "Wednesday", workout: "Medium long run", miles: 12 },
      { day: "Thursday", workout: "Recovery run", miles: 6 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 15 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 7,
    totalMiles: 50,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Lactate threshold workout", miles: 9 },
      { day: "Wednesday", workout: "Medium long run", miles: 12 },
      { day: "Thursday", workout: "Recovery run", miles: 6 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 16 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 8,
    totalMiles: 40,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 7 },
      { day: "Wednesday", workout: "Medium long run", miles: 10 },
      { day: "Thursday", workout: "Recovery run", miles: 5 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 13 },
      { day: "Sunday", workout: "Recovery run", miles: 5 }
    ]
  },
  {
    week: 9,
    totalMiles: 52,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "VO2 max workout", miles: 9 },
      { day: "Wednesday", workout: "Medium long run", miles: 13 },
      { day: "Thursday", workout: "Recovery run", miles: 7 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 17 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 10,
    totalMiles: 55,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Lactate threshold workout", miles: 10 },
      { day: "Wednesday", workout: "Medium long run", miles: 13 },
      { day: "Thursday", workout: "Recovery run", miles: 7 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 18 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 11,
    totalMiles: 53,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 9 },
      { day: "Wednesday", workout: "Medium long run", miles: 12 },
      { day: "Thursday", workout: "Marathon pace workout", miles: 8 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run with MP finish", miles: 17 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 12,
    totalMiles: 55,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "VO2 max workout", miles: 10 },
      { day: "Wednesday", workout: "Medium long run", miles: 13 },
      { day: "Thursday", workout: "Recovery run", miles: 7 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 18 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 13,
    totalMiles: 53,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Lactate threshold workout", miles: 9 },
      { day: "Wednesday", workout: "Medium long run", miles: 12 },
      { day: "Thursday", workout: "Marathon pace workout", miles: 8 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 17 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 14,
    totalMiles: 55,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "VO2 max workout", miles: 10 },
      { day: "Wednesday", workout: "Medium long run", miles: 13 },
      { day: "Thursday", workout: "Recovery run", miles: 7 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 18 },
      { day: "Sunday", workout: "Recovery run", miles: 7 }
    ]
  },
  {
    week: 15,
    totalMiles: 46,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "Lactate threshold workout", miles: 8 },
      { day: "Wednesday", workout: "Medium long run", miles: 11 },
      { day: "Thursday", workout: "Recovery run", miles: 6 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 15 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 16,
    totalMiles: 39,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 7 },
      { day: "Wednesday", workout: "Medium long run", miles: 9 },
      { day: "Thursday", workout: "Recovery run", miles: 5 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 12 },
      { day: "Sunday", workout: "Recovery run", miles: 6 }
    ]
  },
  {
    week: 17,
    totalMiles: 31,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 6 },
      { day: "Wednesday", workout: "Medium long run", miles: 8 },
      { day: "Thursday", workout: "Recovery run", miles: 4 },
      { day: "Friday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Saturday", workout: "Long run", miles: 9 },
      { day: "Sunday", workout: "Recovery run", miles: 4 }
    ]
  },
  {
    week: 18,
    totalMiles: 40,
    runs: [
      { day: "Monday", workout: "Rest / Cross-train", miles: 0 },
      { day: "Tuesday", workout: "General aerobic", miles: 5 },
      { day: "Wednesday", workout: "Recovery run", miles: 4 },
      { day: "Thursday", workout: "Shakeout run", miles: 3 },
      { day: "Friday", workout: "Rest", miles: 0 },
      { day: "Saturday", workout: "Rest / Shakeout", miles: 1 },
      { day: "Sunday", workout: "Marathon race", miles: 26.2 }
    ]
  }
];

const startDateInput = document.getElementById("start-date");
const dateRangeOutput = document.getElementById("date-range");
const planContainer = document.getElementById("plan-container");
const downloadButton = document.getElementById("download-ical");

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseInputDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatIcsDate(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getWorkoutDate(startDate, weekIndex, dayName) {
  const dayOffset = DAYS.indexOf(dayName);
  return addDays(startDate, weekIndex * 7 + dayOffset);
}

function renderPlan() {
  const startDate = parseInputDate(startDateInput.value);

  planContainer.innerHTML = "";

  PFITZ_18_55.forEach((week, weekIndex) => {
    const details = document.createElement("details");
    if (weekIndex === 0) details.open = true;

    const summary = document.createElement("summary");
    summary.textContent = `Week ${week.week} • ${week.totalMiles} mi`;
    details.appendChild(summary);

    const table = document.createElement("table");
    table.className = "week-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Day</th>
          <th>Workout</th>
          <th>Miles</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    week.runs.forEach((run) => {
      const tr = document.createElement("tr");
      const workoutDate = startDate ? getWorkoutDate(startDate, weekIndex, run.day) : null;
      tr.innerHTML = `
        <td>${run.day}</td>
        <td>${run.workout}</td>
        <td>${run.miles}</td>
        <td>${workoutDate ? formatDate(workoutDate) : "Select a start date"}</td>
      `;
      tbody.appendChild(tr);
    });

    details.appendChild(table);
    planContainer.appendChild(details);
  });

  if (startDate) {
    const endDate = addDays(startDate, PFITZ_18_55.length * 7 - 1);
    dateRangeOutput.textContent = `Plan dates: ${formatDate(startDate)} → ${formatDate(endDate)}`;
  } else {
    dateRangeOutput.textContent = "Select a start date to map workouts and enable iCal export.";
  }
}

function escapeIcsText(value) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildIcs() {
  const startDate = parseInputDate(startDateInput.value);
  if (!startDate) {
    window.alert("Please choose a plan start date first.");
    return null;
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MileStones//Pfitz 18-55//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  PFITZ_18_55.forEach((week, weekIndex) => {
    week.runs.forEach((run, runIndex) => {
      const eventDate = getWorkoutDate(startDate, weekIndex, run.day);
      const nextDay = addDays(eventDate, 1);
      const summary = `W${week.week} ${run.day}: ${run.workout}${run.miles ? ` (${run.miles} mi)` : ""}`;
      const description = `${run.workout}${run.miles ? ` - ${run.miles} miles` : ""}`;
      const uid = `pfitz-18-55-${week.week}-${runIndex}@milestones`;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${formatIcsDate(new Date())}T000000Z`,
        `DTSTART;VALUE=DATE:${formatIcsDate(eventDate)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(nextDay)}`,
        `SUMMARY:${escapeIcsText(summary)}`,
        `DESCRIPTION:${escapeIcsText(description)}`,
        "END:VEVENT"
      );
    });
  });

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function downloadIcsFile() {
  const icsContent = buildIcs();
  if (!icsContent) return;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pfitz-18-55-marathon-plan.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

startDateInput.addEventListener("input", renderPlan);
downloadButton.addEventListener("click", downloadIcsFile);

renderPlan();
