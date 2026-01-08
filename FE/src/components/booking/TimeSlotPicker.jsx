function TimeSlotPicker({ slots, selectedSlot, onSelectSlot, loading }) {
    if (loading) {
        return (
            <div className="bg-card rounded-lg border p-6">
                <p className="text-center text-muted-foreground">Loading available times...</p>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="bg-card rounded-lg border p-6">
                <p className="text-center text-muted-foreground">
                    No available time slots for this date. Please select another date.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Select a Time
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                {slots.map((slot, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectSlot(slot)}
                        className={`px-3 py-2 rounded-lg border transition-all ${selectedSlot?.startTime === slot.startTime
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-foreground border-input hover:border-primary hover:bg-primary/10'
                            }`}
                    >
                        {slot.displayTime}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TimeSlotPicker;
