package com.autoadmin.service;

import com.autoadmin.entity.Part;
import com.autoadmin.entity.WorkUnit;
import com.autoadmin.entity.WorkUnitPart;
import com.autoadmin.repository.PartRepository;
import com.autoadmin.repository.WorkUnitPartRepository;
import com.autoadmin.repository.WorkUnitRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkUnitService {

    @Autowired
    private WorkUnitRepository workUnitRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private WorkUnitPartRepository workUnitPartRepository;

    public List<WorkUnit> getAllWorkUnits() {
        return workUnitRepository.findAll();
    }

    public WorkUnit getWorkUnitById(Long id) {
        return workUnitRepository.findById(id).orElse(null);
    }

    public WorkUnit saveWorkUnit(WorkUnit workUnit) {
        return workUnitRepository.save(workUnit);
    }

    public WorkUnit updateWorkUnit(WorkUnit workUnit) {
        return workUnitRepository.save(workUnit);
    }

    public void deleteWorkUnit(Long id) {
        workUnitRepository.deleteById(id);
    }

    @Transactional
    public WorkUnit addPartToWorkUnit(Long workUnitId, Long partId, int quantity) {
        Optional<WorkUnit> workUnitOpt = workUnitRepository.findById(workUnitId);
        Optional<Part> partOpt = partRepository.findById(partId);

        if (workUnitOpt.isPresent() && partOpt.isPresent()) {
            WorkUnit workUnit = workUnitOpt.get();
            Part part = partOpt.get();
            WorkUnitPart workUnitPart = new WorkUnitPart(workUnit, part, quantity);
            workUnit.getWorkUnitParts().add(workUnitPart);
            part.addWorkUnitPartToPart(workUnitPart);
            part.updateReservedCount();
            partRepository.save(part);
            return workUnitRepository.save(workUnit);
        }
        return null;
    }

    @Transactional
    public WorkUnit removePartFromWorkUnit(Long workUnitId, Long partId) {
        Optional<WorkUnit> workUnitOpt = workUnitRepository.findById(workUnitId);
        Optional<Part> partOpt = partRepository.findById(partId);

        if (workUnitOpt.isPresent() && partOpt.isPresent()) {
            WorkUnit workUnit = workUnitOpt.get();
            Part part = partOpt.get();
            workUnit.getWorkUnitParts().removeIf(wup -> wup.getPart().equals(part));
            part.getWorkUnitParts().removeIf(wup -> wup.getPart().equals(part));
            part.updateReservedCount();
            partRepository.save(part);
            return workUnitRepository.save(workUnit);
        }
        return null;
    }
}