package com.autoadmin.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "WorkUnits")
public class WorkUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String description;

    private String status;

    private double cost;

    private String dateStarted;

    private String dateCompleted;

    @OneToMany(mappedBy = "workUnit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkUnitPart> workUnitParts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id")
    private RepairOrder repairOrder;

    public WorkUnit() {}

    public WorkUnit(String description, String status, double cost, String dateStarted, String dateCompleted) {
        this.description = description;
        this.status = status;
        this.cost = cost;
        this.dateStarted = dateStarted;
        this.dateCompleted = dateCompleted;
    }

    public WorkUnit(long id, String description, String status, int cost, String dateStarted, String dateCompleted) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.cost = cost;
        this.dateStarted = dateStarted;
        this.dateCompleted = dateCompleted;
    }

    @Transactional
    public void addPart(Part part, int quantity) {
        WorkUnitPart workUnitPart = new WorkUnitPart(this, part, quantity);
        workUnitParts.add(workUnitPart);
    }

    public void removePart(Part part) {
        workUnitParts.removeIf(wup -> wup.getPart().equals(part));
    }

}