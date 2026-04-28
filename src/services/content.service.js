import Content from '../models/content.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const uploadContent = async (userId, contentData) => {
  return Content.create({
    ...contentData,
    uploaded_by: userId,
    status: 'pending',
  });
};

const getTeacherUploads = async (teacherId) => {
  return Content.findAll({
    where: { uploaded_by: teacherId },
    order: [['created_at', 'DESC']],
  });
};

const getPendingContent = async () => {
  return Content.findAll({
    where: { status: 'pending' },
    include: [{ model: User, as: 'uploader', attributes: ['name', 'email'] }],
    order: [['created_at', 'ASC']],
  });
};

const approveContent = async (contentId, principalId) => {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new ApiError(404, 'Content not found');
  }

  content.status = 'approved';
  content.approved_by = principalId;
  content.approved_at = new Date();
  
  await content.save();
  return content;
};

const rejectContent = async (contentId, principalId, rejectionReason) => {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new ApiError(404, 'Content not found');
  }

  if (!rejectionReason) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  content.status = 'rejected';
  content.rejection_reason = rejectionReason;
  content.approved_by = principalId; // Tracking who rejected it as well
  content.approved_at = new Date();

  await content.save();
  return content;
};

const getAllContent = async () => {
  return Content.findAll({
    include: [
      { model: User, as: 'uploader', attributes: ['name', 'email'] },
      { model: User, as: 'approver', attributes: ['name', 'email'] }
    ],
  });
};

export default {
  uploadContent,
  getTeacherUploads,
  getPendingContent,
  approveContent,
  rejectContent,
  getAllContent,
  // Keeping updateStatus for internal use if needed, or I can remove it
};
