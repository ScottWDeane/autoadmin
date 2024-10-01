// UpdatePartModal.js
import React, {useEffect, useState} from 'react';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const UpdatePartModal = ({onUpdatePart, setShowModal, showModal, part, existingPartNames, fetchWithAuth}) => {
    const [formData, setFormData] = useState({
        id: part.id,
        name: part.name,
        description: part.description,
        totalCount: part.totalCount,
        reservedCount: part.reservedCount,
        availableCount: part.availableCount,
        price: parseFloat(part.price.replace('$', ''))
    });
    const [originalName, setOriginalName] = useState(part.name);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            id: part.id,
            name: part.name,
            description: part.description,
            totalCount: part.totalCount,
            reservedCount: part.reservedCount,
            availableCount: part.availableCount,
            price: parseFloat(part.price.replace('$', ''))
        });
        setOriginalName(part.name);
    }, [part]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        console.log("price value: " + part.price);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name !== originalName && existingPartNames.includes(formData.name)) {
            setError('A part with that name already exists!');
            return;
        }

        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/parts/${part.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onUpdatePart();
                setShowModal(false);
                alert(`Part '${formData.name}' updated! `)
            } else {
                // Handle error
                alert(`Failed to update part '${formData.name}' `);
            }
        } catch (error) {
            alert(`Error updating part '${formData.name}' :` + error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
            <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>×</span>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Part Name:</label></td>
                            <td><input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Part Description:</label></td>
                            <td><input type="text" name="description" value={formData.description}
                                       onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <td><label>Total Count:</label></td>
                            <td><input type="number" name="totalCount" value={formData.totalCount}
                                       onChange={handleChange} required/></td>
                        </tr>
                        <tr>
                            <td><label>Reserved Count:</label></td>
                            <td><input type="number" name="reservedCount" value={formData.reservedCount}
                                       onChange={handleChange} required/></td>
                        </tr>
                        <tr>
                            <td><label>Available Count:</label></td>
                            <td><input type="number" name="availableCount" value={formData.availableCount}
                                       onChange={handleChange} required/></td>
                        </tr>
                        <tr>
                            <td><label>Price:</label></td>
                            <td><input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange}
                                       required/></td>
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

export default UpdatePartModal;
