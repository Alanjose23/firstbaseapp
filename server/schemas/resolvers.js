const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { User, Message } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'firstbase_secret_key_change_in_production';
const JWT_EXPIRY = '24h';

const signToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

const requireAuth = (ctx) => {
  if (!ctx.user) throw new GraphQLError('Not authenticated.', {
    extensions: { code: 'UNAUTHENTICATED' },
  });
};

const PROFILE_SELECT = '_id email name age ageRangeMin ageRangeMax bio interests favoriteShows socialMedia tier';

const populateFull = (query) =>
  query.select('-password -sentRequests').populate([
    { path: 'connections',     select: PROFILE_SELECT },
    { path: 'pendingRequests', select: PROFILE_SELECT },
  ]);

const resolvers = {
  Query: {
    me: async (_, __, ctx) => {
      requireAuth(ctx);
      return populateFull(User.findById(ctx.user._id));
    },

    getConversation: async (_, { userId }, ctx) => {
      requireAuth(ctx);
      return Message.find({
        $or: [
          { sender: ctx.user._id, recipient: userId },
          { sender: userId,       recipient: ctx.user._id },
        ],
      })
        .sort({ createdAt: 1 })
        .populate('sender',    PROFILE_SELECT)
        .populate('recipient', PROFILE_SELECT);
    },

    discoverUsers: async (_, __, ctx) => {
      requireAuth(ctx);
      const me = await User.findById(ctx.user._id).select('connections sentRequests pendingRequests');
      const exclude = [me._id, ...me.connections, ...me.sentRequests, ...me.pendingRequests];
      return User.find({ _id: { $nin: exclude } }).select(PROFILE_SELECT);
    },
  },

  Mutation: {
    addUser: async (_, { email, password }) => {
      const user = await User.create({ email, password });
      return { token: signToken(user), user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new GraphQLError('No account found with that email.');
      const valid = await user.isCorrectPassword(password);
      if (!valid) throw new GraphQLError('Incorrect password.');
      return { token: signToken(user), user };
    },

    updateProfile: async (_, args, ctx) => {
      requireAuth(ctx);
      const filtered = Object.fromEntries(
        Object.entries(args).filter(([, v]) => v !== undefined && v !== null)
      );
      return populateFull(
        User.findByIdAndUpdate(ctx.user._id, { $set: filtered }, { new: true, runValidators: true })
      );
    },

    sendRequest: async (_, { userId }, ctx) => {
      requireAuth(ctx);
      if (userId === String(ctx.user._id))
        throw new GraphQLError('Cannot send a request to yourself.');

      await User.findByIdAndUpdate(userId, { $addToSet: { pendingRequests: ctx.user._id } });

      return populateFull(
        User.findByIdAndUpdate(ctx.user._id, { $addToSet: { sentRequests: userId } }, { new: true })
      );
    },

    acceptRequest: async (_, { userId }, ctx) => {
      requireAuth(ctx);

      await User.findByIdAndUpdate(userId, {
        $pull:     { sentRequests: ctx.user._id },
        $addToSet: { connections: ctx.user._id },
      });

      return populateFull(
        User.findByIdAndUpdate(
          ctx.user._id,
          { $pull: { pendingRequests: userId }, $addToSet: { connections: userId } },
          { new: true }
        )
      );
    },

    declineRequest: async (_, { userId }, ctx) => {
      requireAuth(ctx);

      await User.findByIdAndUpdate(userId, { $pull: { sentRequests: ctx.user._id } });

      return populateFull(
        User.findByIdAndUpdate(ctx.user._id, { $pull: { pendingRequests: userId } }, { new: true })
      );
    },

    sendMessage: async (_, { recipientId, content }, ctx) => {
      requireAuth(ctx);
      const me = await User.findById(ctx.user._id).select('connections');
      const isConnected = me.connections.some((id) => String(id) === recipientId);
      if (!isConnected)
        throw new GraphQLError('You can only message your connections.');

      const msg = await Message.create({
        sender: ctx.user._id, recipient: recipientId, content,
      });
      return msg.populate(['sender', 'recipient']);
    },

    removeConnection: async (_, { userId }, ctx) => {
      requireAuth(ctx);

      await User.findByIdAndUpdate(userId, { $pull: { connections: ctx.user._id } });

      return populateFull(
        User.findByIdAndUpdate(ctx.user._id, { $pull: { connections: userId } }, { new: true })
      );
    },
  },
};

module.exports = resolvers;
