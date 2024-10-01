package com.autoadmin.DTO;

import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Vehicle;
import com.autoadmin.entity.WorkUnit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class RepairOrderDTO {
    private Long id;
    private CustomerDTO customer;
    private VehicleDTO vehicle;
    private String status;
    private List<WorkUnitDTO> workUnits;

}
