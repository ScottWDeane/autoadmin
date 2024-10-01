package com.autoadmin.bootstrap;

import com.autoadmin.entity.*;
import com.autoadmin.repository.*;
import com.autoadmin.service.CustomerVehicleService;
import com.autoadmin.service.RepairOrderService;
import com.autoadmin.service.WorkUnitService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


public class BootStrapData implements CommandLineRunner {

    private final PartRepository partRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    private final WorkUnitRepository workUnitRepository;

    private final RepairOrderRepository repairOrderRepository;
    private final CustomerVehicleService customerVehicleService;
    private final RepairOrderService repairOrderService;

    private final WorkUnitPartRepository workUnitPartRepository;
    private final WorkUnitService workUnitService;

    public BootStrapData(PartRepository partRepository, CustomerRepository customerRepository, VehicleRepository vehicleRepository,
                         WorkUnitRepository workUnitRepository, RepairOrderRepository repairOrderRepository, CustomerVehicleService customerVehicleService, RepairOrderService repairOrderService, WorkUnitPartRepository workUnitPartRepository, WorkUnitService workUnitService) {
        this.partRepository = partRepository;
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
        this.workUnitRepository = workUnitRepository;
        this.repairOrderRepository = repairOrderRepository;
        this.customerVehicleService = customerVehicleService;
        this.repairOrderService = repairOrderService;
        this.workUnitPartRepository = workUnitPartRepository;
        this.workUnitService = workUnitService;
    }

