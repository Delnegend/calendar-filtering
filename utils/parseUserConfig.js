const parseUserConfig = (data_) => {
  /*
    'B1_L1': 'https://calendar.google.com/calendar/ical/v0qbbfube10coopf5vfiovf5qo%40group.calendar.google.com/public/basic.ics',
    'B1_L2': 'https://calendar.google.com/calendar/ical/c_gj0263fted8l7qfm15shi2069c%40group.calendar.google.com/public/basic.ics',
    'B1_L3': 'https://calendar.google.com/calendar/ical/c_fsjo0lba0dfq79odbo46jer5fg%40group.calendar.google.com/public/basic.ics',
    'dev': 'http://localhost:6969/basic.ics',
  */
  const data = JSON.parse(Buffer.from(data_, 'base64').toString('utf-8'));
  const config = {
    'url': data.url ? data.url : 'https://calendar.google.com/calendar/ical/v0qbbfube10coopf5vfiovf5qo%40group.calendar.google.com/public/basic.ics',
    'name': data.name ? data.name : 'My Calendar',
    'type': 'blist',
    'matchPart': data.matchPart ? data.matchPart : [
      '[B1.09]',
      '[B1.10]',
      // "[B1.11]",
      '[B1.12]',
      '[B1.13]',
      '[B1.14]',
      '[B1.15]',
      '[B1.16]',
      'L1.1',
      'L1.2',
      'L1.3',
      'L1.4',
      // "L1.5",
      'L1.6',
      'L1.7',
    ],
    // 'matchString': data.matchString ? data.matchString : [
    //   'English B1',
    //   'Semester I',
    //   'English',
    // ],
    // 'limit': {
    //   'start': {
    //     'year': 2021,
    //     'month': 8,
    //     'day': 1,
    //   },
    //   'end': {
    //     'year': 2021,
    //     'month': 12,
    //     'day': 31,
    //   },
    // },
  };
  return config;
};
module.exports = parseUserConfig;
