import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import MeetingCard from '../components/meetings/MeetingCard';

function Meetings() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, [activeTab]);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await bookingAPI.getAll(activeTab);
            setMeetings(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load meetings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelMeeting = async (id) => {
        try {
            await bookingAPI.cancel(id);
            // Refresh the meetings list
            fetchMeetings();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to cancel meeting');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Meetings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your scheduled meetings
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-border">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'upcoming'
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Upcoming
                        {activeTab === 'upcoming' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'past'
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Past
                        {activeTab === 'past' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Meetings List */}
                {meetings.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            {activeTab === 'upcoming'
                                ? 'No upcoming meetings'
                                : 'No past meetings'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {meetings.map((meeting) => (
                            <MeetingCard
                                key={meeting.id}
                                booking={meeting}
                                onCancel={handleCancelMeeting}
                                showCancelButton={activeTab === 'upcoming'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Meetings;
