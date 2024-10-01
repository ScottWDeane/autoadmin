package com.autoadmin.repository;

import com.autoadmin.entity.WorkUnit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkUnitRepository extends JpaRepository<WorkUnit, Long> {
}