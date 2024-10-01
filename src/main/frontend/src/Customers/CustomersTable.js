import React, {useEffect, useState} from 'react';
import '../App.css';
import AddCustomerModal from "./AddCustomerModal";
import UpdateCustomerModal from "./UpdateCustomerModal";
import AddVehicleModal from "../Vehicles/AddVehicleModal";
import UpdateVehicleModal from "../Vehicles/UpdateVehicleModal";

const ConfirmationDialog = ({isOpen, onConfirm, onCancel, itemName}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <p>Are you sure you want to delete {itemName}?</p>
                <div>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

function CustomersTable({ fetchWithAuth }) {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('First Name');
    const [showModal, setShowModal] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [customerToUpdate, setCustomerToUpdate] = useState(null);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [vehicleToUpdate, setVehicleToUpdate] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, searchOption]);

    const handleAddCustomer = () => {
        fetchCustomers();
        toggleModal();
    };

    const handleDeleteClick = async (id, firstName, lastName) => {
        setCustomerToDelete({id, firstName, lastName});
        setShowDialog(true);
    };

    const handleDeleteVehicleClick = (id, model) => {
        setVehicleToDelete({id, model});
        setShowDialog(true);
    };

    const handleCustomerUpdateClick = (customer) => {
        setCustomerToUpdate(customer);
        setShowUpdateModal(true);
    };
    const handleVehicleUpdateClick = (vehicle) => {
        setVehicleToUpdate(vehicle);
        setShowUpdateModal(true);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleUpdateModalClose = () => {
        console.log("Closing modal for customer")
        setCustomerToUpdate(null); // reset when closed
        setShowUpdateModal(false);
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/getall`, {
                method: 'GET'
            });
            const data = await response.json();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleSearch = () => {
        const searchTerm = searchQuery.toLowerCase();
        const filtered = customers.filter(customer => {
            if (searchQuery.trim() === '') {
                return true;
            }

            switch (searchOption) {
                case 'First Name':
                    return customer.firstName.toLowerCase().includes(searchTerm);
                case 'Last Name':
                    return customer.lastName.toLowerCase().includes(searchTerm);
                case 'Contact Number':
                    return customer.contactNumber.toString().toLowerCase().includes(searchTerm);
                default:
                    return true;
            }
        });
        setFilteredCustomers(filtered);
    };

    const confirmDelete = async () => {
        if (customerToDelete) {
            try {
                await fetchWithAuth(`${apiBaseUrl}/customers/${customerToDelete.id}`, {
                    method: 'DELETE'
                });
                setShowDialog(false);
                fetchCustomers();
                alert(`Customer deleted: ${customerToDelete.firstName} ${customerToDelete.lastName}`)
                setCustomerToDelete(null);
            } catch (error) {
                alert(`Error deleting customer with ID ${customerToDelete.id}, 
                FirstName: ${customerToDelete.firstName}, LastName: ${customerToDelete.lastName}:` + error);
            }
        } else if (vehicleToDelete) {
            try {
                await fetchWithAuth(`${apiBaseUrl}/customers/vehicles/${vehicleToDelete.id}`, {
                    method: 'DELETE'
                });
                setShowDialog(false);
                fetchCustomers();
                alert(`Vehicle deleted: ${vehicleToDelete.color} ${vehicleToDelete.make} ${vehicleToDelete.model}`)
                setVehicleToDelete(null);
            } catch (error) {
                alert(`Error deleting vehicle with ID ${vehicleToDelete}:` + error);
            }
        }
    };

    const cancelDelete = () => {
        setShowDialog(false);
    };

    const handleAddVehicleClick = (customerId) => {
        setSelectedCustomerId(customerId);
        setShowAddVehicleModal(true);
    };

    const handleAddVehicle = () => {
        setShowAddVehicleModal(false);
        fetchCustomers();
    };

    return (
        <div className="customer-table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select value={searchOption} onChange={e => setSearchOption(e.target.value)}>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Contact Number">Contact Number</option>
                </select>
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
            <button onClick={() => setShowModal(true)}>Add New Customer</button>
            <AddCustomerModal onAddCustomer={handleAddCustomer} setShowModal={setShowModal} showModal={showModal} fetchWithAuth={fetchWithAuth}
            />
            <table className="customers-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Contact #</th>
                    <th>Address</th>
                    <th>Associated Vehicles</th>
                    <th>Manage Customer</th>
                </tr>
                </thead>
                <tbody>
                {filteredCustomers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.firstName}</td>
                        <td>{customer.lastName}</td>
                        <td>{customer.contactNumber}</td>
                        <td>{customer.address}</td>
                        <td>
                            <div>
                                <button onClick={() => handleAddVehicleClick(customer.id)}>Add New Vehicle</button>
                            </div>
                            {customer.vehicles.map(vehicle => (
                                <div key={vehicle.id}>
                                    Color: {vehicle.color}, Year: {vehicle.year}, Make: {vehicle.make},
                                    Model: {vehicle.model}, VIN: {vehicle.vin}
                                    <button onClick={() => handleVehicleUpdateClick(vehicle)}>Update Vehicle</button>
                                    <button onClick={() => handleDeleteVehicleClick(vehicle.id, vehicle.model)}>
                                        Delete Vehicle {vehicle.model}
                                    </button>
                                </div>
                            ))}
                        </td>
                        <td>
                            <button onClick={() => handleCustomerUpdateClick(customer)}>Update Customer</button>
                            <button
                                onClick={() => handleDeleteClick(customer.id, customer.firstName, customer.lastName)}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ConfirmationDialog
                isOpen={showDialog}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                itemName={customerToDelete
                    ? customerToDelete.firstName + " " + customerToDelete.lastName
                    : vehicleToDelete
                        ? vehicleToDelete.model
                        : ''}
            />
            {customerToUpdate &&
                <UpdateCustomerModal onUpdateCustomer={fetchCustomers}
                                     setShowModal={setShowUpdateModal}
                                     showModal={showUpdateModal}
                                     customer={customerToUpdate}
                                     fetchWithAuth={fetchWithAuth}
                                     onClose={handleUpdateModalClose}
                />}
            {selectedCustomerId &&
                <AddVehicleModal
                    showModal={showAddVehicleModal}
                    setShowModal={setShowAddVehicleModal}
                    customer_id={selectedCustomerId}
                    fetchWithAuth={fetchWithAuth}
                    onAddVehicle={handleAddVehicle}
                />}
            {vehicleToUpdate &&
                <UpdateVehicleModal onUpdateVehicle={fetchCustomers}
                                     setShowModal={setShowUpdateModal}
                                     showModal={showUpdateModal}
                                     vehicle={vehicleToUpdate}
                                    fetchWithAuth={fetchWithAuth}
                                     onClose={handleUpdateModalClose}
                                    customer_id={selectedCustomerId}

                />}
        </div>
    );
}

export default CustomersTable;
