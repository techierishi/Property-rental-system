package ee.rental.app.core.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.repository.BookingRepo;
@Repository
public class BookingRepoImpl implements BookingRepo{

	@Autowired
	private SessionFactory sessionFactory;
	public Booking createBooking(Booking booking) {
		Session session = sessionFactory.getCurrentSession();
		session.persist(booking);
		session.flush();
		return booking;
	}

	public List<Booking> findAllBookings() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT b FROM Booking b");
		return query.list();
	}

	public Booking findBooking(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Booking booking = (Booking)session.get(Booking.class, id);
		session.flush();
		return  booking;
	}

	public List<Booking> findBookingsByAccount(String username) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.userAccount.username=:username ORDER BY id DESC");
		query.setParameter("username", username);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public BookingStatus findBookingStatusById(Long statusId) {
		Session session = sessionFactory.getCurrentSession();
		BookingStatus result = (BookingStatus) session.get(BookingStatus.class, statusId);
		session.flush();
		return result;
		
	}

	public List<Booking> findBookingsByYearAndProperty(Integer year,Long propertyId) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.property.id=:propertyId "
				+ "AND to_char(b.checkIn,'YYYY') = :year "
				+ "AND b.bookingStatus.name = 'Accepted'");
		query.setParameter("propertyId", propertyId);
		query.setParameter("year", year);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<Booking> findBookingsByProperty(Long propertyId) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.property.id=:propertyId");
		query.setParameter("propertyId", propertyId);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<BookingStatus> findBookingStatuses() {
		Session session =  sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT bs FROM BookingStatus bs");
		List<BookingStatus> result = (List<BookingStatus>) query.list();
		session.flush();
		return result;
	}

	public void updateBookingStatus(Booking booking, BookingStatus bookingStatus) {
		Session session =  sessionFactory.getCurrentSession();
		booking.setBookingStatus(bookingStatus);
		session.update(booking);
		session.flush();
	}


}
