import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const res = await axios.post("/api/auth/login", credentials);
            const user = res?.data?.user;
            if (user) return user;
            return null;
        }
    })]
});

