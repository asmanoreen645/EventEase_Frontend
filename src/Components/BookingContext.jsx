// eslint-disable-next-line no-unused-vars
import { createContext, useContext, useCallback, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Step 0:  "Book Now" save vendor data
  const [vendor, setVendor] = useState(null);
  // { id, name, category, price, image }

  // Step 1: BookingDetails form data
  const [bookingDetails, setBookingDetails] = useState(null);
  // { bookingName, eventDate, eventType, city, guestCount, contact, notes }

  // Step 2: PackageSelection  selected package + extras
  const [selectedPackage, setSelectedPackage] = useState(null);
  // { packageName, basePrice, extras: [{ name, price }] }

  // Final total price (package + extras, or per-head x guests)
  const [totalPrice, setTotalPrice] = useState(0);

  const [bookingId, setBookingId] = useState(null);

  const value = {
  vendor,
  setVendor,
  bookingDetails,
  setBookingDetails,
  selectedPackage,
  setSelectedPackage,
  totalPrice,
  setTotalPrice,
  bookingId,
  setBookingId,
};

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook 
// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  return useContext(BookingContext);
}
