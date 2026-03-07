import * as Yup from "yup";

export const outletSchema = Yup.object().shape({
  name: Yup.string()
    .required("Outlet name is required")
    .min(3, "Outlet name must be at least 3 characters")
    .max(100, "Outlet name must not exceed 100 characters"),
  province: Yup.string().optional(),
  city: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["AVAILABLE", "MAINTENANCE"], "Invalid status")
    .required("Status is required"),
  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),
  latitude: Yup.number()
    .typeError("Please select a location on the map")
    .required("Please select a location on the map")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: Yup.number()
    .typeError("Please select a location on the map")
    .required("Please select a location on the map")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export type OutletSchemaType = Yup.InferType<typeof outletSchema>;