    @Override
    public void run(String... args) throws Exception {

        repairOrderRepository.deleteAll();
        vehicleRepository.deleteAll();
        customerRepository.deleteAll();
        partRepository.deleteAll();
        workUnitRepository.deleteAll();
        workUnitPartRepository.deleteAll();

        // Add sample parts
        List<Part> bootstrapParts = Arrays.asList(
                new Part("Blinker Fluid", "", 19.99, 100, 0, 100),
                new Part("Flux Capacitor", "", 29.99, 90, 0, 90),
                new Part("Turbo Encabulator", "", 39.99, 80, 0, 80),
                new Part("Piston Return Spring", "", 49.99, 70, 0, 70),
                new Part("Exhaust Spark Arrestor", "", 59.99, 60, 0, 60),
                new Part("Muffler Bearing", "", 60.00, 50, 0, 50),
                new Part("Windshield Magnet", "", 79.99, 40, 0, 40),
                new Part("Electric Muffler", "", 89.99, 30, 0, 30),
                new Part("FLux Gate Capacitor", "", 99.99, 20, 0, 20),
                new Part("Friction Coefficient Adjuster", "", 249.99, 10, 0, 10),
                new Part("Left-handed Lug Nut", "", 499.99, 5, 0, 5),
                new Part("Radiator Hose Stretcher", "", 250.00, 15, 0, 15),
                new Part("Fuel Line Deionizer", "", 20.00, 25, 0, 25),
                new Part("Turbo Boost Stabilizer", "", 35.99, 35, 0, 35),
                new Part("Fuel Injector Vaporizer", "", 30.00, 45, 0, 45),
                new Part("Transmission Fluid Decontaminator", "", 50000.00, 55, 0, 55),
                new Part("Reverse Gear Lubricant", "", 8.00, 65, 0, 65),
                new Part("Spark Plug Adapter", "", 15.00, 75, 0, 75),
                new Part("Bluetooth Windshield Wipers", "", 3.00, 85, 0, 85)
        );
        partRepository.saveAll(bootstrapParts);

        System.out.println("Number of Parts: " + partRepository.count());
        partRepository.findAll().forEach(part -> {
            System.out.println("Part Name: { " + part.getName() + " }, Price: { $ " + part.getPrice() + " }, Number Available: { " + part.getAvailableCount() + " }");
        });

        // Add sample customers and vehicles
        if (customerRepository.count() < 3) {
            System.out.println("Not enough customers. Adding some sample customers.");

            List<Vehicle> vehicles1 = Arrays.asList(
                    new Vehicle("Red", 1993, "Toyota", "Camry", "VIN123456789"),
                    new Vehicle("Blue", 2008, "Honda", "Accord", "VIN987654321")
            );
            Customer customer1 = new Customer("John", "Doe", "123 Main St", "1112223333", vehicles1);
//            customerVehicleService.createCustomerWithVehicles(customer1, vehicles1);

            List<Vehicle> vehicles2 = Arrays.asList(
                    new Vehicle("Green", 2015, "Lexus", "ES350", "VIN234567890"),
                    new Vehicle("Yellow", 1989, "Hyundai", "Sonata", "VIN654321098")
            );
            Customer customer2 = new Customer("Sally", "Rose", "5th and 12th", "5556667777", vehicles2);
//            customerVehicleService.createCustomerWithVehicles(customer2, vehicles2);

            List<Vehicle> vehicles3 = Arrays.asList(
                    new Vehicle("Turquoise", 1999, "Ford", "F950", "VIN940F78DUA65744"),
                    new Vehicle("Violet", 1998, "BMW", "X4", "VIN5F4H53EB086583"),
                    new Vehicle("Rosegold", 2019, "Cadillac", "CT5", "VIN1S124X27211701")
            );
            Customer customer3 = new Customer("Emerald", "Stonehand", "456 East St", "7775553333", vehicles3);
//            customerVehicleService.createCustomerWithVehicles(customer3, vehicles3);
        } else {
            System.out.println("Sufficient customers in table, skipping the addition of sample customers.");
        }

        System.out.println("Number of Customers: " + customerRepository.count());
        customerRepository.findAll().forEach(customer -> {
            System.out.println("Customer First Name: { " + customer.getFirstName() + " }, " +
                    "Last Name: { " + customer.getLastName() + " }, " +
                    "Address: { " + customer.getAddress() + " }, " +
                    "Phone Contact Number: { " + customer.getContactNumber() + " }");
            vehicleRepository.findVehiclesByCustomerId(customer.getId()).forEach(vehicle -> {
                System.out.println("\tVehicle: " + vehicle.getColor() + ", " + vehicle.getModel() + ", " +
                        vehicle.getYear() + ", " + vehicle.getMake() + ", " + vehicle.getVin());
            });
        });

        // Add sample repair orders and work units
        if (repairOrderService.getAllRepairOrders().isEmpty()) {
            System.out.println("Not enough repair orders. Adding some sample repair orders.");

            List<Customer> customers = (List<Customer>) customerRepository.findAll();

            if (!customers.isEmpty()) {
                Customer customer1 = customers.get(0);
                Vehicle vehicle1 = vehicleRepository.findVehiclesByCustomerId(customer1.getId()).get(0);

                LocalDateTime currentDateTime = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

//                RepairOrder repairOrder1 = repairOrderService.createRepairOrder(customer1.getId(), vehicle1.getId(), "In Progress");

                WorkUnit workUnit1 = new WorkUnit("Oil Change", "In Progress", 500.00, currentDateTime.format(formatter), "");
                workUnit1.addPart(partRepository.findByName("Blinker Fluid"), 2);
                workUnit1.addPart(partRepository.findByName("Flux Capacitor"), 1);

                WorkUnit workUnit2 = new WorkUnit("Tire Rotation", "Not Started", 299.99, "", "");
                workUnit2.addPart(partRepository.findByName("Piston Return Spring"), 4);
                workUnit2.addPart(partRepository.findByName("Turbo Encabulator"), 1);

//                repairOrderService.addWorkUnitToRepairOrder(repairOrder1.getId(), workUnit1);
//                repairOrderService.addWorkUnitToRepairOrder(repairOrder1.getId(), workUnit2);

                System.out.println("Added Repair Order for customer: " + customer1.getFirstName() + " " + customer1.getLastName());

                // Add another repair order
                Customer customer2 = customers.get(1);
                Vehicle vehicle2 = vehicleRepository.findVehiclesByCustomerId(customer2.getId()).get(0);

//                RepairOrder repairOrder2 = repairOrderService.createRepairOrder(customer2.getId(), vehicle2.getId(), "Completed");

                WorkUnit workUnit3 = new WorkUnit("Tire Rotation", "Completed", 999.50, "2024-01-05 12:00:00", "2024-05-15 08:00:00");
                workUnit3.addPart(partRepository.findByName("Turbo Encabulator"), 2);
                workUnit3.addPart(partRepository.findByName("Piston Return Spring"), 4);

//                repairOrderService.addWorkUnitToRepairOrder(repairOrder2.getId(), workUnit3);

                System.out.println("Added Repair Order for customer: " + customer2.getFirstName() + " " + customer2.getLastName());
            }
        } else {
            System.out.println("Sufficient repair orders in table, skipping the addition of sample repair orders.");
        }

        System.out.println("Number of Repair Orders: " + repairOrderService.getAllRepairOrdersWithDetails().size());
        List<RepairOrder> allRepairOrders = repairOrderService.getAllRepairOrdersWithDetails();
        for (RepairOrder ro : allRepairOrders) {
            System.out.println("RO #: " + ro.getId());
            System.out.println("Customer first name: " + ro.getCustomer().getFirstName());
            System.out.println("Customer last name: " + ro.getCustomer().getLastName());

            System.out.println("Vehicle Color: " + ro.getVehicle().getColor());
            System.out.println("Vehicle Make: " + ro.getVehicle().getMake());
            System.out.println("Vehicle Model: " + ro.getVehicle().getModel());

            List<WorkUnit> associatedWorkUnits = ro.getWorkUnits();

            for (WorkUnit wu : associatedWorkUnits) {
                System.out.println("WU #: " + wu.getId());
                System.out.println("WU Description: " + wu.getDescription());
                System.out.println("WU Status: " + wu.getStatus());
                System.out.println("WU Parts: ");

                List<WorkUnitPart> wuParts = wu.getWorkUnitParts();
                for (WorkUnitPart wup : wuParts) {
                    System.out.println("Part Name: " + wup.getPart().getName());
                    System.out.println("Part Quantity for WU: " + wup.getQuantity());
                }
            }

        }
        updateReservedCountsForParts();

        System.out.println("Updated Parts Information:");
        partRepository.findAll().forEach(part -> {
            System.out.println("Part Name: { " + part.getName() + " }, " +
                    "Total Count: { " + part.getTotalCount() + " }, " +
                    "Reserved Count: { " + part.getReservedCount() + " }, " +
                    "Available Count: { " + part.getAvailableCount() + " }");
        });

    }

    private void updateReservedCountsForParts() {
        // Reset all reserved counts to 0
        partRepository.findAll().forEach(part -> {
            part.setReservedCount(0);
            part.setAvailableCount(part.getTotalCount()); // Reset available count
        });
        partRepository.saveAll(partRepository.findAll());

        // Calculate reserved counts based on current work units
        List<RepairOrder> allRepairOrders = repairOrderService.getAllRepairOrdersWithDetails();
        for (RepairOrder repairOrder : allRepairOrders) {
            for (WorkUnit workUnit : repairOrder.getWorkUnits()) {
                for (WorkUnitPart workUnitPart : workUnit.getWorkUnitParts()) {
                    Part part = workUnitPart.getPart();
                    part.setReservedCount(part.getReservedCount() + workUnitPart.getQuantity());
                    part.setAvailableCount(part.getTotalCount() - part.getReservedCount());
                    partRepository.save(part);
                }
            }
        }
    }
}
