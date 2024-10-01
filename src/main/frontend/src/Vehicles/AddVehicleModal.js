import React, {useEffect, useState} from 'react';

const AddVehicleModal = ({showModal, setShowModal, customer_id, onAddVehicle, fetchWithAuth}) => {
    const initialVehicleData = {
        customer_id: customer_id,
        color: '',
        year: '',
        make: '',
        model: '',
        vin: ''
    };

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [vehicleData, setVehicleData] = useState(initialVehicleData);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!showModal) {
            setVehicleData(initialVehicleData);
        }
    }, [showModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to add vehicle to customer...");
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/${customer_id}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });
            if (response.ok) {
                onAddVehicle();
                setShowModal(false);
                setVehicleData(initialVehicleData);
                alert(`Vehicle '${vehicleData.color} ${vehicleData.make} ${vehicleData.model}' added!`)
            } else {
                alert('Failed to add vehicle');
            }
        } catch (error) {
            alert('Error adding vehicle:' + error);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setVehicleData({...vehicleData, [name]: value});
    };

    return (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>×</span>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Color:</label></td>
                            <td><input type="text" name="color" value={vehicleData.color} onChange={handleChange}
                                       required/></td>
                        </tr>
                        <tr>
                            <td><label>Year:</label></td>
                            <td><input type="number" name="year" value={vehicleData.year} onChange={handleChange}
                                       required/></td>
                        </tr>
                        <tr>
                            <td><label>Make:</label></td>
                            <td><input type="text" name="make" value={vehicleData.make} onChange={handleChange}
                                       required/></td>
                        </tr>
                        <tr>
                            <td><label>Model:</label></td>
                            <td><input type="text" name="model" value={vehicleData.model} onChange={handleChange}
                                       required/></td>
                        </tr>
                        <tr>
                            <td><label>VIN #:</label></td>
                            <td><input type="text" name="vin" value={vehicleData.vin} onChange={handleChange} required/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button type="submit">Add Vehicle</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
}

export default AddVehicleModal;
