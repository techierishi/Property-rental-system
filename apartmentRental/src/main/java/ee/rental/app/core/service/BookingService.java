package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Booking;

public interface BookingService {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(Long accountId);
}