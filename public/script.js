console.log("Powered by G.U.D. https://gud.chs.chalmers.se/");
console.log("Source code: https://github.com/gudchalmers/lasvecka");
setTimeout(function () {
  location.reload();
}, 25886000);

// Set calendar links in panel
const origin = window.location.origin.replace(/^\w+:\/\//, "");
const calendarUrl = `webcal://${origin}/cal.ics`;
document
  .getElementById("cal-google")
  .setAttribute(
    "href",
    `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarUrl)}`,
  );
document.getElementById("cal-apple").setAttribute("href", calendarUrl);
document
  .getElementById("cal-outlook")
  .setAttribute(
    "href",
    `https://outlook.office.com/calendar/addcalendar?url=${encodeURIComponent(calendarUrl)}`,
  );

// Open panel
const panel = document.getElementById("calendar-panel");
const toggleButton = document.getElementById("toggle-panel-button");

function openPanel() {
  if (panel.hasAttribute("open")) return;
  panel.show();
  toggleButton.ariaExpanded = true;
}

toggleButton.addEventListener("click", openPanel);
toggleButton.addEventListener("mousedown", function (event) {
  if (event.button === 0) openPanel();
});

// Close panel
panel.addEventListener("close", function () {
  toggleButton.ariaExpanded = false;
});
