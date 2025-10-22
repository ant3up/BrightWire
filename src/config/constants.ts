// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "C.Lewis Electrical Services",
  PHONE: "+61403968312",
  ADDRESS: "276 Woronora Rd, Engadine NSW 2233",
  SUBURB: "276 Woronora Rd, Engadine NSW 2233",
  DESCRIPTION: "Professional electrical services for C.Lewis Electrical Services",
  CONTACT_INFO: {
    phone: "+61403968312",
    address: "276 Woronora Rd, Engadine NSW 2233",
    suburb: "276 Woronora Rd, Engadine NSW 2233"
  }
} as const;

export const BUSINESS_INFO = {
  name: "C.Lewis Electrical Services",
  phone: "+61403968312",
  address: "276 Woronora Rd, Engadine NSW 2233",
  suburb: "276 Woronora Rd, Engadine NSW 2233"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "C.Lewis Electrical Services",
  phone: {
    display: "0403 968 312",
    href: "tel:61403968312"
  },
  address: "276 Woronora Rd, Engadine NSW 2233",
  suburb: "276 Woronora Rd, Engadine NSW 2233",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;