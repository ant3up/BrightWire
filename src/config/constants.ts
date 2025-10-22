// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "ASP ELECTRICAL SERVICES",
  PHONE: "+61403558214",
  ADDRESS: "Southern Cross Ave, Middleton Grange NSW 2171",
  SUBURB: "Southern Cross Ave, Middleton Grange NSW 2171",
  DESCRIPTION: "Professional electrical services for ASP ELECTRICAL SERVICES",
  CONTACT_INFO: {
    phone: "+61403558214",
    address: "Southern Cross Ave, Middleton Grange NSW 2171",
    suburb: "Southern Cross Ave, Middleton Grange NSW 2171"
  }
} as const;

export const BUSINESS_INFO = {
  name: "ASP ELECTRICAL SERVICES",
  phone: "+61403558214",
  address: "Southern Cross Ave, Middleton Grange NSW 2171",
  suburb: "Southern Cross Ave, Middleton Grange NSW 2171"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "ASP ELECTRICAL SERVICES",
  phone: {
    display: "0403 558 214",
    href: "tel:61403558214"
  },
  address: "Southern Cross Ave, Middleton Grange NSW 2171",
  suburb: "Southern Cross Ave, Middleton Grange NSW 2171",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;