package com.autoadmin.service;

import com.autoadmin.DTO.CustomerDTO;
import com.autoadmin.entity.Customer;
import com.autoadmin.mapper.CustomerMapper;
import com.autoadmin.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<CustomerDTO> findAllCustomers() {
        Iterable<Customer> customers = customerRepository.findAll();
        List<CustomerDTO> customerDTOs = new ArrayList<>();
        for (Customer customer : customers) {
            customerDTOs.add(CustomerMapper.toDTO(customer));
        }
        return customerDTOs;
    }

    public void saveCustomer(CustomerDTO theCustomer) {
        Customer customer = CustomerMapper.toEntity(theCustomer);
        customerRepository.save(customer);
    }

    public void updateCustomer(long id, CustomerDTO customerDTO) {
        if (customerRepository.existsById(id)) {
            customerDTO.setId(id);
            customerRepository.save(CustomerMapper.toEntity(customerDTO));
        }
    }

    public void deleteCustomerById(int theId) {
        Long theIdl=(long)theId;
        customerRepository.deleteById(theIdl);
    }

}
