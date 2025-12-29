const express = require("express");
const moment = require("moment");
const app = express();
const computeTime = require("./calc_date.js");
const createCalendar = require("./create_calendar.js");
const port = process.env.PORT || 3000;

const maxBefore = process.env.MAX_BEFORE ? parseInt(process.env.MAX_BEFORE) : 20;
const maxAfter = process.env.AFTER ? parseInt(process.env.AFTER) : 20;

let studyweek = "";
let studyweekNum = "";

function updateStudyWeek() {
	studyweek = computeTime();
	studyweekNum = studyweek
		.replace("LV ", "")
		.replace("MV ", "")
		.replace("Självstudier", "S")
		.replace("Tentavecka", "T");
	return { studyweek, studyweekNum };
}

app.use(express.static("public"));

app.get("/", (req, res) => {
	const { studyweek, studyweekNum } = updateStudyWeek();
	const week = moment().format("YYYY-[W]WW"); // eg. 2023-W45
	const data = { studyweek, week, studyweekNum };
	res.send(render(data));
});

app.get("/data", (req, res) => {
	res.send(computeTime());
});

app.get("/cal.ics", (req, res) => {
	const before = req.query.before ? parseInt(req.query.before) : 8;
	if (isNaN(before) || before < 0 || before > maxBefore) {
		res.status(400).end(`Invalid before, must be an integer between 0 and ${maxBefore}`);
		return;
	}

	let after = req.query.after ? parseInt(req.query.after) : 8;
	if (isNaN(after) || after < 0 || after > maxAfter) {
		res.status(400).end(`Invalid after, must be an integer between 0 and ${maxAfter}`);
		return;
	}

	const now = moment();
	const calendar = createCalendar(now, before, after);

	res.setHeader("Content-Type", "text/calendar")
		.end(calendar.serialize());
})

app.get("/favicon.ico", (req, res) => {
	const studyweek = computeTime();
	const studyweekNum = studyweek
		.replace("LV ", "")
		.replace("MV ", "")
		.replace("Självstudier", "S")
		.replace("Tentavecka", "T");
	res.sendFile(`${__dirname}/public/icons/${studyweekNum}/favicon.ico`);
});

app.get("/site.webmanifest", (req, res) => {
	const studyweek = computeTime();
	const studyweekNum = studyweek
		.replace("LV ", "")
		.replace("MV ", "")
		.replace("Självstudier", "S")
		.replace("Tentavecka", "T");
	const manifest = {
		name: "läsvecka.nu",
		short_name: "läsvecka.nu",
		icons: [
			{
				src: `/icons/${studyweekNum}/android-chrome-192x192.png`,
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: `/icons/${studyweekNum}/android-chrome-512x512.png`,
				sizes: "512x512",
				type: "image/png",
			},
		],
		theme_color: "#1c7bb7",
		background_color: "#90c0de",
		display: "standalone",
	};

	res.send(manifest);
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});

const render = (data) => {
	const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${data.studyweek} | läsvecka.nu</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/${data.studyweekNum}/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/${data.studyweekNum}/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/${data.studyweekNum}/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="description" content="läsvecka.nu ger dig aktuell läsvecka, utan några konstigheter!">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://lasvecka.nu/">
    <meta property="og:title" content="läsvecka.nu | ${data.studyweek}">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <time datetime="${data.week}">${data.studyweek}</time>

    <div class="corner">
      <button id="toggle-panel-button" aria-expanded="false" aria-haspopup="dialog" aria-controls="calendar-panel">
        <svg viewBox="0 0 25 25" aria-hidden="true">
          <path d="M10 3h5v19h-5zM3 10h19v5H3z" />
        </svg>
      </button>

      <dialog id="calendar-panel" class="calendar-panel hidden" closedby="any">
        <h3>Prenumerera</h3>
        <div class="calendars">
          <a id="cal-google">Google Kalender</a>
          <a id="cal-apple">Apple Kalender</a>
          <a id="cal-outlook">Outlook</a>
        </div>
      </dialog>
    </div>
    <script src="/script.js"></script>
  </body>
</html>`;
	return html
		.replace(/\n/g, "")
		.replace(/\r/g, "")
		.replace(/\t/g, "")
		.replace(/ {2,}/g, "");
};
