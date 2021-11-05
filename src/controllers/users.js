const ApiError = require('../utils/ApiError');

const { User } = require('../database/models');
const UserSerializer = require('../serializers/UserSerializer');

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

// const deleteUser = async (req, res, next) => {
//   try {
//     const { params } = req;

//     const user = await User.findOne({ where: { id: params.id } });

//     if (!user || user.active === false) {
//       throw new ApiError('User not found', 400);
//     }

//     await User.update({ where: { id: params.id } },
//       {
//         active: false,
//       });

//     res.json(new UserSerializer(null));
//   } catch (err) {
//     next(err);
//   }
// };

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

module.exports = {
  createUser,
  getUserById,
  // deleteUser,
  updateUser,
  findUser,
  deactivateUser,
};
