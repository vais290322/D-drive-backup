const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server running' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({
    message: 'User registered successfully',
    user: { id: '1', email: req.body.email, username: req.body.username },
    token: 'test-token-123'
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    message: 'Login successful',
    user: { id: '1', email: req.body.email },
    token: 'test-token-123'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});
