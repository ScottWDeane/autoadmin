import React, {useState} from 'react';

const AddCustomerModal = ({showModal, setShowModal, onAddCustomer, fetchWithAuth}) => {
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        contactNumber: '',
        vehicles: [{color: ''}]
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [error, setError] = useState('');

    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        setCustomerData({...customerData, [name]: value});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to add customer...")
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });
            if (response.ok) {
                onAddCustomer();
                setShowModal(false);
                alert('Customer added!')
            } else {
                alert('Failed to add customer');
            }
        } catch (error) {
            alert('Error adding customer:' + error);
        }
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
                                       onChange={handleInputChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Last Name:</label></td>
                            <td><input type="text" name="lastName" value={customerData.lastName}
                                       onChange={handleInputChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Address:</label></td>
                            <td><input type="text" name="address" value={customerData.address}
                                       onChange={handleInputChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Contact #:</label></td>
                            <td><input type="number" name="contactNumber" value={customerData.contactNumber}
                                       onChange={handleInputChange} required/>
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
}

export default AddCustomerModal;
