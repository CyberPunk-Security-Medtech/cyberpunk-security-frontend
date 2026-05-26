interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`w-[38px] h-[20px] rounded-full flex items-center transition
        ${checked ? "bg-[#00001a]" : "bg-slate-300"}`}
    >
      <span
        className={`w-[16px] h-[16px] bg-white rounded-full transition ml-1
          ${checked ? "translate-x-[18px]" : ""}`}
      ></span>
    </button>
  );
}
