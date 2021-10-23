const express = require("express");
const { validatorEnglishClasses } = require("./utils");
const _ = require("lodash");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const ical = require("ical-generator");

app.listen(PORT, () => {
  console.log(`Server is running on ::${PORT}`);
});

app.get("/", async (req, res) => {
  const { english_class, lecture_class, tutor_class, practice_class } =
    req.query;
  const valid_params = [];
  const errors = [];
  if (_.isUndefined(validatorEnglishClasses(english_class))) {
    errors.push("Invalid english class");
  } else {
    valid_params.push(english_class);
  }
  const calendarURL =
    "https://clients6.google.com/calendar/v3/calendars/v0qbbfube10coopf5vfiovf5qo@group.calendar.google.com/events?calendarId=v0qbbfube10coopf5vfiovf5qo%40group.calendar.google.com&singleEvents=true&timeZone=Asia%2FHo_Chi_Minh&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=2021-09-26T00%3A00%3A00%2B07%3A00&timeMax=2021-11-07T00%3A00%3A00%2B07%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs";
  const jsonCal = (await axios.get(calendarURL))?.data;
  // Valid for lecture, tutor and practice class
  let events = _.filter(
    jsonCal?.items,
    (event) => {
      let validEvent = false;
      _.forEach(valid_params, (param) => {
        if (_.includes(event?.summary, param)) {
          validEvent = true;
        }
      });
      return validEvent;
    }
    //   console.log(valid_params, event?.summary)
  );
  events = events.map((event) => {
    return {
      start: event?.start?.dateTime,
      end: event?.end?.dateTime,
      summary: event?.summary,
      description: event?.location,
    };
  });
  const cal = ical({ name: "my first iCal", events });

  cal.serve(res);
  //   res.send({ events });
});
