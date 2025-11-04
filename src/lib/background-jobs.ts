export type Time = number;
export const SECOND: Time = 1000; // ms
export const MINUTE: Time = 60 * SECOND;
export const HOUR: Time = 60 * MINUTE;
export const DAY: Time = 24 * HOUR;

export function startJob(interval: Time, job: () => {}) {
  setInterval(job, interval);
}

