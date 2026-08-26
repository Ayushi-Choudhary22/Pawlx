/**
 * Generates a downloadable .ics (iCalendar) file from a list of normalized
 * calendar events, so users can import their PAWLX schedule into Google
 * Calendar, Apple Calendar, Outlook, etc.
 */

const pad = (n) => String(n).padStart(2, '0');

// Formats a JS Date as a UTC-based iCalendar DATE or DATE-TIME string (all-day event style: YYYYMMDD)
const toICSDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
};

// Adds one day to a date string in YYYYMMDD form, since ICS all-day events use an exclusive DTEND
const nextDayICS = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return toICSDate(d);
};

const escapeICSText = (text = '') =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * @param {Array<{id: string, title: string, subtitle?: string, date: string, endDate?: string}>} events
 * @returns {string} raw .ics file content
 */
export const generateICS = (events) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PAWLX//Pet Ecosystem Calendar//EN',
    'CALSCALE:GREGORIAN',
  ];

  events.forEach((event) => {
    const start = toICSDate(event.date);
    const end = event.endDate ? nextDayICS(event.endDate) : nextDayICS(event.date);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@pawlx.app`,
      `DTSTAMP:${toICSDate(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${escapeICSText(event.title)}`,
      event.subtitle ? `DESCRIPTION:${escapeICSText(event.subtitle)}` : null,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.filter(Boolean).join('\r\n');
};

/**
 * Triggers a browser download of the generated .ics file.
 */
export const downloadICS = (events, filename = 'pawlx-calendar.ics') => {
  const content = generateICS(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
