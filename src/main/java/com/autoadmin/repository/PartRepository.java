package com.autoadmin.repository;

import com.autoadmin.entity.Part;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PartRepository extends CrudRepository <Part, Long> {
    @Query("SELECT p FROM Part p WHERE p.name LIKE %?1%")
    public List<Part> search(String keyword);

//    @Query("SELECT p FROM Part p WHERE p.name LIKE %?1% LIMIT 1")
//    public Part findByName(String keyword);

    Part findByName(String name);
}
