export interface CreateServiceDTO {
    name: string;
    description: string;
    price: number;
    duration: number;
    currency: string;
    categoryId: string;
    requiresPreparation: boolean;
    preparationTime: number;
    maxBookingsPerDay: number;
    maxAdvanceBooking: number;
    bufferTime: number; 
    isActive: boolean;
}