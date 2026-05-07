"use client";

import { Button } from "@/components/ui/button";

type SocialAuthButtonProps = {
  label: string;
  icon: React.ReactNode;
};

export default function SocialAuthButton({ label, icon }: SocialAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-12 w-full justify-center rounded-2xl border-[#e3e8ef] bg-white px-4 text-[14px] font-medium text-[#10233d] shadow-none hover:bg-[#f8fafc]"
    >
      <span className="inline-flex items-center gap-3">
        <span className="text-[#10233d]">{icon}</span>
        <span>{label}</span>
      </span>
    </Button>
  );
}
