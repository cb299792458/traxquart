'use client';
import WaterTracker from "@/components/WaterTracker";
import { useState } from "react";

export default function Page() {
    const [user, setUser] = useState({name: "John Doe", weight: 160});


    return (
        <WaterTracker user={user} />
    );
}
