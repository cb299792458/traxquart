import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        authorized: async ({ auth, request: { nextUrl } }) => {
            const isLoggedIn = auth?.user;
            const isOnHome = nextUrl.pathname.startsWith("/home");
            if (isOnHome) {
                if (isLoggedIn) return true;
                return false; // Redirect to sign-in page
            } else if (isLoggedIn) {
                return Response.redirect("/home");
            }
            return true;
        }
    },
    providers: [],
    
};
