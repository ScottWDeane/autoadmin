package com.autoadmin.controller;

import com.autoadmin.DTO.RepairOrderDTO;
import com.autoadmin.entity.*;
import com.autoadmin.mapper.RepairOrderMapper;
import com.autoadmin.repository.PartRepository;
import com.autoadmin.repository.RepairOrderRepository;
import com.autoadmin.repository.WorkUnitPartRepository;
import com.autoadmin.repository.WorkUnitRepository;
import com.autoadmin.service.RepairOrderService;
import com.autoadmin.service.WorkUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/repairorders")
public class RepairOrderController {

    @Autowired
    private RepairOrderService repairOrderService;

    @Autowired
    private RepairOrderRepository repairOrderRepository;

    @Autowired
    private WorkUnitRepository workUnitRepository;

    @Autowired
    private WorkUnitPartRepository workUnitPartRepository;

    @Autowired
    private WorkUnitService workUnitService;

    @Autowired
    private PartRepository partRepository;


    @GetMapping("getall")
    public Iterable<RepairOrderDTO> getAllRepairOrdersWithDetails() {
        List<RepairOrderDTO> allROs = repairOrderService.getAllRepairOrders();
        return allROs;
    }

    @GetMapping("getRO/{roID}")
    public RepairOrderDTO getSingleRepairOrderWithDetails(@PathVariable("roID") Long roID) {
        RepairOrder ro = repairOrderService.getRepairOrderById(roID);
        RepairOrderDTO roDTO = RepairOrderMapper.toDTO(ro);
        return roDTO;
    }

    @PutMapping("/wu/{wupID}/updatepart")
    public ResponseEntity<String> updatePartOnWorkUnit(@RequestBody Map<String, Object> request) {
        try {
            Long wupID = Long.parseLong(request.get("id").toString());
            Long partID = Long.parseLong(request.get("part_id").toString());
            Long wuID = Long.parseLong(request.get("workunit_id").toString());
            int quantityWanted = Integer.parseInt(request.get("quantity").toString());

            workUnitService.removePartFromWorkUnit(wuID, partID);
            workUnitService.addPartToWorkUnit(wuID, partID, quantityWanted);
            return ResponseEntity.ok("Part updated on Work Unit successfully. Updated part reserved and available count.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add part to work unit: " + e.getMessage());
        }
    }

    @PostMapping("/wu/{workunitID}/part")
    public ResponseEntity<String> addPartToWorkUnit(@RequestBody Map<String, Object> request) {
        try {
            Long partID = Long.parseLong(request.get("part_id").toString());
            int quantityWanted = Integer.parseInt(request.get("quantity").toString());
            Long wuID = Long.parseLong(request.get("workunit_id").toString());

            workUnitService.addPartToWorkUnit(wuID, partID, quantityWanted);
            return ResponseEntity.ok("Part added to Work Unit successfully. Updated part reserved and available count.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add part to work unit: " + e.getMessage());
        }
    }

    @DeleteMapping("/wu/{workUnitId}/part/{partId}")
    public ResponseEntity<String> deletePartFromWorkUnit(@PathVariable long workUnitId, @PathVariable long partId) {
        try {
            workUnitService.removePartFromWorkUnit(workUnitId, partId);
            return ResponseEntity.status(HttpStatus.OK).body("Work Unit deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Work Unit: " + e.getMessage());
        }
    }

    @PostMapping("/ro/{roID}/addwu")
    public ResponseEntity<String> addWorkUnitToRepairOrder(@PathVariable long roID, @RequestBody WorkUnit workUnit) {
        try {
            RepairOrder ro = repairOrderService.getRepairOrderById(roID);
            if (ro == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Repair Order not found");
            }
            workUnit.setStatus("Not Started"); // all new Work Units start off as "Not Started"
            workUnit.setRepairOrder(ro);
            workUnitRepository.save(workUnit);
            ro.updateRepairOrderStatus();
            repairOrderRepository.save(ro);
            return ResponseEntity.ok("Work Unit added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add Work Unit: " + e.getMessage());
        }
    }

    @PutMapping("wu")
    public ResponseEntity<?> updateWorkUnit(@RequestBody WorkUnit updatedWU) {
        try {
            WorkUnit oldWU = workUnitService.getWorkUnitById(updatedWU.getId());
            RepairOrder ro = repairOrderService.getRepairOrderById(oldWU.getRepairOrder().getId());
            updatedWU.setRepairOrder(oldWU.getRepairOrder());
            List<WorkUnitPart> existingWorkUnitParts = oldWU.getWorkUnitParts();

            // check status: if we're finalizing a Work Unit, we need to resolve all the associated parts THEN save those parts...
            if (oldWU.getStatus() != "Completed" && updatedWU.getStatus().equalsIgnoreCase("Completed")) {
                // since we're finalizing a Work Unit, we need to now subtract all associated part's "Reserved" counts from that part's "Total Count" value
                for (WorkUnitPart wup : existingWorkUnitParts) {
                    wup.getPart().finalizeQuantitiesForSpecificWorkUnit(updatedWU.getId());
                }
            }

            updatedWU.setWorkUnitParts(existingWorkUnitParts);
            workUnitRepository.save(updatedWU);
            ro.updateRepairOrderStatus();
            repairOrderRepository.save(ro);
            //

            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update Work Unit: " + updatedWU.getId() + " " + updatedWU.getDescription() + " | " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("wu/{id}")
    public ResponseEntity<String> deleteWorkUnitById(@PathVariable("id") Long wuID) {
        try {
            WorkUnit wu = workUnitService.getWorkUnitById(wuID);
            RepairOrder ro = repairOrderService.getRepairOrderById(wu.getRepairOrder().getId());
            workUnitRepository.deleteById(wuID);
            ro.updateRepairOrderStatus();
            repairOrderRepository.save(ro);
            return ResponseEntity.status(HttpStatus.OK).body("Work Unit deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Work Unit: " + e.getMessage());
        }
    }

    @DeleteMapping("ro/{roID}")
    public String deleteRepairOrderByID(@PathVariable("roID") Long roID) {
        RepairOrder roEntity = repairOrderService.getRepairOrderById(roID);
        if (roEntity != null) {
            RepairOrderDTO roDTO = RepairOrderMapper.toDTO(roEntity);
            if (roDTO.getWorkUnits().size() == 0) {
                repairOrderService.deleteRepairOrder(roDTO.getId());
                return String.valueOf(new ResponseEntity<>("Repair Order deleted successfully", HttpStatus.OK));
            } else {
                return String.valueOf(new ResponseEntity<>("Repair Order cannot be deleted if it still has unresolved Work Units", HttpStatus.NOT_MODIFIED));
            }
        }
        return String.valueOf(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PostMapping("ro/add")
    public ResponseEntity<?> createRepairOrder(@RequestBody Map<String, Object> request) {
        try {
            Long customerID = Long.parseLong(request.get("customerID").toString());
            Long vehicleID = Long.parseLong(request.get("vehicleID").toString());
            repairOrderService.createRepairOrder(customerID, vehicleID, "Not Started");
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create Repair Order: " + request.get("customerID") + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
