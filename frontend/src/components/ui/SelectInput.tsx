import Select, { type StylesConfig } from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

// Styles via variables CSS Markyn (source unique index.css) — pas de hex dans le JSX.
const styles: StylesConfig<SelectOption, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: "var(--color-primary)",
    borderRadius: 6,
    boxShadow: "none",
    minHeight: 38,
    ":hover": { borderColor: "var(--color-accent)" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--color-accent)"
      : state.isFocused
        ? "var(--color-light)"
        : "#fff",
    color: state.isSelected ? "#fff" : "var(--color-primary)",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "var(--color-primary)" }),
  placeholder: (base) => ({ ...base, color: "#9ca3af" }),
  dropdownIndicator: (base) => ({ ...base, color: "var(--color-primary)" }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};

export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  isClearable = false,
  inputId,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  isClearable?: boolean;
  inputId?: string;
}) {
  const selected = options.find((o) => o.value === value) ?? null;
  return (
    <Select
      inputId={inputId}
      classNamePrefix="mk-select"
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      placeholder={placeholder ?? "Sélectionner…"}
      isClearable={isClearable}
      styles={styles}
    />
  );
}
