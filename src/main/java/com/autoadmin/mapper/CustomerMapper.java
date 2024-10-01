package com.autoadmin.mapper;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.entity.Customer;

import java.util.stream.Collectors;

public class CustomerMapper {
    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setAddress(customer.getAddress());
        dto.setContactNumber(customer.getContactNumber());
        dto.setVehicles(customer.getVehicles().stream().map(VehicleMapper::toDTO).collect(Collectors.toList()));
        // TODO: setRepairOrders
        return dto;
    }

    public static Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setAddress(dto.getAddress());
        customer.setContactNumber(dto.getContactNumber());
        customer.setVehicles(
                dto.getVehicles().
                        stream().
                        map(VehicleMapper::toEntity).
                        collect(Collectors.toList()));
        // TODO: setRepairOrders
        return customer;
    }
}
