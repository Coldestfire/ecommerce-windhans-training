const { Redis } = require('@upstash/redis');

// Create Redis client with Upstash configuration
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = redis; 