import React, {useEffect, useState} from 'react';
import '../App.css';

const UpdatePartOnWorkUnit = ({showModal, setShowModal, workUnitPart, onUpdatePartToWorkUnit, fetchWithAuth, originalPart, parentWorkUnit}) => {
    const [workUnitPartData, setWorkUnitPartData] = useState({
        id: workUnitPart.id,
        workunit_id: workUnitPart.workunit_id,
        part_id: workUnitPart.part_id,
        quantity: workUnitPart.quantity,
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [error, setError] = useState('');
    const [selectedPart, setSelectedPart] = useState('');
    const [filteredParts, setFilteredParts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('');
    const [parts, setParts] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [originalSelectedQuantity, setOriginalSelectedQuantity] = useState(workUnitPart.quantity);

    useEffect(() => {
        fetchParts();
    }, []);

    useEffect(() => {
        const acceptableCount = originalPart.availableCount + originalSelectedQuantity;
        if (selectedQuantity > acceptableCount) {
            console.log("calc'd value " + acceptableCount);
            setError(`Error: Quantity requested cannot exceed current reserved by Work Unit plus available count for part (${acceptableCount})`);
        } else {
            setError('');
        }
    }, [selectedQuantity, originalPart.availableCount]);


    useEffect(() => {
        setWorkUnitPartData({
            id: workUnitPart.id,
            workunit_id: parentWorkUnit.id,
            part_id: workUnitPart.part_id,
            quantity: workUnitPart.quantity,
        });
        setSelectedQuantity(workUnitPart.quantity);
        setSelectedPart(originalPart.id);
    }, [workUnitPart]);

    const fetchParts = async () => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/parts/getall`, {
                method: 'GET'
            });
            const data = await response.json();
            setParts(data);
            // setFilteredParts(data);
        } catch (error) {
            console.error('Error fetching parts:', error);
        }
    };

    const handlePartChange = (e) => {
        const partId = e.target.value;
        setSelectedPart(partId);
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        setSelectedQuantity(quantity);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (error) {
            return;
        }
        try {
            const formData = {
                id: workUnitPart.id,
                workunit_id: parentWorkUnit.id,
                part_id: selectedPart,
                quantity: selectedQuantity
            };
            console.log("Attempting to Update Part on Work Unit Part..." + JSON.stringify(formData));
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/wu/${formData.id}/updatepart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onUpdatePartToWorkUnit();
                setShowModal(false);
                alert("Part Udated!")
            } else {
                alert('Failed to update part on work unit');
            }
        } catch (error) {
            alert('Error updating part on work unit:' + error);
        }
    };

    return (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>×</span>
                <form onSubmit={handleUpdate}>
                    Update {originalPart.name}
                    <div>
                        <label htmlFor="part">Update Current Desired Quantity (Available qty: {originalPart.availableCount + originalSelectedQuantity}) :</label>
                        <input type="number" name="quantity" value={selectedQuantity} onChange={handleQuantityChange} required/>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                        {error && <div className="error">{error}</div>}
                        <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePartOnWorkUnit;