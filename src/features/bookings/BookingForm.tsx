import { useActionState } from "react";
import type { Booking, NewBooking } from "./data/booking";
import type { FlightClass } from "../flights/data/flight";
import { createBooking } from "./data/bookings-api";
import { BookingList } from "./BookingList";
import { Button } from "../../ui/Button";

type BookingState = {
  bookings: Booking[];
  error: string | null;
};

type BookingFormProps = {
  flightId: number;
  initialBookings: Booking[];
};

export function BookingForm({ flightId, initialBookings }: BookingFormProps) {

   const [state, formAction, isPending] = useActionState (bookFlight, {
    bookings: initialBookings,
    error: null,
   })

   async function bookFlight(prev: BookingState, formData: FormData): Promise<BookingState> {
    const newBooking: NewBooking = {
      flightId,
      passenger: String(formData.get('passenger')),
      email: String(formData.get('email')),
      seats: Number(formData.get('seats')),
      flightClass: formData.get('flightClass') as FlightClass, // confiamos no <select> (por agora)
    };
    try {
      const booking = await createBooking(newBooking);
      return { bookings: [...prev.bookings, booking], error: null };
    } catch {
      return { ...prev, error: 'Could not book this flight. Please try again.' };
    }
  }

  return (
    <>
      <BookingList bookings={state.bookings} />
      <form className="booking" action={formAction}>
        <div className="field">
          <label htmlFor="passenger">Passenger</label>
          <input id="passenger" name="passenger" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="seats">Seats</label>
          <input id="seats" name="seats" type="number" min={1} max={9} defaultValue={1} />
        </div>
        <div className="field">
          <label htmlFor="flightClass">Class</label>
          <select id="flightClass" name="flightClass" defaultValue="economy">
            <option value="economy">economy</option>
            <option value="business">business</option>
            <option value="first">first</option>
          </select>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Booking…' : 'Book'}
        </Button>
        {state.error && <p className="form-error">{state.error}</p>}
      </form>
    </>
  );

}


