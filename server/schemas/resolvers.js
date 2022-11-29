const { User } = require('../models');

const resolvers = {
  Query: {
    Users: async () => {
      return await User.find();
    },
    User: async (parent, { userId }) => {
      return await User.findOne({ _id: userId });
    },
    Dates: async(parent, {userId}) =>{
      return await User.find({ id: userId }).populate({locations, Exp});
    },
  },

  Mutation: {
    addUser: async (parent, { username, password, zipcode }) => {
      return await User.create({ username, password, zipcode });
    },
    removeUser: async (parent, { userId }) => {
      return await User.findOneAndDelete({ _id: userId });
    },
    // addDateLocations: async (parent, { userId, locations}) => {
    //   return await Date.insertOne({ id: userId, locations: locations});
    // },
    // addDateExp: async (parent, { userId, Exp}) => {
    //   return await Date.insertOne({ id: userId, Exp: Exp});
    // },
  },
};

module.exports = resolvers;
