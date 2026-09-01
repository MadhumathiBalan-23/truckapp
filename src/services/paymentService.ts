import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types/booking';

export const paymentService = {
  processPayment: async (bookingId: string, method: Booking['paymentMethod'], amount: number): Promise<boolean> => {
    // Process mock transaction
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Random status simulator (95% success rate for mock)
    const isSuccess = Math.random() < 0.95;
    
    if (isSuccess) {
      await useBookingStore.getState().completePayment(bookingId, method);
      return true;
    }
    return false;
  }
};
