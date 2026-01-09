import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { Calendar as CalendarIcon, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface CalendarEvent {
    id?: string;
    summary?: string;
    location?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
}

const Schedule = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchEvents = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await apiClient.get('/calendar/events');
            if (res.data.events) {
                setEvents(res.data.events);
                setError(null);
                setLastUpdated(new Date());
            } else {
                setError(res.data.message || 'Failed to fetch events');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching your calendar.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatTime = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getEventStart = (event: CalendarEvent) => {
        return event.start?.dateTime || event.start?.date || '';
    };

    const getEventEnd = (event: CalendarEvent) => {
        return event.end?.dateTime || event.end?.date || '';
    };

    const groupedEvents = events.reduce((acc: Record<string, CalendarEvent[]>, event) => {
        const start = getEventStart(event);
        const key = start ? new Date(start).toDateString() : 'Unknown';
        acc[key] = acc[key] || [];
        acc[key].push(event);
        return acc;
    }, {});

    const orderedDays = Object.keys(groupedEvents).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    const nextEvent = events
        .map(event => ({ event, start: getEventStart(event) }))
        .filter(item => item.start)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="spinner"></div>
                <span className="mt-3 text-sm text-[#061E29]/60">Loading calendar...</span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Calendar</h1>
                    <p className="text-sm text-[#061E29]/60">
                        Synced from Google Calendar
                        {lastUpdated && ` ? Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="px-3 py-2 bg-[#F3F4F4] rounded-lg text-xs text-[#061E29]/70">
                            {events.length} events
                        </div>
                        {nextEvent?.start && (
                            <div className="px-3 py-2 bg-[#F3F4F4] rounded-lg text-xs text-[#061E29]/70">
                                Next: {formatDate(nextEvent.start)} at {formatTime(nextEvent.start)}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => fetchEvents(true)}
                        disabled={refreshing || loading}
                        className="btn btn-secondary"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing' : 'Refresh'}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="card p-8 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#061E29] mb-2">{error}</h2>
                    <p className="text-sm text-[#061E29]/60 mb-6">
                        Access token might be stale or permissions were revoked.
                    </p>
                    <Link to="/sync-calendar" className="btn btn-primary">
                        Reconnect Calendar
                    </Link>
                </div>
            ) : events.length === 0 ? (
                <div className="card p-12 text-center">
                    <CalendarIcon className="w-10 h-10 text-[#061E29]/20 mx-auto mb-3" />
                    <p className="text-sm text-[#061E29]/40">No upcoming events</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orderedDays.map((dayKey) => {
                        const dayEvents = groupedEvents[dayKey] || [];
                        return (
                            <div key={dayKey}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs uppercase tracking-widest text-[#5F9598]">
                                        {formatDate(new Date(dayKey).toISOString())}
                                    </span>
                                    <span className="h-px flex-1 bg-[#061E29]/10" />
                                </div>
                                <div className="space-y-2">
                                    {dayEvents.map((event, index) => {
                                        const start = getEventStart(event);
                                        const end = getEventEnd(event);
                                        const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
                                        return (
                                            <div key={event.id || `${dayKey}-${index}`} className="card p-4 hover:border-[#5F9598]/30">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-[#061E29] mb-1 truncate">
                                                            {event.summary || 'Untitled Event'}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#061E29]/60">
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {isAllDay ? 'All day' : `${formatTime(start)} - ${formatTime(end)}`}
                                                            </span>
                                                            {event.location && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <CalendarIcon className="w-3.5 h-3.5" />
                                                                    {event.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Schedule;
