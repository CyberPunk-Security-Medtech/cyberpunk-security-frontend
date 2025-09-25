import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PaymentFormActivationData } from "@/types/forms";
import Button from "@components/Button";

interface PaymentFormProps {
    register: UseFormRegister<PaymentFormActivationData>;
    errors: FieldErrors<PaymentFormActivationData>;
    onSubmit: () => void;
    submitError: string | null;
}

export const PaymentForm = ({
    register,
    errors,
    onSubmit,
    submitError,
}: PaymentFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="cardNumber">Card Number</label>
                <input id="cardNumber" type="text" {...register("cardNumber")} />
                {errors.cardNumber && <p className="text-red-500">{errors.cardNumber.message}</p>}
            </div>

            <div>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input id="expiryDate" type="text" placeholder="MM/YY" {...register("expiryDate")} />
                {errors.expiryDate && <p className="text-red-500">{errors.expiryDate.message}</p>}
            </div>

            <div>
                <label htmlFor="cvv">CVV</label>
                <input id="cvv" type="text" {...register("cvv")} />
                {errors.cvv && <p className="text-red-500">{errors.cvv.message}</p>}
            </div>

            <Button type="submit">Submit Payment</Button>

            {submitError && <p className="text-red-500">{submitError}</p>}
        </form>
    );
};
