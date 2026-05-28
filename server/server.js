const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./config/connection');
require('dotenv').config();

const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'firstbase_secret_key_change_in_production';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    '/graphql',
    cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
        if (!token) return {};
        try {
          const user = jwt.verify(token, JWT_SECRET);
          return { user };
        } catch {
          return {};
        }
      },
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startServer();
