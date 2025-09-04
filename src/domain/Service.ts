export type Service = {
    id: string,
    name: string,
    description: string,
    price: number,
    duration: number,
    currency: string,
    isActive: boolean,
    categoryId: number,
    category: string;
    requiresPreparation: boolean,
    preparationTime: number,
    maxBookingsPerDay: number,
    maxAdvanceBooking: number;
    bufferTime: number
}