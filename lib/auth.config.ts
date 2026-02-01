import Credentials from "next-auth/providers/credentials"

export default {
    providers: [
        Credentials({
            // For demo purposes, we will return a mock user
            authorize: async (credentials) => {
                // Implement real logic here
                return { id: "1", name: "User", email: "user@example.com" }
            },
        }),
    ],
    // Add other edge-compatible config here
}
