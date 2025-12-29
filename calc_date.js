const moment = require("moment");
const fs = require("node:fs");
const scrape = require("./lasveckor_scraper.js");
let dateDict = {};

// check if data.json exists
if (!fs.existsSync("./data/data.json")) {
	scrape().then((res) => {
		dateDict = res;
	});
} else {
	dateDict = JSON.parse(fs.readFileSync("./data/data.json"));

	// check if it was updated after 1/8 this year and if 1/8 has occured this year
	const updated = moment(dateDict.updated);
	const firstOfAugust = moment().month(7).date(1);
	if (updated.isBefore(firstOfAugust) && moment().isAfter(firstOfAugust)) {
		scrape().then((res) => {
			dateDict = res;
		});
	}
}

function readDatePeriod(currDate) {
	let soughtDate = "";
	let diff = -1000;
	for (const dat in dateDict) {
		// if dat is updated, easter_start, easter_end or ord_cont then skip
		if (
			dat === "updated" ||
			dat === "easter_start" ||
			dat === "easter_end" ||
			dat === "ord_cont"
		) {
			continue;
		}

		const deltaT = moment(dat).diff(currDate, "days");
		if (deltaT === 0) {
			return { date: dat, type: dateDict[dat] };
		}

		if (deltaT > diff && deltaT < 0) {
			soughtDate = dat;
			diff = deltaT;
		}
	}
	return { date: soughtDate, type: dateDict[soughtDate] };
}

function computeTime(currentDate = moment()) {
	// Find date where value is easter_start, easter_end and ord_cont in json file
	const EASTER_START = dateDict.easter_start;
	const ORD_CONT = dateDict.ord_cont;
	const easterEndCheck = currentDate.diff(ORD_CONT, "days");
	const easterStartCheck = currentDate.diff(EASTER_START, "days");
	const { date: dat, type: typ } = readDatePeriod(currentDate);
	if (typ === "exam_period") {
		const deltaT = currentDate.diff(moment(dat), "days");
		if (deltaT > 7) {
			return "Självstudier";
		}
		return "Tentavecka";
	}

	let deltaT = currentDate.diff(moment(dat), "days");
	if (typ === 'first_day') {
		const weeks = Math.floor(deltaT / 7);
		return `MV ${weeks + 1}`;
	}

	if (easterStartCheck >= 0 && easterEndCheck <= 0) {
		return "Självstudier";
	}

	if (easterEndCheck > 0) {
		// the easter period is over and it is 7 days long
		deltaT = deltaT - 7;
	}

	const weeks = Math.floor(deltaT / 7);

	if (weeks > 7) {
		return "Självstudier";
	}
	return `LV ${weeks + 1}`;
}

module.exports = computeTime;
