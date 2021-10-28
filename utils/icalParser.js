// const ical = require('ical');
// const icalParser = (data) => {
//   if (typeof data !== 'string') throw new Error('data must be a string');
//   return ical.parseICS(data);
// };
// module.exports = { icalParser };


const ical = require('cal-parser');
const icalParser = (data) => {
  if (typeof data !== 'string') throw new Error('data must be a string');
  return ical.parseString(data);
};
module.exports = { icalParser };
