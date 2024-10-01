package com.autoadmin.repository;

import com.autoadmin.entity.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RepairOrderRepository extends CrudRepository<RepairOrder, Long> {

    @Query("SELECT ro FROM RepairOrder ro JOIN FETCH ro.customer c JOIN FETCH c.vehicles v JOIN FETCH ro.workUnits wu LEFT JOIN FETCH wu.workUnitParts pu LEFT JOIN FETCH pu.part")
    List<RepairOrder> findAllWithDetails();
}
