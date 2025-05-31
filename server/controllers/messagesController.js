const Message = require("../model/messages");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/errorHandler");

exports.getChat = catchAsync(async (req, res ,next) => {
  const { user1, user2 } = req.params;

  if (!user1 || !user2) {
    return next(new AppError('two user required user1 and user2'))
  }

  const messages = await Message.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 },
    ],
  }).sort({ createdAt: 1 });

  console.log('Chat messages between', user1, 'and', user2, ':', messages);

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
