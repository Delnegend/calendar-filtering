/* eslint-disable prefer-const */
const axios = require('axios');
const express = require('express');
const clone = require('just-clone');
const ical = require('ical-generator');

const { convert } = require('./utils/icalToFromJson');
const parseUserConfig = require('./utils/parseUserConfig');
const createEventConfig = require('./utils/createEventConfig');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ::${PORT}`);
});
const throwErr = (err, req, res) => {
  res.setHeader('Content-type', 'application/json');
  req.connection.destroy();
  res.end(JSON.stringify(err));
};

app.get('/', async (req, res) => {
  userConfigData = await req.query?.userConfig ? await axios.get(req.query?.userConfig) : void 0;
  if (!userConfigData) throwErr('userConfig unvalid or not found', req, res);
  let userConfig = parseUserConfig(userConfigData.data);
  // if (!userConfigData) throwErr('userConfig unvalid or not found');
  let rawCal = await axios.get(userConfig.url);
  let jsonCal = convert(rawCal.data);
  let events = clone(jsonCal.VCALENDAR[0].VEVENT);
  if (userConfig.type == 'blist') {
    if (userConfig.matchPart) {
      for (const item of userConfig.matchPart) events = events.filter((event) => !event.SUMMARY.includes(item));
    }
    if (userConfig.matchString) {
      for (const item of userConfig.matchString) events = events.filter((event) => !(event.SUMMARY == item));
    }
  }

  const newCalendar = ical({
    'prodId': '//Google Inc//Google Calendar//EN',
    'name': userConfig.name,
    'description': jsonCal.VCALENDAR[0]['X-WR-CALDESC'],
    'scale': jsonCal.VCALENDAR[0]?.CALSCALE,
    'method': jsonCal.VCALENDAR[0]?.METHOD,
  });
  for (const event of events) {
    const eventConfig = createEventConfig(event);
    if (userConfig.limit?.start) {
      const condition = [
        parseInt(eventConfig.date.start.year) >= userConfig.limit.start.year,
        parseInt(eventConfig.date.start.month) >= userConfig.limit.start.month,
        parseInt(eventConfig.date.start.day) >= userConfig.limit.start.day,
      ];
      if (!condition.includes(false)) newCalendar.createEvent(eventConfig.data);
    } else if (userConfig.limit?.start && userConfig.limit?.end) {
      const condition = [
        parseInt(eventConfig.date.start.year) >= userConfig.limit.start.year,
        parseInt(eventConfig.date.start.month) >= userConfig.limit.start.month,
        parseInt(eventConfig.date.start.day) >= userConfig.limit.start.day,
        parseInt(eventConfig.date.end.year) <= userConfig.limit.end.year,
        parseInt(eventConfig.date.end.month) <= userConfig.limit.end.month,
        parseInt(eventConfig.date.end.day) <= userConfig.limit.end.day,
      ];
      if (!condition.includes(false)) newCalendar.createEvent(eventConfig.data);
    } else {
      newCalendar.createEvent(eventConfig.data);
    }
  }

  // FOR DEVELOPMENT PURPOSES ONLY
  // res.setHeader('Content-type', 'application/json');
  // res.end(JSON.stringify(newCalendar));

  // ENABLE FOR PRODUCTION
  newCalendar.serve(res);
  // console.log('requested');
});
