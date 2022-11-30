const { User, Date } = require('../models');

const resolvers = {
  Query: {
    Users: async () => {
      return await User.find();
    },
    User: async (parent, { userId }) => {
      return await User.findOne({ _id: userId });
    },
    UserDate: async (parent, {userId}) => {
      return await User.findOne({id: userId}).populate("date");
    }
  },

  Mutation: {
    addUser: async (parent, { username, password, zipcode }) => {
      return await User.create({ username, password, zipcode });
    },
    removeUser: async (parent, { userId }) => {
      return await User.findOneAndDelete({ _id: userId });
    },
    addDate: async (parent, {user, future, journal} ) => {
      return await Date.create({user, future, journal});
    },  
  },
};

module.exports = resolvers;
