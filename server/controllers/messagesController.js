const Message = require("../model/messages");
const { redisClients } = require("../redisClient");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/errorHandler");

exports.getChat = catchAsync(async (req, res ,next) => {
  const { user1, user2 } = req.params;

  if (!user1 || !user2) {
    return next(new AppError('two user required user1 and user2'))
  }
  const cahshkey=`chatbetween_${user1}_${user2}`;
  const cashed=await redisClients.get(cahshkey);
  if(cashed){
    console.log("cash hit");
    return res.status(200).json(JSON.parse(cashed))
  }else{
    console.log('cahse missed')
  }

  const messages = await Message.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 },
    ],
  }).sort({ createdAt: 1 });

  // console.log('Chat messages between', user1, 'and', user2, ':', messages);
  const response={
    resultLength:messages.length,
    data:{messages}
  }
  redisClients.setEx(cahshkey,3600,JSON.stringify(response))
  res.status(200).json(response)
});
