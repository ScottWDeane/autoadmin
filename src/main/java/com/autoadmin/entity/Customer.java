package com.autoadmin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    String firstName;

    String lastName;

    String address;

    String contactNumber;

//    @JsonManagedReference
    @OneToMany(mappedBy = "customer", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

//    @JsonBackReference
    @OneToMany(mappedBy = "customer", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private Set<RepairOrder> repairOrders;

    public Customer(String firstName, String lastName, String address, String contactNumber, List<Vehicle> vehicles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.contactNumber = contactNumber;
        if (vehicles != null) {
            this.vehicles = vehicles;
        } else {
            this.vehicles = new ArrayList<>();
        }
    }

    public Customer(long ID, String firstName, String lastName, String address, String contactNumber, List<Vehicle> vehicles) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.contactNumber = contactNumber;
        if (vehicles != null) {
            this.vehicles = vehicles;
        } else {
            this.vehicles = new ArrayList<>();
        }
    }

    public Customer() {}
}
