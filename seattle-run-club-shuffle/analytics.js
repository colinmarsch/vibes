const ANALYTICS_MEASUREMENT_ID = "G-XXXXXXXXXX";

const hasRealMeasurementId = /^G-[A-Z0-9]+$/i.test(ANALYTICS_MEASUREMENT_ID) && !ANALYTICS_MEASUREMENT_ID.includes("XXXXXXXX");

function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

window.trackEvent = trackEvent;

if (hasRealMeasurementId) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_MEASUREMENT_ID}`;
  document.head.append(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", ANALYTICS_MEASUREMENT_ID, {
    page_path: window.location.pathname
  });

  trackEvent("page_view", {
    page_title: document.title,
    page_path: window.location.pathname
  });
}

document.addEventListener("click", (event) => {
  const anchor = event.target.closest("a");
  if (!anchor) {
    return;
  }

  const href = anchor.getAttribute("href") || "";
  const isExternal = href.startsWith("http");

  if (isExternal) {
    trackEvent("outbound_click", {
      link_url: href,
      link_text: anchor.textContent?.trim() || ""
    });
  }

  if (href.includes("submit.html")) {
    trackEvent("navigate_to_submit", {
      from_path: window.location.pathname
    });
  }
});
