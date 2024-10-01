package com.autoadmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "Parts")
public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @Column(unique = true)
    String name;

    double price;

    String description;

    int totalCount;

    int reservedCount;

    int availableCount;

    @OneToMany(mappedBy = "part")
    private Set<WorkUnitPart> workUnitParts;

    public Part() {}

    public Part(String name, String description, double price, int totalCount, int reservedCount, int availableCount) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.totalCount = totalCount;
        this.reservedCount = reservedCount;
        this.availableCount = availableCount;
    }

    public Part(long id, String name, String description, double price, int totalCount, int reservedCount, int availableCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.totalCount = totalCount;
        this.reservedCount = reservedCount;
        this.availableCount = availableCount;
    }

    public void updateReservedCount() {
        this.reservedCount = workUnitParts.stream()
                .filter(part -> !"Completed".equals(part.getWorkUnit().getStatus()))
                .mapToInt(WorkUnitPart::getQuantity)
                .sum();
        this.availableCount = totalCount - reservedCount;
    }

    public void finalizeQuantitiesForSpecificWorkUnit(Long wuID) {
        int amtToSubtractFromTotalCount = 0;
        for (WorkUnitPart wup : workUnitParts) {
            if(wup.getWorkUnit().getId() == wuID) {
                amtToSubtractFromTotalCount += wup.getQuantity();
            }
        }
        this.totalCount = totalCount - amtToSubtractFromTotalCount;
    }

    public void addWorkUnitPartToPart(WorkUnitPart wup) {
        this.workUnitParts.add(wup);
    }
    public void removeWorkUnitPartFromPart(WorkUnitPart wup) {
        this.workUnitParts.remove(wup);
    }

}
