"use client";

import { Users, BadgeCheck, ShieldOff, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Customer } from "@/features/super-admin/customer/types/customer.types";

interface CustomerStatsCardsProps {
  customers: Customer[];
  totalFromPagination: number;
}

export function CustomerStatsCards({
  customers,
  totalFromPagination,
}: CustomerStatsCardsProps) {
  const verifiedCount = customers.filter((c) => c.isVerified).length;
  const unverifiedCount = customers.filter((c) => !c.isVerified).length;
  const socialLoginCount = customers.filter(
    (c) => c.provider && c.provider !== "credentials",
  ).length;

  const stats = [
    {
      label: "Total Customers",
      value: totalFromPagination,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Verified",
      value: verifiedCount,
      icon: BadgeCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      note: "on this page",
    },
    {
      label: "Unverified",
      value: unverifiedCount,
      icon: ShieldOff,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      note: "on this page",
    },
    {
      label: "Social Login",
      value: socialLoginCount,
      icon: UserPlus,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      note: "on this page",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  {stat.note && (
                    <p className="text-[10px] text-slate-400">{stat.note}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
