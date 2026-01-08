import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { eventTypesAPI, bookingAPI } from '../services/api';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingForm from '../components/booking/BookingForm';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

function BookingPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [eventType, setEventType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [hostTimezone, setHostTimezone] = useState('UTC');
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch event type on mount
    useEffect(() => {
        fetchEventType();
    }, [slug]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (eventType) {
            fetchAvailableSlots();
        }
    }, [selectedDate, eventType]);

    const fetchEventType = async () => {
        try {
            setLoading(true);
            const response = await eventTypesAPI.getBySlug(slug);
            setEventType(response.data);
            setError(null);
        } catch (err) {
            setError('Event type not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            setSlotsLoading(true);
            // Format date as YYYY-MM-DD in local timezone (not UTC)
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const response = await bookingAPI.getAvailableSlots(slug, dateStr);
            setAvailableSlots(response.data.slots);
            if (response.data.timezone) {
                setHostTimezone(response.data.timezone);
            }
            setSelectedSlot(null); // Reset selected slot when date changes
        } catch (err) {
            console.error('Error fetching slots:', err);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleBookingSubmit = async (formData) => {
        try {
            setBookingLoading(true);
            const bookingData = {
                eventTypeId: eventType.id,
                inviteeName: formData.inviteeName,
                inviteeEmail: formData.inviteeEmail,
                startTime: selectedSlot.startTime,
                notes: formData.notes
            };

            const response = await bookingAPI.create(bookingData);
            // Redirect to confirmation page
            navigate(`/booking/confirmation/${response.data.id}`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create booking. Please try again.';
            alert(errorMessage);
            console.error('Error creating booking:', err);
            // Refresh slots in case the slot was taken
            fetchAvailableSlots();
        } finally {
            setBookingLoading(false);
        }
    };

    const handleCancelBooking = () => {
        setSelectedSlot(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-xl mb-4">{error}</p>
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
            <div className="container mx-auto p-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        {eventType.name}
                    </h1>
                    {eventType.description && (
                        <p className="text-muted-foreground mb-2">{eventType.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {eventType.duration} minutes
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            Times shown in {hostTimezone}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Calendar */}
                    <div>
                        <div className="bg-card rounded-lg border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                Select a Date
                            </h3>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                className="border-0 w-full"
                            />
                        </div>
                    </div>

                    {/* Right Column - Time Slots & Booking Form */}
                    <div className="space-y-6">
                        <TimeSlotPicker
                            slots={availableSlots}
                            selectedSlot={selectedSlot}
                            onSelectSlot={handleSlotSelect}
                            loading={slotsLoading}
                        />

                        {selectedSlot && (
                            <BookingForm
                                selectedSlot={selectedSlot}
                                eventType={eventType}
                                onSubmit={handleBookingSubmit}
                                onCancel={handleCancelBooking}
                                loading={bookingLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
