import Report from '../models/Report.js';

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { contentType, contentId, contentTypeModel, reason } = req.body;

    if (!contentType || !contentId || !contentTypeModel || !reason) {
      return res.status(400).json({ message: 'contentType, contentId, contentTypeModel, and reason are required' });
    }

    const validContentTypes = ['product', 'service', 'user', 'message'];
    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      contentType,
      contentId,
      contentTypeModel,
      reason,
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports for a specific content item
// @route   GET /api/reports/content/:contentType/:contentId
// @access  Public
export const getContentReports = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const reports = await Report.find({ contentType, contentId })
      .populate('reporter', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
