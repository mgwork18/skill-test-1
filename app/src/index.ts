import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";

const app = new Elysia()
  .use(
    rateLimit({
      max: 6,
    })
  )
  .use(cors())
  .get("/api/bnb-price", getPriceHandler) // ✅ pass the function, not the result
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// ✅ define it as a function, not a function that returns a value
function getPriceHandler() {
  const basePrice = 600;
  const fluctuation = basePrice * (Math.random() * 0.04 - 0.02); // ±2%
  const price = +(basePrice + fluctuation).toFixed(2);
  return {
    price,
    lastUpdate: Date.now(),
  };
}
