const ApiError = require('../utils/ApiError');
const { User } = require('../database/models');
const UserSerializer = require('../serializers/UserSerializer');
const AuthSerializer = require('../serializers/AuthSerializer');
const generateAccessToken = require('../services/jwt');
const UsersSerializer = require('../serializers/UsersSerializer');
const { ROLES } = require('../config/constants');

const findUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId, active: true } });
  if (!user) {
    throw new ApiError('User not found', 400);
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
      throw new ApiError('User not found', 400);
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

    const user = await findUser(Number(params.id));

    if (!user || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    Object.keys(body).forEach((key) => {
      if (key !== 'username' && key !== 'email' && key !== 'name') {
        throw new ApiError('Payload can only contain username, email or name', 400);
      }
    });

    Object.assign(user, body);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await findUser(Number(params.id));

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

    const user = await findUser({ username: body.username });

    if (!(await user.comparePassword(body.password))) {
      throw new ApiError('User not found', 400);
    }

    const accessToken = generateAccessToken(user.id, 'ADMIN');

    res.json(new AuthSerializer(accessToken));
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
};
