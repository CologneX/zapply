import z from "zod";

export const SignInRequestSchema = z.object({
    username: z.string({
        error: "Username is required",
    }).min(2, {
        error: "Username must be at least 2 characters long",
    }).max(100, {
        error: "Username must be at most 100 characters long",
    }),
    password: z.string({
        error: "Password is required",
    }).min(6, {
        error: "Password must be at least 6 characters long",
    }).max(100),
})

export const SignUpRequestSchema = SignInRequestSchema.extend({
    name: z.string({
        error: "Name is required",
    }).min(2, {
        error: "Name must be at least 2 characters long",
    }).max(100, {
        error: "Name must be at most 100 characters long",
    }),
    email: z.email({
        error: "Enter a valid email address",
    }),
    confirmPassword: z.string({
        error: "Confirm Password is required",
    }).min(6, {
        error: "Confirm Password must be at least 6 characters long",
    }).max(100, {
        error: "Confirm Password must be at most 100 characters long",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ConfirmEmailRequestSchema = z.object({
    email: z.email({
        error: "Enter a valid email address",
    }),
    code: z.string({
        error: "Confirmation code is required",
    }).length(6, {
        error: "Confirmation code must be 6 characters long",
    }),
});

export const ForgotPasswordRequestSchema = z.object({
    email: z.email({
        error: "Enter a valid email address",
    }),
});


export type ConfirmEmailRequestType = z.infer<typeof ConfirmEmailRequestSchema>;
export type ForgotPasswordRequestType = z.infer<typeof ForgotPasswordRequestSchema>;
export type SignInRequestType = z.infer<typeof SignInRequestSchema>;
export type SignUpRequestType = z.infer<typeof SignUpRequestSchema>;