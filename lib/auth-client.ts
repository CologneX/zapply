
import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth`,
    plugins: [
        usernameClient(),
    ]
})

export const { useSession } = authClient;