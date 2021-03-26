import {addDays, addMonths, format} from 'date-fns';

export function getDateFromString(d: string): Date {
  const array: string[] = d.split('-');
  const year: number = Number.parseInt(array[0]);
  const month: number = Number.parseInt(array[1]) - 1;
  const day: number = Number.parseInt(array[2]);
  return new Date(year, month, day);
}

// Feature "TodoQuickDelay"
// Preparing string for adding delay by a days and weeks
export function getDelayString(d: number): string {
  const prefix: string = d >= 0 ? '+ ' : '- ';
  let value: number = Math.abs(d);
  let suffix: string = (value%7 === 0) ? ' week' : ' day';
  if (value%7 === 0) value = value/7;
  if (value > 1) suffix += 's';
  return prefix + value + suffix;
}

// Preparing string for adding delay by a month
export function getDelayStringMonths(m: number) : string {
  const prefix: string = m >= 0 ? '+ ' : '- ';
  let value: number = Math.abs(m);
  let suffix: string = ' month';
  if (value > 1) suffix += 's';
  return prefix + value + suffix;
}

export function calculateNewDueDate(d: string, delay: number): string {
  const oldDueDate: Date = getDateFromString(d);
  return format(addDays(oldDueDate, delay),'yyyy-MM-dd');
}

// to calculate new month
export function calculateNewDueMonth(d: string, delay: number): string {
  const oldDueDate :Date = getDateFromString(d);
  return format(addMonths(oldDueDate, delay), 'yyyy-MM-dd');
}

export function getBasecampFormattedDueDate(d: string): string {
  const date: Date = getDateFromString(d);
  return format(date, '  EEE, MMM d');
}

export function parseDelayDayOptionsString(s: string): number[] {
  const a: number[] | undefined = s.split(',').map(n => parseInt(n)).sort((a: number, b: number) => a-b);
  return (a !== undefined) ? a : [1,2,7,14]; // default if string parsing fails
}
