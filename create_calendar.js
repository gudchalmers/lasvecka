const { CalendarDate, CalendarEvent, Calendar } = require("iamcal");
const computeTime = require("./calc_date");
const moment = require("moment");

function weeksToEvents(weeks, dtstamp=Date()) {
    const events = [];
    weeks.forEach(([date, studyweek]) => {
        const uid = date.format("yyyy-ww");
        const day = new CalendarDate(date.toDate());
        const event = new CalendarEvent(uid, dtstamp, day)
            .setEnd(day)
            .setSummary(studyweek);
        events.push(event);
    })
    return events;
}

function computeWeeks(now, before, after) {
    const weeks = [];
    for (let i = -before; i <= after; i++) {
        const date = moment(now).add(i, "weeks");
        weeks.push([date, computeTime(date)]);
    }
    return weeks;
}

function startOfWeek(now) {
    return moment(now)
        .subtract(moment.duration(now.isoWeekday() - 1, "days"))
        .startOf("day")
        .add(12, "hours");
}

function createCalendar(now, before, after) {
	const monday = startOfWeek(now);
	const weeks = computeWeeks(monday, before, after);

	const calendar = new Calendar("-//gud//lasvecka")
    .setCalendarName("Läsvecka.nu")
    .setCalendarDescription("Kommande läsveckor från läsvecka.nu");

	const dtstamp = new Date();
	const events = weeksToEvents(weeks, dtstamp);
    calendar.addComponents(events);

	return calendar;
}

module.exports = createCalendar;
