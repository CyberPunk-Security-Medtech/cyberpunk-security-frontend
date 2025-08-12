import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignupFormData } from "forms/forms";
import Button from "@components/Button";


interface SignupFormProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
    onSubmit: () => void;
    activationKey: string | null;
    onGetActivationKey: () => void;
    submitError: string | null;
}

export const SignupForm = ({
    register,
    errors,
    onSubmit,
    activationKey,
    onGetActivationKey,
    submitError,
}: SignupFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div>
                <Button type="button" onSubmitHandler={onGetActivationKey}>
                    {activationKey ? "Resend Activation Key" : "Get Activation Key"}
                </Button>
                {activationKey && <p className="text-sm text-green-600">Key: {activationKey}</p>}
            </div>

            <Button type="submit">Continue</Button>

            {submitError && <p className="text-red-500">{submitError}</p>}
        </form>
    );
};
