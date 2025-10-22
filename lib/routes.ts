export type RouteItems = {
    title: string;
    description?: string;
    url: string;
}

export enum RouteURL {
    HOME = "/",
    DASHBOARD = "/dashboard",
    // AUTH
    SIGNIN = "/signin",
    SIGNUP = "/signup",
    CONFIRM_EMAIL = "/confirm-email",
    FORGOT_PASSWORD = "/forgot-password",
    // PROFILE
    PROFILE = "/profile",
    ACCOUNT_SETTINGS = "/account-settings",
    // RESUME & COVER LETTER
    CREATE_RESUME = "/create-resume",
    EDIT_RESUME = "/edit-resume",
    CREATE_COVER_LETTER = "/create-cover-letter",
    EDIT_COVER_LETTER = "/edit-cover-letter",
    USER = "/u",
}

export const routesMap: Partial<Record<RouteURL, RouteItems>> = {
    [RouteURL.DASHBOARD]: {
        title: "Dashboard",
        url: RouteURL.DASHBOARD,
        description: "Your personal dashboard",
    },
    [RouteURL.SIGNIN]: {
        title: "Sign In",
        url: RouteURL.SIGNIN,
        description: "Access your account",
    },
    [RouteURL.SIGNUP]: {
        title: "Sign Up",
        url: RouteURL.SIGNUP,
        description: "Create a new account",
    },
    [RouteURL.CONFIRM_EMAIL]: {
        title: "Confirm Email",
        url: RouteURL.CONFIRM_EMAIL,
        description: "Verify your email address",
    },
    [RouteURL.FORGOT_PASSWORD]: {
        title: "Forgot Password",
        url: RouteURL.FORGOT_PASSWORD,
        description: "Reset your password",
    },
    [RouteURL.PROFILE]: {
        title: "Profile",
        url: RouteURL.PROFILE,
        description: "View and edit your profile",
    },
    [RouteURL.ACCOUNT_SETTINGS]: {
        title: "Account Settings",
        url: RouteURL.ACCOUNT_SETTINGS,
        description: "Manage your account settings",
    },
    [RouteURL.CREATE_RESUME]: {
        title: "Create Resume",
        url: RouteURL.CREATE_RESUME,
        description: "Build a new resume",
    },
    [RouteURL.EDIT_RESUME]: {
        title: "Edit Resume",
        url: RouteURL.EDIT_RESUME,
        description: "Modify your existing resume",
    },
    [RouteURL.CREATE_COVER_LETTER]: {
        title: "Create Cover Letter",
        url: RouteURL.CREATE_COVER_LETTER,
        description: "Craft a new cover letter",
    },
    [RouteURL.EDIT_COVER_LETTER]: {
        title: "Edit Cover Letter",
        url: RouteURL.EDIT_COVER_LETTER,
        description: "Update your cover letter",
    },
    [RouteURL.USER]: {
        title: "User Profile",
        url: RouteURL.USER,
        description: "View user profiles",
    },
};

export const routes = Object.values(routesMap).filter(Boolean) as RouteItems[];