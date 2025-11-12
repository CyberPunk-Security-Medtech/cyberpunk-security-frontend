import { forwardRef, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";


export const FieldLabel = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
<label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#0B1227]">
{children}
</label>
);


export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
{ className = "", ...props },
ref
) {
return (
<input
ref={ref}
className={`w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1A2380] focus:ring-1 focus:ring-[#1A2380] ${className}`}
{...props}
/>
);
});


export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
{ className = "", children, ...props },
ref
) {
return (
<select
ref={ref}
className={`w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#1A2380] focus:ring-1 focus:ring-[#1A2380] ${className}`}
{...props}
>
{children}
</select>
);
});


export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
{ className = "", ...props },
ref
) {
return (
<textarea
ref={ref}
className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1A2380] focus:ring-1 focus:ring-[#1A2380] ${className}`}
{...props}
/>
);
});