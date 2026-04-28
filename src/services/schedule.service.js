import { Op } from 'sequelize';
import Content from '../models/content.model.js';
import ContentSchedule from '../models/content_schedule.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get the currently active content based on the rotation algorithm.
 * Can be filtered by teacherId or subject.
 */
const getActiveContent = async (filters = {}) => {
  const { teacherId, subject } = filters;
  const now = new Date();

  const whereClause = {
    status: 'approved',
    start_time: { [Op.lte]: now },
    end_time: { [Op.gte]: now },
  };

  if (teacherId) {
    whereClause.uploaded_by = teacherId;
  }

  if (subject) {
    whereClause.subject = subject;
  }

  // 1. Filter valid content (approved + within time window)
  const validContents = await Content.findAll({
    where: whereClause,
    include: [
      {
        model: ContentSchedule,
        as: 'schedule',
        required: true,
      },
      {
        model: User,
        as: 'uploader',
        attributes: ['id', 'name'],
      },
    ],
    order: [
      ['subject', 'ASC'],
      ['uploaded_by', 'ASC'],
      [{ model: ContentSchedule, as: 'schedule' }, 'rotation_order', 'ASC'],
    ],
  });

  if (validContents.length === 0) {
    // Edge case: Invalid subject or no content for this filter
    if (subject || teacherId) {
      return null; // Returns empty response per requirements
    }

    // Check if there is any approved content at all
    const anyApproved = await Content.count({ where: { status: 'approved' } });
    if (anyApproved === 0) {
      return { message: 'No content available' };
    }
    return null;
  }

  // 2. Calculate total cycle duration (in minutes)
  const totalCycleDuration = validContents.reduce((total, item) => {
    return total + (item.schedule?.duration || 0);
  }, 0);

  if (totalCycleDuration === 0) return null;

  // 3. Use current timestamp to determine current position
  const currentMinutes = Math.floor(now.getTime() / (1000 * 60));
  const currentPosition = currentMinutes % totalCycleDuration;

  // 4. Return active content
  let accumulatedTime = 0;
  for (const item of validContents) {
    accumulatedTime += item.schedule.duration;
    if (currentPosition < accumulatedTime) {
      return item;
    }
  }

  return validContents[0];
};

/**
 * Create or update a schedule for a content item.
 */
const upsertSchedule = async (contentId, scheduleData) => {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new ApiError(404, 'Content not found');
  }

  if (content.status !== 'approved') {
    throw new ApiError(400, 'Only approved content can be scheduled');
  }

  const { start_time, end_time, rotation_order, duration } = scheduleData;
  if (start_time || end_time) {
    await content.update({ start_time, end_time });
  }

  const [schedule, created] = await ContentSchedule.findOrCreate({
    where: { content_id: contentId },
    defaults: { rotation_order, duration },
  });

  if (!created) {
    await schedule.update({ rotation_order, duration });
  }

  return schedule;
};

export default {
  getActiveContent,
  upsertSchedule,
};
