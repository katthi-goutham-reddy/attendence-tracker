import { eachDayOfInterval, getDay, format, isEqual, parseISO } from 'date-fns';

/**
 * Generate all class sessions from timetable between start and end dates,
 * excluding holidays.
 */
export function generateSessions(startDate, endDate, timetable, holidays) {
  if (!startDate || !endDate || !timetable.length) return [];

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (start > end) return [];

  const allDays = eachDayOfInterval({ start, end });
  const holidayDates = holidays.map(h =>
    typeof h.date === 'string' ? parseISO(h.date) : h.date
  );

  const sessions = [];

  for (const day of allDays) {
    const weekday = getDay(day); // 0=Sunday, 6=Saturday

    // Check if it's a holiday
    const isHoliday = holidayDates.some(hd => isEqual(stripTime(hd), stripTime(day)));
    if (isHoliday) continue;

    // Find timetable entries for this weekday
    const entries = timetable.filter(t => t.weekday === weekday);

    for (const entry of entries) {
      sessions.push({
        id: `${format(day, 'yyyy-MM-dd')}-${entry.subjectId}`,
        date: format(day, 'yyyy-MM-dd'),
        subjectId: entry.subjectId,
        subjectName: entry.subjectName,
        status: null, // null = unmarked, 'present', 'absent'
      });
    }
  }

  return sessions;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Calculate attendance stats for each subject
 */
export function calculateAttendanceStats(sessions, subjects, targetAttendance = 75) {
  const stats = {};

  for (const subject of subjects) {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const attended = subjectSessions.filter(s => s.status === 'present').length;
    const absent = subjectSessions.filter(s => s.status === 'absent').length;
    const total = subjectSessions.length;
    const marked = attended + absent;
    const percentage = marked > 0 ? (attended / marked) * 100 : 0;

    stats[subject.id] = {
      subjectId: subject.id,
      subjectName: subject.name,
      attended,
      absent,
      total,
      marked,
      percentage,
      status: percentage >= targetAttendance ? 'safe' : percentage >= (targetAttendance - 5) ? 'warning' : 'danger',
    };
  }

  return stats;
}

/**
 * Predict attendance safety
 */
export function predictAttendance(stats, requiredPercentage = 75) {
  const predictions = {};

  for (const [subjectId, stat] of Object.entries(stats)) {
    const remaining = stat.total - stat.marked;
    const requiredMin = Math.ceil((requiredPercentage / 100) * stat.total);
    const mustAttend = Math.max(0, requiredMin - stat.attended);
    const canMiss = Math.max(0, remaining - mustAttend);

    predictions[subjectId] = {
      ...stat,
      remaining,
      requiredMin,
      mustAttend,
      canMiss,
      isSafe: stat.attended + remaining >= requiredMin,
    };
  }

  return predictions;
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
}

/**
 * Get weekday name
 */
export const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function getWeekdayLabel(day) {
  return WEEKDAYS.find(w => w.value === day)?.label || '';
}
