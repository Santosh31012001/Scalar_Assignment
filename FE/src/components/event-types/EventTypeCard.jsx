import { Copy, Edit, Trash2, Clock } from 'lucide-react';

function EventTypeCard({ eventType, onEdit, onDelete }) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(eventType.bookingUrl);
        alert('Booking link copied to clipboard!');
    };

    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                        {eventType.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{eventType.duration} minutes</span>
                    </div>
                    {eventType.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {eventType.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                    <code className="flex-1 truncate text-xs">
                        {eventType.bookingUrl}
                    </code>
                    <button
                        onClick={handleCopyLink}
                        className="p-1 hover:bg-background rounded transition-colors"
                        title="Copy link"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(eventType)}
                        className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(eventType.id)}
                        className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventTypeCard;
