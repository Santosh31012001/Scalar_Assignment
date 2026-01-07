const prisma = require('../config/db');

// Common timezones list
const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Warsaw',
    'Europe/Stockholm',
    'Europe/Athens',
    'Europe/Istanbul',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
];

// Get list of timezones
const getTimezones = (req, res) => {
    res.json(TIMEZONES);
};

// Get availability settings
const getAvailability = async (req, res) => {
    try {
        // For simplicity, we'll use a single availability record
        // In a real app, this would be per user
        const availability = await prisma.availability.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!availability) {
            // Return default availability if none exists
            return res.json({
                timezone: 'UTC',
                weeklySchedule: {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: [],
                    sunday: []
                }
            });
        }

        res.json(availability);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability settings' });
    }
};

// Create or update availability settings
const upsertAvailability = async (req, res) => {
    try {
        const { timezone, weeklySchedule } = req.body;

        // Validate required fields
        if (!timezone || !weeklySchedule) {
            return res.status(400).json({
                error: 'Timezone and weekly schedule are required'
            });
        }

        // Validate timezone
        if (!TIMEZONES.includes(timezone)) {
            return res.status(400).json({
                error: 'Invalid timezone'
            });
        }

        // Validate weekly schedule structure
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        for (const day of days) {
            if (!Array.isArray(weeklySchedule[day])) {
                return res.status(400).json({
                    error: `Invalid schedule for ${day}`
                });
            }

            // Validate time slots
            for (const slot of weeklySchedule[day]) {
                if (!slot.start || !slot.end) {
                    return res.status(400).json({
                        error: `Invalid time slot for ${day}`
                    });
                }

                // Validate time format (HH:MM)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
                    return res.status(400).json({
                        error: `Invalid time format for ${day}. Use HH:MM format`
                    });
                }

                // Validate start < end
                if (slot.start >= slot.end) {
                    return res.status(400).json({
                        error: `Start time must be before end time for ${day}`
                    });
                }
            }
        }

        // Check if availability already exists
        const existing = await prisma.availability.findFirst();

        let availability;
        if (existing) {
            // Update existing
            availability = await prisma.availability.update({
                where: { id: existing.id },
                data: {
                    timezone,
                    weeklySchedule
                }
            });
        } else {
            // Create new
            availability = await prisma.availability.create({
                data: {
                    timezone,
                    weeklySchedule
                }
            });
        }

        res.json(availability);
    } catch (error) {
        console.error('Error saving availability:', error);
        res.status(500).json({ error: 'Failed to save availability settings' });
    }
};

module.exports = {
    getTimezones,
    getAvailability,
    upsertAvailability
};
