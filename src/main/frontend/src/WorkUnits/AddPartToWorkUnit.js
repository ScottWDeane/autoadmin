import React, {useEffect, useState} from 'react';
import '../App.css';

const AddPartToWorkUnit = ({showModal, setShowModal, workunit_id, onAddPartToWorkUnit, fetchWithAuth}) => {
    const initialWorkUnitPartData = {
        workunit_id: workunit_id,
        part_id: '',
        quantity: '',
    };

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [workUnitPartData, setWorkUnitPartData] = useState([]);
    const [error, setError] = useState('');
    const [selectedPart, setSelectedPart] = useState('');
    const [filteredParts, setFilteredParts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('');
    const [parts, setParts] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [availableCount, setAvailableCount] = useState(0);

    useEffect(() => {
        fetchParts();
    }, []);

    useEffect(() => {
        if (selectedQuantity > availableCount) {
            setError(`Error: Quantity cannot exceed available count (${availableCount})`);
        } else {
            setError('');
        }
    }, [selectedQuantity, availableCount]);

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
        const selectedPartDetails = parts.find(part => part.id === parseInt(partId, 10));
        console.log("selectedPartDetails: " + selectedPartDetails);
        if (selectedPartDetails) {
            setAvailableCount(selectedPartDetails.availableCount);
            console.log("Selected part and its available count: " + JSON.stringify(selectedPartDetails));
        }
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        setSelectedQuantity(quantity);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) {
            return;
        }
        try {
            const formData = {
              workunit_id: workunit_id,
              part_id: selectedPart,
              quantity: selectedQuantity
            };
            console.log("Attempting to add Part to Work Unit Part...");
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/wu/${workunit_id}/part`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onAddPartToWorkUnit();
                setShowModal(false);
                // setWorkUnitPartData(initialWorkUnitPartData);
                alert("Part successfully added to work unit!")
            } else {
                alert('Failed to add part to work unit');
            }
        } catch (error) {
            alert('Error adding part to work unit:', error);
        }
    };

    return (
        <div className="modal" style={{display: showModal ? 'block' : 'none'}}>
            <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>×</span>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="part">Part:</label>
                        <select id="part" value={selectedPart} onChange={handlePartChange} required>
                            <option value="">Select a Part</option>
                            {parts.map(part => (
                                <option key={part.id} value={part.id}>
                                    {part.name}, {part.description}, Available: {part.availableCount}, Price Ea: {part.price}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="part">Desired Quantity:</label>
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

export default AddPartToWorkUnit;