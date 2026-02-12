import * as Yup from "yup";

export const outletSchema = Yup.object().shape({
  name: Yup.string()
    .required("Outlet name is required")
    .min(3, "Outlet name must be at least 3 characters")
    .max(100, "Outlet name must not exceed 100 characters"),

  province: Yup.string().test(
    "province-required",
    "Province is required when coordinates are not provided",
    function (value) {
      const { latitude, longitude } = this.parent;
      // Jika ada coordinates, province optional
      if (latitude && longitude) return true;
      // Jika tidak ada coordinates, province wajib
      return !!value;
    },
  ),

  city: Yup.string().test(
    "city-required",
    "City is required when coordinates are not provided",
    function (value) {
      const { latitude, longitude } = this.parent;
      // Jika ada coordinates, city optional
      if (latitude && longitude) return true;
      // Jika tidak ada coordinates, city wajib
      return !!value;
    },
  ),

  status: Yup.string()
    .oneOf(["AVAILABLE", "MAINTENANCE"], "Invalid status")
    .required("Status is required"),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),

  latitude: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      // Convert empty string to null
      return originalValue === "" ? null : value;
    })
    .test(
      "latitude-range",
      "Latitude must be between -90 and 90",
      function (value) {
        if (value === null || value === undefined) return true;
        return value >= -90 && value <= 90;
      },
    )
    .test(
      "latitude-longitude-pair",
      "Longitude is required when latitude is provided",
      function (value) {
        const { longitude } = this.parent;
        if (value !== null && value !== undefined) {
          return (
            longitude !== null && longitude !== undefined && longitude !== ""
          );
        }
        return true;
      },
    ),

  longitude: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .test(
      "longitude-range",
      "Longitude must be between -180 and 180",
      function (value) {
        if (value === null || value === undefined) return true;
        return value >= -180 && value <= 180;
      },
    )
    .test(
      "longitude-latitude-pair",
      "Latitude is required when longitude is provided",
      function (value) {
        const { latitude } = this.parent;
        if (value !== null && value !== undefined) {
          return latitude !== null && latitude !== undefined && latitude !== "";
        }
        return true;
      },
    ),
});

export type OutletSchemaType = Yup.InferType<typeof outletSchema>;
