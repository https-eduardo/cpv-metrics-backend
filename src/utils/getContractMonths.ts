import { differenceInCalendarMonths } from "date-fns";

export function getContractMonths(startDate: Date, endDate: Date) {
  return differenceInCalendarMonths(endDate, startDate);
}
