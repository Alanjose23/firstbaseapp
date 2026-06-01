require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/connection');

const { typeDefs, resolvers } = require('./schemas');
const { verifyToken } = require('./utils/auth');
const ensureSeeds = require('./seeders/ensureSeeds');

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CLIENT_URL || 'http://localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  // Clears auth cookies so the browser session ends
  app.post('/logout', (req, res) => {
    const cookieOpts = { path: '/', sameSite: 'strict', secure: IS_PRODUCTION };
    res.clearCookie('id_token', cookieOpts);
    res.clearCookie('auth_present', cookieOpts);
    res.json({ ok: true });
  });

  app.use(
    '/graphql',
    cors({ origin: CORS_ORIGIN, credentials: true }),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.cookies.id_token || '';
        if (!token) return { res, req };
        try {
          const user = verifyToken(token);
          return { user, res, req };
        } catch {
          return { res, req };
        }
      },
    })
  );

  if (IS_PRODUCTION) {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', async () => {
    await ensureSeeds();
    const httpServer = app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
    });
    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use. Run this to free it:\n  fuser -k ${PORT}/tcp\n`);
      } else {
        console.error('Server error:', err.message);
      }
      process.exit(1);
    });
  });
};

startServer();
