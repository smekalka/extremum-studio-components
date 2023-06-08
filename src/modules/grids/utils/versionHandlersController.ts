import {Dispatch, SetStateAction} from 'react';
import {RowsData} from '../types/grid';

export class VersionHandlersController {
    private readonly vscode: any;

    // private readonly controller: GridsController<any>

    constructor(vscode: any) {
        this.vscode = vscode;
        // this.controller = controller;
    }

    public gitCompare = (setIsTable: Dispatch<SetStateAction<boolean>>) => () => {
        setIsTable(prevState => !prevState);
    };

    public pushChanges = (
        setShowTable: Dispatch<SetStateAction<boolean>>,
        updateDataFromServe: () => void
    ) => () => {
        // this.controller.updateItems(this.vscode.getState().changed)
        // this.controller.createItems(this.vscode.getState().newRows)
        // this.controller.removeItems(this.vscode.getState().removedRows)


        this.vscode.postMessage({
            command: "pushChanges",
            state: {
                correctItems: this.vscode.getState().data,
                ...this.vscode.getState()
            }
        })

        this.vscode.setState({
            init: this.vscode.getState().init,
            data: this.vscode.getState().init,
            ids: [],
            changed: [],
            newRows: [],
            removedRows: [],
        });


        setShowTable(true);
        updateDataFromServe
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

        this.vscode.postMessage({
            command: "cancelChanges",
            state: {
                init: this.vscode.getState().init,
                data: this.vscode.getState().init,
                ids: [],
                changed: [],
                newRows: [],
                removedRows: [],
            }
        })
        setShowTable(true);
    };

}
