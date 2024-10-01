import React, {useState} from 'react';

const AddPartModal = ({onAddPart, setShowModal, showModal, existingPartNames, fetchWithAuth}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalCount: '',
        reservedCount: '',
        availableCount: '',
        price: ''
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (existingPartNames.some(name => name.trim().toLowerCase() === formData.name.trim().toLowerCase())) {
            setError('A part with that name already exists!');
            return;
        }

        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/parts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onAddPart();
                setShowModal(false);
                alert(`Added part ${formData.name}`)
            } else {
                alert('Failed to add part');
            }
        } catch (error) {
            alert('Error adding part: ' + error);
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
                            <td><label>Part Name:</label></td>
                            <td><input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                            </td>
                        </tr>
                        <tr>
                            <td><label>Part Description:</label></td>
                            <td><input type="text" name="description" value={formData.description}
                                       onChange={handleChange}/></td>
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
                            <td><input type="number" name="price" value={formData.price} step="0.01" onChange={handleChange}
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

export default AddPartModal;
