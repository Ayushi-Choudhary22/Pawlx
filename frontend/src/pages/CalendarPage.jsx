import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiDownload } from 'react-icons/fi';
import { calendarService } from '@/services/calendarService';
import { downloadICS } from '@/utils/icsExport';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

const TYPE_STYLES = {
  vet: { dot: 'bg-primary', label: 'Vet Visit' },
  grooming: { dot: 'bg-accent', label: 'Grooming' },
  sitter: { dot: 'bg-secondary', label: 'Pet Sitting' },
  medicine: { dot: 'bg-ink-muted', label: 'Medicine' },
  vaccination: { dot: 'bg-red-400', label: 'Vaccination' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const eventFallsOnDay = (event, day) => {
  const start = new Date(event.date);
  if (!event.endDate) return sameDay(start, day);
  const end = new Date(event.endDate);
  return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString());
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    calendarService
      .getMyEvents()
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const gridDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  }, [viewDate]);

  const eventsForSelectedDay = events.filter((e) => eventFallsOnDay(e, selectedDay));

  const changeMonth = (delta) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-ink">Calendar</h1>
        <Button
          variant="outline"
          size="sm"
          icon={<FiDownload size={14} />}
          onClick={() => downloadICS(events, 'pawlx-calendar.ics')}
          disabled={events.length === 0}
        >
          Export to Calendar (.ics)
        </Button>
      </div>
      <p className="text-sm text-ink-muted mb-6">
        Every vet visit, grooming session, pet-sitting stay, and reminder — in one place.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-surface text-ink-muted">
                <FiChevronLeft size={16} />
              </button>
              <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-surface text-ink-muted">
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-muted mb-2">
            {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {gridDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dayEvents = events.filter((e) => eventFallsOnDay(e, day));
              const isSelected = sameDay(day, selectedDay);
              const isToday = sameDay(day, new Date());

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg p-1.5 text-left flex flex-col transition-colors ${
                    isSelected ? 'bg-primary-light' : 'hover:bg-surface'
                  }`}
                >
                  <span
                    className={`text-xs h-5 w-5 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-primary text-white' : 'text-ink'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${TYPE_STYLES[e.type]?.dot}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border">
            {Object.entries(TYPE_STYLES).map(([key, { dot, label }]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span className={`h-2 w-2 rounded-full ${dot}`} /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-4">
            {selectedDay.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>

          {eventsForSelectedDay.length === 0 ? (
            <EmptyState icon={<FiCalendar size={24} />} title="Nothing scheduled" description="No events on this day." />
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDay.map((event) => (
                <Link key={event.id} to={event.link} className="block p-3 rounded-lg border border-border hover:bg-surface">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-2 w-2 rounded-full ${TYPE_STYLES[event.type]?.dot}`} />
                    <span className="text-sm font-medium text-ink">{event.title}</span>
                  </div>
                  {event.subtitle && <p className="text-xs text-ink-muted ml-4">{event.subtitle}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
