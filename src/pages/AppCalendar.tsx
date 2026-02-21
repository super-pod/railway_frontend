import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

interface CalendarEvent {
    id?: string;
    summary?: string;
    location?: string;
    htmlLink?: string;
    status?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}

const AppCalendar = () => {
    const { profile } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [syncingCalendar, setSyncingCalendar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

    const calendarConnected = Boolean(profile?.calendar_connected);

    const fetchEvents = async (isRefresh = false) => {
        if (!calendarConnected) {
            setEvents([]);
            setError(null);
            setLoading(false);
            setRefreshing(false);
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await apiClient.get('/mvp/calendar/events');
            setEvents(response.data?.events || []);
            setError(null);
            setLastUpdatedAt(new Date());
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Could not load your calendar events.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        void fetchEvents();
    }, [calendarConnected]);

    const connectCalendar = async () => {
        setSyncingCalendar(true);
        setError(null);
        try {
            const response = await apiClient.post('/mvp/oauth/start', {
                provider: 'calendar',
                from_path: '/app/calendar',
            });
            window.location.href = response.data.auth_url;
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Could not start calendar sync.');
            setSyncingCalendar(false);
        }
    };

    const getStart = (event: CalendarEvent) => event.start?.dateTime || event.start?.date || '';
    const getEnd = (event: CalendarEvent) => event.end?.dateTime || event.end?.date || '';

    const formatDate = (iso: string) => {
        if (!iso) {
            return '';
        }
        return new Date(iso).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (iso: string) => {
        if (!iso) {
            return '';
        }
        return new Date(iso).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const groupedEvents = useMemo(() => {
        return events.reduce<Record<string, CalendarEvent[]>>((groups, event) => {
            const start = getStart(event);
            const key = start ? new Date(start).toDateString() : 'Unknown';
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(event);
            return groups;
        }, {});
    }, [events]);

    const orderedDayKeys = useMemo(() => {
        return Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }, [groupedEvents]);

    return (
        <div className="px-5 py-8 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#09343a]">Calendar</h1>
                        <p className="mt-1 text-sm text-[#33585d]">
                            Upcoming events from your Google Calendar
                            {lastUpdatedAt ? ` . Updated ${lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => fetchEvents(true)}
                        disabled={refreshing || loading || !calendarConnected}
                        className="rounded-lg border border-[#0a4f56]/20 px-3 py-2 text-sm text-[#0a4f56] disabled:opacity-60"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {!calendarConnected && (
                    <div className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                        <p className="text-base font-semibold text-[#09343a]">Connect your Google Calendar</p>
                        <p className="mt-2 text-sm text-[#33585d]">
                            Calendar sync is required before your events can be shown here.
                        </p>
                        <button
                            onClick={connectCalendar}
                            disabled={syncingCalendar}
                            className="mt-4 rounded-lg bg-[#0a4f56] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {syncingCalendar ? 'Connecting...' : 'Connect Google Calendar'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {calendarConnected && loading && (
                    <div className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                        <p className="text-sm text-[#33585d]">Loading calendar...</p>
                    </div>
                )}

                {calendarConnected && !loading && events.length === 0 && (
                    <div className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                        <p className="text-sm text-[#33585d]">No upcoming events in your current window.</p>
                    </div>
                )}

                {calendarConnected && !loading && events.length > 0 && (
                    <div className="space-y-5">
                        {orderedDayKeys.map((dayKey) => (
                            <section key={dayKey} className="rounded-2xl border border-[#0a4f56]/12 bg-white p-6">
                                <h2 className="text-base font-semibold uppercase tracking-wide text-[#5F9598]">
                                    {formatDate(new Date(dayKey).toISOString())}
                                </h2>
                                <div className="mt-4 space-y-3">
                                    {(groupedEvents[dayKey] || []).map((event, index) => {
                                        const start = getStart(event);
                                        const end = getEnd(event);
                                        const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
                                        return (
                                            <div key={event.id || `${dayKey}-${index}`} className="rounded-xl border border-[#0a4f56]/12 p-4">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#09343a]">{event.summary || 'Untitled event'}</p>
                                                        <p className="mt-1 text-xs text-[#33585d]">
                                                            {isAllDay ? 'All day' : `${formatTime(start)} - ${formatTime(end)}`}
                                                        </p>
                                                        {event.location && <p className="mt-1 text-xs text-[#33585d]">Location: {event.location}</p>}
                                                    </div>
                                                    {event.htmlLink && (
                                                        <a
                                                            href={event.htmlLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="rounded-lg border border-[#0a4f56]/20 px-2.5 py-1.5 text-xs text-[#0a4f56]"
                                                        >
                                                            Open in Google
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppCalendar;
