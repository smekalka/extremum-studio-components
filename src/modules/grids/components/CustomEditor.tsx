import React, {
    Dispatch,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import {closeEditor, updateCellValue} from 'ka-table/actionCreators';
import 'ka-table/style.css';
import '../grids.scss';
import {ICellEditorProps} from 'ka-table/props';
import classNames from 'classnames';
import {useOutsideClick} from '../utils/hooks/useOutsideClick';
import TextareaAutosize from 'react-textarea-autosize';
import {isNewRow} from '../utils/isNewRow';
import _ from 'lodash';
import {CustomValidateFunc} from '../types/functions';
import {RowData} from '../types/grid';

export const CustomEditor: React.FC<ICellEditorProps & {
    validate: CustomValidateFunc;
    vscode: any;
    data: any[];
    isEditable: boolean;
    setNewRowData: Dispatch<SetStateAction<{ id: string }>>;
}> = ({
          rowKeyValue,
          column,
          value,
          validate,
          dispatch,
          vscode,
          rowData,
          data,
          setNewRowData,
          isEditable
      }) => {
    const [currentValueError, setCurrentValueError] = useState<string | undefined>(undefined);
    const [editorValue, setValue] = useState(value);

    const editorRef = useRef<HTMLDivElement>(null);

    const onChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = ({
                                                                                currentTarget,
                                                                            }) => {
        if (isEditable) {
            setValue(currentTarget.value);
            if (isNewRow(rowKeyValue)) {
                if (!validate(currentTarget.value, column)) {
                    setNewRowData(prevState => ({
                        ...prevState,
                        [column.key]: currentTarget.value,
                    }));
                } else {
                    setNewRowData(prevState => ({
                        ...prevState,
                        [column.key]: null,
                    }));
                }
            }
        }
    };
    const onCloseHandler = (subjectRef: RefObject<HTMLDivElement>) => {
        if (!currentValueError) {
            if (
                subjectRef.current &&
                editorValue !== value &&
                !isNewRow(rowKeyValue)
            ) {
                const currentCellElement =
                    subjectRef.current.parentElement?.parentElement;
                if (!currentCellElement?.classList.contains('modified-cell')) {
                    currentCellElement?.classList.add('modified-cell');
                }
            }

            rowData[column.key] = editorValue;

            if (!isNewRow(rowKeyValue)) {
                if (editorValue !== value) {
                    const ids = vscode.getState().ids;
                    ids.push(rowData.id);

                    const changed = vscode.getState().changed;

                    const indexOfCopy = changed.findIndex(
                        (changedRow: RowData) => changedRow.id === rowData.id
                    );

                    if (indexOfCopy >= 0) {
                        changed[indexOfCopy] = rowData;
                    } else {
                        changed.push(rowData);
                    }

                    vscode.setState({
                        init: vscode.getState().init,
                        data: data,
                        ids: _.uniq(ids),
                        changed,
                        newRows: vscode.getState().newRows,
                        removedRows: vscode.getState().removedRows,
                    });
                }
            }

            dispatch(closeEditor(rowKeyValue, column.key));
            dispatch(updateCellValue(rowKeyValue, column.key, editorValue));
        }
    };

    useEffect(() => {
        setCurrentValueError(validate(editorValue, column));
    }, [editorValue]);

    useEffect(() => {
        if (currentValueError) {
            dispatch(updateCellValue(rowKeyValue, column.key, editorValue));
        }
    }, [currentValueError]);
    useOutsideClick<HTMLDivElement>(editorRef, onCloseHandler, [
        editorValue,
        currentValueError,
    ]);

    return (
        <div
            className={classNames('custom-editor', {
                'validator-enabled': !!currentValueError,
            }, {'outline-none': !isEditable})}
            ref={editorRef}
        >
            <TextareaAutosize
                placeholder={currentValueError}
                className={classNames('custom-form-control')}
                onChange={onChangeHandler}
                value={editorValue}
                disabled={!isEditable}
            />
        </div>
    );
};
