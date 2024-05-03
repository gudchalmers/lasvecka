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

	//check if it was updated after 1/7 this year and if 1/7 has occured this year
	const updated = moment(dateDict.updated);
	const firstOfJuly = moment().month(6).date(1);
	if (updated.isBefore(firstOfJuly) && moment().isAfter(firstOfJuly)) {
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

function handleEaster(easterStartDiff, easterEndDiff) {
	if (easterStartDiff >= 0 && easterEndDiff <= 0) {
		return "Självstudier";
	}
	if (easterEndDiff > 0) {
		const weeks = Math.floor(easterEndDiff / 7);
		return `Lv ${weeks + 4}`;
	}
}

function computeTime() {
	// Find date where value is easter_start, easter_end and ord_cont in json file
	const EASTER_START = dateDict.easter_start;
	const ORD_CONT = dateDict.ord_cont;
	const currentDate = moment();
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
	if (easterEndCheck >= 0 || easterStartCheck >= 0) {
		return handleEaster(easterStartCheck, easterEndCheck);
	}
	const deltaT = currentDate.diff(moment(dat), "days");
	const weeks = Math.floor(deltaT / 7);
	if (weeks > 7) {
		return "Självstudier";
	}
	return `LV ${weeks + 1}`;
}

module.exports = computeTime;
