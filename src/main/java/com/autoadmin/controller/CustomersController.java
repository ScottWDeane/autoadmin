package com.autoadmin.controller;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.DTO.VehicleDTO;
import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Vehicle;
import com.autoadmin.repository.CustomerRepository;
import com.autoadmin.repository.VehicleRepository;
import com.autoadmin.service.CustomerService;
import com.autoadmin.service.CustomerVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomersController {

    @Autowired
    private ApplicationContext context;

    private final CustomerRepository customerRepository;

    private final VehicleRepository vehicleRepository;

    private final CustomerVehicleService customerVehicleService;

    private CustomerService customerService;

    @Autowired
    public CustomersController(CustomerRepository customerRepository, VehicleRepository vehicleRepository, CustomerVehicleService customerVehicleService, CustomerService customerService) {
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
        this.customerVehicleService = customerVehicleService;
        this.customerService = customerService;
    }

    @GetMapping("/getall")
    public Iterable<CustomerDTO> getAllCustomersWithVehicles() {
        return customerService.findAllCustomers();
    }

    @PostMapping("/add")
    public ResponseEntity<String> createNewCustomerWithoutVehicles(@RequestBody CustomerDTO customer) {
        try {
            customerService.saveCustomer(customer);
            return ResponseEntity.ok("Customer added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add customer: " + e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    public String deleteCustomerById(@PathVariable("id") Long customerID) {
        try {
            customerVehicleService.deleteCustomerAndVehicles(customerID);
            return String.valueOf(new ResponseEntity<>("Customer deleted successfully", HttpStatus.OK));
        } catch (Exception e) {
            return String.valueOf(new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateCustomer(@RequestBody Customer customer) {
        try {
            customerRepository.save(customer);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update customer: " + customer.getFirstName() + " " + customer.getLastName() + " | " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{customerId}/vehicles")
    public ResponseEntity<String> addVehicleToCustomer(@PathVariable long customerId, @RequestBody Vehicle vehicle) {
        try {
            Customer customer = customerRepository.findById(customerId).orElse(null);
            if (customer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
            }
            vehicle.setCustomer(customer);
            vehicleRepository.save(vehicle);
            return ResponseEntity.ok("Vehicle added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add vehicle: " + e.getMessage());
        }
    }

    @PutMapping("/vehicles")
    public ResponseEntity<String> updateSingleVehicleForCustomer(@RequestBody Vehicle vehicle) {
        try {
            long customerId = customerVehicleService.getCustomerIdByVehicleId(vehicle.getId());
            Customer customer = customerRepository.findById(customerId).orElse(null);
            if (customer == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Owning customer not found");
            }
            vehicle.setCustomer(customer);
            vehicleRepository.save(vehicle);
            return ResponseEntity.ok("Vehicle updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("vehicles/{id}")
    public String deleteVehicleById(@PathVariable("id") Long vehicleId) {
        try {
            vehicleRepository.deleteById(vehicleId);
            return String.valueOf(new ResponseEntity<>("Vehicle deleted successfully", HttpStatus.OK));
        } catch (Exception e) {
            return String.valueOf(new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

}
