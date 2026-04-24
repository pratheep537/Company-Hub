const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check — important for Docker
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth',  require('./routes/auth.routes'));
app.use('/api/org',   require('./routes/org.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/logs',  require('./routes/log.routes'));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
