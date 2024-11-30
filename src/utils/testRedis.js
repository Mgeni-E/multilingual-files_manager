const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

async function testRedisConnection() {
  const client = redis.createClient({
    password: process.env.REDIS_PSWD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => console.error("Redis Error:", err));

  try {
    await client.connect();
    console.log("Redis Connection Successful");

    // Perform test operations
    await client.set("test_connection", "Working");
    const testValue = await client.get("test_connection");
    console.log("Test Value:", testValue);
  } catch (error) {
    console.error("Connection Failed:", error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
