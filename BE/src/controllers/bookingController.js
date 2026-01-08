const prisma = require('../config/db');

// Helper function to format time as HH:MM
const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Helper function to parse time string (HH:MM) and combine with date
const parseTimeSlot = (dateStr, timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    // Create date in local timezone (not UTC)
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return date;
};

// Get available time slots for a specific date and event type
const getAvailableSlots = async (req, res) => {
    try {
        const { slug } = req.params;
        const { date } = req.query; // Format: YYYY-MM-DD

        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD)' });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // Get event type
        const eventType = await prisma.eventType.findUnique({
            where: { slug }
        });

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        // Get availability settings
        const availability = await prisma.availability.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!availability) {
            return res.json({
                slots: [],
                timezone: 'UTC'
            });
        }

        const hostTimezone = availability.timezone; // e.g., 'Asia/Kolkata'

        // Parse the date in the HOST's timezone
        const [year, month, day] = date.split('-').map(Number);

        // Create a date string in the host's timezone
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Get day of week in HOST's timezone
        // We need to check what day it is at midnight in the host's timezone
        const dateInHostTZ = new Date(`${dateStr}T00:00:00`);

        // Calculate timezone offset for host timezone
        // This is a simplified approach - for production, use a library like luxon or date-fns-tz
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: hostTimezone,
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(dateInHostTZ);
        const weekdayPart = parts.find(p => p.type === 'weekday');
        const dayName = weekdayPart.value.toLowerCase();

        console.log('Debug - Date:', date);
        console.log('Debug - Host Timezone:', hostTimezone);
        console.log('Debug - Day Name in host TZ:', dayName);

        // Get available hours for this day
        const daySchedule = availability.weeklySchedule[dayName];

        if (!daySchedule || daySchedule.length === 0) {
            console.log('Debug - No schedule found for', dayName);
            return res.json({
                slots: [],
                timezone: hostTimezone,
                eventType: {
                    name: eventType.name,
                    duration: eventType.duration,
                    description: eventType.description
                }
            });
        }

        // Get existing bookings for this date
        // Create start and end of day in HOST's timezone
        const startOfDayStr = `${dateStr}T00:00:00`;
        const endOfDayStr = `${dateStr}T23:59:59`;

        // Convert to Date objects (these will be interpreted in server's local time)
        // Then we need to adjust for the host's timezone
        const startOfDay = new Date(startOfDayStr);
        const endOfDay = new Date(endOfDayStr);

        const existingBookings = await prisma.booking.findMany({
            where: {
                eventTypeId: eventType.id,
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'confirmed'
            }
        });

        console.log('Debug - Existing bookings:', existingBookings.length);

        // Generate available slots
        const slots = [];
        const slotInterval = 30; // 30-minute intervals
        const eventDuration = eventType.duration;

        for (const timeRange of daySchedule) {
            console.log('Debug - Processing time range:', timeRange);

            // Parse times in host's timezone
            const [startHour, startMin] = timeRange.start.split(':').map(Number);
            const [endHour, endMin] = timeRange.end.split(':').map(Number);

            // Create datetime in host's timezone
            const startTime = new Date(`${dateStr}T${timeRange.start}:00`);
            const endTime = new Date(`${dateStr}T${timeRange.end}:00`);

            let currentSlot = new Date(startTime);

            while (currentSlot < endTime) {
                const slotEnd = new Date(currentSlot.getTime() + eventDuration * 60000);

                // Check if slot end is within working hours
                if (slotEnd <= endTime) {
                    // Check if slot is not booked
                    const isBooked = existingBookings.some(booking => {
                        const bookingStart = new Date(booking.startTime);
                        const bookingEnd = new Date(booking.endTime);

                        // Check for overlap
                        return (currentSlot < bookingEnd && slotEnd > bookingStart);
                    });

                    if (!isBooked) {
                        // Only show slots that are in the future
                        const now = new Date();
                        if (currentSlot > now) {
                            slots.push({
                                startTime: currentSlot.toISOString(),
                                endTime: slotEnd.toISOString(),
                                displayTime: formatTime(currentSlot)
                            });
                        }
                    }
                }

                // Move to next slot
                currentSlot = new Date(currentSlot.getTime() + slotInterval * 60000);
            }
        }

        console.log('Debug - Total slots generated:', slots.length);

        res.json({
            slots,
            timezone: hostTimezone,
            eventType: {
                name: eventType.name,
                duration: eventType.duration,
                description: eventType.description
            }
        });
    } catch (error) {
        console.error('Error getting available slots:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to get available slots' });
    }
};

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { eventTypeId, inviteeName, inviteeEmail, startTime, notes } = req.body;

        // Validate required fields
        if (!eventTypeId || !inviteeName || !inviteeEmail || !startTime) {
            return res.status(400).json({
                error: 'Event type, invitee name, email, and start time are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inviteeEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Get event type
        const eventType = await prisma.eventType.findUnique({
            where: { id: eventTypeId }
        });

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        // Calculate end time
        const start = new Date(startTime);
        const end = new Date(start.getTime() + eventType.duration * 60000);

        // Check if slot is still available (prevent double booking)
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                eventTypeId,
                status: 'confirmed',
                OR: [
                    {
                        AND: [
                            { startTime: { lte: start } },
                            { endTime: { gt: start } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { lt: end } },
                            { endTime: { gte: end } }
                        ]
                    },
                    {
                        AND: [
                            { startTime: { gte: start } },
                            { endTime: { lte: end } }
                        ]
                    }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(409).json({
                error: 'This time slot is no longer available. Please select another time.'
            });
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                eventTypeId,
                inviteeName,
                inviteeEmail,
                startTime: start,
                endTime: end,
                notes: notes || null
            },
            include: {
                eventType: true
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                eventType: true
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// Get all bookings with optional filter
const getAllBookings = async (req, res) => {
    try {
        const { filter } = req.query; // upcoming, past, or all
        const now = new Date();

        let whereClause = {};

        if (filter === 'upcoming') {
            whereClause = {
                startTime: { gte: now },
                status: 'confirmed'
            };
        } else if (filter === 'past') {
            whereClause = {
                startTime: { lt: now }
            };
        }
        // If filter is 'all' or not provided, no additional where clause

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                eventType: true
            },
            orderBy: {
                startTime: filter === 'past' ? 'desc' : 'asc'
            }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if booking exists
        const existing = await prisma.booking.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if already cancelled
        if (existing.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        // Update booking status to cancelled
        const booking = await prisma.booking.update({
            where: { id },
            data: { status: 'cancelled' },
            include: {
                eventType: true
            }
        });

        res.json(booking);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

module.exports = {
    getAvailableSlots,
    createBooking,
    getBookingById,
    getAllBookings,
    cancelBooking
};
