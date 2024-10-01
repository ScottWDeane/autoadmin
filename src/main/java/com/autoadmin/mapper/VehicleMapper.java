package com.autoadmin.mapper;

import com.autoadmin.DTO.VehicleDTO;
import com.autoadmin.entity.Vehicle;

public class VehicleMapper {
    public static VehicleDTO toDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setColor(vehicle.getColor());
        dto.setYear(vehicle.getYear());
        dto.setMake(vehicle.getMake());
        dto.setModel(vehicle.getModel());
        dto.setVin(vehicle.getVin());
        return dto;
    }

    public static Vehicle toEntity(VehicleDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(dto.getId());
        vehicle.setColor(dto.getColor());
        vehicle.setYear(dto.getYear());
        vehicle.setMake(dto.getMake());
        vehicle.setModel(dto.getModel());
        vehicle.setVin(dto.getVin());
        return vehicle;
    }
}
