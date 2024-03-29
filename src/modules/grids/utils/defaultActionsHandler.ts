import { insertRow, openEditor } from 'ka-table/actionCreators';
import { DispatchFunc } from 'ka-table/types';
import { ADDITION_COLUMN } from '../const/uniqueColumnKey';
import { ITableProps } from 'ka-table';
import { kaPropsUtils } from 'ka-table/utils';
import { Dispatch, SetStateAction } from 'react';
import { RowData, RowsData } from '../types/grid';
import {CREATED_ROW_ID} from "../const/componentsId";

export class DefaultActionsHandler {
  private readonly dispatch: DispatchFunc;
  private readonly vscode: any;
  private readonly tableProps: ITableProps;
  private readonly setGridsData: Dispatch<SetStateAction<RowsData | undefined>>;

  constructor(
    tableProps: ITableProps,
    dispatch: DispatchFunc,
    vscode: any,
    setGridsData: Dispatch<SetStateAction<RowsData | undefined>>
  ) {
    this.dispatch = dispatch;
    this.tableProps = tableProps;
    this.vscode = vscode;
    this.setGridsData = setGridsData;
  }

  public addNewRow = (
    newRowData: { [key: string]: any },
    rowKeyField: string,
    setIsAdditionNewRow: Dispatch<SetStateAction<boolean>>
  ) => () => {
    this.dispatch(insertRow(newRowData));
    this.dispatch(openEditor(newRowData[rowKeyField], ADDITION_COLUMN));
    Object.keys(newRowData)
      .splice(1)
      .forEach(key => this.dispatch(openEditor(newRowData[rowKeyField], key)));
    setIsAdditionNewRow(true);
  };

  public removeSelectedRow = () => {
    const selectedDataIds = kaPropsUtils
      .getSelectedData(this.tableProps)
      ?.map(selected => selected.id);

    const dataWithoutRemoved = this.vscode
      .getState()
      .data.filter((row: RowData) => !selectedDataIds.includes(row.id));
    const changedWithoutRemoved = this.vscode
      .getState()
      .changed.filter(
        (changed: RowData) => !this.vscode.getState().ids.includes(changed.id)
      );
    const createdWithoutRemoved = this.vscode
      .getState()
      .newRows.filter(
        (created: RowData) => {
          return !((kaPropsUtils.getSelectedData(this.tableProps)).map(element=>element.id).includes(created.id))
        }
      );

    const state = {
      init: this.vscode.getState().init,
      data: dataWithoutRemoved,
      ids: this.vscode.getState().ids,
      changed: changedWithoutRemoved,
      newRows: createdWithoutRemoved,
      removedRows: (kaPropsUtils.getSelectedData(this.tableProps)).filter( item =>!item.id.startsWith(CREATED_ROW_ID)) || [],
    }
    this.vscode.setState(state);

    this.vscode.postMessage({command:"removeItem",state})
    this.setGridsData(dataWithoutRemoved);

  };
}
