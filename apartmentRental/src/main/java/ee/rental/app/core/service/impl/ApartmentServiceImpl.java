package ee.rental.app.core.service.impl;

import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.ApartmentQueryWrapper;
import ee.rental.app.core.repository.ApartmentRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.ApartmentService;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.controller.ApartmentController;

@Service
@Transactional
public class ApartmentServiceImpl implements ApartmentService{
	private static final Logger logger = LoggerFactory.getLogger(ApartmentController.class);
	@Autowired
	private ApartmentRepo apartmentRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	public Apartment createApartment(Apartment apartment) {
		UserAccount account = userAccountRepo.findUserAccount(apartment.getOwner().getId());
		if(account == null)
			throw new UserAccountNotFoundException();
		return apartmentRepo.createApartment(apartment);
	}

	public List<Apartment> findAllApartments() {
		return apartmentRepo.findAllApartments();
	}

	public Apartment findApartment(Long id) {
		return apartmentRepo.findApartment(id);
	}
	
	public List<Apartment> findApartmentsByAccount(Long accountId) {
		return apartmentRepo.findApartmentsByAccount(accountId);
	}
	
	public List<Apartment> queryApartments(ApartmentQueryWrapper query) {
		if(!query.getLocality().equals("")){
			return apartmentRepo.queryApartmentsByCity(query);
		}else{
			return apartmentRepo.queryApartmentsByCountry(query);
		}
	}

}
