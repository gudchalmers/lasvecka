const moment = require('moment');
const fs = require('fs');
const scrape = require('./lasveckor_scraper.js');
var dateDict = {};

// check if data.json exists
if (!fs.existsSync('data.json')) {
  scrape().then((res) => {
    dateDict = res
  });
} else {
  dateDict = JSON.parse(fs.readFileSync('data.json'));

  //check if it was updated after 1/7 this year and if 1/7 has occured this year
  let updated = moment(dateDict["updated"]);
  let firstOfJuly = moment().month(6).date(1);
  if (updated.isBefore(firstOfJuly) && moment().isAfter(firstOfJuly)) {
    scrape().then((res) => {
      dateDict = res
    });
  }
}

function readDatePeriod(currDate) {
  let soughtDate = "";
  let diff = -1000;
  for (let dat in dateDict) {
    // if dat is updated, easter_start, easter_end or ord_cont then skip
    if (dat === "updated" || dat === "easter_start" || dat === "easter_end" || dat === "ord_cont") {
      continue;
    }
    let deltaT = moment(dat).diff(currDate, 'days');
    if (deltaT === 0) {
      return { date: dat, type: dateDict[dat] };
    } else if (deltaT > diff && deltaT < 0) {
      soughtDate = dat;
      diff = deltaT;
    }
  }
  return { date: soughtDate, type: dateDict[soughtDate] };
}

function handleEaster(easterStartDiff, easterEndDiff) {
  if (easterStartDiff >= 0 && easterEndDiff <= 0) {
    return "Självstudier";
  } else if (easterEndDiff > 0) {
    let weeks = Math.floor(easterEndDiff / 7);
    return "Lv " + (weeks + 4);
  }
}

function computeTime() {
  // Find date where value is easter_start, easter_end and ord_cont in json file
  let EASTER_START = dateDict["easter_start"]
  let ORD_CONT = dateDict["ord_cont"]
  let currentDate = moment();
  let easterEndCheck = currentDate.diff(ORD_CONT, 'days');
  let easterStartCheck = currentDate.diff(EASTER_START, 'days');
  let { date: dat, type: typ } = readDatePeriod(currentDate);
  if (typ === "exam_period") {
    let deltaT = currentDate.diff(moment(dat), 'days');
    if (deltaT > 7) {
      return "Självstudier";
    } else {
      return "Tentavecka";
    }
  }
  if (easterEndCheck >= 0 || easterStartCheck >= 0) {
    return handleEaster(easterStartCheck, easterEndCheck);
  } else {
    let deltaT = currentDate.diff(moment(dat), 'days');
    let weeks = Math.floor(deltaT / 7);
    if (weeks > 7) {
      return "Självstudier";
    } else {
      return "LV " + (weeks + 1);
    }
  }
}

module.exports = computeTime;