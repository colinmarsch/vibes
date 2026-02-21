const FOCUS_CATEGORIES = [
  "Social & Community",
  "Training & Performance",
  "Inclusive & Identity-Based",
  "Trail Running",
  "Free Weekly 5K"
];

const clubs = [
  {
    name: "November Project Seattle",
    neighborhood: "Citywide",
    focus: "Social & Community",
    days: ["Wednesday", "Friday"],
    schedule: [
      "Wednesday · 6:29 AM (Gas Works Park in summer, Seattle Center in winter)",
      "Friday · 6:29 AM (rotating city locations)"
    ],
    source: "https://november-project.com/seattle-wa/"
  },
  {
    name: "Seattle Frontrunners",
    neighborhood: "Capitol Hill / Downtown",
    focus: "Inclusive & Identity-Based",
    days: ["Wednesday", "Saturday"],
    schedule: [
      "Wednesday evening social run/walk (check current post)",
      "Saturday morning social run/walk (check current post)"
    ],
    source: "https://www.seattlefrontrunners.org/runs-walks"
  },
  {
    name: "Club Northwest",
    neighborhood: "Seattle area tracks + parks",
    focus: "Training & Performance",
    days: ["Tuesday", "Thursday", "Sunday"],
    schedule: [
      "Tuesday club workout (track / speed focus)",
      "Thursday club workout",
      "Sunday long-run groups (seasonal)"
    ],
    source: "https://clubnorthwest.org/workouts"
  },
  {
    name: "Green Lake Running Group",
    neighborhood: "Green Lake",
    focus: "Social & Community",
    days: ["Wednesday", "Saturday"],
    schedule: [
      "Wednesday evening group run",
      "Saturday morning group run"
    ],
    source: "https://www.meetup.com/greenlake-running-group/"
  },
  {
    name: "Seattle Running Club",
    neighborhood: "Central Seattle",
    focus: "Training & Performance",
    days: ["Tuesday", "Saturday"],
    schedule: [
      "Tuesday evening workout / social run",
      "Saturday group run"
    ],
    source: "https://www.meetup.com/seattlerunningclub/"
  },
  {
    name: "Fleet Feet Seattle Run Club",
    neighborhood: "Capitol Hill / Eastside",
    focus: "Social & Community",
    days: ["Tuesday", "Thursday"],
    schedule: [
      "Tuesday evening community run",
      "Thursday evening community run / training blocks"
    ],
    source: "https://www.fleetfeet.com/s/seattle/community"
  },
  {
    name: "Brooks Trailhead Community Runs",
    neighborhood: "Fremont",
    focus: "Social & Community",
    days: ["Tuesday"],
    schedule: ["Tuesday evening run from Brooks Trailhead store"],
    source: "https://www.brooksrunning.com/en_us/brooks-run-club/"
  },
  {
    name: "West Seattle Runner Group Runs",
    neighborhood: "West Seattle",
    focus: "Social & Community",
    days: ["Thursday"],
    schedule: ["Thursday evening shop run"],
    source: "https://www.westseattlerunner.com/events"
  },
  {
    name: "Lake Sammamish Run Club",
    neighborhood: "Redmond / Eastside",
    focus: "Training & Performance",
    days: ["Monday", "Wednesday", "Thursday", "Friday", "Sunday"],
    schedule: [
      "Monday · 6:05 PM intro, run starts around 6:07–6:10 PM (Redmond Downtown Park)",
      "Wednesday · 6:00 AM (Redmond Central Connector)",
      "Thursday · 6:05 PM intro, run starts around 6:07–6:10 PM (Kirkland/Bridle Trails seasonal)",
      "Friday · 7:00 AM rotating run (Redmond/Kirkland area)",
      "Sunday · 8:30 AM coffee/field-trip run (varies by week)"
    ],
    source: "https://www.lakesammamishrunclub.org/WeeklyRuns"
  },
  {
    name: "Issaquah Alps Trail Running Club",
    neighborhood: "Issaquah Alps",
    focus: "Trail Running",
    days: ["Tuesday"],
    schedule: ["Tuesday · 6:00 PM trail run events (see current Facebook events listing)"],
    source: "https://www.facebook.com/groups/1199932723806219/events/"
  },
  {
    name: "Renton parkrun",
    neighborhood: "Renton (Cedar River Trail)",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 9:00 AM free timed 5K"],
    source: "https://www.parkrun.us/renton/"
  },
  {
    name: "Des Moines Creek parkrun",
    neighborhood: "Des Moines",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 9:00 AM free timed 5K"],
    source: "https://www.parkrun.us/desmoinescreek/"
  },
  {
    name: "Perrigo parkrun",
    neighborhood: "Redmond (Perrigo Community Park)",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 8:00 AM (May–Sep) / 9:00 AM (Oct–Apr) free timed 5K"],
    source: "https://www.parkrun.us/perrigo/"
  }
];

const uncategorizedClubs = clubs.filter((club) => !FOCUS_CATEGORIES.includes(club.focus));
if (uncategorizedClubs.length) {
  console.warn(
    `Some clubs are using unsupported focus categories: ${uncategorizedClubs.map((club) => club.name).join(", ")}`
  );
}

const dayFilter = document.getElementById("day-filter");
const focusFilter = document.getElementById("focus-filter");
const searchInput = document.getElementById("search-input");
const cardsEl = document.getElementById("cards");
const statsEl = document.getElementById("stats");

const uniqueDays = [...new Set(clubs.flatMap((club) => club.days))].sort();
uniqueDays.forEach((day) => dayFilter.insertAdjacentHTML("beforeend", `<option value="${day}">${day}</option>`));

FOCUS_CATEGORIES.forEach((focus) => focusFilter.insertAdjacentHTML("beforeend", `<option value="${focus}">${focus}</option>`));

function render() {
  const day = dayFilter.value;
  const focus = focusFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  const filtered = clubs.filter((club) => {
    const dayMatch = day === "all" || club.days.includes(day);
    const focusMatch = focus === "all" || club.focus === focus;
    const q = `${club.name} ${club.neighborhood} ${club.focus} ${club.schedule.join(" ")}`.toLowerCase();
    const queryMatch = !query || q.includes(query);
    return dayMatch && focusMatch && queryMatch;
  });

  statsEl.textContent = `${filtered.length} clubs shown`;

  cardsEl.innerHTML = filtered
    .map(
      (club) => `
      <article class="card">
        <h3>${club.name}</h3>
        <div class="meta">${club.neighborhood}</div>
        <div class="chips">
          <span class="chip">${club.focus}</span>
          ${club.days.map((d) => `<span class="chip">${d}</span>`).join("")}
        </div>
        <ul class="schedule">
          ${club.schedule.map((entry) => `<li>${entry}</li>`).join("")}
        </ul>
        <a class="source" href="${club.source}" target="_blank" rel="noopener">Source ↗</a>
      </article>`
    )
    .join("");
}

[dayFilter, focusFilter, searchInput].forEach((el) => el.addEventListener("input", render));
render();
