package com.autoadmin.mapper;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.DTO.RepairOrderDTO;
import com.autoadmin.entity.RepairOrder;

import java.util.stream.Collectors;

public class RepairOrderMapper {
    public static RepairOrderDTO toDTO(RepairOrder ro) {
        RepairOrderDTO roDTO = new RepairOrderDTO();
        roDTO.setId(ro.getId());
        roDTO.setStatus(ro.getStatus());
        roDTO.setCustomer(CustomerMapper.toDTO(ro.getCustomer()));
        roDTO.setVehicle(VehicleMapper.toDTO(ro.getVehicle()));
        roDTO.setWorkUnits(ro.getWorkUnits().stream().map(WorkUnitMapper::toDTO).collect(Collectors.toList()));
        return roDTO;
    }

    public static RepairOrder toEntity(RepairOrderDTO roDTO) {
        RepairOrder ro = new RepairOrder();
        ro.setId(roDTO.getId());
        ro.setStatus(roDTO.getStatus());
        ro.setCustomer(CustomerMapper.toEntity(roDTO.getCustomer()));
        ro.setVehicle(VehicleMapper.toEntity(roDTO.getVehicle()));
        ro.setWorkUnits(roDTO.getWorkUnits().stream().map(WorkUnitMapper::toEntity).collect(Collectors.toList()));
        return ro;
    }
}
