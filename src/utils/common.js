const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElementArray = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomDate = function(minuteRange = 60, hourRange = 23, rangeOfDays = 5 ){
  const today = new Date(Date.now());
  return new Date(today.getYear() + 1900,today.getMonth(), today.getDate() + Math.random() * rangeOfDays, Math.random() * hourRange, Math.random() * minuteRange);
};

const increaseRandomDate = (date, minuteRange = 60, hourRange = 5) => {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + getRandomInt(1, hourRange));
  newDate.setMinutes(date.getMinutes() + getRandomInt(0, minuteRange));
  return newDate;
};

export {
  getRandomInt,
  getRandomElementArray,
  getRandomDate,
  increaseRandomDate
};
