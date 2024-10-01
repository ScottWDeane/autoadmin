import React, {useEffect, useState} from 'react';

const UpdateCustomerModal = ({setShowModal, customer, showModal, onUpdateCustomer, fetchWithAuth}) => {
    const [customerData, setCustomerData] = useState({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        contactNumber: customer.contactNumber,
        address: customer.address
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [error, setError] = useState('');

    useEffect(() => {
        setCustomerData({
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            contactNumber: customer.contactNumber,
            address: customer.address
        });
    }, [customer]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCustomerData({...customerData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to update customer...")
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/add`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });
            if (response.ok) {
                onUpdateCustomer();
                setShowModal(false);
                alert(`Customer ${customerData.firstName} ${customerData.lastName} added!`)
            } else {
                alert('Failed to add customer');
            }
        } catch (error) {
            alert('Error adding customer: ' + error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>×</span>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label>First Name:</label></td>
                            <td><input type="text" name="firstName" value={customerData.firstName}
                                       onChange={handleChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Name:</label></td>
                            <td><input type="text" name="lastName" value={customerData.lastName}
                                       onChange={handleChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Address:</label></td>
                            <td><input type="text" name="address" value={customerData.address}
                                       onChange={handleChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Contact #:</label></td>
                            <td><input type="number" name="contactNumber" value={customerData.contactNumber}
                                       onChange={handleChange} required/>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <button type="submit">Submit</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};

export default UpdateCustomerModal;