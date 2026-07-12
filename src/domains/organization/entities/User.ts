import type { UserId } from "@/domains/shared/types/ids";

export interface User {
  id: UserId;
  name: string;
  email: string;
}
