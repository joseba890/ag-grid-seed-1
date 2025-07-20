import {
    ColDef,
    createGrid,
    GridApi,
    GridOptions,
    ModuleRegistry,
    CellStyleModule,
    ClientSideRowModelModule,
    ColumnAutoSizeModule,
    ColumnHoverModule,
    PaginationModule,
    QuickFilterModule,
    ValidationModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
    CellStyleModule,
    ClientSideRowModelModule,
    ColumnAutoSizeModule,
    ColumnHoverModule,
    PaginationModule,
    QuickFilterModule,
]);

if (process.env.NODE_ENV !== "production") {
    ModuleRegistry.registerModules([ValidationModule]);
}

export { ColDef, createGrid, GridApi, GridOptions };

/*
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
*/
