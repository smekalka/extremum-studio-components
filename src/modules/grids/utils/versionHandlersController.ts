import { Dispatch, SetStateAction } from "react";
import { RowsData } from "../types/grid";

export class VersionHandlersController {

  private readonly vscode: any;


  constructor(vscode: any) {
    this.vscode = vscode;
  }

  public gitCompare = (setIsTable: Dispatch<SetStateAction<boolean>>) => () => {
    setIsTable(prevState => !prevState);
  };


  public cancelChanges = (setGridsData: Dispatch<SetStateAction<RowsData | undefined>>, setShowTable: Dispatch<SetStateAction<boolean>>) => () => {
    setGridsData(this.vscode.getState().init);

    this.vscode.setState({
      init: this.vscode.getState().init,
      data: this.vscode.getState().init,
      ids: [],
      changed: [],
      newRows: [],
      removedRows:[]
    });
    setShowTable(true)
  };

}
