type ComplianceSearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ComplianceSearchField({
  label,
  placeholder,
  value,
  onChange,
}: ComplianceSearchFieldProps) {
  return (
    <label className="w-full sm:max-w-[17rem]">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-10 w-full rounded-xl border border-transparent bg-[#EFEFF1] px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#051466] focus:ring-2 focus:ring-[#051466]/20"
      />
    </label>
  );
}
