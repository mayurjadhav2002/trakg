import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.REDIS_URI) {
  throw new Error("Missing REDIS_URI environment variable");
}

const redis = new Redis(process.env.REDIS_URI, {
  tls: process.env.REDIS_URI.startsWith("rediss://") ? {} : undefined,
  retryStrategy: (times) => {
    if (times > 5) {
      console.error("Redis retry limit reached");
      return null;
    }
    return Math.min(times * 200, 2000);
  },

  maxRetriesPerRequest: null,
  enableOfflineQueue: true,
});

redis.on("connect", () => console.log("Redis connecting..."));
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", (err) => console.error("⚠️ Redis error:", err));
redis.on("end", () => console.warn("⚠️ Redis connection closed"));
redis.on("reconnecting", (delay: number) =>
  console.log(`♻️ Redis reconnecting in ${delay}ms`),
);

process.on("SIGINT", async () => {
  console.log("❌ Closing Redis connection...");
  try {
    await redis.quit();
  } catch (err) {
    console.error("❌ Error closing Redis:", err);
  } finally {
    process.exit(0);
  }
});

export default redis;
