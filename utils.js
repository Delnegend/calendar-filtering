const _ = require("lodash");

const englishClasses = [
  "B1.09",
  "B1.10",
  "B1.11",
  "B1.12",
  "B1.13",
  "B1.14",
  "B1.15",
  "B1.16",
];

const validatorEnglishClasses = (className) => {
  return _.includes(englishClasses, className);
};

module.exports = { validatorEnglishClasses };
