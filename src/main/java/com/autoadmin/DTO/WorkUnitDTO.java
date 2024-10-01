package com.autoadmin.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WorkUnitDTO {
    private Long id;
    private String description;
    private String status;
    private double cost;
    private String dateStarted;
    private String dateCompleted;
    private List<WorkUnitPartDTO> workUnitParts;
//    private Long repairOrderID;

}
