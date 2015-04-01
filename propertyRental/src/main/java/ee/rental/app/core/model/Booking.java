package ee.rental.app.core.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="atbookingId")
public class Booking {
	@Id @GeneratedValue
	private Long id;
	@OneToOne
	@JsonIgnore
	private UserAccount userAccount;
	@OneToOne
	private Property property;
	@OneToOne
	private BookingStatus bookingStatus;
	@OneToOne
	private BookingPayed bookingPayed;
	private Date checkIn;
	private Date checkOut;
	private Integer guestNumber;
	private BigDecimal price;
	@Override
	public String toString() {
		return "Booking [id=" + id + ", userAccount=" + userAccount
				+ ", property=" + property + ", bookingStatus=" + bookingStatus
				+ ", bookingPayed=" + bookingPayed + ", checkIn=" + checkIn
				+ ", checkOut=" + checkOut + ", guestNumber=" + guestNumber
				+ "]";
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public Property getProperty() {
		return property;
	}
	public void setProperty(Property property) {
		this.property = property;
	}
	public Date getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(Date checkIn) {
		this.checkIn = checkIn;
	}
	public Date getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(Date checkOut) {
		this.checkOut = checkOut;
	}
	public Integer getGuestNumber() {
		return guestNumber;
	}
	public void setGuestNumber(Integer guestNumber) {
		this.guestNumber = guestNumber;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UserAccount getUserAccount() {
		return userAccount;
	}
	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}
	public BookingStatus getBookingStatus() {
		return bookingStatus;
	}
	public void setBookingStatus(BookingStatus bookingStatus) {
		this.bookingStatus = bookingStatus;
	}
	public BookingPayed getBookingPayed() {
		return bookingPayed;
	}
	public void setBookingPayed(BookingPayed bookingPayed) {
		this.bookingPayed = bookingPayed;
	}
}
