import { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import { Clock, Save, RotateCcw } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DEFAULT_SCHEDULE = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};

function Availability() {
    const [timezone, setTimezone] = useState('UTC');
    const [weeklySchedule, setWeeklySchedule] = useState(DEFAULT_SCHEDULE);
    const [timezones, setTimezones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [timezonesRes, availabilityRes] = await Promise.all([
                availabilityAPI.getTimezones(),
                availabilityAPI.get()
            ]);

            setTimezones(timezonesRes.data);
            setTimezone(availabilityRes.data.timezone || 'UTC');
            setWeeklySchedule(availabilityRes.data.weeklySchedule || DEFAULT_SCHEDULE);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to load availability settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);
            await availabilityAPI.upsert({ timezone, weeklySchedule });
            setMessage({ type: 'success', text: 'Availability settings saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving:', error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Reset to default schedule?')) {
            setWeeklySchedule(DEFAULT_SCHEDULE);
        }
    };

    const toggleDay = (day) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: prev[day].length > 0 ? [] : [{ start: '09:00', end: '17:00' }]
        }));
    };

    const addTimeSlot = (day) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: [...prev[day], { start: '09:00', end: '17:00' }]
        }));
    };

    const removeTimeSlot = (day, index) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const updateTimeSlot = (day, index, field, value) => {
        setWeeklySchedule(prev => ({
            ...prev,
            [day]: prev[day].map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
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
            <div className="container mx-auto p-8 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Availability Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Set your working hours and timezone
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-destructive/10 border border-destructive text-destructive'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Timezone Selector */}
                <div className="bg-card rounded-lg border p-6 mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Timezone
                    </label>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Weekly Schedule</h2>
                    <div className="space-y-4">
                        {DAYS.map(day => (
                            <div key={day} className="border-b border-border pb-4 last:border-0">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center min-w-[140px] pt-2">
                                        <input
                                            type="checkbox"
                                            checked={weeklySchedule[day].length > 0}
                                            onChange={() => toggleDay(day)}
                                            className="w-4 h-4 mr-2"
                                        />
                                        <span className="font-medium text-foreground capitalize">{day}</span>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        {weeklySchedule[day].length === 0 ? (
                                            <p className="text-sm text-muted-foreground pt-2">Unavailable</p>
                                        ) : (
                                            weeklySchedule[day].map((slot, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                                                        className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                    <span className="text-muted-foreground">to</span>
                                                    <input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                                                        className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                    <button
                                                        onClick={() => removeTimeSlot(day, index)}
                                                        className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                        {weeklySchedule[day].length > 0 && (
                                            <button
                                                onClick={() => addTimeSlot(day)}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                + Add time slot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Availability;
