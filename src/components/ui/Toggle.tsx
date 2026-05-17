import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Toggle = ({ checked, onChange, className, disabled }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-[11px] transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        backgroundColor: checked ? "var(--saathi-coral)" : "#D1D1D1",
        // @ts-ignore
        "--tw-ring-color": "var(--saathi-coral)",
      }}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={cn(
          "pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-[20px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
};
