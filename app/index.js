const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, I am Thisanda Prasanjana!. I am a aspiring DevOps & Cloud engineer. I am passionate about building scalable and efficient cloud infrastructure, and I enjoy working with technologies like AWS, Docker, Kubernetes, Ansible, Terraform and CI/CD.',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Only start server if not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
