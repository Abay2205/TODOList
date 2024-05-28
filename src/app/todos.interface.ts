export interface Todo {
  id: number;
  textArea?: string | null;
  createdAt: Date | string;
  date: Date | string | null;
  dateShow?: string;
  remainingTime?: string | null;
  createdAtShow?: string;
  favorite?: boolean;
}
