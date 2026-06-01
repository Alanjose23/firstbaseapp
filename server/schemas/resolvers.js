const { GraphQLError } = require('graphql');
const { User, Message } = require('../models');
const { signToken } = require('../utils/auth');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 h, matches JWT_EXPIRY

// Simple in-memory rate limiter for login (not suitable for multi-instance deployments)
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;

function checkLoginRateLimit(ip) {
  const now = Date.now();
  let entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOGIN_WINDOW_MS };
  }
  entry.count += 1;
  loginAttempts.set(ip, entry);
  if (entry.count > MAX_LOGIN_ATTEMPTS) {
    throw new GraphQLError('Too many login attempts. Please try again later.', {
      extensions: { code: 'TOO_MANY_REQUESTS' },
    });
  }
}

// Requires uppercase, lowercase, digit, and at least 8 characters
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function setAuthCookies(res, token) {
  const opts = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
  res.cookie('id_token', token, opts);
  // Non-httpOnly companion cookie lets client JS detect an active session
  res.cookie('auth_present', '1', { ...opts, httpOnly: false });
}

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
    addUser: async (_, { email, password }, ctx) => {
      if (!PASSWORD_REGEX.test(password)) {
        throw new GraphQLError(
          'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
          { extensions: { code: 'BAD_USER_INPUT' } }
        );
      }
      const user = await User.create({ email, password });
      setAuthCookies(ctx.res, signToken(user));
      return { user };
    },

    login: async (_, { email, password }, ctx) => {
      const ip = ctx.req?.ip || 'unknown';
      checkLoginRateLimit(ip);

      const user = await User.findOne({ email });
      const valid = user && (await user.isCorrectPassword(password));
      if (!valid) {
        throw new GraphQLError('Invalid credentials.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      setAuthCookies(ctx.res, signToken(user));
      return { user };
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
