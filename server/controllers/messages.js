import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const createMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user._id;

    const ids = [sender.toString(), receiver].sort();
    const roomId = `${ids[0]}_${ids[1]}`;

    const images = req.files ? req.files.map((file) => file.path) : [];

    const message = await Message.create({
      sender,
      receiver,
      roomId,
      text,
      images,
    });

    const populated = await message.populate('sender', 'name avatar');

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiver}`).emit('new_message', populated);
    }

    await Notification.create({
      user: receiver,
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      reference: message._id,
      referenceModel: 'Message',
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.query;

    const messages = await Message.find({ roomId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$read', false] }, { $ne: ['$sender', userId] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$lastMessage'] } },
      },
      {
        $project: { lastMessage: 0 },
      },
      {
        $lookup: {
          from: 'users',
          let: { receiverId: '$receiver', senderId: '$sender' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$receiverId'] },
                    { $eq: ['$_id', '$$senderId'] },
                  ],
                },
              },
            },
          ],
          as: 'participants',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
