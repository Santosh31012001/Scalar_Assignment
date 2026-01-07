import { useState, useEffect } from 'react';
import { eventTypesAPI } from '../services/api';
import EventTypeCard from '../components/event-types/EventTypeCard';
import EventTypeForm from '../components/event-types/EventTypeForm';

function EventTypes() {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEventType, setEditingEventType] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const fetchEventTypes = async () => {
        try {
            setLoading(true);
            const response = await eventTypesAPI.getAll();
            setEventTypes(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load event types');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingEventType(null);
        setShowForm(true);
    };

    const handleEdit = (eventType) => {
        setEditingEventType(eventType);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event type?')) {
            return;
        }

        try {
            await eventTypesAPI.delete(id);
            fetchEventTypes();
        } catch (err) {
            alert('Failed to delete event type');
            console.error(err);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingEventType) {
                await eventTypesAPI.update(editingEventType.id, data);
            } else {
                await eventTypesAPI.create(data);
            }
            setShowForm(false);
            setEditingEventType(null);
            fetchEventTypes();
        } catch (err) {
            throw err;
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingEventType(null);
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
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Event Types</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your scheduling event types
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        + Create Event Type
                    </button>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
                            <EventTypeForm
                                eventType={editingEventType}
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                            />
                        </div>
                    </div>
                )}

                {eventTypes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No event types yet</p>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Create your first event type
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {eventTypes.map((eventType) => (
                            <EventTypeCard
                                key={eventType.id}
                                eventType={eventType}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventTypes;
