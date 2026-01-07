import { useState, useEffect } from 'react';

function EventTypeForm({ eventType, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        duration: 30,
        slug: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (eventType) {
            setFormData({
                name: eventType.name,
                duration: eventType.duration,
                slug: eventType.slug,
                description: eventType.description || ''
            });
        }
    }, [eventType]);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: eventType ? prev.slug : generateSlug(name)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.duration || !formData.slug) {
            setError('Name, duration, and slug are required');
            return;
        }

        if (formData.duration < 5 || formData.duration > 480) {
            setError('Duration must be between 5 and 480 minutes');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save event type');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
                {eventType ? 'Edit Event Type' : 'Create Event Type'}
            </h2>

            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Event Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., 30-min Meeting"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Duration (minutes) *
                    </label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        min="5"
                        max="480"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Between 5 and 480 minutes
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        URL Slug *
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                        placeholder="e.g., 30-min-meeting"
                        pattern="[a-z0-9-]+"
                        required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Lowercase letters, numbers, and hyphens only
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Description (optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows="3"
                        placeholder="Brief description of this event type"
                        maxLength="500"
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : eventType ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}

export default EventTypeForm;
