export interface Transaction{
    id: string,
    product: string,
    price: number,
    reason: string,
    status: "pending" | "approved" | "rejected",
    timestamp: string;
}