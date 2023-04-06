import {Dispatch, SetStateAction} from 'react';
import {RowsData} from '../types/grid';
import {GridsController} from "../service/gridsController";

export class VersionHandlersController {
    private readonly vscode: any;
    private readonly controller:GridsController<any>
    constructor(vscode: any,controller:GridsController<any>) {
        this.vscode = vscode;
        this.controller = controller;
    }

    public gitCompare = (setIsTable: Dispatch<SetStateAction<boolean>>) => () => {
        setIsTable(prevState => !prevState);
    };

    public pushChanges = (
        setShowTable: Dispatch<SetStateAction<boolean>>,
        updateDataFromServe: () => void
    ) => () => {
        this.controller.updateItems(this.vscode.getState().changed)
        this.controller.createItems(this.vscode.getState().newRows)
        this.controller.removeItems(this.vscode.getState().removedRows)

        this.vscode.setState({
            init: this.vscode.getState().init,
            data: this.vscode.getState().init,
            ids: [],
            changed: [],
            newRows: [],
            removedRows: [],
        });
        setShowTable(true);
        updateDataFromServe();
    }

    public cancelChanges = (
        setGridsData: Dispatch<SetStateAction<RowsData | undefined>>,
        setShowTable: Dispatch<SetStateAction<boolean>>
    ) => () => {
        setGridsData(this.vscode.getState().init);

        this.vscode.setState({
            init: this.vscode.getState().init,
            data: this.vscode.getState().init,
            ids: [],
            changed: [],
            newRows: [],
            removedRows: [],
        });
        setShowTable(true);
    };

}
