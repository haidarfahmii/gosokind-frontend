"use client";

import { Plus, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  onAdd: () => void;
}

export function PageHeader({ onAdd }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-blue-600" /> Employee Management
        </h1>
        <p className="text-slate-500 text-sm">
          Manage access, roles, and assign employees to outlets.
        </p>
      </div>
      <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
        <Plus className="w-4 h-4" /> Add Employee
      </Button>
    </div>
  );
}
