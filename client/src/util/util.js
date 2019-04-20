export const parseDate = function(temp) {
  let year = parseInt(temp.substring(0, 4));
  let month = parseInt(temp.substring(5, 7));
  let day = parseInt(temp.substring(8, 10));
  if (year % 4 === 0) {
    if (month === 2) {
      if (day > 29) {
        return false;
      }
    }
  } else {
    if (month === 2) {
      if (day > 28) {
        return false;
      }
    } else if (
      (month === 1) |
      (month === 3) |
      (month === 5) |
      (month === 7) |
      (month === 8) |
      (month === 10) |
      (month === 12)
    ) {
      if (day > 31) {
        return false;
      }
    } else {
      if (day > 30) {
        return false;
      }
    }
  }

  return true;
};
