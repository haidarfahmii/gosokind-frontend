import { DriverJob } from "@/@types/driver.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Clock, Phone, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DriverHistoryCardProps {
  job: DriverJob;
}

export default function DriverHistoryCard({ job }: DriverHistoryCardProps) {
  const isPickup = job.type === "PICKUP";

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-transparent hover:border-gray-200 overflow-hidden flex flex-col h-full bg-white relative shadow-sm opacity-[0.97]">
      {/* Left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />

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
            <span
              className={cn(
                "inline-flex rounded-full h-2 w-2",
                isPickup ? "bg-blue-600" : "bg-purple-600",
              )}
            ></span>
            {job.type}
          </Badge>
          <span className="font-mono text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            #{job.orderId}
          </span>
        </div>

        {/* Customer Info Box */}
        <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Customer Details
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-100 shrink-0">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <h3 className="font-semibold text-slate-700 text-sm truncate">
                {job.customerName}
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
              {job.customerPhone ? (
                <span className="text-xs font-medium text-slate-500">
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
          <div className="bg-slate-50 p-2 rounded-full shrink-0 border border-slate-100">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm text-slate-600 font-medium leading-relaxed pt-0.5 line-clamp-3">
            {job.address}
          </span>
        </div>

        {/* Meta Info (Date & Distance) */}
        <div className="flex items-center flex-wrap gap-2 mt-auto pt-4 border-t border-dashed border-slate-200">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {job.date}
          </div>
          {job.distance && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              {job.distance}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pl-6 pb-5 pt-4 mt-auto">
        <Button
          className="w-full font-semibold shadow-none rounded-xl h-11 bg-emerald-50 text-emerald-600 hover:bg-emerald-50 pointer-events-none border border-emerald-100"
          size="lg"
          variant="secondary"
          disabled
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed
        </Button>
      </CardFooter>
    </Card>
  );
}
