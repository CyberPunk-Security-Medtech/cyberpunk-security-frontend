import { Check } from "lucide-react";

type StepIndicatorProps = {
  currentStep: number;
};

const steps = [
  "Hospital Information",
  "Verify Hospital",
  "Compliance & Authorization",
] as const;

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Hospital onboarding progress" className="mx-auto w-full">
      <ol className="grid grid-cols-3">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isActive = isCompleted || isCurrent;

          return (
            <li
              key={label}
              className="relative flex min-w-0 flex-col items-center px-1 text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-3 h-px w-full ${
                    stepNumber <= currentStep
                      ? "bg-[#1A2380]"
                      : "bg-gray-200"
                  }`}
                />
              ) : null}

              <span
                aria-hidden="true"
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                  isActive ? "border-[#1A2380]" : "border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 text-[#1A2380]" strokeWidth={3} />
                ) : isCurrent ? (
                  <span className="h-2 w-2 rounded-full bg-[#1A2380]" />
                ) : null}
              </span>

              <span
                className={`mt-2 max-w-28 text-[11px] leading-4 sm:text-xs ${
                  isCurrent
                    ? "font-medium text-[#1A2380]"
                    : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
