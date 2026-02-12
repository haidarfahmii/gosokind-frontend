"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Store, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { toast } from "react-toastify";

interface OutletData {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  phoneNumber?: string | null;
  status?: string;
  operatingHours?: string | null;
}

export default function OutletInfo() {
  const { data: session } = useSession();
  const [outlet, setOutlet] = useState<OutletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOutletInfo = async () => {
      try {
        setLoading(true);

        // Backend akan otomatis return outlet sesuai outletId dari token
        const response = await outletService.getAllOutlets();

        if (response.success && response.data && response.data.length > 0) {
          setOutlet(response.data[0]);
        }
      } catch (error: any) {
        console.error("Failed to fetch outlet info:", error);
        toast.error("Failed to load outlet information");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "OUTLET_ADMIN") {
      fetchOutletInfo();
    }
  }, [session]);

  if (loading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!outlet) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500 text-center">
            Outlet information not available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {outlet.name}
              </h3>
              <p className="text-sm text-slate-500">Your Outlet</p>
            </div>
          </div>

          {/* Status Badge */}
          {outlet.status && (
            <Badge
              variant="secondary"
              className={
                outlet.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {outlet.status}
            </Badge>
          )}
        </div>

        {/* Outlet Details */}
        <div className="space-y-3 pt-2 border-t">
          {/* Address */}
          {outlet.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-700">{outlet.address}</p>
                {(outlet.city || outlet.province) && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {[outlet.city, outlet.province].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Phone */}
          {outlet.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-700">{outlet.phoneNumber}</p>
            </div>
          )}

          {/* Operating Hours */}
          {outlet.operatingHours && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-700">{outlet.operatingHours}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t">
          <p className="text-xs text-slate-500 mb-2">Quick Links</p>
          <div className="flex gap-2">
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Edit Details
            </a>
            <span className="text-xs text-slate-300">•</span>
            <a href="#" className="text-xs text-blue-600 hover:underline">
              View Map
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
