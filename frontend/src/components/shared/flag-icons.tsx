import {
  AE,
  AU,
  CN,
  DE,
  DK,
  FR,
  GB,
  IN,
  IT,
  PK,
  RU,
  US,
} from "country-flag-icons/react/3x2";
import type { ComponentType } from "react";

export type CountryCode = "AE" | "AU" | "CN" | "DE" | "DK" | "FR" | "GB" | "IN" | "IT" | "PK" | "RU" | "US";

export const FlagComponents: Record<CountryCode, ComponentType<{ title?: string; className?: string }>> = {
  AE,
  AU,
  CN,
  DE,
  DK,
  FR,
  GB,
  IN,
  IT,
  PK,
  RU,
  US,
};
