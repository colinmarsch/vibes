const statusEl = document.getElementById("form-status");
const formEl = document.getElementById("schedule-form");
const params = new URLSearchParams(window.location.search);

if (params.get("submitted") === "1") {
  statusEl.textContent = "Thanks! Your submission was sent and is now pending review.";
  if (typeof window.trackEvent === "function") {
    window.trackEvent("schedule_submitted", {
      page_path: window.location.pathname
    });
  }
  window.history.replaceState({}, "", "submit.html");
}

if (formEl) {
  formEl.addEventListener("submit", () => {
    if (typeof window.trackEvent === "function") {
      window.trackEvent("submit_form_started", {
        page_path: window.location.pathname
      });
    }
  });
}
