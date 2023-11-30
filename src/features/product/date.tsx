import moment from "moment";

export function diffInHours(dateA: Date, dateB: Date) {
  const momentA = moment(dateA);
  const momentB = moment(dateB);

  const diffHours = momentB.diff(momentA, "hours");

  return diffHours;
}
