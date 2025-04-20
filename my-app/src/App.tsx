import { useEffect, useRef, useState } from "react";
import "./App.css";
import { apiGetPrice } from "./api";

enum BG_STATE {
  DEFAULT = "default",
  UP = "up",
  DOWN = "down",
}

const POLL_INTERVAL_MS = 10_000;

function App() {
  const [price, setPrice] = useState<number | null>(null);
  const [bg, setBg] = useState<BG_STATE>(BG_STATE.DEFAULT);
  const [countdown, setCountdown] = useState<number>(POLL_INTERVAL_MS / 1000);

  const latestPriceRef = useRef<number | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const data = await apiGetPrice();

        if (latestPriceRef.current !== null) {
          if (data.price > latestPriceRef.current) {
            setBg(BG_STATE.UP);
          } else if (data.price < latestPriceRef.current) {
            setBg(BG_STATE.DOWN);
          } else {
            setBg(BG_STATE.DEFAULT);
          }
        }

        latestPriceRef.current = data.price;
        setPrice(data.price);
        setCountdown(POLL_INTERVAL_MS / 1000);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : POLL_INTERVAL_MS / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownTimer);
    };
  }, []); // run once on mount

  const getBgColor = (): string => {
    switch (bg) {
      case BG_STATE.UP:
        return "lightgreen";
      case BG_STATE.DOWN:
        return "salmon";
      default:
        return "lightgray";
    }
  };

  return (
    <div
      style={{
        backgroundColor: getBgColor(),
        padding: "2rem",
        fontSize: "2rem",
      }}
    >
      <div>{price !== null ? `$${price}` : "Loading..."}</div>
      <div style={{ fontSize: "1rem", marginTop: "1rem" }}>
        Next update in: {countdown}s
      </div>
    </div>
  );
}

export default App;
