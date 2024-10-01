package com.autoadmin.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "RepairOrders")
public class RepairOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

//    @JsonManagedReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonManagedReference
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private String status;

//    @JsonManagedReference
    @OneToMany(mappedBy = "repairOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkUnit> workUnits;

    public RepairOrder() {}

    public RepairOrder(Customer customer, Vehicle vehicle, String status) {
        this.customer = customer;
        this.vehicle = vehicle;
        this.status = status;
    }

    public void addWorkUnit(WorkUnit workUnit) {
        workUnits.add(workUnit);
        workUnit.setRepairOrder(this);
    }

    public void removeWorkUnit(WorkUnit workUnit) {
        workUnits.remove(workUnit);
        workUnit.setRepairOrder(null);
    }


    public void updateRepairOrderStatus() {
        if(workUnits == null || workUnits.isEmpty()) {
            this.status = "Not Started";
            return;
        }
        boolean allWUNotStarted = true;
        boolean anyInProgress = false;
        boolean allComplete = true;

        for (WorkUnit wu : workUnits) {
            String wuStatus = wu.getStatus();
            if(!wuStatus.equals("Not Started")) {
                allWUNotStarted = false;
            }
            if (wuStatus.equals("In Progress")) {
                anyInProgress = true;
            }
            if (!wuStatus.equals("Completed")) {
                allComplete = false;
            }
        }

        if (allWUNotStarted) {
            this.status = "Not Started";
        } else if (anyInProgress) {
            this.status = "In Progress";
        } else if (allComplete) {
            this.status = "Completed";
        }
    }
}