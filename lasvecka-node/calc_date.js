const fs = require('fs');
const moment = require('moment');
const dateDict = require('./data.json');

const EASTER_START = moment("2024-04-03");
const EASTER_END = moment("2024-04-05");
const ORD_CONT = moment("2024-04-08");

function readDatePeriod(currDate) {
  let soughtDate = "";
  let diff = -1000;
  let dateDict = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  for (let dat in dateDict) {
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

console.log(computeTime());