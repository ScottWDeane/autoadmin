import React, {useEffect, useState} from 'react';


const AddRepairOrderModal = ({ showModal, setShowModal, onAddRepairOrder, fetchWithAuth }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/getall`, {
                method: 'GET'
            });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        setSelectedCustomer(customerId);
        const customer = customers.find(customer => customer.id === parseInt(customerId));
        setVehicles(customer ? customer.vehicles : []);
    };

    const handleVehicleChange = (e) => {
        setSelectedVehicle(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const repairOrderData = {
                customerID: selectedCustomer,
                vehicleID: selectedVehicle
            };
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/ro/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(repairOrderData)
            });
            if (response.ok) {
                onAddRepairOrder();
                setShowModal(false);
                alert('Added Repair Order');
            } else {
                alert('Failed to add repair order');
            }
        } catch (error) {
            alert('Error adding repair order:' + error);
        }
    };

    return (
        <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>×</span>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="customer">Customer:</label>
                        <select id="customer" value={selectedCustomer} onChange={handleCustomerChange} required>
                            <option value="">Select a Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicle">Vehicle:</label>
                        <select id="vehicle" value={selectedVehicle} onChange={handleVehicleChange} required>
                            <option value="">Select a Vehicle</option>
                            {vehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.color} {vehicle.year} {vehicle.make} {vehicle.model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default AddRepairOrderModal;
