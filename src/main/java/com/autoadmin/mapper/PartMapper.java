package com.autoadmin.mapper;

import com.autoadmin.DTO.PartDTO;
import com.autoadmin.DTO.WorkUnitPartDTO;
import com.autoadmin.entity.Part;
import com.autoadmin.entity.WorkUnitPart;

import java.util.stream.Collectors;

public class PartMapper {
    public static Part toEntity(PartDTO partDTO) {
        Part part = new Part();
        part.setId(partDTO.getId());
        part.setName(partDTO.getName());
        part.setPrice(partDTO.getPrice());
        part.setDescription(partDTO.getDescription());
        part.setTotalCount(partDTO.getTotalCount());
        part.setReservedCount(partDTO.getReservedCount());
        part.setAvailableCount(partDTO.getAvailableCount());
        if(partDTO.getWorkUnitParts() != null) {
            part.setWorkUnitParts(
                    partDTO.getWorkUnitParts().stream()
                            .map(WorkUnitPartMapper::toEntity)
                            .collect(Collectors.toSet())
            );
        }
        return part;
    }

    public static PartDTO toDTO(Part part) {
        PartDTO partDTO = new PartDTO();
        partDTO.setId(part.getId());
        partDTO.setName(part.getName());
        partDTO.setPrice(part.getPrice());
        partDTO.setDescription(part.getDescription());
        partDTO.setTotalCount(part.getTotalCount());
        partDTO.setReservedCount(part.getReservedCount());
        partDTO.setAvailableCount(part.getAvailableCount());
        partDTO.setWorkUnitParts(
                part.getWorkUnitParts().stream()
                        .map(WorkUnitPartMapper::toDTO)
                        .collect(Collectors.toList())
        );
        return partDTO;
    }
}