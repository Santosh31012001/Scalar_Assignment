import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { CheckCircle, Calendar, Clock, Mail, User } from 'lucide-react';

function BookingConfirmation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const response = await bookingAPI.getById(id);
            setBooking(response.data);
            setError(null);
        } catch (err) {
            setError('Booking not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-xl mb-4">{error || 'Booking not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-8 max-w-2xl">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-muted-foreground">
                        Your meeting has been successfully scheduled
                    </p>
                </div>

                {/* Booking Details Card */}
                <div className="bg-card rounded-lg border p-8 space-y-6">
                    {/* Event Type */}
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            {booking.eventType.name}
                        </h2>
                        {booking.eventType.description && (
                            <p className="text-muted-foreground">{booking.eventType.description}</p>
                        )}
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
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
                            <div>
                                <p className="font-medium text-foreground">
                                    {booking.eventType.duration} minutes
                                </p>
                            </div>
                        </div>

                        {/* Invitee Name */}
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">
                                    {booking.inviteeName}
                                </p>
                            </div>
                        </div>

                        {/* Invitee Email */}
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">
                                    {booking.inviteeEmail}
                                </p>
                            </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                            <div className="pt-4 border-t border-border">
                                <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                                <p className="text-sm text-muted-foreground">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Booking ID */}
                    <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                            Booking ID: {booking.id}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                        A confirmation email will be sent to <span className="font-medium">{booking.inviteeEmail}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BookingConfirmation;
