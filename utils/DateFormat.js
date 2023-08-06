export default function DateFormat(currentDate, getString = true) {
  const provideDate = new Date(currentDate);
  const date = provideDate.getDate();
  /* for int month */
  const monthInt = provideDate.getMonth() + 1;

  /* for string month */
  const month = provideDate.toDateString();
  const monthFormat = month.split(" ");
  const year = provideDate.getFullYear();
  if (getString) {
    return `${date} ${monthFormat[1]} ${year}`;
  }
  return {
    date: date,
    monthString: monthFormat[1],
    month: monthInt,
    year: year,
  };

  /* when need date format as a object */
  // return {
  //   date,
  //   month: monthFormat[1],
  //   year,
  // };
}
