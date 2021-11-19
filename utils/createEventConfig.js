const { rrulestr } = require('rrule');

const iCalDateParse = (date) => {
  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(6, 2);
  let hour = date.substr(9, 2);
  let minute = date.substr(11, 2);
  let second = date.substr(13, 2);
  const offset = date.substr(15, 1);
  hour = hour ? hour : '00';
  minute = minute ? ':' + minute : ':00';
  second = second ? ':' + second + '.000' : ':00.000';
  const finalDate = year + '-' + month + '-' + day + 'T' + hour + minute + second + offset;
  return [finalDate, year, month, day];
};

const parseDate = (event) => {
  const result = {
    'start': iCalDateParse(event[Object.keys(event).filter((prop) => /DTSTART/g.test(prop))[0]]),
    'end': iCalDateParse(event[Object.keys(event).filter((prop) => /DTEND/g.test(prop))[0]]),
  };
  return {
    'start': {
      'date': result.start[0],
      'year': result.start[1],
      'month': result.start[2],
      'day': result.start[3],
    },
    'end': {
      'date': result.end[0],
      'year': result.end[1],
      'month': result.end[2],
      'day': result.end[3],
    },
  };
};

const createEventConfig = (event) => {
  const date = parseDate(event);
  return {
    'data': {
      'start': date.start.date,
      'end': date.end.date,
      'repeating': event.RRULE ? rrulestr(event.RRULE) : null, // eslint-disable-line new-cap
      'timestamp': event.DTSTAMP,
      'created': iCalDateParse(event.CREATED)[0],
      'description': event.DESCRIPTION,
      'location': event.LOCATION,
      'sequence': event.SEQUENCE,
      'status': event.STATUS,
      'summary': event.SUMMARY,
      'transparency': event.TRANSP == 'TRANSP' ? 'TRANSP' : 'OPAQUE',
    },
    'date': date,
  };
};
module.exports = createEventConfig;
