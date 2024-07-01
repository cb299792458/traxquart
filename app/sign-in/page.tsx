'use client';
import { useState } from "react";
import { signIn } from '@/auth';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await signIn('credentials', { email, password })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black"
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black"
                    />
                </label>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
