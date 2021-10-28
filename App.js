/* eslint-disable prefer-const */
const axios = require('axios');
const express = require('express');
const clone = require('just-clone');

const ical = require('ical-generator');
const { icalParser } = require('./utils/icalParser');
const { RRule } = require('rrule');

// Express server
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ::${PORT}`);
});

app.get('/', async (req, res) => {
  // #region

  // let { config } = req.query;
  // if (!config) {
  /* eslint-disable quotes, comma-dangle, semi */
  let config = {
    "userCal": false,
    "selectCal": "B1_L1",
    "type": "blist",
    "matchPart": [
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
    ],
    "matchString": [
      "English B1",
      "Semester I",
      "English"
    ]
  }
  /* eslint-enable quotes, comma-dangle, semi */
  // }
  const calURL = {
    'B1_L1': 'https://calendar.google.com/calendar/ical/v0qbbfube10coopf5vfiovf5qo%40group.calendar.google.com/public/basic.ics',
    'B1_L2': 'https://calendar.google.com/calendar/ical/c_gj0263fted8l7qfm15shi2069c%40group.calendar.google.com/public/basic.ics',
    'B1_L3': 'https://calendar.google.com/calendar/ical/c_fsjo0lba0dfq79odbo46jer5fg%40group.calendar.google.com/public/basic.ics',
    'dev': 'http://localhost:5500/basic.ics',
  };

  let calendarURL;
  if (config.userCal) calendarURL = config.userCal;
  else calendarURL = calURL[config.selectCal];

  // FOR DEVELOPMENT PURPOSES ONLY
  calendarURL = calURL.dev;
  // #endregion

  let rawCal = await axios.get(calendarURL);
  let jsonCal = icalParser(rawCal.data);
  let events = clone(jsonCal.events);

  if (config.type == 'blist') {
    for (const item of config.matchPart) events = events.filter((event) => !event.summary?.value.includes(item));
    for (const item of config.matchString) events = events.filter((event) => !(event.summary?.value == item));
  }

  // #region
  const newCalendar = ical({
    'prodId': '//Google Inc//Google Calendar//EN',
    'method': jsonCal.calendarData?.method,
    'name': 'Kien Calendar',
    // 'timezone': jsonCal.calendarData['x-wr-timezone'],
  });

  for (const event of events) {
    newCalendar.createEvent({
      'start': new Date(event.dtstart?.value),
      'end': new Date(event.dtend?.value),
      'id': event.uid?.value,
      'description': event.description?.value,
      'location': event.location?.value,
      'sequence': event.sequence?.value,
      'status': event.status?.value,
      'summary': event.summary?.value,
      'transparency': event.transp?.value,
      // 'timezone': jsonCal.calendarData['x-wr-timezone'],
      'repeating': new RRule(event.recurrenceRule?.options).toString(),
    });
  }

  // FOR DEVELOPMENT PURPOSES ONLY
  // res.setHeader('Content-type', 'application/json');
  // res.end(JSON.stringify(jsonCal));

  // ENABLE FOR PRODUCTION
  newCalendar.serve(res);
  console.log('requested');
});
