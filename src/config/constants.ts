// Site configuration constants
export const SITE_CONFIG = {
  BUSINESS_NAME: "Blue Mountains Auto Electrical Pty Ltd",
  PHONE: "+61247824880",
  ADDRESS: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
  SUBURB: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
  DESCRIPTION: "Professional electrical services for Blue Mountains Auto Electrical Pty Ltd",
  CONTACT_INFO: {
    phone: "+61247824880",
    address: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
    suburb: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780"
  }
} as const;

export const BUSINESS_INFO = {
  name: "Blue Mountains Auto Electrical Pty Ltd",
  phone: "+61247824880",
  address: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
  suburb: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780"
} as const;

// Export for existing code compatibility
export const COMPANY_INFO = {
  name: "Blue Mountains Auto Electrical Pty Ltd",
  phone: {
    display: "+61247824880",
    href: "tel:61247824880"
  },
  address: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
  suburb: "Unit 1/62 Woodlands Rd, Katoomba NSW 2780",
  hours: {
    weekdays: "Mon-Fri: 7:00 AM - 6:00 PM",
    weekends: "Sat-Sun: 8:00 AM - 4:00 PM"
  }
} as const;