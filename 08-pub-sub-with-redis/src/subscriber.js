import redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URl || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.error("failed to subscribe: %s", err.message);
    return;
  }

  console.log("subscribed successfully");
});
