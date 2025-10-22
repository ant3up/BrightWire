// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Behr - HVAC & Electrical",
  PHONE: "+61296833412",
  ADDRESS: "179 Tizzana Rd, Ebenezer NSW 2756",
  SUBURB: "179 Tizzana Rd, Ebenezer NSW 2756",
  DESCRIPTION: "Professional electrical services for Behr - HVAC & Electrical",
  CONTACT_INFO: {
    phone: "+61296833412",
    address: "179 Tizzana Rd, Ebenezer NSW 2756",
    suburb: "179 Tizzana Rd, Ebenezer NSW 2756"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Behr - HVAC & Electrical",
  phone: "+61296833412",
  address: "179 Tizzana Rd, Ebenezer NSW 2756",
  suburb: "179 Tizzana Rd, Ebenezer NSW 2756"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Behr - HVAC & Electrical",
  phone: {
    display: "+61296833412",
    href: "tel:61296833412"
  },
  address: "179 Tizzana Rd, Ebenezer NSW 2756",
  suburb: "179 Tizzana Rd, Ebenezer NSW 2756",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;