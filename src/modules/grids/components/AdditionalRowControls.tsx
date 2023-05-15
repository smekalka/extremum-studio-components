import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { closeEditor, deleteRow, updateRow } from 'ka-table/actionCreators';
import { ICellEditorProps } from 'ka-table/props';
import SaveIcon from '../icons/SaveIcon';
import CloseIcon from '../icons/CloseIcon';
import classNames from 'classnames';
import { ADDITION_COLUMN } from '../const/uniqueColumnKey';
import { CREATED_ROW_ID, NEW_ROW_ID } from '../const/componentsId';

export const AdditionalRowControls: React.FC<ICellEditorProps & {
  generateNewId: () => number;
  setInitialNewRow: () => void;
  newRowData: any;
  setIsAdditionNewRow: Dispatch<SetStateAction<boolean>>;
  vscode: any;
}> = ({
  dispatch,
  generateNewId,
  rowData,
  rowKeyField,
  setInitialNewRow,
  newRowData,
  setIsAdditionNewRow,
  vscode,
}) => {
  const [valuesIsAllowable, setValuesIsAllowable] = useState(false);
  useEffect(() => {
    if (Object.values(newRowData).every((value: any) => value)) {
      setValuesIsAllowable(true);
    } else {
      setValuesIsAllowable(false);
    }
  }, [newRowData]);
  const saveAddedRowHandler = () => {
    const transientId = generateNewId();
    const createdRowData = {
      ...rowData,
      [rowKeyField]: `${CREATED_ROW_ID}-${transientId}`,
    };
    dispatch(updateRow(createdRowData));

    vscode.setState({
      init: vscode.getState().init,
      data: [...vscode.getState().data, createdRowData],
      ids: [...vscode.getState().ids, `${CREATED_ROW_ID}-${transientId}`],
      changed: vscode.getState().changed,
      newRows: [...vscode.getState().newRows, createdRowData],
      removedRows: vscode.getState().removedRows,
    });

    dispatch(deleteRow(NEW_ROW_ID));
    dispatch(closeEditor(NEW_ROW_ID, ADDITION_COLUMN));
    setInitialNewRow();
    setIsAdditionNewRow(false);
  };
  const removeAddedRowHandler = () => {
    dispatch(deleteRow(NEW_ROW_ID));
    setInitialNewRow();
    setIsAdditionNewRow(false);
  };

  return (
    <div className="buttons d-flex justify-content-between">
      <button
        disabled={!valuesIsAllowable}
        className={classNames('rowControlsBtn', {
          'opacity-50': !valuesIsAllowable,
        })}
        onClick={saveAddedRowHandler}
      >
        <SaveIcon />
      </button>
      <button className="rowControlsBtn" onClick={removeAddedRowHandler}>
        <CloseIcon />
      </button>
    </div>
  );
};
