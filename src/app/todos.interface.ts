import {DateTime} from "luxon";

export interface Todo {
  id: number;
  textArea?: string | null;
  createdAt: Date | string;
 // dateTime?: string;
  Date: Date | null | string
}
