// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "CLT Electrical",
  PHONE: "+61457800087",
  ADDRESS: "12 Aberfoyle Pl, Grasmere NSW 2570",
  SUBURB: "12 Aberfoyle Pl, Grasmere NSW 2570",
  DESCRIPTION: "Professional electrical services for CLT Electrical",
  CONTACT_INFO: {
    phone: "+61457800087",
    address: "12 Aberfoyle Pl, Grasmere NSW 2570",
    suburb: "12 Aberfoyle Pl, Grasmere NSW 2570"
  }
} as const;

export const BUSINESS_INFO = {
  name: "CLT Electrical",
  phone: "+61457800087",
  address: "12 Aberfoyle Pl, Grasmere NSW 2570",
  suburb: "12 Aberfoyle Pl, Grasmere NSW 2570"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "CLT Electrical",
  phone: {
    display: "0457 800 087",
    href: "tel:61457800087"
  },
  address: "12 Aberfoyle Pl, Grasmere NSW 2570",
  suburb: "12 Aberfoyle Pl, Grasmere NSW 2570",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;