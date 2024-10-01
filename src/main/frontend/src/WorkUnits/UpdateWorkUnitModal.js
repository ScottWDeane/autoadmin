import React, {useEffect, useState} from 'react';

const UpdateWorkUnitModal = ({showUpdateWorkUnitModal, setShowUpdateWorkUnitModal, workUnit, onUpdateWorkUnit, fetchWithAuth }) => {
    const [workUnitData, setWorkUnitData] = useState({
        id: workUnit.id,
        description: workUnit.description,
        status: workUnit.status,
        cost: workUnit.cost,
        dateStarted: workUnit.dateStarted,
        dateCompleted: workUnit.dateCompleted
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        setWorkUnitData({
            id: workUnit.id,
            description: workUnit.description,
            status: workUnit.status,
            cost: workUnit.cost,
            dateStarted: workUnit.dateStarted,
            dateCompleted: workUnit.dateCompleted
        });
    }, [workUnit]);

    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        setWorkUnitData({...workUnitData, [name]: value});
    };

    const handleStatusChange = (e) => {
        handleInputChange(e);
        if (e.target.value === "Completed") {
            setIsCompleted(true);
        } else {
            setIsCompleted(false);
        }
    };

    const confirmAndSubmit = (e) => {
        e.preventDefault();
        if (isCompleted) {
            const confirmed = window.confirm("Are you sure you want to mark this Work Unit as completed? This action cannot be undone. Used parts will be resolved and all data will be permanent. " +
                "\nUndoing this will require deleting the Work Unit and performing a manual inspection and updating of parts inventory.");
            if (!confirmed) {
                return;
            }
        }
        handleSubmit(e);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to update Work Unit");
            if(!workUnitData.dateCompleted && workUnitData.status == "Completed") {
                workUnitData.dateCompleted = new Date().toISOString().slice(0, 16);
            }
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/wu`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workUnitData)
            });
            if (response.ok) {
                onUpdateWorkUnit();
                setShowUpdateWorkUnitModal(false);
                setIsCompleted(false);
                alert(`Work unit '${workUnitData.description}' updated!`)
            } else {
                alert(`Failed to update work unit '${workUnitData.description}'`);
            }
        } catch (error) {
            alert('Unknown error while updating work unit: ' + error);
        }
    };

    return (
        <div className="modal" style={{ display: showUpdateWorkUnitModal ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowUpdateWorkUnitModal(false)}>×</span>
                <form onSubmit={confirmAndSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Description:</label></td>
                            <td><input type="text" name="description" value={workUnitData.description}
                                       onChange={handleInputChange} />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Current Status: </label></td>
                            <td>
                                <select id="status" name="status" value={workUnitData.status}
                                        onChange={handleStatusChange} required>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default UpdateWorkUnitModal;
