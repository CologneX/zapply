"use server";

import { auth } from "@/lib/auth";
import { RouteURL } from "@/lib/routes";
import { ConfirmEmailRequestSchema, ConfirmEmailRequestType, SignInRequestSchema, SignInRequestType, SignUpRequestSchema, SignUpRequestType } from "@/types/auth.types";
import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const SignInAction = async (data: SignInRequestType) => {
    const validatedFields = SignInRequestSchema.safeParse({
        username: data.username,
        password: data.password,
    });
    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid input" };
    }
    let email = "";
    try {
        const data = await auth.api.signInUsername({
            body: {
                username: validatedFields.data.username,
                password: validatedFields.data.password,
            }
        });
        if (data && data.user.email) {
            email = data.user.email;
        }
    } catch (error) {
        const err = error as APIError;
        if (err.statusCode === 403) {
            redirect(`${RouteURL.CONFIRM_EMAIL}?email=${encodeURIComponent(email)}`);
        }
        console.error(error);
        return { error: err.body?.message || "Failed to sign in." };
    }
    redirect(RouteURL.DASHBOARD);
}

export const SignUpAction = async (data: SignUpRequestType) => {
    const validatedFields = SignUpRequestSchema.safeParse({
        username: data.username,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
        email: data.email,
    });
    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid input" };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                username: validatedFields.data.username,
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                password: validatedFields.data.password,
            }
        });
    } catch (error) {
        const err = error as APIError;
        if (err.body?.code === "USER_ALREADY_EXISTS") {
            redirect(`${RouteURL.SIGNIN}?email=${encodeURIComponent(validatedFields.data.email)}`);
        }
        if (err.body?.code === "EMAIL_NOT_VERIFIED") {
            redirect(`${RouteURL.CONFIRM_EMAIL}?email=${encodeURIComponent(validatedFields.data.email)}`);
        }
        return { error: err.body?.message || "Failed to sign up." };
    }
    // redirect(data.redirectURL || `${RouteURL.CONFIRM_EMAIL}?email=${encodeURIComponent(validatedFields.data.email)}`);
    redirect(`${RouteURL.CONFIRM_EMAIL}?email=${encodeURIComponent(validatedFields.data.email)}&otpSent=true`);
}

export const CheckUsernameAvailabilityAction = async (username: string) => {
    try {
        const res = await auth.api.isUsernameAvailable({
            body: {
                username: username,
            }
        });
        if (res.available) {
            return true;
        }
        return { message: "Username is already taken." };
    } catch (error) {
        const err = error as APIError;
        console.error(err);
        return { error: err.body?.message || "Failed to check username availability." };
    }
}

export const LogoutAction = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });;
    // revalidatePath({
    //     ""
    // });
    redirect(RouteURL.HOME);
}

export const ConfirmEmailAction = async (data: ConfirmEmailRequestType) => {
    const validatedFields = ConfirmEmailRequestSchema.safeParse({
        code: data.code,
        email: data.email,
    });
    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid input" };
    }
    try {
        await auth.api.verifyEmailOTP({
            body: {
                email: validatedFields.data.email,
                otp: validatedFields.data.code,
            },
        });

    } catch (error) {
        const err = error as APIError;
        return { error: err.body?.message || "Failed to verify email." };
    }

    redirect(RouteURL.HOME);
}

export const ResendEmailVerificationAction = async ({ email }: { email: string }) => {
    try {
        await auth.api.sendVerificationOTP({
            body: {
                email: email,
                type: "email-verification",
            },
        });

    } catch (error) {
        const err = error as APIError;
        return { error: err.body?.message || "Failed to resend verification email." };
    }
    redirect(`${RouteURL.CONFIRM_EMAIL}?email=${encodeURIComponent(email)}&otpSent=true`);
}

export const AuthGoogleAction = async (): Promise<void> => {
    let redirectURL: string = "";
    try {
        const data = await auth.api.signInSocial({
            headers: await headers(),
            body: {
                provider: "google",
                requestSignUp: true,
            }
        });
        if (data && data.url) {
            redirectURL = data.url;
        }
    } catch (error) {
        const err = error as APIError;
        console.error(err);
        // On error, redirect back to sign-in with an error message so the form action matches expected signature
        redirect(`${RouteURL.SIGNIN}?error=${encodeURIComponent(err.body?.message || "Failed to sign in with Google.")}`);
    }
    redirect(redirectURL);
}
