const { Profile, User, Dates } = require('../models');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    dates: async(userId) =>{
      return Dates.find({ id: userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, password, zipcode }) => {
      return User.create({ username, password, zipcode });
    },
    removeUser: async (parent, { userId }) => {
      return User.findOneAndDelete({ _id: userId });
    },
    addDate: async (parent, { userId, locations, Exp }) => {
      return Date.create({ userId, locations, Exp });
    },
  },
};

module.exports = resolvers;
