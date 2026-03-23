const STORAGE_KEY = "doji-vu-trackers-v1";

const itemForm = document.querySelector("#item-form");
const itemsNode = document.querySelector("#items");
const emptyState = document.querySelector("#empty-state");
const clearAllButton = document.querySelector("#clear-all");
const itemTemplate = document.querySelector("#item-template");

const state = {
  trackers: loadTrackers(),
};

render();

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(itemForm);
  const name = String(formData.get("name") || "").trim();
  const emoji = String(formData.get("emoji") || "").trim();

  if (!name || !emoji) {
    return;
  }

  state.trackers.unshift({
    id: crypto.randomUUID(),
    name,
    emoji,
    timestamps: [],
    createdAt: new Date().toISOString(),
  });

  saveTrackers();
  render();
  itemForm.reset();
});

clearAllButton.addEventListener("click", () => {
  if (state.trackers.length === 0) {
    return;
  }

  const ok = window.confirm("Delete every tracker and all log history?");
  if (!ok) {
    return;
  }

  state.trackers = [];
  saveTrackers();
  render();
});

function loadTrackers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) => item && typeof item.id === "string" && typeof item.name === "string"
    );
  } catch {
    return [];
  }
}

function saveTrackers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trackers));
}

function render() {
  itemsNode.innerHTML = "";

  emptyState.classList.toggle("hidden", state.trackers.length > 0);

  for (const tracker of state.trackers) {
    const item = itemTemplate.content.firstElementChild.cloneNode(true);

    item.querySelector(".item__emoji").textContent = tracker.emoji;
    item.querySelector(".item__name").textContent = tracker.name;
    item.querySelector(".item__meta").textContent = buildMeta(tracker);

    item.querySelector(".log-btn").addEventListener("click", () => {
      tracker.timestamps = tracker.timestamps || [];
      tracker.timestamps.push(new Date().toISOString());
      saveTrackers();
      render();
    });

    item.querySelector(".delete-btn").addEventListener("click", () => {
      state.trackers = state.trackers.filter((candidate) => candidate.id !== tracker.id);
      saveTrackers();
      render();
    });

    itemsNode.append(item);
  }
}

function buildMeta(tracker) {
  const timestamps = Array.isArray(tracker.timestamps) ? tracker.timestamps : [];

  if (timestamps.length === 0) {
    return "Not logged yet.";
  }

  const sorted = [...timestamps]
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a);

  if (sorted.length === 0) {
    return "Not logged yet.";
  }

  const lastDone = sorted[0];
  const dayCount = countDistinctDays(sorted);
  const frequency = (
    sorted.length / Math.max(1, dayCount)
  ).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  return `Done ${sorted.length} time${sorted.length === 1 ? "" : "s"} • Last: ${formatDate(
    lastDone
  )} • Avg: ${frequency}/day`;
}

function countDistinctDays(dates) {
  const days = new Set(
    dates.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })
  );

  return days.size;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
