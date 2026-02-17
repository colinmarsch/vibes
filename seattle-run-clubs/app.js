const clubs = [
  {
    name: "November Project Seattle",
    neighborhood: "Citywide",
    focus: "Free fitness + social",
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
    focus: "LGBTQIA+ community + allies",
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
    focus: "Training team / performance",
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
    focus: "Social mileage",
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
    focus: "Social + training",
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
    focus: "Retail-led community runs",
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
    focus: "Brand community + social miles",
    days: ["Tuesday"],
    schedule: ["Tuesday evening run from Brooks Trailhead store"],
    source: "https://www.brooksrunning.com/en_us/community/"
  },
  {
    name: "West Seattle Runner Group Runs",
    neighborhood: "West Seattle",
    focus: "Neighborhood social running",
    days: ["Thursday"],
    schedule: ["Thursday evening shop run"],
    source: "https://westseattlerunner.com/pages/events"
  },
  {
    name: "Carkeek Parkrun",
    neighborhood: "Northwest Seattle",
    focus: "Free weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 9:00 AM free timed 5K"],
    source: "https://www.parkrun.us/carkeek/"
  }
];

const dayFilter = document.getElementById("day-filter");
const focusFilter = document.getElementById("focus-filter");
const searchInput = document.getElementById("search-input");
const cardsEl = document.getElementById("cards");
const statsEl = document.getElementById("stats");

const uniqueDays = [...new Set(clubs.flatMap((club) => club.days))].sort();
uniqueDays.forEach((day) => dayFilter.insertAdjacentHTML("beforeend", `<option value="${day}">${day}</option>`));

const uniqueFocuses = [...new Set(clubs.map((club) => club.focus))].sort();
uniqueFocuses.forEach((focus) => focusFilter.insertAdjacentHTML("beforeend", `<option value="${focus}">${focus}</option>`));

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
