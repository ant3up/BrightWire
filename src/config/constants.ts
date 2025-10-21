// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Daddy Electrician",
  PHONE: "61469567377",
  ADDRESS: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
  SUBURB: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
  DESCRIPTION: "Professional electrical services for Daddy Electrician",
  CONTACT_INFO: {
    phone: "61469567377",
    address: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
    suburb: "3/289 Pennant Hills Rd, Carlingford NSW 2118"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Daddy Electrician",
  phone: "61469567377",
  address: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
  suburb: "3/289 Pennant Hills Rd, Carlingford NSW 2118"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Daddy Electrician",
  phone: {
    display: "61469567377",
    href: "tel:61469567377"
  },
  address: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
  suburb: "3/289 Pennant Hills Rd, Carlingford NSW 2118",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;