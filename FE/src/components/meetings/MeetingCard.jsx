import { Calendar, Clock, User, Mail, X } from 'lucide-react';

function MeetingCard({ booking, onCancel, showCancelButton = true }) {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this meeting?')) {
            onCancel(booking.id);
        }
    };

    const isCancelled = booking.status === 'cancelled';
    const isPast = new Date(booking.startTime) < new Date();

    return (
        <div className={`bg-card rounded-lg border p-6 ${isCancelled ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                        {booking.eventType.name}
                    </h3>
                    {isCancelled && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded">
                            Cancelled
                        </span>
                    )}
                </div>
                {showCancelButton && !isCancelled && !isPast && (
                    <button
                        onClick={handleCancel}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Cancel meeting"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium text-foreground">
                            {formatDateTime(booking.startTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                    </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">
                        {booking.eventType.duration} minutes
                    </p>
                </div>

                {/* Invitee Name */}
                <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">
                        {booking.inviteeName}
                    </p>
                </div>

                {/* Invitee Email */}
                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">
                        {booking.inviteeEmail}
                    </p>
                </div>

                {/* Notes */}
                {booking.notes && (
                    <div className="pt-3 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MeetingCard;
