"use client";

import { Users } from "lucide-react";

export function CustomerPageHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Customer Management
            </h1>
            <p className="text-slate-500 text-sm">
              View and monitor all registered customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
