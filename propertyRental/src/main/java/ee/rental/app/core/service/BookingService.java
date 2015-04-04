package ee.rental.app.core.service;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.BookedDaysWrapper;

public interface BookingService {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(String string);
	public List<BookedDaysWrapper> findBookedDaysPerMonthsInYearByProp(Integer year, Long propertyId);
	public List<Booking> findBookingsByProperty(Long propertyId);
	public List<BookingStatus> findBookingStatuses();
	public boolean updateBookingStatus(Long bookingId, Long statusId);
}
