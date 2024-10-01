package com.autoadmin.DTO;

import com.autoadmin.entity.Part;
import com.autoadmin.entity.WorkUnit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkUnitPartDTO {

    private Long id;

    private Long workUnitID;

    private Long partID;

    private int quantity;

}
