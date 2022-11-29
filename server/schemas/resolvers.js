const { Profile, User, Dates } = require('../models');

const resolvers = {
  Query: {
    Users: async () => {
      return await User.find();
    },
    User: async (parent, { userId }) => {
      return await User.findOne({ _id: userId });
    },
    Dates: async(parent, {userId}) =>{
      return await Dates.find({ id: userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, password, zipcode }) => {
      return await User.create({ username, password, zipcode });
    },
    removeUser: async (parent, { userId }) => {
      return await User.findOneAndDelete({ _id: userId });
    },
    addDateLocations: async (parent, { userId, locations}) => {
      return await Dates.insertOne({ id: userId, locations: locations});
    },
    addDateExp: async (parent, { userId, Exp}) => {
      return await Dates.insertOne({ id: userId, Exp: Exp});
    },
  },
};

module.exports = resolvers;
