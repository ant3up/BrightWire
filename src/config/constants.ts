// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Elevated Electrical Services",
  PHONE: "+61450903942",
  ADDRESS: "Faulconbridge NSW 2776, ",
  SUBURB: "Faulconbridge NSW 2776, ",
  DESCRIPTION: "Professional electrical services for Elevated Electrical Services",
  CONTACT_INFO: {
    phone: "+61450903942",
    address: "Faulconbridge NSW 2776, ",
    suburb: "Faulconbridge NSW 2776, "
  }
} as const;

export const BUSINESS_INFO = {
  name: "Elevated Electrical Services",
  phone: "+61450903942",
  address: "Faulconbridge NSW 2776, ",
  suburb: "Faulconbridge NSW 2776, "
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Elevated Electrical Services",
  phone: {
    display: "+61450903942",
    href: "tel:61450903942"
  },
  address: "Faulconbridge NSW 2776, ",
  suburb: "Faulconbridge NSW 2776, ",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;