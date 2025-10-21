// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Daluxe Electrical",
  PHONE: "61422406679",
  ADDRESS: "4 Hamilton Pl, Narellan NSW 2567",
  SUBURB: "4 Hamilton Pl, Narellan NSW 2567",
  DESCRIPTION: "Professional electrical services for Daluxe Electrical",
  CONTACT_INFO: {
    phone: "61422406679",
    address: "4 Hamilton Pl, Narellan NSW 2567",
    suburb: "4 Hamilton Pl, Narellan NSW 2567"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Daluxe Electrical",
  phone: "61422406679",
  address: "4 Hamilton Pl, Narellan NSW 2567",
  suburb: "4 Hamilton Pl, Narellan NSW 2567"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Daluxe Electrical",
  phone: {
    display: "61422406679",
    href: "tel:61422406679"
  },
  address: "4 Hamilton Pl, Narellan NSW 2567",
  suburb: "4 Hamilton Pl, Narellan NSW 2567",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;