"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  loading?: boolean;
  className?: string;
}

/**
 * StatsCard — reusable stat metric card.
 * Used on both Super Admin and Outlet Admin dashboards.
 */
export function StatsCard({
  label,
  value,
  change,
  changePositive = true,
  icon: Icon,
  iconBg,
  iconColor,
  loading = false,
  className,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={cn("shadow-sm border-none", className)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-sm border-none hover:shadow-md transition-shadow",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              iconBg,
              iconColor,
            )}
          >
            <Icon size={20} />
          </div>
          {change && (
            <span
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                changePositive
                  ? "text-green-600 bg-green-50"
                  : "text-red-600 bg-red-50",
              )}
            >
              {change}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
