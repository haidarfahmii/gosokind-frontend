"use client";

import { Users, UserCheck, UserX, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeStats as StatsType } from "../../types/employee.types";

interface EmployeeStatsProps {
  stats: StatsType | null;
  loading?: boolean;
}

export function EmployeeStats({ stats, loading }: EmployeeStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Roles",
      value: Object.keys(stats.byRole).length,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className="border-none shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {card.title}
            </CardTitle>
            <div
              className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}
            >
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
