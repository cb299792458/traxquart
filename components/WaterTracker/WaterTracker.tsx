import { useState } from "react";

export const WaterTracker = ({ user }: { user: {name: string, weight: number }}) => {
    const { name, weight } = user;
    const [ waterConsumed, setWaterConsumed ] = useState(0);
    const [ waterGoal, setWaterGoal ] = useState(weight / 2);
    return (
        <div>
            <h1>Water Tracker</h1>
            <p>Water Consumed: 0 oz</p>
            <p>Water Goal: 32 oz</p>
            <button>Add 1 oz</button>
            <button>Remove 1 oz</button>
            <button>Reset</button>
        </div>
    );
};
