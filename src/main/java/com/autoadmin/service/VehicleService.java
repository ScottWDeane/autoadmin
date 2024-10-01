package com.autoadmin.service;

import com.autoadmin.entity.Vehicle;

import java.util.List;

public interface VehicleService {
    public List<Vehicle> findAll();
    public Vehicle findById(int theId);
    public void save (Vehicle theVehicle);
    public void deleteById(int theId);
    public List<Vehicle> listAllVehicles(String keyword);
}
