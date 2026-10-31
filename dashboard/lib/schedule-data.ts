import kpScheduleRaw from "../data/schedule-kwentong-pinoy.json";
import adbtScheduleRaw from "../data/schedule-adaybackthen.json";

export interface ScheduleItem {
  day: number;
  slug: string;
  title: string;
  date: string;
  time?: string;
  youtube?: {
    videoId: string;
    url: string;
    scheduledPht: string;
    scheduledUtc: string;
    status: string;
  } | null;
  facebook?: {
    videoId: string;
    url: string;
    scheduledPht: string;
    scheduledUtc: string;
    status: string;
  } | null;
  instagramExpected?: {
    date: string;
    timePht: string;
    owner: string;
    status: string;
  } | null;
}

export const kwentongPinoySchedule: ScheduleItem[] = kpScheduleRaw as ScheduleItem[];
export const aDayBackThenSchedule: ScheduleItem[] = adbtScheduleRaw as ScheduleItem[];
