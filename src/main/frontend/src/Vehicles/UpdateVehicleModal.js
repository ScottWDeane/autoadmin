import React, {useEffect, useState} from 'react';

const UpdateVehicleModal = ({onUpdateVehicle, setShowModal, showModal, vehicle, fetchWithAuth}) => {
    const [vehicleData, setVehicleData] = useState({
        id: vehicle.id,
        color: vehicle.color,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        vin: vehicle.vin
    });
    const [error, setError] = useState('');

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        setVehicleData({
            id: vehicle.id,
            color: vehicle.color,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin
        });
    }, [vehicle]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setVehicleData({...vehicleData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to update vehicle for customer...");
            const response = await fetchWithAuth(`${apiBaseUrl}/customers/vehicles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });
            if (response.ok) {
                onUpdateVehicle();
                setShowModal(false);
                alert(`Vehicle '${vehicleData.color} ${vehicleData.make} ${vehicleData.model}' updated!`)
            } else {
                alert('Failed to update vehicle');
            }
        } catch (error) {
            alert('Error updating vehicle: ' + error);
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
                    <button type="submit">Update Vehicle</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
}

export default UpdateVehicleModal;