require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./config/connection');

const { typeDefs, resolvers } = require('./schemas');
const { verifyToken } = require('./utils/auth');
const ensureSeeds = require('./seeders/ensureSeeds');

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CLIENT_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  await server.start();

  app.set('trust proxy', 1);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  // ── Photo uploads ────────────────────────────────────────
  // Uploads go to Cloudinary when CLOUDINARY_URL is set; otherwise to local
  // disk under server/uploads (fine for dev — ephemeral on Render).
  const UPLOADS_DIR = path.join(__dirname, 'uploads');
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype in IMAGE_TYPES),
  });

  const requirePhotoAuth = (req, res, next) => {
    try {
      req.user = verifyToken(req.cookies.id_token || '');
      next();
    } catch {
      res.status(401).json({ error: 'Not authenticated.' });
    }
  };

  app.post('/api/photos', requirePhotoAuth, upload.single('photo'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image received — use JPEG, PNG, or WebP up to 5 MB.' });
      }
      if (process.env.CLOUDINARY_URL) {
        const { v2: cloudinary } = require('cloudinary');
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'firstbase', resource_type: 'image' }, (err, r) =>
              err ? reject(err) : resolve(r)
            )
            .end(req.file.buffer);
        });
        return res.json({ url: result.secure_url });
      }
      const ext = IMAGE_TYPES[req.file.mimetype];
      const name = `${req.user._id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await fs.promises.writeFile(path.join(UPLOADS_DIR, name), req.file.buffer);
      res.json({ url: `/uploads/${name}` });
    } catch (err) {
      next(err);
    }
  });

  app.use('/uploads', express.static(UPLOADS_DIR));

  // Multer size-limit errors and upload failures surface as JSON, not HTML
  app.use('/api/photos', (err, req, res, next) => {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large — max 5 MB.' : 'Upload failed.';
    console.error('Photo upload error:', err.message);
    res.status(400).json({ error: msg });
  });

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
