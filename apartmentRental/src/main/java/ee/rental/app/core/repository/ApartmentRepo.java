package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.Apartment;

public interface ApartmentRepo {
	public Apartment createApartment(Apartment apartment);
	public List<Apartment> findAllApartments();
	public Apartment findApartment(Long id);
	public List<Apartment> findApartmentsByAccount(Long accountId);
	public Apartment updateApartment(Apartment data);
}
