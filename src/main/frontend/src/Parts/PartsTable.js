import React, {useEffect, useState} from 'react';
import '../App.css';
import AddPartModal from "./AddPartModal";
import UpdatePartModal from "./UpdatePartModal";

// Confirmation dialog component
const ConfirmationDialog = ({isOpen, onConfirm, onCancel, itemName}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <p>Are you sure you want to delete {itemName}?</p>
                <div>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function PartsTable({ fetchWithAuth }) {
    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('Name');
    const [partToDelete, setPartToDelete] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [existingPartNames, setExistingPartNames] = useState([]);
    const [partToUpdate, setPartToUpdate] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchParts();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, searchOption]);

    useEffect(() => {
        const partNames = parts.map(part => part.name);
        setExistingPartNames(partNames);
    }, [parts]);

    const fetchParts = async () => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/parts/getall`, {
                method: 'GET'
            });
            const data = await response.json();
            // Format price before setting parts
            const formattedData = data.map(part => ({
                ...part,
                price: `$ ${parseFloat(part.price).toFixed(2)}`
            }));
            setParts(formattedData);
            setFilteredParts(formattedData); // Initialize filtered parts with all parts
        } catch (error) {
            console.error('Error fetching parts:', error);
        }
    };

    const handleDeleteClick = async (id, name) => {
        setPartToDelete({id, name});
        setShowDialog(true);
    };

    const handleUpdateClick = (part) => {
        setPartToUpdate(part);
        setShowUpdateModal(true);
    };

    const handleUpdateModalClose = () => {
        console.log("Closing modal for part")
        setPartToUpdate(null); // Reset partToUpdate when modal is closed
        setShowUpdateModal(false);
    };

    const confirmDelete = async () => {
        try {
            console.log("Attempting to delete.")
            const response = await fetchWithAuth(`${apiBaseUrl}/parts/${partToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // 409 --> conflict
            if(response.status === 409) {
                alert('Part cannot be deleted: at least one Work Unit is using this part!')
                setShowDialog(false);
            }
            if (response.status===204 || response.ok) {
                alert(`Part deleted.`)
                setShowDialog(false); // Close the dialog after successfully deleting the part
                fetchParts();
            }
        } catch (error) {
            alert(`Part failed to delete for an unknown reason...`)
            setShowDialog(false); // Close the dialog after successfully deleting the part
            fetchParts();
        }
    };

    const cancelDelete = () => {
        setShowDialog(false);
    };

    const handleSearch = () => {
        const searchTerm = searchQuery.toLowerCase();
        const filtered = parts.filter(part => {
            if (searchQuery.trim() === '') {
                return true;
            }

            switch (searchOption) {
                case 'ID':
                    return part.id.toString().toLowerCase().includes(searchTerm);
                case 'Name':
                    return part.name.toLowerCase().includes(searchTerm);
                case 'Description':
                    return part.description.toLowerCase().includes(searchTerm);
                default:
                    return true;
            }
        });
        setFilteredParts(filtered);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAddPart = () => {
        fetchParts();
        toggleModal();
    };


    return (
        <div className="parts-table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select value={searchOption} onChange={e => setSearchOption(e.target.value)}>
                    <option value="ID">ID</option>
                    <option value="Name">Name</option>
                    <option value="Description">Description</option>
                </select>
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
            <button onClick={() => setShowModal(true)}>Add New Part</button>
            {/* Open modal when clicked */}
            <AddPartModal onAddPart={handleAddPart} setShowModal={setShowModal} showModal={showModal}
                          existingPartNames={existingPartNames} fetchWithAuth={fetchWithAuth}/>
            <table className="parts-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Total Count</th>
                    <th>Reserved Count</th>
                    <th>Available Count</th>
                    <th>Price</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {filteredParts.map(part => (
                    <tr key={part.id}>
                        <td>{part.id}</td>
                        <td>{part.name}</td>
                        <td>{part.description}</td>
                        <td>{part.totalCount}</td>
                        <td>{part.reservedCount}</td>
                        <td>{part.availableCount}</td>
                        <td>{part.price}</td>
                        <td>
                            <button onClick={() => handleUpdateClick(part)}>Update</button>
                            <button onClick={() => handleDeleteClick(part.id, part.name)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </table>
            <ConfirmationDialog
                isOpen={showDialog}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                fetchWithAuth={fetchWithAuth}
                itemName={partToDelete ? partToDelete.name : ''}
            />
            {partToUpdate &&
                <UpdatePartModal onUpdatePart={fetchParts}
                                 setShowModal={setShowUpdateModal}
                                 showModal={showUpdateModal}
                                 part={partToUpdate}
                                 fetchWithAuth={fetchWithAuth}
                                 onClose={handleUpdateModalClose}
                                 existingPartNames={existingPartNames}/>}
        </div>
    );
}

export default PartsTable;
