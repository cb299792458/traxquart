'use client';
import { useState } from "react";

export default function Page() {
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [waterGoal, setWaterGoal] = useState(32);


  return (
    <div>
      <h1>Water Tracker</h1>
      <p>Water Consumed: {waterConsumed} oz</p>
      <p>Water Goal: {waterGoal} oz</p>
      <button onClick={() => setWaterConsumed(waterConsumed + 1)}>Add 1 oz</button>
      <button onClick={() => setWaterConsumed(waterConsumed - 1)}>Remove 1 oz</button>
      <button onClick={() => setWaterConsumed(0)}>Reset</button>
    </div>
  );
}
