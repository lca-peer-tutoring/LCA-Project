export interface User {
  userId: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "admin";
  hasActiveRequest: boolean;
  // Add other fields as necessary
}
