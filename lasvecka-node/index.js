const express = require("express");
const moment = require("moment");
const app = express();
const computeTime = require("./calc_date.js");
const port = process.env.PORT || 3000;

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
    <title>läsvecka.nu | ${data.studyweek}</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/${data.studyweekNum}/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/${data.studyweekNum}/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/${data.studyweekNum}/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="description" content="läsvecka.nu ger dig aktuell läsvecka, utan några konstigheter!">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://lasvecka.nu/">
    <meta property="og:title" content="läsvecka.nu | ${data.studyweek}">
    <style>
      html, body { height: 100%; background-color: #90c0de; overflow: hidden; }
      time {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        margin: -110px 0 0 0;
        height: 220px;
        text-align: center;
        color: #1c7bb7;
        font-family: Arial, sans-serif;
        font-size: 260px;
        line-height: 227px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <time datetime="${data.week}">${data.studyweek}</time>
    <script>
      console.log('Powered by G.U.D. https://gud.chs.chalmers.se/');
      console.log('Source code: https://github.com/gudchalmers/lasvecka');
      setTimeout(function () { location.reload(); }, 25886000);
    </script>
  </body>
</html>`;
	return html
		.replace(/\n/g, "")
		.replace(/\r/g, "")
		.replace(/\t/g, "")
		.replace(/ {2,}/g, "");
};
