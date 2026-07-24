interface ToggleSwitchProps {
  checked: boolean;
  label: string;
}

export default function ToggleSwitch({ checked, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled
      title="Preview only — this setting is not connected to the server yet"
      className={`flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full p-1 transition-colors disabled:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2 motion-reduce:transition-none
        ${checked ? "bg-[#00001a]" : "bg-slate-300"}`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition-transform motion-reduce:transition-none
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
