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
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-blue-300">Loading your schedule...</span>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white">My Schedule</h1>
                </div>
                <button
                    onClick={() => fetchEvents(true)}
                    disabled={refreshing || loading}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
                    title="Refresh Schedule"
                >
                    <RefreshCw className={`w-5 h-5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error ? (
                <div className="glass-card p-6 border-red-500/50 flex flex-col items-center gap-4 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                    <div>
                        <p className="text-red-200 font-medium text-lg">{error}</p>
                        <p className="text-red-300/60 mt-1 mb-6">Your calendar connection might have expired or permissions were not granted.</p>
                        <Link to="/sync-calendar" className="btn-primary inline-flex items-center px-6 py-2">
                            Reconnect Calendar
                        </Link>
                    </div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 glass-card">
                    <p className="text-blue-300 italic">No upcoming events found in your primary calendar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map((event: CalendarEvent, index: number) => (
                        <div key={event.id || index} className="glass-card p-5 hover:bg-slate-800/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{event.summary || '(No title)'}</h3>
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                                        <span>
                                            {formatDate(event.start?.dateTime || event.start?.date || '')} • {formatTime(event.start?.dateTime || '')} - {formatTime(event.end?.dateTime || '')}
                                        </span>
                                    </div>
                                </div>
                                {event.location && (
                                    <div className="text-sm text-slate-500 max-w-xs text-right">
                                        {event.location}
                                    </div>
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
