import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

function CustomerList() {

    //Luo tyhjän taulukon
    const [customers, setCustomers] = useState([]);

    //Renderöi kerran, hakee asiakkaat
    useEffect(() => {
        fetchCustomers();
    }, []);

    const [columnDefs] = useState([
        {field: 'firstname', sortable: true, filter: true},
        {field: 'lastname', sortable: true, filter: true},
        {field: 'streetaddress', sortable: true, filter: true},
        {field: 'postcode', sortable: true, filter: true, width: '100%'},
        {field: 'city', sortable: true, filter: true, width: '100%'},
        {field: 'email', sortable: true, filter: true},
        {field: 'phone', sortable: true, filter: true},
        {
            cellRenderer: params => <EditCustomer updateCustomer={updateCustomer} data={params.data} />,
            width: 120
          },
        {
            cellRenderer: params => <Button size="small" onClick={() => deleteCustomer(params.data.links[0].href)}>Delete</Button>,
            width: 120
        }
    ]);


    //Haetaan asiakkaat
    const fetchCustomers = () => {
        fetch('https://traineeapp.azurewebsites.net/api/customers')
        .then(response => {
            if (response.ok)
            return response.json();
            else    
                throw new Error("Error fetcing customers:" + response.statusText);
        })
        .then (data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const deleteCustomer = (url) => {
        if (window.confirm("Are you sure ?")) {
        fetch(url, {method: 'DELETE'}) 
        .then(response => {
            if (response.ok)
            fetchCustomers();    
            else
            throw new Error("Error in DELETE: " + response.statusText);
        })
        .catch (err => console.error(err))
    }
    }

    const saveCustomer = (customer) => {
        fetch('https://traineeapp.azurewebsites.net/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
    }

    const updateCustomer = (customer, link) => {
        fetch(link, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
        })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
    }

    return(
        <>
        <AddCustomer saveCustomer={saveCustomer}/>
        <div className="ag-theme-material" style= {{ width: '90%', height: 700, margin: 'auto'}}>
        <AgGridReact
            rowData={customers}
            columnDefs={columnDefs}
            pagination={true} 
            paginationAutoPageSize = {true}
        />
        </div>
        </>
    )
}

export default CustomerList;