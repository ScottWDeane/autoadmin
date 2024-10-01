package com.autoadmin.repository;

import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Vehicle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleRepository extends CrudRepository<Vehicle, Long> {
    @Query("SELECT v FROM Vehicle v WHERE v.id = ?1")
    public List<Vehicle> search(long vehicleID);

    @Query("SELECT v FROM Vehicle v WHERE v.customer.id = :customerId")
    List<Vehicle> findVehiclesByCustomerId(@Param("customerId") Long customerId);


}
