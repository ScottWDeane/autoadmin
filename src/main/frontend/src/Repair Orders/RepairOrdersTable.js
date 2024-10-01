import React, {useEffect, useState} from 'react';
import '../App.css';
import AddRepairOrderModal from "./AddRepairOrderModal";
import AddWorkUnitModal from "../WorkUnits/AddWorkUnitModal";
import AddPartToWorkUnit from "../WorkUnits/AddPartToWorkUnit";
import UpdateWorkUnitModal from "../WorkUnits/UpdateWorkUnitModal";
import UpdatePartOnWorkUnit from "../WorkUnits/UpdatePartOnWorkUnit";

const ConfirmationDialog = ({isOpen, onConfirm, onCancel, itemName, workUnitIsComplete}) => {
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

function RepairOrdersTable({fetchWithAuth}) {
    const [repairOrders, setRepairOrders] = useState([]);
    const [filteredRepairOrders, setFilteredRepairOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('First Name');
    const [workUnitToUpdate, setWorkUnitToUpdate] = useState(null);
    const [showUpdateWorkUnitModal, setShowUpdateWorkUnitModal] = useState(false);
    const [partToDelete, setPartToDelete] = useState(null);
    const [workUnitPartToUpdate, setWorkUnitPartToUpdate] = useState(null);
    const [showAddWorkUnitModal, setShowAddWorkUnitModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [selectedRepairOrderId, setSelectedRepairOrderId] = useState(null);
    const [selectedPartName, setSelectedPartName] = useState(null);
    const [parentWorkUnit, setParentWorkUnit] = useState(null);
    const [partDetails, setPartDetails] = useState({});
    const [showAddRepairOrderModal, setShowAddRepairOrderModal] = useState(false);
    const [showAddPartToWorkUnitPartModal, setShowAddPartToWorkUnitPartModal] = useState(false);
    const [showUpdatePartToWorkUnitPartModal, setShowUpdatePartToWorkUnitPartModal] = useState(false);
    const [workUnitIsComplete, setWorkUnitIsComplete] = useState(false);

    useEffect(() => {
        fetchRepairOrders();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, searchOption]);

    const fetchRepairOrders = async () => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/repairorders/getall`, {
                method: 'GET'
            });
            const data = await response.json();
            setRepairOrders(data);
            setFilteredRepairOrders(data);
            data.forEach(repairOrder => {
                repairOrder.workUnits.forEach(workUnit => {
                    workUnit.workUnitParts.forEach(workUnitPart => {
                        fetchPartDetails(workUnitPart.partID);
                    });
                });
            });
        } catch (error) {
            console.error('Error fetching Repair Orders:', error);
        }
    };

    const fetchPartDetails = async (partId) => {
        try {
            const response = await fetchWithAuth(`${apiBaseUrl}/parts/${partId}`, {
                method: 'GET'
            });
            const data = await response.json();
            setPartDetails(prevState => ({
                ...prevState,
                [partId]: data
            }));
        } catch (error) {
            console.error(`Error fetching Part ${partId}:`, error);
        }
    };

    const handleSearch = () => {
        const searchTerm = searchQuery.toLowerCase();
        const filtered = repairOrders.filter(repairOrder => {
            if (searchQuery.trim() === '') {
                return true;
            }

            switch (searchOption) {
                case 'RO #':
                    return repairOrder.id.toString().toLowerCase().includes(searchTerm);
                case 'Customer Name':
                    const fullName = `${repairOrder.customer.firstName} ${repairOrder.customer.lastName}`.toLowerCase();
                    return fullName.includes(searchTerm);
                case 'Vehicle Make':
                    return repairOrder.vehicle.make.toString().toLowerCase().includes(searchTerm);
                case 'Vehicle Model':
                    return repairOrder.vehicle.model.toString().toLowerCase().includes(searchTerm);
                case 'Vehicle Color':
                    return repairOrder.vehicle.color.toString().toLowerCase().includes(searchTerm);
                case 'Overall Status':
                    return repairOrder.status.toString().toLowerCase().includes(searchTerm);
                default:
                    return true;
            }
        });
        setFilteredRepairOrders(filtered);
    };

    const handleWorkUnitUpdateClick = (workUnit) => {
        setWorkUnitToUpdate(workUnit);
        setShowUpdateWorkUnitModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setDeleteTarget(null);
    };

    const handleAddWorkUnitClick = (repairOrderId) => {
        setSelectedRepairOrderId(repairOrderId);
        setShowAddWorkUnitModal(true);
    };

    const handleAddWorkUnit = () => {
        setShowAddWorkUnitModal(false);
        fetchRepairOrders();
    };

    const handleDeleteWorkUnitClick = (workUnit) => {
        setDeleteTarget({type: 'workUnit', workUnit});
        if(workUnit.status == "Completed") {
            setWorkUnitIsComplete(true);
        } else {
            setWorkUnitIsComplete(false);
        }

        setShowDeleteDialog(true);
    };

    const handleDeleteRepairOrderClick = (repairOrder) => {
        setDeleteTarget({type: 'repairOrder', repairOrder});
        setShowDeleteDialog(true);
    };

    const handleAddRepairOrder = () => {
        fetchRepairOrders();
    };

    const handleAddPartToWorkUnitPart = () => {
        setShowAddPartToWorkUnitPartModal(false);
        fetchRepairOrders();
        setShowAddPartToWorkUnitPartModal(true);
    };


    const handleDeletePartClick = (part, workUnit) => {
        setDeleteTarget({type: 'part', part, workUnit});
        setShowDeleteDialog(true);
    };

    const handleUpdatePartClick = (workUnitPart, partName, workUnit) => {
        setShowUpdatePartToWorkUnitPartModal(false);
        setWorkUnitPartToUpdate(workUnitPart);
        setSelectedPartName(partName);
        setParentWorkUnit(workUnit);
        setShowUpdatePartToWorkUnitPartModal(true);
    }

    const handleUpdatePartClose = () => {
        setWorkUnitPartToUpdate(null); // reset when closed
        setShowAddPartToWorkUnitPartModal(false);
    };

    const handleUpdateWorkUnitClose = () => {
        setWorkUnitToUpdate(null); // reset when closed
        setShowUpdateWorkUnitModal(false);
    };

    const confirmDelete = async () => {
        if (deleteTarget) {
            try {
                console.log("deleteTarget: " + JSON.stringify(workUnitIsComplete))
                switch (deleteTarget.type) {
                    case 'repairOrder':
                        await fetchWithAuth(`${apiBaseUrl}/repairorders/ro/${deleteTarget.repairOrder.id}`, {
                            method: 'DELETE'
                        });
                        alert('Repair Order deleted.');
                        break;
                    case 'workUnit':
                        if (workUnitIsComplete) {
                            const confirmed = window.confirm("Are you sure you want to delete this Work Unit? It is marked 'Completed', and you will need to manually update any associated Parts' quantities to make sure they're accurate. ");
                            if (!confirmed) {
                                return;
                            }
                            if (confirmed) {
                                await fetchWithAuth(`${apiBaseUrl}/repairorders/wu/${deleteTarget.workUnit.id}`, {
                                    method: 'DELETE'
                                });
                                setWorkUnitIsComplete(false);
                                alert('Work Unit deleted.');
                            }
                        } else {
                            await fetchWithAuth(`${apiBaseUrl}/repairorders/wu/${deleteTarget.workUnit.id}`, {
                                method: 'DELETE'
                            });
                            setWorkUnitIsComplete(false);
                            alert('Work Unit deleted.');
                        }
                        break;
                    case 'part':
                        await fetchWithAuth(`${apiBaseUrl}/repairorders/wu/${deleteTarget.workUnit.id}/part/${deleteTarget.part.id}`, {
                            method: 'DELETE'
                        });
                        alert('Part removed from Work Unit.');
                        break;
                    default:
                        throw new Error("Oops, can't determine what type of item we're trying to delete.");
                }
                setShowDeleteDialog(false);
                fetchRepairOrders();
                setDeleteTarget(null);
            } catch (error) {
                console.error(`Error deleting ${deleteTarget.type}:`, error);
            }
        }
    };

    return (
        <div className="repair-orders-table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select value={searchOption} onChange={e => setSearchOption(e.target.value)}>
                    <option value="RO #">RO #</option>
                    <option value="Customer Name">Customer Name</option>
                    <option value="Vehicle Make">Vehicle Make</option>
                    <option value="Vehicle Model">Vehicle Model</option>
                    <option value="Vehicle Color">Vehicle Color</option>
                    <option value="Overall Status">Overall Status</option>
                </select>
                <button onClick={handleSearch}>Search</button>
                <button onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
            <button onClick={() => setShowAddRepairOrderModal(true)}>Add New Repair Order</button>
            <table className="repair-orders-table">
                <thead>
                <tr>
                    <th>RO #</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Overall Status</th>
                    <th>Associated Work Units</th>
                    <th>Manage Repair Order</th>
                </tr>
                </thead>
                <tbody>
                {filteredRepairOrders.map(repairOrder => (
                    <tr key={repairOrder.id}>
                        <td>{repairOrder.id}</td>
                        <td>{repairOrder.customer.firstName} {repairOrder.customer.lastName}</td>
                        <td>{repairOrder.vehicle.color} {repairOrder.vehicle.year} {repairOrder.vehicle.make} {repairOrder.vehicle.model}</td>
                        <td>{repairOrder.status}</td>
                        <td>
                            <div>
                                <button onClick={() => handleAddWorkUnitClick(repairOrder.id)}>Add New Work Unit
                                </button>
                            </div>
                            {repairOrder.workUnits.map(workUnit => {
                                const partsCost = workUnit.workUnitParts.reduce((total, workUnitPart) => {
                                    const part = partDetails[workUnitPart.partID];
                                    return total + (part ? part.price * workUnitPart.quantity : 0);
                                }, 0);
                                const totalCost = workUnit.cost + partsCost;

                                return (
                                    <div key={workUnit.id} className="work-unit">
                                        <div>Description: {workUnit.description} &emsp; Status: {workUnit.status} &emsp; Labor
                                            Cost: ${workUnit.cost.toFixed(2)} &emsp; Total WU Cost:
                                            ${totalCost.toFixed(2)} &emsp; Started: {workUnit.dateStarted ? workUnit.dateStarted : "---"} &emsp;
                                            Completed: {workUnit.dateCompleted ? workUnit.dateCompleted : "---"}
                                            {workUnit.status !== 'Completed' && (
                                                <>
                                                    <button onClick={() => handleWorkUnitUpdateClick(workUnit)}>Update
                                                        "{workUnit.description}" Work Unit
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => handleDeleteWorkUnitClick(workUnit)}>
                                                Delete "{workUnit.description}" Work Unit
                                            </button>
                                        </div>
                                        <br></br>
                                        Parts:
                                        {workUnit.workUnitParts.map(workUnitPart => {
                                            const part = partDetails[workUnitPart.partID];
                                            return (
                                                <div key={workUnitPart.id}>
                                                    {part && (
                                                        <div>
                                                            &emsp;&emsp; {part.name}
                                                            &emsp; Available Quantity: {part.availableCount}
                                                            &emsp; Used/Reserved By This WU: {workUnitPart.quantity}
                                                            &emsp; Cost of Parts: ${(part.price * workUnitPart.quantity).toFixed(2)}
                                                            &emsp;
                                                            {workUnit.status !== 'Completed' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleUpdatePartClick(workUnitPart, part, workUnit)}>
                                                                        Update Part {part.name}
                                                                    </button>
                                                                    &emsp;
                                                                    <button
                                                                        onClick={() => handleDeletePartClick(part, workUnit)}>
                                                                        Delete Part {part.name}
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {workUnit.status !== 'Completed' && (
                                            <button onClick={() => handleAddPartToWorkUnitPart(workUnit.id)}>
                                                Add New Part to "{workUnit.description}" Work Unit
                                            </button>
                                        )}
                                        <AddPartToWorkUnit onAddPartToWorkUnit={handleAddPartToWorkUnitPart}
                                                           showModal={showAddPartToWorkUnitPartModal}
                                                           setShowModal={setShowAddPartToWorkUnitPartModal}
                                                           workunit_id={workUnit.id} fetchWithAuth={fetchWithAuth}/>
                                    </div>
                                );
                            })}
                        </td>
                        <td>
                            <button onClick={() => handleDeleteRepairOrderClick(repairOrder)}>
                                Delete Repair Order for {repairOrder.vehicle.make} {repairOrder.vehicle.model}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                fetchWithAuth={fetchWithAuth}
                workUnitIsComplete={workUnitIsComplete}
                itemName={
                    deleteTarget
                        ? deleteTarget.type === 'repairOrder'
                            ? `the Repair Order for ${deleteTarget.repairOrder.customer.firstName}'s ${deleteTarget.repairOrder.vehicle.model}`
                            : deleteTarget.type === 'workUnit'
                                ? `the Work Unit ${deleteTarget.workUnit.description}`
                                : `the Part ${deleteTarget.part.name}`
                        : ''
                }
            />
            <AddRepairOrderModal
                showModal={showAddRepairOrderModal}
                setShowModal={setShowAddRepairOrderModal}
                fetchWithAuth={fetchWithAuth}
                onAddRepairOrder={handleAddRepairOrder}
            />
            {selectedRepairOrderId &&
                <AddWorkUnitModal
                    showModal={showAddWorkUnitModal}
                    setShowModal={setShowAddWorkUnitModal}
                    repair_order_id={selectedRepairOrderId}
                    fetchWithAuth={fetchWithAuth}
                    onAddWorkUnit={handleAddWorkUnit}
                />}
            {workUnitToUpdate &&
                <UpdateWorkUnitModal onUpdateWorkUnit={fetchRepairOrders}
                                     setShowUpdateWorkUnitModal={setShowUpdateWorkUnitModal}
                                     showUpdateWorkUnitModal={showUpdateWorkUnitModal}
                                     workUnit={workUnitToUpdate}
                                     fetchWithAuth={fetchWithAuth}
                                     onClose={handleUpdateWorkUnitClose}
                />}
            {workUnitPartToUpdate &&
                <UpdatePartOnWorkUnit onUpdatePartToWorkUnit={fetchRepairOrders}
                                      showModal={showUpdatePartToWorkUnitPartModal}
                                      setShowModal={setShowUpdatePartToWorkUnitPartModal}
                                      workUnitPart={workUnitPartToUpdate}
                                      originalPart={selectedPartName}
                                      parentWorkUnit={parentWorkUnit}
                                      fetchWithAuth={fetchWithAuth}
                                      onClose={handleUpdatePartClose} />
            }

        </div>
    );
}

export default RepairOrdersTable;
