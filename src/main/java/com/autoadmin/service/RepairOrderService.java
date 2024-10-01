package com.autoadmin.service;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.DTO.RepairOrderDTO;
import com.autoadmin.DTO.VehicleDTO;
import com.autoadmin.entity.Customer;
import com.autoadmin.entity.RepairOrder;
import com.autoadmin.entity.Vehicle;
import com.autoadmin.entity.WorkUnit;
import com.autoadmin.mapper.CustomerMapper;
import com.autoadmin.mapper.RepairOrderMapper;
import com.autoadmin.mapper.VehicleMapper;
import com.autoadmin.repository.CustomerRepository;
import com.autoadmin.repository.RepairOrderRepository;
import com.autoadmin.repository.VehicleRepository;
import com.autoadmin.repository.WorkUnitRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class RepairOrderService {

    @Autowired
    private RepairOrderRepository repairOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private WorkUnitRepository workUnitRepository;

    public List<RepairOrderDTO> getAllRepairOrders() {
        Iterable<RepairOrder> ROs = repairOrderRepository.findAll();
        List<RepairOrderDTO> roDTOs = new ArrayList<>();
        for (RepairOrder ro : ROs) {
            roDTOs.add(RepairOrderMapper.toDTO(ro));
        }
        roDTOs.sort(Comparator.comparing(RepairOrderDTO::getId));
        return roDTOs;
    }

    public List<RepairOrder> getAllRepairOrdersWithDetails() {
        return repairOrderRepository.findAllWithDetails();
    }

    public RepairOrder getRepairOrderById(Long id) {
        return repairOrderRepository.findById(id).orElse(null);
    }

    @Transactional
    public void createRepairOrder(Long customerId, Long vehicleId, String status) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);

        if (customerOpt.isPresent() && vehicleOpt.isPresent()) {
            RepairOrder repairOrder = new RepairOrder(customerOpt.get(), vehicleOpt.get(), status);
            repairOrderRepository.save(repairOrder);
        }
    }

    @Transactional
    public RepairOrder addWorkUnitToRepairOrder(Long repairOrderId, WorkUnit workUnit) {
        Optional<RepairOrder> repairOrderOpt = repairOrderRepository.findById(repairOrderId);
        if (repairOrderOpt.isPresent()) {
            RepairOrder repairOrder = repairOrderOpt.get();
            repairOrder.addWorkUnit(workUnit);
            // TODO: update the status of the entire repair order?
            return repairOrderRepository.save(repairOrder);
        }
        return null;
    }

    @Transactional
    public RepairOrder removeWorkUnitFromRepairOrder(Long repairOrderId, Long workUnitId) {
        Optional<RepairOrder> repairOrderOpt = repairOrderRepository.findById(repairOrderId);
        Optional<WorkUnit> workUnitOpt = workUnitRepository.findById(workUnitId);

        if (repairOrderOpt.isPresent() && workUnitOpt.isPresent()) {
            RepairOrder repairOrder = repairOrderOpt.get();
            WorkUnit workUnit = workUnitOpt.get();
            repairOrder.removeWorkUnit(workUnit);
            // TODO: update the status of the entire repair order?
            return repairOrderRepository.save(repairOrder);
        }
        return null;
    }

    @Transactional
    public void deleteRepairOrder(Long id) {
        repairOrderRepository.deleteById(id);
    }
}
