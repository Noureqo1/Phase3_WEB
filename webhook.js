const express = require('express');
const { handleWebhook } = require('./config/stripe');

const app = express();
const PORT = 3001;

// Raw body parser for webhooks
app.use('/webhook', express.raw({ type: 'application/json' }));

// Webhook endpoint
app.post('/webhook', handleWebhook);

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log('Use this URL with Stripe CLI: stripe listen --forward-to localhost:3001/webhook');
});
