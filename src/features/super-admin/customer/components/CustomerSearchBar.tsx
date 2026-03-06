"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerSearchBar({ value, onChange }: CustomerSearchBarProps) {
  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-white"
      />
    </div>
  );
}
