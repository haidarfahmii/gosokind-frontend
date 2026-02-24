"use client";

import { Loader2, BarChart2, Users, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReportPage, ReportTab } from "../hooks/useReportPage";
import { SalesFilterBar, EmployeeFilterBar } from "./ReportFilterBar";
import { SalesSummaryCards } from "./SalesSummaryCards";
import { SalesChart } from "./SalesChart";
import {
  TopPerformerCard,
  EmployeePerformanceTable,
} from "./EmployeePerformanceTable";

function TabButton({
  tab,
  activeTab,
  onClick,
  icon: Icon,
  label,
}: {
  tab: ReportTab;
  activeTab: ReportTab;
  onClick: (tab: ReportTab) => void;
  icon: React.ElementType;
  label: string;
}) {
  const isActive = tab === activeTab;
  return (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/**
 * ReportPageContent
 * Komponen konten halaman laporan yang digunakan bersama
 * oleh Super Admin dan Outlet Admin.
 *
 * - Super Admin: dapat melihat dropdown filter outlet dan
 *   berpindah antar outlet
 * - Outlet Admin: tidak memiliki filter outlet
 *   (backend otomatis membatasi data ke outlet miliknya)
 *
 * Penggunaan:
 *   Halaman Super Admin  → export { default } from ".../outlet-admin/reports/page"
 *   Halaman Outlet Admin → merender <ReportPageContent />
 */
export function ReportPageContent() {
  const {
    isSuperAdmin,
    activeTab,
    setActiveTab,
    outlets,
    globalOutletId,
    handleOutletChange,
    activeOutletName,
    salesReport,
    employeeReport,
  } = useReportPage();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analyze sales performance and employee productivity
            {isSuperAdmin && globalOutletId !== "all" && (
              <span className="font-semibold text-blue-600">
                {" "}
                · {activeOutletName}
              </span>
            )}
          </p>
        </div>

        {/* Active outlet badge */}
        {isSuperAdmin && (
          <Badge
            variant="outline"
            className="text-xs px-3 py-1.5 text-slate-600 shrink-0"
          >
            {globalOutletId === "all"
              ? "🌐 All Outlets"
              : `📍 ${activeOutletName}`}
          </Badge>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <TabButton
          tab="sales"
          activeTab={activeTab}
          onClick={setActiveTab}
          icon={BarChart2}
          label="Sales Report"
        />
        <TabButton
          tab="employees"
          activeTab={activeTab}
          onClick={setActiveTab}
          icon={Users}
          label="Employee Performance"
        />
      </div>

      {/* Sales Report Tab */}
      {activeTab === "sales" && (
        <SalesReportTab
          isSuperAdmin={isSuperAdmin}
          outlets={outlets}
          globalOutletId={globalOutletId}
          onOutletChange={handleOutletChange}
          salesReport={salesReport}
        />
      )}

      {/* Employee Performance Tab */}
      {activeTab === "employees" && (
        <EmployeeReportTab
          isSuperAdmin={isSuperAdmin}
          outlets={outlets}
          globalOutletId={globalOutletId}
          onOutletChange={handleOutletChange}
          employeeReport={employeeReport}
        />
      )}
    </div>
  );
}

// Sales Report Tab
function SalesReportTab({
  isSuperAdmin,
  outlets,
  globalOutletId,
  onOutletChange,
  salesReport,
}: {
  isSuperAdmin: boolean;
  outlets: Array<{ id: string; name: string }>;
  globalOutletId: string;
  onOutletChange: (id: string) => void;
  salesReport: ReturnType<typeof useReportPage>["salesReport"];
}) {
  const {
    report,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch,
  } = salesReport;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesFilterBar
            period={period}
            startDate={startDate}
            endDate={endDate}
            outletId={globalOutletId}
            outlets={outlets}
            showOutletFilter={isSuperAdmin}
            onPeriodChange={setPeriod}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onOutletChange={onOutletChange}
            onRefresh={refetch}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton for first load */}
      {loading && !report && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Content */}
      {report && (
        <>
          {/* Period info */}
          <div className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-600">
              {new Date(report.startDate).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>{" "}
            –{" "}
            <span className="font-medium text-slate-600">
              {new Date(report.endDate).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>
            {report.outlet && (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-blue-600">
                  {report.outlet.name}
                </span>
              </>
            )}
          </div>

          {/* Summary Cards */}
          <SalesSummaryCards summary={report.summary} loading={loading} />

          {/* Charts */}
          <SalesChart
            data={report.data}
            period={report.period}
            outletName={report.outlet?.name}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

// Employee Report Tab
function EmployeeReportTab({
  isSuperAdmin,
  outlets,
  globalOutletId,
  onOutletChange,
  employeeReport,
}: {
  isSuperAdmin: boolean;
  outlets: Array<{ id: string; name: string }>;
  globalOutletId: string;
  onOutletChange: (id: string) => void;
  employeeReport: ReturnType<typeof useReportPage>["employeeReport"];
}) {
  const {
    report,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    refetch,
  } = employeeReport;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeFilterBar
            startDate={startDate}
            endDate={endDate}
            outletId={globalOutletId}
            roleFilter={roleFilter}
            outlets={outlets}
            showOutletFilter={isSuperAdmin}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onOutletChange={onOutletChange}
            onRoleChange={setRoleFilter}
            onRefresh={refetch}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !report && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Content */}
      {report && (
        <>
          {/* Period info */}
          <div className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-600">
              {new Date(report.startDate).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>{" "}
            –{" "}
            <span className="font-medium text-slate-600">
              {new Date(report.endDate).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>
            {report.outlet && (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-blue-600">
                  {report.outlet.name}
                </span>
              </>
            )}
          </div>

          {/* Top Performer & Summary */}
          <TopPerformerCard
            topPerformer={report.summary.topPerformer}
            totalEmployees={report.summary.totalEmployees}
            loading={loading}
          />

          {/* Employee Table */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Employee Breakdown</CardTitle>
              <CardDescription>
                {report.data.length} employee
                {report.data.length !== 1 ? "s" : ""} with activity in this
                period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeePerformanceTable
                data={paginatedData}
                totalItems={report.data.length}
                loading={loading}
                currentPage={page}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
