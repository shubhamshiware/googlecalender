import { Response } from 'express';
import Event, { IEvent } from '../models/Event';
import { AuthRequest } from '../middleware/authMiddleware';

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const generateRecurringOccurrences = (event: IEvent, startDate: Date, endDate: Date): IEvent[] => {
  const occurrences: IEvent[] = [];
  let currentStart = new Date(event.start);
  let currentEnd = new Date(event.end);
  const duration = event.end.getTime() - event.start.getTime();

  while (currentStart < endDate) {
    if (currentEnd > startDate) {
      occurrences.push({
        ...event,
        start: new Date(currentStart),
        end: new Date(currentEnd),
      } as IEvent);
    }

    if (event.repeat === 'daily') {
      currentStart = addDays(currentStart, 1);
      currentEnd = addDays(currentEnd, 1);
    } else if (event.repeat === 'weekly') {
      currentStart = addDays(currentStart, 7);
      currentEnd = addDays(currentEnd, 7);
    } else if (event.repeat === 'monthly') {
      currentStart = addMonths(currentStart, 1);
      currentEnd = addMonths(currentEnd, 1);
    } else {
      break;
    }
  }

  return occurrences;
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, start, end, color, repeat, category } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Please provide title, start, and end' });
    }

    const event = await Event.create({
      title,
      description: description || '',
      start: new Date(start),
      end: new Date(end),
      userId: req.userId,
      color: color || '#3B82F6',
      repeat: repeat || 'none',
      category: category || 'Personal',
    });

    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Please provide start and end date' });
    }

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    const events = await Event.find({
      userId: req.userId,
      start: { $lt: endDate },
      end: { $gt: startDate },
    });

    const allOccurrences: IEvent[] = [];

    for (const event of events) {
      if (event.repeat === 'none') {
        allOccurrences.push(event);
      } else {
        const occurrences = generateRecurringOccurrences(event, startDate, endDate);
        allOccurrences.push(...occurrences);
      }
    }

    res.json({ events: allOccurrences });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error });
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, start, end, color, repeat, category } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        title,
        description,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        color,
        repeat,
        category,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error });
  }
};

export const searchEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { text, startDate, endDate, color, category, upcoming } = req.query;

    const query: any = { userId: req.userId };

    if (text) {
      query.$or = [
        { title: { $regex: text, $options: 'i' } },
        { description: { $regex: text, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      const dateQuery: any = {};
      if (startDate) {
        dateQuery.$gte = new Date(startDate as string);
      }
      if (endDate) {
        dateQuery.$lte = new Date(endDate as string);
      }
      query.start = dateQuery;
    }

    if (color) {
      query.color = color;
    }

    if (category) {
      query.category = category;
    }

    if (upcoming === 'true') {
      query.start = { $gte: new Date() };
    } else if (upcoming === 'false') {
      query.end = { $lt: new Date() };
    }

    const events = await Event.find(query).sort({ start: 1 });

    const allOccurrences: IEvent[] = [];

    for (const event of events) {
      if (event.repeat === 'none') {
        allOccurrences.push(event);
      } else if (startDate && endDate) {
        const startD = new Date(startDate as string);
        const endD = new Date(endDate as string);
        const occurrences = generateRecurringOccurrences(event, startD, endD);
        allOccurrences.push(...occurrences);
      } else {
        allOccurrences.push(event);
      }
    }

    res.json({ events: allOccurrences });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search events', error });
  }
};
