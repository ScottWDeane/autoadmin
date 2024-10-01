import React, {useState} from 'react';
import PartsTable from './Parts/PartsTable';
import CustomersTable from "./Customers/CustomersTable";
import RepairOrdersTable from "./Repair Orders/RepairOrdersTable";
import Login from './SecurityAndAuthentication/Login';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('Parts');
    const [auth, setAuth] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (!auth) {
        return <Login setAuth={setAuth} />;
    }

    const fetchWithAuth = async (url, options = {}) => {
        const headers = new Headers(options.headers || {});
        headers.set('Authorization', `Basic ${auth}`);
        return fetch(url, { ...options, headers });
    };

    return (
        <div className="tabs-container">
            <div className="tab-buttons">
                <button onClick={() => handleTabClick('Parts')} className={activeTab === 'Parts' ? 'tab-button active' : 'tab-button'}>
                    Parts
                </button>
                <button onClick={() => handleTabClick('Customers')} className={activeTab === 'Customers' ? 'tab-button active' : 'tab-button'}>
                    Customers
                </button>
                <button onClick={() => handleTabClick('Repair Orders')} className={activeTab === 'Repair Orders' ? 'tab-button active' : 'tab-button'}>
                    Repair Orders
                </button>
            </div>
            <div>
                {activeTab === 'Parts' && <PartsTable fetchWithAuth={fetchWithAuth} />}
                {activeTab === 'Customers' && <CustomersTable fetchWithAuth={fetchWithAuth} />}
                {activeTab === 'Repair Orders' && <RepairOrdersTable fetchWithAuth={fetchWithAuth} />}
            </div>
        </div>
    );
};

export default Tabs;
