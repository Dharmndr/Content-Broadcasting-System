import catchAsync from '../utils/catchAsync.js';
import scheduleService from '../services/schedule.service.js';

const getActiveContent = catchAsync(async (req, res) => {
  const { subject } = req.query;
  const activeContent = await scheduleService.getActiveContent({ subject });

  if (activeContent && activeContent.message) {
    return res.status(200).send({ message: activeContent.message });
  }

  if (!activeContent) {
    return res.status(200).send([]); // Empty response as per requirements
  }

  res.send(activeContent);
});

const upsertSchedule = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const schedule = await scheduleService.upsertSchedule(contentId, req.body);
  res.status(201).send({
    message: 'Schedule updated successfully',
    schedule,
  });
});

export default {
  getActiveContent,
  upsertSchedule,
};
