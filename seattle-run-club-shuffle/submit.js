const statusEl = document.getElementById("form-status");
const formEl = document.getElementById("schedule-form");
const params = new URLSearchParams(window.location.search);

if (params.get("submitted") === "1") {
  statusEl.classList.add("is-success");
  statusEl.textContent = "Thanks! Your submission was sent and is now pending review.";
  window.history.replaceState({}, "", "submit.html");
}

const sourceInputEl = formEl?.querySelector('input[name="Source link"]');

const normalizeUrl = (rawValue) => {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
};

const isValidUrl = (rawValue) => {
  const normalizedValue = normalizeUrl(rawValue);

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    return parsedUrl.hostname.includes(".");
  } catch {
    return false;
  }
};

sourceInputEl?.addEventListener("input", () => {
  sourceInputEl.setCustomValidity("");
});

formEl?.addEventListener("submit", (event) => {
  if (!sourceInputEl) {
    return;
  }

  if (!isValidUrl(sourceInputEl.value)) {
    event.preventDefault();
    sourceInputEl.setCustomValidity("Enter a valid link, like example.com or https://example.com.");
    sourceInputEl.reportValidity();
    return;
  }

  sourceInputEl.value = normalizeUrl(sourceInputEl.value);
});
