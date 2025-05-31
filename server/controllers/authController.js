const jwt = require('jsonwebtoken');
const catchAsync = require('../utility/catchAsync');
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const AppError = require('../utility/errorHandler');
require('dotenv').config();

function validationOfToken(req) {
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
      .json({ message: 'must be password and email toghether' });
  }
  const findUser = await Users.findOne({ email });

  if (!findUser) {
    return res
      .status(401)
      .json({ message: 'Invalid username or password in find user' });
  }
  const checkPassword = await bcrypt.compare(password, findUser.password);
  if (!checkPassword) {
    return next(new AppError('the password is incorrect'));
  }

  // it suppose using refresh token to make the user login longer 
  const token = jwt.sign(
    { id: findUser.id, username: findUser.username },
    process.env.secret_api_key,
    {
      expiresIn: '15m',
    }
  );

  res.status(200).json({
    status: 'success',
    accessToken: {
      token,
    },
  });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
      console.log('debugging ',req.user);

  res.status(200).json({
  status: 'success',
  user: req.user
});

});

exports.validateToken = catchAsync(async (req, res, next) => {
  let token = validationOfToken(req);
  if (!token) {
    return next(
      new AppError('you are not loged in please log in to get authorized', 401)
    );
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.secret_api_key);
  } catch (err) {
    return next(
      new AppError('Invalid or expired token. Please log in again.', 401)
    );
  }

   
    const user = await Users.findById(decoded.id);
    if (!user) {
     return next( new AppError('Authorization error: User not found for this token.', 403))
    }
    


    req.user = user;

    next();
  
});
