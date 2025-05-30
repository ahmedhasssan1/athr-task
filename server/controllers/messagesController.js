const Message = require("../model/messages");
const catchAsync = require("../utility/catchAsync");

// Example REST endpoint (in Express)
exports.getchat=(catchAsync( async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    data:{
        messages
    }
  })
})
);
