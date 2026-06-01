# First Base — Client

React 18 + Vite frontend for the First Base app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |

Run these from the `client/` directory, or use `npm run develop` from the project root to start both client and server together.

## Notes

- The dev server proxies `/graphql` and `/logout` to the Express server on port 3001. Make sure the server is running when in development mode.
- Apollo Client is configured with `credentials: 'include'` so auth cookies are forwarded automatically — no manual token handling needed.
