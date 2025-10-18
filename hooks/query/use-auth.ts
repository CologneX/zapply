import { ActionErrorWrapper } from "@/lib/utils";
import { CheckUsernameAvailabilityAction, ConfirmEmailAction, LogoutAction, ResendEmailVerificationAction, SignInAction, SignUpAction } from "@/services/auth.service";
import { ConfirmEmailRequestType, SignInRequestType, SignUpRequestType } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export const useAuthQuery = () => {
    const SignIn = useMutation({
        mutationFn: async (data: SignInRequestType) => ActionErrorWrapper(SignInAction(data)),
    });
    const SignUp = useMutation({
        mutationFn: async (data: SignUpRequestType) => ActionErrorWrapper(SignUpAction(data)),
    });
    const CheckUsernameAvailability = useMutation({
        mutationFn: async (username: string) => CheckUsernameAvailabilityAction(username),
    });
    const ResendEmailVerification = useMutation({
        mutationFn: async (email: string) => ActionErrorWrapper(ResendEmailVerificationAction({ email })),
    });
    const ConfirmEmailOTP = useMutation({
        mutationFn: async (data: ConfirmEmailRequestType) => ActionErrorWrapper(ConfirmEmailAction(data)),
    });
    const Logout = useMutation({
        mutationFn: async () => ActionErrorWrapper(LogoutAction()),
    });
    return { SignIn, SignUp, CheckUsernameAvailability, ResendEmailVerification, ConfirmEmailOTP, Logout };
}