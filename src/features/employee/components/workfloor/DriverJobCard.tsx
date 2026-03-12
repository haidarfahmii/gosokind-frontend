import { DriverJob } from "@/@types/driver.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Truck,
  Clock,
  Phone,
  User,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DriverJobCardProps {
  job: DriverJob;
  onAccept: (jobId: string) => Promise<void>;
  onComplete?: (jobId: string, type: string) => Promise<void>;
  isLoading?: boolean;
}

import { useState } from "react";

export default function DriverJobCard({
  job,
  onAccept,
  onComplete,
  isLoading,
}: DriverJobCardProps) {
  const isPickup = job.type === "PICKUP";
  const isInProgress =
    job.status === "IN_PROGRESS" ||
    job.status === "PICKUP_ON_THE_WAY" ||
    job.status === "DELIVERY_ON_THE_WAY";

  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    try {
      if (isInProgress && onComplete) {
        await onComplete(job.id, job.type);
      } else {
        await onAccept(job.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-transparent hover:border-gray-200 overflow-hidden flex flex-col h-full bg-white group relative shadow-sm">
      {/* Left border accent */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5",
          isInProgress
            ? "bg-emerald-500"
            : isPickup
              ? "bg-blue-600"
              : "bg-purple-600",
        )}
      />

      <CardHeader className="pb-3 pt-5 px-5 pl-6">
        {/* Top Header: Badge & Order ID */}
        <div className="flex justify-between items-center mb-4">
          <Badge
            variant="outline"
            className={cn(
              "uppercase text-[10px] sm:text-xs px-2.5 py-1 border-0 font-bold tracking-wide flex items-center gap-1.5",
              isPickup
                ? "bg-blue-50 text-blue-700"
                : "bg-purple-50 text-purple-700",
            )}
          >
            {/* Pulsing Dot */}
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  isPickup ? "bg-blue-500" : "bg-purple-500",
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  isPickup ? "bg-blue-600" : "bg-purple-600",
                )}
              ></span>
            </span>
            {job.type}
          </Badge>
          <span className="font-mono text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            #{job.orderId}
          </span>
        </div>

        {/* Customer Info Box */}
        <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 transition-colors group-hover:bg-slate-50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Customer Details
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-100 shrink-0">
                <User className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm truncate">
                {job.customerName}
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Invisible spacer to align with text above */}
              <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
              {job.customerPhone ? (
                <span className="text-xs font-medium text-slate-600">
                  {job.customerPhone}
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No phone number
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pl-6 py-2 grow flex flex-col">
        {/* Address */}
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-red-50 p-2 rounded-full shrink-0 border border-red-100">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5 line-clamp-3">
            {job.address}
          </span>
        </div>

        {/* Meta Info (Date & Distance) */}
        <div className="flex items-center flex-wrap gap-2 mt-auto pt-4 border-t border-dashed border-slate-200">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            {job.date}
          </div>
          {job.distance && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md text-xs font-medium text-orange-700">
              <Truck className="w-3.5 h-3.5 text-orange-500" />
              {job.distance}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pl-6 pb-5 pt-4 mt-auto">
        <Button
          className={cn(
            "w-full font-semibold shadow-sm rounded-xl transition-all duration-200 h-11",
            isInProgress
              ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md group-hover:-translate-y-0.5",
          )}
          onClick={handleClick}
          disabled={isLoading || isProcessing}
        >
          {isProcessing || isLoading ? (
            <span className="flex items-center">
              Processing... <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            </span>
          ) : isInProgress ? (
            <span className="flex items-center">
              Complete Job <CheckCircle className="w-4 h-4 ml-2" />
            </span>
          ) : (
            <span className="flex items-center">
              Accept Job{" "}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
