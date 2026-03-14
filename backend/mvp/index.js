require('dotenv').config()
// The main API server is implemented in TypeScript. Use the npm scripts:
//   npm run dev   – start in development mode with ts-node-dev
//   npm run build – compile TypeScript to dist/
//   npm start     – run the compiled server (dist/server.js)
//
// For the standalone Azure Vision prototype, see examples/azure-vision-prototype.js
console.error(
  'Run "npm run dev" or "npm start" to start the API server. ' +
    'See examples/azure-vision-prototype.js for the Azure Vision prototype.',
)
process.exit(1)
