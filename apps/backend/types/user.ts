export type Role = "admin" | "inventory_owner" | "inventory_manager";

export interface User {
  id: number;
  email: string;
  role: Role;
}
