package com.autoadmin.service;

import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Part;
import com.autoadmin.entity.Vehicle;
import com.autoadmin.repository.PartRepository;
import com.autoadmin.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {
    private VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<Vehicle> findAll() {
        return (List<Vehicle>) vehicleRepository.findAll();
    }
    public List<Vehicle> listAll(Long vehicleID){
        if(vehicleID !=null){
            return vehicleRepository.search(vehicleID);
        }
        return (List<Vehicle>) vehicleRepository.findAll();
    }
    @Override
    public Vehicle findById(int theId) {
        Long theIdl=(long)theId;
        Optional<Vehicle> result = vehicleRepository.findById(theIdl);

        Vehicle theVehicle = null;

        if (result.isPresent()) {
            theVehicle = result.get();
        }
        else {
            throw new RuntimeException("Did not find vehicle id - " + theId);
        }

        return theVehicle;
    }

    @Override
    public void save(Vehicle theVehicle) {
        vehicleRepository.save(theVehicle);

    }

    @Override
    public void deleteById(int theId) {
        Long theIdl=(long)theId;
        vehicleRepository.deleteById(theIdl);
    }

    @Override
    public List<Vehicle> listAllVehicles(String keyword) {
        return null;
    }
}
