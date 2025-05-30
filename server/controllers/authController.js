const jwt = require('jsonwebtoken');
const catchAsync = require('../utility/catchAsync');
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const AppError = require('../utility/errorHandler');
require('dotenv').config();

function generateToken(req){
   if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}


exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
     res
      .status(400)
      .json({ message: 'must be password and username toghether' });
  }
  const findUser = await Users.findOne({ email: email });
  
  if (!findUser) {
    return res.status(401).json({ message: 'Invalid username or password in find user' });
  }
  const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: 'password incorectcorrect' });
    }

  const token = jwt.sign(
    { id: findUser.id, username: findUser.username },
    process.env.secret_api_key,
    {
      expiresIn: '1h',
    }
  );
  findUser.accessToken = token;
  await findUser.save();
  res.status(200).json({
    status: 'success',
    token: {
      token,
    },
  });
});



exports.getCurrentUser = catchAsync(async (req, res, next) => {
  let token=generateToken(req)
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get authorized.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.secret_api_key);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // 3. Find user by decoded ID
  const currentUser = await Users.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User not found. Please log in again.', 401));
  }

  req.user = currentUser;

   res.status(200).json({ status: 'success', user: currentUser });
  
});

exports.validateToken = catchAsync(async (req, res, next) => {
  let token=generateToken(req)
  if (!token) {
    return next(
      new AppError('you are not loged in please log in to get authorized', 401)
    );
  }
  try {
    const user = await Users.findOne({ accessToken: token });
    if (!user) {
      return res.status(403).json({
        error: true,
        message: "Authorization error not found user with this token",
      });
    }

    const decoded = jwt.verify(token, process.env.secret_api_key);

    if (user.username !== decoded.username) {
      return res.status(401).json({
        error: true,
        message: "Invalid token",
      });
    }

    req.decoded = decoded;
    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        error: true,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      error: true,
      message: "Authentication error",
    });
  }
});
