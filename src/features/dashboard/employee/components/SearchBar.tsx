"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search by name or email..."
        className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
