const prisma = require('../config/db');

// Create new event type
const createEventType = async (req, res) => {
    try {
        const { name, duration, slug, description } = req.body;

        // Validate required fields
        if (!name || !duration || !slug) {
            return res.status(400).json({
                error: 'Name, duration, and slug are required'
            });
        }

        // Check if slug already exists
        const existing = await prisma.eventType.findUnique({
            where: { slug }
        });

        if (existing) {
            return res.status(400).json({
                error: 'An event type with this slug already exists'
            });
        }

        const eventType = await prisma.eventType.create({
            data: {
                name,
                duration: parseInt(duration),
                slug,
                description: description || null
            }
        });

        res.status(201).json({
            ...eventType,
            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/book/${eventType.slug}`
        });
    } catch (error) {
        console.error('Error creating event type:', error);
        res.status(500).json({ error: 'Failed to create event type' });
    }
};

// Get all event types
const getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await prisma.eventType.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const eventTypesWithUrls = eventTypes.map(et => ({
            ...et,
            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/book/${et.slug}`
        }));

        res.json(eventTypesWithUrls);
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).json({ error: 'Failed to fetch event types' });
    }
};

// Get single event type by ID
const getEventTypeById = async (req, res) => {
    try {
        const { id } = req.params;

        const eventType = await prisma.eventType.findUnique({
            where: { id }
        });

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json({
            ...eventType,
            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/book/${eventType.slug}`
        });
    } catch (error) {
        console.error('Error fetching event type:', error);
        res.status(500).json({ error: 'Failed to fetch event type' });
    }
};

// Get event type by slug
const getEventTypeBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const eventType = await prisma.eventType.findUnique({
            where: { slug }
        });

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        res.json({
            ...eventType,
            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/book/${eventType.slug}`
        });
    } catch (error) {
        console.error('Error fetching event type:', error);
        res.status(500).json({ error: 'Failed to fetch event type' });
    }
};

// Update event type
const updateEventType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duration, slug, description } = req.body;

        // Check if event type exists
        const existing = await prisma.eventType.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        // If slug is being changed, check if new slug is available
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.eventType.findUnique({
                where: { slug }
            });

            if (slugExists) {
                return res.status(400).json({
                    error: 'An event type with this slug already exists'
                });
            }
        }

        const eventType = await prisma.eventType.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(duration && { duration: parseInt(duration) }),
                ...(slug && { slug }),
                ...(description !== undefined && { description: description || null })
            }
        });

        res.json({
            ...eventType,
            bookingUrl: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/book/${eventType.slug}`
        });
    } catch (error) {
        console.error('Error updating event type:', error);
        res.status(500).json({ error: 'Failed to update event type' });
    }
};

// Delete event type
const deleteEventType = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event type exists
        const existing = await prisma.eventType.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        await prisma.eventType.delete({
            where: { id }
        });

        res.json({ message: 'Event type deleted successfully' });
    } catch (error) {
        console.error('Error deleting event type:', error);
        res.status(500).json({ error: 'Failed to delete event type' });
    }
};

module.exports = {
    createEventType,
    getAllEventTypes,
    getEventTypeById,
    getEventTypeBySlug,
    updateEventType,
    deleteEventType
};
