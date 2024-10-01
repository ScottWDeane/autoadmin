package com.autoadmin.DTO;

import com.autoadmin.entity.WorkUnitPart;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PartDTO {

    private long id;
    private String name;
    private double price;
    private String description;
    private int totalCount;
    private int reservedCount;
    private int availableCount;
    private List<WorkUnitPartDTO> workUnitParts;

//    public long getId() {
//        return id;
//    }
//
//    public void setId(long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public double getPrice() {
//        return price;
//    }
//
//    public void setPrice(double price) {
//        this.price = price;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public int getTotalCount() {
//        return totalCount;
//    }
//
//    public void setTotalCount(int totalCount) {
//        this.totalCount = totalCount;
//    }
//
//    public int getReservedCount() {
//        return reservedCount;
//    }
//
//    public void setReservedCount(int reservedCount) {
//        this.reservedCount = reservedCount;
//    }
//
//    public int getAvailableCount() {
//        return availableCount;
//    }
//
//    public void setAvailableCount(int availableCount) {
//        this.availableCount = availableCount;
//    }
//
//    public List<WorkUnitPartDTO> getWorkUnitParts() {
//        return workUnitParts;
//    }
//
//    public void setWorkUnitParts(List<WorkUnitPartDTO> workUnitParts) {
//        this.workUnitParts = workUnitParts;
//    }
}
