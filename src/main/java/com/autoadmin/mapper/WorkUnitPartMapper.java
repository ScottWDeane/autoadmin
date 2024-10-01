package com.autoadmin.mapper;

import com.autoadmin.DTO.WorkUnitPartDTO;
import com.autoadmin.entity.Part;
import com.autoadmin.entity.WorkUnit;
import com.autoadmin.entity.WorkUnitPart;


public class WorkUnitPartMapper {
    public static WorkUnitPart toEntity(WorkUnitPartDTO workUnitPartDTO) {
        WorkUnitPart workUnitPart = new WorkUnitPart();
        workUnitPart.setId(workUnitPartDTO.getId());
        workUnitPart.setQuantity(workUnitPartDTO.getQuantity());

        // just set the work unit's ID, we can fill it the rest of the WU out later if/when we need to.
        WorkUnit minimalWorkUnit = new WorkUnit();
        minimalWorkUnit.setId(workUnitPartDTO.getWorkUnitID());
        workUnitPart.setWorkUnit(minimalWorkUnit);

        // just set the part's ID, we can fill the rest of the Part later if we need it
        Part minimalPart = new Part();
        minimalPart.setId(workUnitPartDTO.getPartID());
        workUnitPart.setPart(minimalPart);

        return workUnitPart;
    }

    public static WorkUnitPartDTO toDTO(WorkUnitPart workUnitPart) {
        WorkUnitPartDTO workUnitPartDTO = new WorkUnitPartDTO();
        workUnitPartDTO.setId(workUnitPart.getId());
        workUnitPartDTO.setQuantity(workUnitPart.getQuantity());
        workUnitPartDTO.setWorkUnitID(workUnitPart.getWorkUnit().getId());
        workUnitPartDTO.setPartID(workUnitPart.getPart().getId());
        return workUnitPartDTO;
    }
}
