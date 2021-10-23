const ical2json = require('ical2json')
const axios = require('axios')
const fs = require('fs')
const clone = require('just-clone')
const _ = require('lodash')

// const calendarURL = "https://calendar.google.com/calendar/ical/v0qbbfube10coopf5vfiovf5qo%40group.calendar.google.com/public/basic.ics";
const calendarURL = "http://127.0.0.1:6969/basic.ics"
const classesToRemove = [
  "[B1.09]",
  "[B1.10]",
  // "[B1.11]",
  "[B1.12]",
  "[B1.13]",
  "[B1.14]",
  "[B1.15]",
  "[B1.16]",
  "L1.1",
  "L1.2",
  "L1.3",
  "L1.4",
  // "L1.5",
  "L1.6",
  "L1.7",
  "English B1"
];

(async () => {
  const rawCal = await axios.get(calendarURL);
  const jsonCal = ical2json.convert(rawCal.data);
  let events = clone(jsonCal.VCALENDAR[0].VEVENT);

  // MODIFIED ical2json
  function revert(object) {
    var lines = [];
    var SPACE = " ";
    for (var key in object) {
      var value = object[key];
      if (Array.isArray(value)) {
        if (key === "RDATE" || key.includes("EXDATE")) {
          value.forEach(function (item) {
            lines.push(key + ":" + item);
          });
        } else {
          value.forEach(function (item) {
            lines.push("BEGIN:" + key);
            lines.push(revert(item));
            lines.push("END:" + key);
          });
        }
      } else {
        var fullLine = key + ":" + value;
        do {
          // According to ical spec, lines of text should be no longer
          // than 75 octets
          lines.push(fullLine.substr(0, 75));
          fullLine = SPACE + fullLine.substr(75);
        } while (fullLine.length > 1);
      }
    }
    return lines.join("\n");
  }

  for (let classToRemove of classesToRemove)
    events = _.filter(events, eachEvent => !eachEvent.SUMMARY?.includes(classToRemove));
  let cleanCal = clone(jsonCal);
  cleanCal.VCALENDAR[0].VEVENT = events;

  fs.writeFile('cleanCalendar.ics', revert(cleanCal), 'utf-8', () => { });
})();