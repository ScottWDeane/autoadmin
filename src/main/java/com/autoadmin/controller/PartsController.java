package com.autoadmin.controller;

import com.autoadmin.DTO.PartDTO;
import com.autoadmin.entity.Part;
import com.autoadmin.service.PartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/parts")
public class PartsController {

    @Autowired
    private ApplicationContext context;

    private PartService partService;

    @Autowired
    public PartsController(PartService partService) {
        this.partService = partService;
    }

    @GetMapping("getall")
    public List<PartDTO> getAllParts() {
        return (List<PartDTO>) partService.findAll();
    }

    @GetMapping("{id}")
    public PartDTO getPart(@PathVariable("id") Long id) {
        PartDTO part = partService.getPartById(id);
        return part;
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") Long id) {
        try {
            if(partService.getPartById(id).getWorkUnitParts().size() > 0) {
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            else {
                partService.deletePartByID(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPart(@RequestBody PartDTO part) {
        try {
            partService.savePart(part);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create part: " + part.getName() + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updatePart(@RequestBody PartDTO part) {
        try {
            partService.savePart(part);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update part: " + part.getName() + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
