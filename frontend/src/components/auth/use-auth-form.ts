"use client";

import { useMemo, useState } from "react";

type Mode = "login" | "signup";

type Values = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Touched = {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getErrors(mode: Mode, values: Values) {
  return {
    email: !values.email
      ? "Email is required."
      : !isEmail(values.email)
        ? "Enter a valid email address."
        : "",
    password: !values.password
      ? "Password is required."
      : values.password.length < 8
        ? "Password must be at least 8 characters."
        : "",
    confirmPassword:
      mode === "signup"
        ? !values.confirmPassword
          ? "Please confirm your password."
          : values.confirmPassword !== values.password
            ? "Passwords do not match."
            : ""
        : "",
  };
}

export function useAuthForm(mode: Mode) {
  const [values, setValues] = useState<Values>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<Touched>({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const errors = useMemo(() => getErrors(mode, values), [mode, values]);
  const isValid = useMemo(() => Object.values(errors).every((value) => !value), [errors]);

  const setValue = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const touchField = (field: keyof Touched) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field: keyof Values) => touched[field] ? errors[field] : "";
  const showSuccess = (field: keyof Values) => touched[field] && !errors[field] && values[field].trim().length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    touchField,
    showError,
    showSuccess,
  };
}
