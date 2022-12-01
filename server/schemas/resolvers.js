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
      return await User.findOne({_id: userId}).populate("date");
    },
    GetDate: async (parent, {id}) => {
      return await Date.findOne({id: id})
    },
    GetJournal: async (parent, {userId}) => {
      return await User.findOne({_id: userId}).populate({
        path : 'date',
        populate : {
          path : 'journal'
        }
      })
    },
    GetFuture: async (parent, {userId}) => {
      return await User.findOne({_id: userId}).populate({
        path : 'date',
        populate : {
          path : 'future'
        }
      })
    }
  },

  Mutation: {
    addUser: async (parent, { username, password, zipcode }) => {
      return await User.create({ username, password, zipcode });
    },
    removeUser: async (parent, { userId }) => {
      return await User.findOneAndDelete({ _id: userId });
    },
    addDate: async (parent, {userId, future, journal} ) => {
      return await Date.create({userId, future, journal});
    },  
  },
};

module.exports = resolvers;
