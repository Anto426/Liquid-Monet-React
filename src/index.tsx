"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { liquidPresets, type LiquidPreset, type LiquidMode } from "./tokens.js";
export {
  liquidPresets,
  liquidTokens,
  type LiquidPreset,
  type LiquidMode,
} from "./tokens.js";

const cx = (...values: (string | false | undefined)[]) =>
  values.filter(Boolean).join(" ");
type Theme = {
  preset: LiquidPreset;
  mode: LiquidMode;
  setPreset: (value: LiquidPreset) => void;
  setMode: (value: LiquidMode) => void;
};
const ThemeContext = createContext<Theme | null>(null);

export function LiquidProvider({
  children,
  defaultPreset = "sapphire",
  defaultMode = "light",
  storageKey,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  defaultPreset?: LiquidPreset;
  defaultMode?: LiquidMode;
  storageKey?: string;
}) {
  const [preset, setPreset] = useState<LiquidPreset>(defaultPreset);
  const [mode, setMode] = useState<LiquidMode>(defaultMode);
  const [systemDark, setSystemDark] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (storageKey) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (
          saved &&
          Object.prototype.hasOwnProperty.call(liquidPresets, saved.preset)
        )
          setPreset(saved.preset);
        if (saved && ["light", "dark", "system"].includes(saved.mode))
          setMode(saved.mode);
      } catch {
        /* Storage is optional, including private browser mode. */
      }
    }
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches);
    update();
    query.addEventListener("change", update);
    setReady(true);
    return () => query.removeEventListener("change", update);
  }, [storageKey]);
  useEffect(() => {
    if (ready && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ preset, mode }));
      } catch {}
    }
  }, [ready, storageKey, preset, mode]);
  const dark = mode === "dark" || (mode === "system" && systemDark);
  const colors = liquidPresets[preset];
  const variables = {
    "--lm-primary": dark ? colors.dark : colors.light,
    "--lm-seed": colors.light,
    "--lm-tertiary": colors.tertiary,
    ...style,
  } as CSSProperties;
  return (
    <ThemeContext.Provider value={{ preset, mode, setPreset, setMode }}>
      <div
        {...props}
        className={cx("lm-root", className)}
        data-lm-mode={dark ? "dark" : "light"}
        data-lm-preset={preset}
        style={variables}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function useLiquidTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useLiquidTheme requires LiquidProvider");
  return theme;
}
export function LiquidBackground({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx("lm-background", className)}
    >
      <i />
      <i />
      <i />
    </div>
  );
}
export function LiquidCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("lm-glass", "lm-card", className)} />;
}
export function LiquidNavigationBar({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <nav {...props} className={cx("lm-glass", "lm-navigation", className)} />
  );
}
type Variant = "primary" | "glass" | "quiet" | "danger";
export function LiquidButton({
  variant = "glass",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      type={type}
      className={cx("lm-button", `lm-button--${variant}`, className)}
    />
  );
}
export function LiquidLink({
  variant = "glass",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a
      {...props}
      className={cx("lm-button", `lm-button--${variant}`, className)}
    />
  );
}
export function LiquidBadge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cx("lm-badge", className)} />;
}
export function LiquidChip({
  selected = false,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      aria-pressed={selected}
      className={cx(
        "lm-chip",
        "lm-glass",
        selected && "lm-chip--selected",
        className,
      )}
    />
  );
}
export function LiquidInput({
  label,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="lm-field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        {...props}
        id={inputId}
        className={cx("lm-input", "lm-glass", className)}
      />
    </div>
  );
}
export function LiquidSearchBar(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    label?: string;
  },
) {
  return (
    <LiquidInput
      {...props}
      type="search"
      aria-label={props["aria-label"] || props.label || "Cerca"}
    />
  );
}
export function LiquidSwitch({
  checked,
  onCheckedChange,
  children,
  disabled = false,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className="lm-switch"
    >
      <span>{children}</span>
      <span className="lm-switch-track">
        <span />
      </span>
    </button>
  );
}
export type LiquidSelectOption = { value: string; label: string };
export function LiquidSelect({
  label,
  value,
  onValueChange,
  options,
  disabled = false,
  name,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly LiquidSelectOption[];
  disabled?: boolean;
  name?: string;
  className?: string;
}) {
  const id = useId(),
    root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const search = useRef({ text: "", at: 0 });
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  useEffect(() => {
    if (disabled || !options.length) setOpen(false);
  }, [disabled, options.length]);
  function choose(index: number) {
    const option = options[index];
    if (option) onValueChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      ref={root}
      className={cx("lm-select", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <span id={`${id}-label`} className="lm-select-label">
        {label}
      </span>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <div className="lm-select-control">
        <button
          ref={trigger}
          type="button"
          className="lm-glass lm-select-trigger"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-expanded={open}
          aria-controls={open ? `${id}-list` : undefined}
          aria-haspopup="listbox"
          aria-activedescendant={open ? `${id}-option-${active}` : undefined}
          disabled={disabled || !options.length}
          onClick={() => {
            setActive(selected);
            setOpen(!open);
          }}
          onKeyDown={(event) => {
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              if (!open) {
                setActive(
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? options.length - 1
                      : selected,
                );
                setOpen(true);
              } else
                setActive((index) =>
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? options.length - 1
                      : (index +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          options.length) %
                        options.length,
                );
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (open) choose(active);
              else {
                setActive(selected);
                setOpen(true);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            } else if (event.key === "Tab") setOpen(false);
            else if (
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.metaKey
            ) {
              const now = Date.now();
              search.current.text =
                (now - search.current.at < 700 ? search.current.text : "") +
                event.key.toLocaleLowerCase();
              search.current.at = now;
              const index = options.findIndex((option) =>
                option.label
                  .toLocaleLowerCase()
                  .startsWith(search.current.text),
              );
              if (index >= 0) {
                event.preventDefault();
                setActive(index);
                setOpen(true);
              }
            }
          }}
        >
          <span>{options[selected]?.label || "Seleziona"}</span>
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="lm-glass lm-select-menu"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                data-active={active === index}
                className="lm-select-option"
                onPointerMove={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                {option.label}
                <span aria-hidden="true">
                  {option.value === value ? "✓" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export function LiquidDialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={cx("lm-glass", "lm-dialog", className)}
      onCancel={onClose}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="lm-dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <LiquidButton aria-label="Chiudi finestra" onClick={onClose}>
          ×
        </LiquidButton>
      </div>
      {children}
    </dialog>
  );
}
