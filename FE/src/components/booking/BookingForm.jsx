import { useState } from 'react';

function BookingForm({ selectedSlot, eventType, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        inviteeName: '',
        inviteeEmail: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.inviteeName.trim()) {
            newErrors.inviteeName = 'Name is required';
        }

        if (!formData.inviteeEmail.trim()) {
            newErrors.inviteeEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.inviteeEmail)) {
            newErrors.inviteeEmail = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Enter Details</h3>

            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                    {eventType.name} ({eventType.duration} minutes)
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                    {new Date(selectedSlot.startTime).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        name="inviteeName"
                        value={formData.inviteeName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.inviteeName ? 'border-destructive' : 'border-input'
                            }`}
                        placeholder="John Doe"
                    />
                    {errors.inviteeName && (
                        <p className="text-sm text-destructive mt-1">{errors.inviteeName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="inviteeEmail"
                        value={formData.inviteeEmail}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.inviteeEmail ? 'border-destructive' : 'border-input'
                            }`}
                        placeholder="john@example.com"
                    />
                    {errors.inviteeEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.inviteeEmail}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Any additional information..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Scheduling...' : 'Schedule Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BookingForm;
