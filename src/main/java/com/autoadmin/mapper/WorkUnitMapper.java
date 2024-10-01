package com.autoadmin.mapper;

import com.autoadmin.DTO.WorkUnitDTO;
import com.autoadmin.DTO.WorkUnitPartDTO;
import com.autoadmin.entity.Part;
import com.autoadmin.entity.WorkUnit;
import com.autoadmin.entity.WorkUnitPart;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class WorkUnitMapper {

    public static WorkUnit toEntity(WorkUnitDTO workUnitDTO) {
        WorkUnit workUnit = new WorkUnit();
        workUnit.setId(workUnitDTO.getId());
        workUnit.setDescription(workUnitDTO.getDescription());
        workUnit.setStatus(workUnitDTO.getStatus());
        workUnit.setCost(workUnitDTO.getCost());
        workUnit.setDateStarted(workUnitDTO.getDateStarted());
        workUnit.setDateCompleted(workUnitDTO.getDateCompleted());

        if(workUnitDTO.getWorkUnitParts() != null) {
            List<WorkUnitPart> wups = new ArrayList<>();
            List<WorkUnitPartDTO> wupDTOs = workUnitDTO.getWorkUnitParts();
            for(WorkUnitPartDTO wupDTO : wupDTOs) {
                wups.add(WorkUnitPartMapper.toEntity(wupDTO));
            }
        }
        return workUnit;
    }

    public static WorkUnitDTO toDTO(WorkUnit workUnit) {
        WorkUnitDTO workUnitDTO = new WorkUnitDTO();
        workUnitDTO.setId(workUnit.getId());
        workUnitDTO.setDescription(workUnit.getDescription());
        workUnitDTO.setStatus(workUnit.getStatus());
        workUnitDTO.setCost(workUnit.getCost());
        workUnitDTO.setDateStarted(workUnit.getDateStarted());
        workUnitDTO.setDateCompleted(workUnit.getDateCompleted());

        List<WorkUnitPartDTO> wupDTOs = new ArrayList<>();
        List<WorkUnitPart> wups = workUnit.getWorkUnitParts();
        for(WorkUnitPart wup : wups) {
            wupDTOs.add(WorkUnitPartMapper.toDTO(wup));
        }
        workUnitDTO.setWorkUnitParts(wupDTOs);
//        workUnitDTO.setRepairOrderID(workUnit.getRepairOrder().getId());
        return workUnitDTO;
    }
}
