package com.autoadmin.repository;

import com.autoadmin.entity.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends CrudRepository<Customer, Long> {

    @Query("SELECT c FROM Customer c WHERE c.id = ?1")
    List<Customer> search(long customerID);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.vehicles WHERE c.id = :customerId")
    Customer findByIdWithVehicles(@Param("customerId") Long customerId);

}
