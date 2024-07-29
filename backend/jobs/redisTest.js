const Redis = require('ioredis');
// Create a Redis client
const redis = new Redis('redis://red-cqjq9e8gph6c739c9aug:6379');

// Event listeners for debugging
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

