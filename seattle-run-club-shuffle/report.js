const statusEl = document.getElementById("form-status");
const params = new URLSearchParams(window.location.search);

if (params.get("submitted") === "1") {
  statusEl.classList.add("is-success");
  statusEl.textContent = "Thanks! Your report was sent and is now pending review.";
  window.history.replaceState({}, "", "report.html");
}
