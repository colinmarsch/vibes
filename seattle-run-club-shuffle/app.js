const FOCUS_CATEGORIES = [
  "Social & Community",
  "Training & Performance",
  "Inclusive & Identity-Based",
  "Trail Running",
  "Free Weekly 5K"
];

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CALENDAR_TIMEZONE = "America/Los_Angeles";
const DEFAULT_EVENT_HOUR = 9;
const CLUB_COLOR_PALETTE = [
  "#e63946",
  "#f77f00",
  "#fcbf49",
  "#2a9d8f",
  "#219ebc",
  "#4361ee",
  "#7209b7",
  "#ff006e",
  "#6a994e",
  "#bc6c25",
  "#1d3557",
  "#8338ec"
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
    source: "https://november-project.com/seattle-wa/",
    location: {
      label: "Seattle Center (winter default meetup)",
      lat: 47.6215,
      lng: -122.3509
    }
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
    source: "https://www.seattlefrontrunners.org/runs-walks",
    location: {
      label: "Cal Anderson Park",
      lat: 47.6218,
      lng: -122.3193
    }
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
    source: "https://clubnorthwest.org/workouts",
    location: {
      label: "West Seattle Stadium (common workout site)",
      lat: 47.5798,
      lng: -122.3869
    }
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
    source: "https://www.meetup.com/seattle-greenlake-running-group/",
    location: {
      label: "Green Lake Park",
      lat: 47.6794,
      lng: -122.3417
    }
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
    source: "https://www.meetup.com/seattlerunningclub/",
    location: {
      label: "Seattle area (rotating meetup locations)",
      lat: 47.6062,
      lng: -122.3321
    }
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
    source: "https://www.fleetfeet.com/s/seattle/community",
    location: {
      label: "Fleet Feet Seattle (Capitol Hill)",
      lat: 47.6163,
      lng: -122.3209
    }
  },
  {
    name: "Brooks Trailhead Community Runs",
    neighborhood: "Fremont",
    focus: "Social & Community",
    days: ["Tuesday"],
    schedule: ["Tuesday evening run from Brooks Trailhead store"],
    source: "https://www.brooksrunning.com/en_us/brooks-run-club/",
    location: {
      label: "Brooks Trailhead Store (Fremont)",
      lat: 47.6498,
      lng: -122.3491
    }
  },
  {
    name: "Westies Run Club",
    neighborhood: "West Seattle",
    focus: "Social & Community",
    days: ["Thursday"],
    schedule: ["Thursday evening neighborhood social run (check current event post for exact start location/time)"],
    source: "https://www.instagram.com/westiesrunclub/",
    location: {
      label: "West Seattle Junction",
      lat: 47.5621,
      lng: -122.3868
    }
  },
  {
    name: "West Seattle Runner Group Runs",
    neighborhood: "West Seattle",
    focus: "Social & Community",
    days: ["Thursday"],
    schedule: ["Thursday evening shop run"],
    source: "https://www.westseattlerunner.com/events",
    location: {
      label: "West Seattle Runner",
      lat: 47.5618,
      lng: -122.3863
    }
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
    source: "https://www.lakesammamishrunclub.org/WeeklyRuns",
    location: {
      label: "Redmond Downtown Park",
      lat: 47.6737,
      lng: -122.1215
    }
  },
  {
    name: "BelRed Run Club",
    neighborhood: "Bellevue / Redmond (Eastside)",
    focus: "Social & Community",
    days: ["Thursday", "Saturday"],
    schedule: [
      "Thursday · 5:30 PM (usually Bellevue, rotates to Redmond sometimes)",
      "Saturday social run/walk meetups (check current event post for exact time and location)"
    ],
    source: "https://www.instagram.com/belredrunclub/",
    location: {
      label: "Downtown Bellevue Park (frequent meetup area)",
      lat: 47.6154,
      lng: -122.2010
    }
  },
  {
    name: "CSRD (Club Seattle Runners Division)",
    neighborhood: "South Lake Union",
    focus: "Social & Community",
    days: ["Monday", "Saturday"],
    schedule: [
      "Monday · 6:30 PM Monday Miles",
      "Saturday · 8:00 AM Saturday Miles"
    ],
    source: "https://www.heylo.com/groups/club-seattle-runners-division",
    location: {
      label: "MOHAI",
      lat: 47.6273,
      lng: -122.3366
    }
  },
  {
    name: "Eastside Runners Club",
    neighborhood: "Eastside / rotating",
    focus: "Training & Performance",
    days: ["Saturday"],
    schedule: ["Saturday · 8:30 AM club run at rotating Eastside (and occasional Seattle-side) locations"],
    source: "https://eastsiderunners.com/Club-Runs",
    location: {
      label: "Eastside rotating meetup locations",
      lat: 47.6101,
      lng: -122.2015
    }
  },
  {
    name: "North Lake Run Club",
    neighborhood: "Kenmore / North Lake",
    focus: "Social & Community",
    days: ["Thursday", "Saturday"],
    schedule: [
      "Thursday · 6:00 PM group run",
      "Saturday · 8:00 AM group run"
    ],
    source: "https://www.instagram.com/northlakerunclub/",
    location: {
      label: "Kenmore Town Center",
      lat: 47.7576,
      lng: -122.2440
    }
  },
  {
    name: "Totem Lake Run Club",
    neighborhood: "Kirkland (Totem Lake)",
    focus: "Social & Community",
    days: ["Wednesday"],
    schedule: ["Wednesday evening run from Totem Lake area (check current event post for exact start time/location)"],
    source: "https://www.instagram.com/totemlakerunclub/",
    location: {
      label: "Totem Lake Village",
      lat: 47.7163,
      lng: -122.1806
    }
  },
  {
    name: "ETA Run Club",
    neighborhood: "Bothell",
    focus: "Social & Community",
    days: ["Tuesday"],
    schedule: ["Tuesday evening community run in Bothell (check current event post for exact start time/location)"],
    source: "https://www.instagram.com/etarunclub/",
    location: {
      label: "Downtown Bothell",
      lat: 47.7601,
      lng: -122.2054
    }
  },
  {
    name: "Cascade Run Club",
    neighborhood: "Redmond / Bellevue",
    focus: "Social & Community",
    days: ["Thursday"],
    schedule: ["Thursday evening Eastside community run (Redmond/Bellevue, check current event post for exact meetup)"],
    source: "https://www.instagram.com/cascaderunclub/",
    location: {
      label: "Downtown Bellevue Park",
      lat: 47.6154,
      lng: -122.2010
    }
  },
  {
    name: "Cowgill Trail Collective",
    neighborhood: "Eastside / rotating",
    focus: "Trail Running",
    days: ["Saturday"],
    schedule: ["Saturday trail group run (check current event post for exact trailhead, route, and start time)"],
    source: "https://www.instagram.com/cowgilltrailcollective/",
    location: {
      label: "Eastside rotating meetup locations",
      lat: 47.6101,
      lng: -122.2015
    }
  },
  {
    name: "Issaquah Alps Trail Running Club",
    neighborhood: "Issaquah Alps",
    focus: "Trail Running",
    days: ["Tuesday"],
    schedule: ["Tuesday · 6:00 PM trail run events (see current Facebook events listing)"],
    source: "https://www.facebook.com/groups/1199932723806219/events/",
    location: {
      label: "Issaquah, WA",
      lat: 47.5301,
      lng: -122.0326
    }
  },
  {
    name: "Renton parkrun",
    neighborhood: "Renton (Cedar River Trail)",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 9:00 AM free timed 5K"],
    source: "https://www.parkrun.us/renton/",
    location: {
      label: "Cedar River Park",
      lat: 47.4826,
      lng: -122.1924
    }
  },
  {
    name: "Des Moines Creek parkrun",
    neighborhood: "Des Moines",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 9:00 AM free timed 5K"],
    source: "https://www.parkrun.us/desmoinescreek/",
    location: {
      label: "Des Moines Beach Park",
      lat: 47.3998,
      lng: -122.3279
    }
  },
  {
    name: "Perrigo parkrun",
    neighborhood: "Redmond (Perrigo Community Park)",
    focus: "Free Weekly 5K",
    days: ["Saturday"],
    schedule: ["Saturday · 8:00 AM (May–Sep) / 9:00 AM (Oct–Apr) free timed 5K"],
    source: "https://www.parkrun.us/perrigo/",
    location: {
      label: "Perrigo Community Park",
      lat: 47.6936,
      lng: -122.0979
    }
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
const mapEl = document.getElementById("map");
const calendarEl = document.getElementById("calendar");
const gridViewBtn = document.getElementById("grid-view-btn");
const mapViewBtn = document.getElementById("map-view-btn");
const calendarViewBtn = document.getElementById("calendar-view-btn");
const noResultsEl = document.getElementById("no-results");
const resetFiltersBtn = document.getElementById("reset-filters-btn");
const resultsAnnouncer = document.getElementById("results-announcer");

let currentView = "grid";
let map;
let mapMarkers;

const uniqueDays = [...new Set(clubs.flatMap((club) => club.days))].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
uniqueDays.forEach((day) => dayFilter.insertAdjacentHTML("beforeend", `<option value="${day}">${day}</option>`));

FOCUS_CATEGORIES.forEach((focus) => focusFilter.insertAdjacentHTML("beforeend", `<option value="${focus}">${focus}</option>`));

function getClubColor(clubName) {
  let hash = 0;
  for (const char of clubName) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return CLUB_COLOR_PALETTE[hash % CLUB_COLOR_PALETTE.length];
}

function getFilteredClubs() {
  const day = dayFilter.value;
  const focus = focusFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  return clubs.filter((club) => {
    const dayMatch = day === "all" || club.days.includes(day);
    const focusMatch = focus === "all" || club.focus === focus;
    const q = `${club.name} ${club.neighborhood} ${club.focus} ${club.schedule.join(" ")} ${club.location.label}`.toLowerCase();
    const queryMatch = !query || q.includes(query);
    return dayMatch && focusMatch && queryMatch;
  });
}

function parseTime(entry) {
  const explicitTimeMatch = entry.match(/(\d{1,2})(?::(\d{2}))?\s?(AM|PM)/i);
  if (explicitTimeMatch) {
    let hour = Number(explicitTimeMatch[1]);
    const minute = Number(explicitTimeMatch[2] || "0");
    const meridiem = explicitTimeMatch[3].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    return { hour, minute, label: `${explicitTimeMatch[1]}:${String(minute).padStart(2, "0")} ${meridiem}` };
  }

  const lower = entry.toLowerCase();
  if (lower.includes("morning")) return { hour: 8, minute: 0, label: "Morning" };
  if (lower.includes("evening")) return { hour: 18, minute: 0, label: "Evening" };

  return { hour: DEFAULT_EVENT_HOUR, minute: 0, label: "Time TBD" };
}

function buildWeeklyEvents(clubsToRender) {
  return clubsToRender.flatMap((club) =>
    club.schedule
      .map((entry) => {
        const day = DAY_ORDER.find((candidate) => entry.startsWith(candidate)) || club.days.find((candidate) => entry.startsWith(candidate));
        if (!day) return null;
        const time = parseTime(entry);
        return {
          id: `${club.name}-${day}-${entry}`,
          day,
          clubName: club.name,
          neighborhood: club.neighborhood,
          location: club.location.label,
          source: club.source,
          detail: entry,
          color: getClubColor(club.name),
          timeLabel: time.label,
          startHour: time.hour,
          startMinute: time.minute
        };
      })
      .filter(Boolean)
  );
}

function renderCalendar(clubsToRender) {
  const events = buildWeeklyEvents(clubsToRender);
  const eventsByDay = DAY_ORDER.reduce((acc, day) => {
    acc[day] = events
      .filter((event) => event.day === day)
      .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
    return acc;
  }, {});

  calendarEl.innerHTML = `
    <header class="calendar-header">
      <div>
        <h2>Weekly calendar</h2>
        <p>Recurring run-club events this week${clubsToRender.length === clubs.length ? " (all clubs)" : " (filtered clubs)"}.</p>
      </div>
      <button id="calendar-download-btn" class="reset-btn" type="button">Download iCal (.ics)</button>
    </header>
    <div class="calendar-grid" role="list" aria-label="Weekly event calendar">
      ${DAY_ORDER.map(
        (day) => `
          <section class="calendar-day" role="listitem" aria-label="${day}">
            <h3>${day}</h3>
            ${
              eventsByDay[day].length
                ? `<ul>${eventsByDay[day]
                    .map(
                      (event) => `
                      <li style="--club-color: ${event.color}">
                        <p class="calendar-time">${event.timeLabel}</p>
                        <p class="calendar-club">${event.clubName}</p>
                        <p class="calendar-meta">${event.location}</p>
                      </li>
                    `
                    )
                    .join("")}</ul>`
                : '<p class="calendar-empty">No listed events.</p>'
            }
          </section>
        `
      ).join("")}
    </div>
  `;

  const downloadButton = document.getElementById("calendar-download-btn");
  downloadButton.addEventListener("click", () => downloadIcs(events));
}

function toDateStamp(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function toDateTimeStamp(date) {
  return `${toDateStamp(date)}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
}

function getNextDayDate(day, hour, minute) {
  const now = new Date();
  const targetDow = (DAY_ORDER.indexOf(day) + 1) % 7;
  const delta = (targetDow - now.getDay() + 7) % 7;
  const eventDate = new Date(now);
  eventDate.setDate(now.getDate() + delta);
  eventDate.setHours(hour, minute, 0, 0);

  if (eventDate <= now) {
    eventDate.setDate(eventDate.getDate() + 7);
  }

  return eventDate;
}

function escapeIcsText(text) {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function downloadIcs(events) {
  const now = new Date();
  const generatedAt = `${toDateTimeStamp(now)}Z`;
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Seattle Run Clubs//Weekly Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Seattle Run Clubs Weekly Schedule`,
    `X-WR-TIMEZONE:${CALENDAR_TIMEZONE}`
  ];

  events.forEach((event) => {
    const start = getNextDayDate(event.day, event.startHour, event.startMinute);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const uid = `${btoa(unescape(encodeURIComponent(`${event.clubName}-${event.day}-${event.detail}`))).replace(/=/g, "")}@seattle-run-clubs`;

    icsLines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${generatedAt}`,
      `DTSTART;TZID=${CALENDAR_TIMEZONE}:${toDateTimeStamp(start)}`,
      `DTEND;TZID=${CALENDAR_TIMEZONE}:${toDateTimeStamp(end)}`,
      "RRULE:FREQ=WEEKLY",
      `SUMMARY:${escapeIcsText(event.clubName)}`,
      `DESCRIPTION:${escapeIcsText(`${event.detail}\nNeighborhood: ${event.neighborhood}\nSource: ${event.source}`)}`,
      `LOCATION:${escapeIcsText(event.location)}`,
      `URL:${event.source}`,
      "END:VEVENT"
    );
  });

  icsLines.push("END:VCALENDAR");

  const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "seattle-run-clubs-weekly.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ensureMap() {
  if (map || typeof L === "undefined") {
    return;
  }

  map = L.map("map", { scrollWheelZoom: false }).setView([47.6062, -122.3321], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  mapMarkers = L.layerGroup().addTo(map);
}

function renderMap(filtered) {
  ensureMap();
  if (!map || !mapMarkers) {
    return;
  }

  mapMarkers.clearLayers();
  const bounds = [];

  filtered.forEach((club) => {
    const clubColor = getClubColor(club.name);
    const marker = L.circleMarker([club.location.lat, club.location.lng], {
      radius: 8,
      color: clubColor,
      fillColor: clubColor,
      fillOpacity: 0.85,
      weight: 2
    }).addTo(mapMarkers);
    marker.bindPopup(`
      <strong style="color: ${clubColor}">${club.name}</strong><br />
      ${club.location.label}<br />
      <a href="${club.source}" target="_blank" rel="noopener">Source ↗</a>
    `);
    bounds.push([club.location.lat, club.location.lng]);
  });

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  } else {
    map.setView([47.6062, -122.3321], 10);
  }
}

function setView(view) {
  currentView = view;
  const showingMap = view === "map";
  const showingCalendar = view === "calendar";

  cardsEl.classList.toggle("hidden", showingMap || showingCalendar);
  mapEl.classList.toggle("hidden", !showingMap);
  calendarEl.classList.toggle("hidden", !showingCalendar);
  gridViewBtn.classList.toggle("is-active", view === "grid");
  mapViewBtn.classList.toggle("is-active", showingMap);
  calendarViewBtn.classList.toggle("is-active", showingCalendar);
  gridViewBtn.setAttribute("aria-pressed", String(view === "grid"));
  mapViewBtn.setAttribute("aria-pressed", String(showingMap));
  calendarViewBtn.setAttribute("aria-pressed", String(showingCalendar));
  mapEl.setAttribute("aria-hidden", String(!showingMap));
  cardsEl.setAttribute("aria-hidden", String(showingMap || showingCalendar));
  calendarEl.setAttribute("aria-hidden", String(!showingCalendar));

  render();

  if (showingMap) {
    mapEl.focus();
    setTimeout(() => map?.invalidateSize(), 0);
  }

  if (showingCalendar) {
    calendarEl.focus();
  }
}

function resetFilters() {
  dayFilter.value = "all";
  focusFilter.value = "all";
  searchInput.value = "";
  render();
}

function render() {
  const filtered = getFilteredClubs();
  const hasResults = filtered.length > 0;
  const resultSummary = `${filtered.length} clubs shown`;
  statsEl.textContent = resultSummary;

  cardsEl.innerHTML = filtered
    .map(
      (club) => `
      <article class="card" role="listitem">
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
  cardsEl.setAttribute("role", "list");

  noResultsEl.classList.toggle("hidden", hasResults || currentView === "map" || currentView === "calendar");
  resultsAnnouncer.textContent = hasResults ? resultSummary : "No clubs found. Try broadening your search or resetting filters.";

  if (currentView === "map") {
    renderMap(filtered);
  }

  if (currentView === "calendar") {
    renderCalendar(filtered);
  }
}

[dayFilter, focusFilter, searchInput].forEach((el) => el.addEventListener("input", render));
resetFiltersBtn.addEventListener("click", resetFilters);
gridViewBtn.addEventListener("click", () => setView("grid"));
mapViewBtn.addEventListener("click", () => setView("map"));
calendarViewBtn.addEventListener("click", () => setView("calendar"));

render();
