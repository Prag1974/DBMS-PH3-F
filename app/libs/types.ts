export interface EventFromDB {
  id: number;
  name: string;
  description: string | null;
  remainingTickets: number;
  maxAttendant: number;
  startDate: Date;
  endDate: Date;
  companyId: number;
  average_consider: number | null;
  consider_count: number;
}
export interface Expenditure {
  name: string;
  description: string;
  cost: number;
  purchaseDate: string | Date;
}

export interface Employee {
  id: number;
  name: string;
  description: string;
  age: number;
  gender: "M" | "F";
  dailySalary: number;
  phoneNumber: string;
}
export interface Ticket {
  name: string;
  price: string | number;
  description: string;
  ticketType:
    | "normal_ticket"
    | "vip_ticket"
    | "student_ticket"
    | "group_ticket"
    | "early_bird_ticket"
    | "free_ticket"
    | "ultimate_vip_ticket"
    | "family_ticket"
    | "standard_plus_ticket"
    | "booth_rental_ticket";
}

export interface Place {
  id: number;
  name: string;
  description: string;
}

export interface Event {
  description: string;
  endDate: any;
  startDate: any;
  name: string;
  maxAttendant: number;
}

export interface BodyInterface {
  companyId: number;
  employees: Employee[];
  event: Event;
  expenditures: Expenditure[];
  places: Place[];
  tickets: Ticket[];
}
export interface EventDetails {
  eventName: string;
  eventDescription: string;
  startDate: any;
  endDate: any;
  maxAttendant: number;
  remainingTickets: number;
  country: string;
  city: string;
  state: string;
  district: string;
  street: string;
  addressDescription: string;
  companyName: string;
  companyDescription: string;
  employees: { employeeName: string; employeeRole: string }[];
  reviews: {
    considererName: string;
    rating: number;
    comment: string;
    reviewDate: string;
  }[];
}
