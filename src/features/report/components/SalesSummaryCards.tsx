"use client";

import {
  ShoppingBag,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SalesSummary } from "../types/report.types";
import { formatCurrency } from "@/utils/formatters";

interface SalesSummaryCardsProps {
  summary: SalesSummary;
  loading?: boolean;
}

export function SalesSummaryCards({
  summary,
  loading,
}: SalesSummaryCardsProps) {
  const conversionRate =
    summary.totalOrders > 0
      ? ((summary.paidOrders / summary.totalOrders) * 100).toFixed(1)
      : "0";

  const cards = [
    {
      label: "Total Orders",
      value: summary.totalOrders.toLocaleString(),
      sub: `${summary.paidOrders} paid`,
      icon: ShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Paid Orders",
      value: summary.paidOrders.toLocaleString(),
      sub: `${conversionRate}% conversion`,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      sub: "from paid orders only",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Avg. Order Value",
      value: formatCurrency(summary.avgOrderValue),
      sub: "per paid order",
      icon: TrendingUp,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-7 bg-slate-200 rounded w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border-none shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div
              className={`w-10 h-10 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-4`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500 font-medium">{card.label}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">
              {card.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
