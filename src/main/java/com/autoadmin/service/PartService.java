package com.autoadmin.service;

import com.autoadmin.DTO.PartDTO;
import com.autoadmin.DTO.RepairOrderDTO;
import com.autoadmin.entity.Customer;
import com.autoadmin.entity.Part;
import com.autoadmin.mapper.PartMapper;
import com.autoadmin.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PartService {
    @Autowired
    PartRepository partRepository;

    public List<PartDTO> findAll() {
        Iterable<Part> parts = partRepository.findAll();
        List<PartDTO> partsDTOs = new ArrayList<>();
        for (Part part : parts) {
            partsDTOs.add(PartMapper.toDTO(part));
        }
        partsDTOs.sort(Comparator.comparing(PartDTO::getId));
        return partsDTOs;
    }

    public PartDTO getPartById(long partID) {
        Optional<Part> partOptional = partRepository.findById(partID);
        Part part = partOptional.orElseThrow(() -> new ResourceNotFoundException("Part not found for this id: " + partID));
        return PartMapper.toDTO(part);
    }

    public void savePart(PartDTO thePart) {
        Part part = PartMapper.toEntity(thePart);
        partRepository.save(part);
    }

    public void deletePartByID(long partID) {
        partRepository.deleteById(partID);
    }
}
