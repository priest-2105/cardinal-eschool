export interface Transaction {
  id: number;
  transaction_ref: string;
  created_at: string;
  subscription_plan_name: string;
  amount: number;
  status: string;
  quantity: number;
}

export interface ApiTransaction {
  id: number;
  transaction_ref: string;
  created_at: string;
  subscription_plan_name: string;
  amount: string;
  status: string;
  quantity: number;
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseTransactionDate(dateString: string) {
  const monthIndex = MONTHS.findIndex((month) => dateString.startsWith(month));
  const year = Number.parseInt(dateString.match(/\d{4}/)?.[0] || "0");
  return { month: monthIndex, year };
}
