// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "ActiVolt Electrical",
  PHONE: "+61451377666",
  ADDRESS: "17 Feldspar Rd, Eagle Vale NSW 2558",
  SUBURB: "17 Feldspar Rd, Eagle Vale NSW 2558",
  DESCRIPTION: "Professional electrical services for ActiVolt Electrical",
  CONTACT_INFO: {
    phone: "+61451377666",
    address: "17 Feldspar Rd, Eagle Vale NSW 2558",
    suburb: "17 Feldspar Rd, Eagle Vale NSW 2558"
  }
} as const;

export const BUSINESS_INFO = {
  name: "ActiVolt Electrical",
  phone: "+61451377666",
  address: "17 Feldspar Rd, Eagle Vale NSW 2558",
  suburb: "17 Feldspar Rd, Eagle Vale NSW 2558"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "ActiVolt Electrical",
  phone: {
    display: "0451 377 666",
    href: "tel:61451377666"
  },
  address: "17 Feldspar Rd, Eagle Vale NSW 2558",
  suburb: "17 Feldspar Rd, Eagle Vale NSW 2558",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;