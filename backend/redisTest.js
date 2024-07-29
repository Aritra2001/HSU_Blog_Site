const Redis = require('ioredis');
// Create a Redis client

const redis = new Redis(process.env.REDIS_URL);

// Event listeners for debugging
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

