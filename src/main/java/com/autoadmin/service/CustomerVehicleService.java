package com.autoadmin.service;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.DTO.VehicleDTO;
import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Vehicle;
import com.autoadmin.mapper.CustomerMapper;
import com.autoadmin.mapper.VehicleMapper;
import com.autoadmin.repository.CustomerRepository;
import com.autoadmin.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerVehicleService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Transactional
    public void createCustomerWithVehicles(CustomerDTO customerDTO, List<VehicleDTO> vehicleDTOs) {
        Customer customer = CustomerMapper.toEntity(customerDTO);

        List<Vehicle> vehicles = vehicleDTOs.stream()
                .map(vehicleDTO -> {
                    Vehicle vehicle = VehicleMapper.toEntity(vehicleDTO);
                    vehicle.setCustomer(customer);
                    return vehicle;
                })
                .toList();

        customerRepository.save(customer);
        vehicleRepository.saveAll(vehicles);
    }

    @Transactional
    public void deleteCustomerAndVehicles(long customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer != null) {
            // delete vehicles first (if they exist)
            if (customer.getVehicles() != null && !customer.getVehicles().isEmpty()) {
                for (Vehicle vehicle : customer.getVehicles()) {
                    vehicleRepository.delete(vehicle);
                }
            }
            customerRepository.delete(customer);
        }
    }

    @Transactional
    public List<Vehicle> getVehiclesByCustomerId(Long customerId) {
        return vehicleRepository.findVehiclesByCustomerId(customerId);
    }

    @Transactional
    public long getCustomerIdByVehicleId(long vehicleId) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        return optionalVehicle.map(vehicle -> vehicle.getCustomer().getId()).orElse(null);
    }

}
