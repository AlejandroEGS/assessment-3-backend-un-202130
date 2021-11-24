const ApiError = require('../utils/ApiError');
const { User } = require('../database/models');
const UserSerializer = require('../serializers/UserSerializer');
const AuthSerializer = require('../serializers/AuthSerializer');
const { generateAccessToken, verifyAccessToken } = require('../services/jwt');
const UsersSerializer = require('../serializers/UsersSerializer');
const { ROLES } = require('../config/constants');
const { transporter } = require('../config/mailer');

const findUser = async (body) => {
  Object.assign(body, { active: true });

  const user = await User.findOne({ where: body });
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  return user;
};
const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    if (body.name === undefined || body.username === undefined || body.email === undefined
      || body.password === undefined) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    req.isRole(ROLES.admin);

    const users = await User.findAll({ ...req.pagination });
    res.json(new UsersSerializer(users, await req.getPaginationInfo(User)));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    if (!user || user.active === false) {
      throw new ApiError('User not found', 404);
    }
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;
    req.isUserAuthorized(Number(params.id));
    const user = await findUser(Number(params.id));

    if (!user || user.active === false) {
      throw new ApiError('User not found', 404);
    }
    Object.keys(body).forEach((key) => {
      if (key !== 'username' && key !== 'email' && key !== 'name') {
        throw new ApiError('Payload can only contain username, email or name', 400);
      }
    });
    Object.assign(user, body);
    await transporter.sendMail({
      from: '"Update" <kevinleilei18@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Update ✔', // Subject line
      text: 'User updated successfully', // plain text body
    });
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    req.isUserAuthorized(Number(params.id));
    const user = await findUser(Number(params.id));
    if (!user || user.active === false) {
      throw new ApiError('User not found', 404);
    }
    Object.assign(user, { active: false });

    await user.save();

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.username === undefined || body.password === undefined) {
      throw new ApiError('Payload must contain username and password', 400);
    }
    const user = await findUser({ username: body.username });
    if (!(await user.comparePassword(body.password))) {
      throw new ApiError('User not found', 404);
    }

    const userId = Number(user.id);
    const accessToken = generateAccessToken(userId, user.role);
    user.token = accessToken;
    await user.save();

    res.json(new AuthSerializer(accessToken));
  } catch (err) {
    next(err);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    // colocar la intrucción que comprueba que el usuario este logueado
    req.isUserAuthorized(Number(req.user.id));
    const { body } = req;
    if ((body.password !== body.passwordConfirmation) || !body.password
      || !body.passwordConfirmation) {
      throw new ApiError('Passwords do not match, empty fields or Payload must contain password and passwordConfirmation', 400);
    }
    const userId = Number(req.user.id);
    const user2 = await findUser({ id: userId });
    user2.password = body.password;
    await user2.save();
    res.json(new UserSerializer(user2));
  } catch (err) {
    next(err);
  }
};
const sendPasswordReset = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.username === undefined) {
      throw new ApiError('Payload must contain username', 400);
    }
    const user = await findUser({ username: body.username });
    const userId = Number(user.id);
    const accessToken = generateAccessToken(userId, user.role);
    await transporter.sendMail({
      from: '"Forgot password" <kevinleilei18@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Forgot password ✔', // Subject line
      text: `Your access token: ${accessToken}`, // plain text body
    });
    user.token = accessToken;
    await user.save();
    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { body } = req;
    if ((body.password !== body.passwordConfirmation) || !body.token || !body.password
      || !body.passwordConfirmation) {
      throw new ApiError('Passwords do not match, empty fields or Payload must contain token, password and passwordConfirmation', 400);
    }
    const user = verifyAccessToken(body.token);
    const userId = Number(user.id);
    const user2 = await findUser({ id: userId });
    user2.password = body.password;
    await user2.save();
    res.json(new UserSerializer(user2));
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {

  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  findUser,
  deactivateUser,
  loginUser,
  sendPasswordReset,
  resetPassword,
  logoutUser,
  updatePassword,
};
