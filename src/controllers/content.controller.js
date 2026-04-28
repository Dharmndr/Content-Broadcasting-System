import catchAsync from '../utils/catchAsync.js';
import contentService from '../services/content.service.js';
import scheduleService from '../services/schedule.service.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const uploadContent = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a file');
  }

  // Upload to Cloudinary
  let cloudinaryResponse;
  try {
    cloudinaryResponse = await uploadToCloudinary(req.file.path);
  } catch (error) {
    console.error('Cloudinary fallback triggered due to error:', error);
  }

  const contentData = {
    ...req.body,
    file_url: cloudinaryResponse ? cloudinaryResponse.secure_url : `/uploads/${req.file.filename}`,
    file_type: req.file.mimetype,
    file_size: req.file.size,
    local_path: req.file.path,
  };

  const content = await contentService.uploadContent(req.user.id, contentData);

  res.status(201).send({
    message: 'Content uploaded successfully',
    content,
  });
});

const getMyUploads = catchAsync(async (req, res) => {
  const contents = await contentService.getTeacherUploads(req.user.id);
  res.send(contents);
});

const getPendingContent = catchAsync(async (req, res) => {
  const contents = await contentService.getPendingContent();
  res.send(contents);
});

const approveContent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const content = await contentService.approveContent(id, req.user.id);
  res.send({
    message: 'Content approved successfully',
    content,
  });
});

const rejectContent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rejection_reason } = req.body;
  const content = await contentService.rejectContent(id, req.user.id, rejection_reason);
  res.send({
    message: 'Content rejected successfully',
    content,
  });
});

const getAllContent = catchAsync(async (req, res) => {
  const contents = await contentService.getAllContent();
  res.send(contents);
});

const getLiveContent = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  const { subject } = req.query;
  const activeContent = await scheduleService.getActiveContent({ teacherId, subject });

  if (activeContent && activeContent.message) {
    return res.status(200).send({ message: activeContent.message });
  }

  if (!activeContent) {
    return res.status(200).send([]);
  }

  res.send(activeContent);
});

export default {
  uploadContent,
  getMyUploads,
  getPendingContent,
  approveContent,
  rejectContent,
  getAllContent,
  getLiveContent,
};
