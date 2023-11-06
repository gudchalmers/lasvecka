const moment = require('moment');
const dateDict = require('./data.json');

function readDatePeriod(currDate) {
  let soughtDate = "";
  let diff = -1000;
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
  // Find date where value is easter_start, easter_end and ord_cont in json file
  let EASTER_START;
  let ORD_CONT;
  for (let dat in dateDict) {
    if (dateDict[dat] === "easter_start") {
      EASTER_START = moment(dat);
    } else if (dateDict[dat] === "ord_cont") {
      ORD_CONT = moment(dat);
    }
  }

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