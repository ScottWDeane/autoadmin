import React, {useEffect, useState} from 'react';

const AddWorkUnitModal = ({showModal, setShowModal, repair_order_id, onAddWorkUnit, fetchWithAuth }) => {
    const initialWorkUnitData = {
        description: '',
        status: '',
        cost: '',
        dateStarted: '',
        dateCompleted: '',
        repair_order_id: repair_order_id
    };

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [workUnitData, setWorkUnitData] = useState(initialWorkUnitData);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!showModal) {
            setWorkUnitData(initialWorkUnitData);
        }
    }, [showModal]);

    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        setWorkUnitData({...workUnitData, [name]: value});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to add Work Unit to Repair Order...");
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/ro/${repair_order_id}/addwu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workUnitData)
            });
            if (response.ok) {
                onAddWorkUnit();
                setShowModal(false);
                setWorkUnitData(initialWorkUnitData);
                alert(`Work unit ${workUnitData.description} added to Repair Order ${repair_order_id}!`)
            } else {
                alert(`Failed to add work unit ${workUnitData.description} to Repair Order ${repair_order_id}!`);
            }
        } catch (error) {
            alert('Error adding work unit:' + error);
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
                            <td><label>Description:</label></td>
                            <td><input type="text" name="description" value={workUnitData.Description}
                                       onChange={handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Labor Cost:</label></td>
                            <td><input type="number" name="cost" step="0.01" value={workUnitData.cost}
                                       onChange={handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Date Started :</label></td>
                            <td><input type="datetime-local" name="dateStarted" value={workUnitData.dateStarted}
                                       onChange={handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Date Completed :</label></td>
                            <td><input type="datetime-local" name="dateCompleted" value={workUnitData.dateCompleted}
                                       onChange={handleInputChange} />
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

export default AddWorkUnitModal;
