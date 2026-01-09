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

    const fetchEvents = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await apiClient.get('/calendar/events');
            if (res.data.events) {
                setEvents(res.data.events);
                setError(null);
            } else {
                setError(res.data.message || 'Failed to fetch events');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching your schedule.');
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

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="spinner"></div>
                <span className="mt-3 text-sm text-[#061E29]/60">Loading schedule...</span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#061E29] mb-1">Schedule</h1>
                    <p className="text-sm text-[#061E29]/60">Your upcoming events</p>
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
                <div className="space-y-2">
                    {events.map((event: CalendarEvent, index: number) => (
                        <div key={event.id || index} className="card p-4 hover:border-[#5F9598]/30">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-[#061E29] mb-1 truncate">
                                        {event.summary || 'Untitled Event'}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-[#061E29]/60">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            {formatDate(event.start?.dateTime || event.start?.date || '')}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatTime(event.start?.dateTime || '')} – {formatTime(event.end?.dateTime || '')}
                                        </span>
                                    </div>
                                </div>
                                {event.location && (
                                    <span className="text-xs text-[#061E29]/40 truncate max-w-[120px]">
                                        {event.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Schedule;
