import {useState} from 'react'

import {AgGridReact} from 'ag-grid-react'; // React Data Grid Component

import { AllEnterpriseModule, LicenseManager, ModuleRegistry } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey("<your license key>")

function App() {
    const [rowData, setRowData] = useState([
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxster", price: 72000}
    ]);

    const [colDefs, setColDefs] = useState([
        {field: "make"},
        {field: "model"},
        {field: "price"}
    ]);

    const [defaultColDef, setDefaultColDef] = useState({
        flex: 1,
    });

    const [statusBar, setStatusBar] = useState({
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left',
            }
        ]
    });

    return (
        <>
            <div
                style={{height: "100%", width: "100%"}} // the grid will fill the size of the parent container
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    statusBar={statusBar}
                    loadThemeGoogleFonts
                />
            </div>
        </>
    )
}

export default App
