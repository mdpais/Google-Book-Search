const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({_id: context.user._id}).populate('savedBooks');
      }
      throw new AuthenticationError('Please log in first!');
    },
  },
  Mutation: {
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('User not found!');
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userId, body }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return res.json(updatedUser);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },
    removeBook: async (parent, { userId, bookId }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "Oops! We seem to have run into an error." });
      }
      return res.json(updatedUser);
    },
    addUser:async (parent, {username, email, password}) => {
      const user = await User.create({username, email, password});
      const token = signToken(user);
      return {token, user}
  },
  },
};

module.exports = resolvers;
