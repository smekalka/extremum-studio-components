import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { ITableProps, kaReducer, Table } from 'ka-table';
import { ChildComponents } from 'ka-table/models';
import { DispatchFunc } from 'ka-table/types';
import 'ka-table/style.css';
import './grids.scss';
import { generateNewId } from './utils/generateNewId';
import GridToolbar, {
  IToolbarAction,
  IToolbarActions,
} from './grid-toolbar/GridToolbar';
import { kaPropsUtils } from 'ka-table/utils';
import FilterIcon from './icons/FilterIcon';
import classNames from 'classnames';
import { CustomEditor } from './components/CustomEditor';
import { AdditionalRowControls } from './components/AdditionalRowControls';
import { SelectionHeader } from './components/SelectionHeader';
import { SelectionCell } from './components/SelectionCell';
import { ADDITION_COLUMN, SELECTION_COLUMN } from './const/uniqueColumnKey';
import { isCreatedRow, isNewRow } from './utils/isNewRow';
import { VersionHandlersController } from './utils/versionHandlersController';
import { DefaultActionsHandler } from './utils/defaultActionsHandler';
import ChangesManager from './сhanges-manager/ChangesManager';
import CompareIcon from './icons/CompareIcon';
import PlusIcon from './icons/PlusIcon';
import PushIcon from './icons/PushIcon';
import RedoIcon from './icons/RedoIcon';
import TrashIcon from './icons/TrashIcon';
import RefreshIcon from './icons/RefreshIcon';
import { NEW_ROW_ID } from './const/componentsId';
import { GridConfigurator } from './utils/gridConfigurator';
import { IGridsProps } from './Grids';
import { RowsData } from './types/grid';
import { useTranslation } from 'react-i18next';

export interface IGridsViewProps {
  data: RowsData;
  setGridsData: Dispatch<SetStateAction<RowsData | undefined>>;
  updateDataFromServe: () => void;
}

const GridsView: FC<Omit<IGridsProps, 'controller' | 'dataHandler'> &
  IGridsViewProps> = ({
  columns,
  data,
  vscode,
  setGridsData,
  options,
  updateDataFromServe,
}) => {
  const { t } = useTranslation();
  const gridConfigurator = new GridConfigurator(options, columns, data, t);
  const [showTable, setShowTable] = useState(true);
  const [isAdditionNewRow, setIsAdditionNewRow] = useState(false);

  const [tableProps, changeTableProps] = useState(
    gridConfigurator.getTablePropsConfigurations()
  );

  useEffect(() => {
    changeTableProps(prevState => ({
      ...prevState,
      data,
    }));
  }, [data]);
  const dispatch: DispatchFunc = action => {
    changeTableProps((prevState: ITableProps) => kaReducer(prevState, action));
  };

  const defaultActionsHandler = new DefaultActionsHandler(
    tableProps,
    dispatch,
    vscode,
    setGridsData
  );

  const versionHandlersController = new VersionHandlersController(vscode);

  const selectedData = kaPropsUtils.getSelectedData(tableProps);

  const generateId = generateNewId(tableProps.data ? tableProps.data : data);
  const initialNewRow = columns.reduce(
    (acc, currentValue) => {
      return {
        ...acc,
        [currentValue.key]: '',
      };
    },
    { id: NEW_ROW_ID }
  );
  const [newRowData, setNewRowData] = useState(initialNewRow);

  const childComponents: ChildComponents = {
    cell: {
      elementAttributes: ({ rowKeyValue, column, rowKeyField }) => {
        const cellClassNames = [];
        const initData: Array<any> = vscode.getState().init;
        const changedItems: Array<any> = vscode.getState().changed;
        const changedRow = changedItems.find(
          row => row[rowKeyField] === rowKeyValue
        );

        if (isCreatedRow(rowKeyValue)) {
          cellClassNames.push('created-row-cell');
        } else if (changedRow) {
          const initDataRow = initData.find(
            row => row[rowKeyField] === rowKeyValue
          );
          if (initDataRow[column.key]) {
            if (changedRow[column.key] !== initDataRow[column.key]) {
              cellClassNames.push('modified-cell');
            }
          }
        }

        return {
          className: cellClassNames.join(' '),
        };
      },
    },
    cellEditor: {
      content: props => {
        if (
          props.column.key === ADDITION_COLUMN &&
          isNewRow(props.rowKeyValue)
        ) {
          return (
            <AdditionalRowControls
              setInitialNewRow={() => {
                setNewRowData(initialNewRow);
              }}
              newRowData={newRowData}
              generateNewId={generateId}
              setIsAdditionNewRow={setIsAdditionNewRow}
              vscode={vscode}
              {...props}
            />
          );
        } else if (props.column.key === ADDITION_COLUMN) {
          return <></>;
        } else {
          return (
            <CustomEditor
              setNewRowData={setNewRowData}
              validate={gridConfigurator.useFinalValidation}
              {...props}
              vscode={vscode}
              data={data}
              rowData={props.rowData}
            />
          );
        }
      },
    },
    filterRowCell: {
      content: props => {
        if (props.column.key === SELECTION_COLUMN) {
          return <></>;
        }
      },
    },
    cellText: {
      content: props => {
        if (props.column.key === SELECTION_COLUMN) {
          return <SelectionCell {...props} />;
        }
      },
    },
    headCell: {
      content: props =>
        props.column.key === SELECTION_COLUMN ? (
          <SelectionHeader
            {...props}
            areAllRowsSelected={kaPropsUtils.areAllFilteredRowsSelected(
              tableProps
            )}
            selectedData={selectedData}
          />
        ) : (
          props.column.key === ADDITION_COLUMN && <></>
        ),
    },
    headFilterButton: {
      content: () => <FilterIcon />,
    },
    noDataRow: {
      content: () => 'No Data Found',
    },
  };

  const defaultActions: Array<IToolbarAction> = [
    {
      icon: <PlusIcon />,
      callback: defaultActionsHandler.addNewRow(
        newRowData,
        tableProps.rowKeyField,
        setIsAdditionNewRow
      ),
      show: showTable && !isAdditionNewRow,
    },
    {
      icon: <TrashIcon />,
      callback: defaultActionsHandler.removeSelectedRow,
      show: showTable && selectedData.length > 0,
    },
    {
      icon: <RefreshIcon />,
      callback: updateDataFromServe,
      show: showTable,
    },
  ];

  const gridsHaveChanges =
    vscode.getState().changed.length > 0 ||
    vscode.getState().newRows.length > 0 ||
    vscode.getState().removedRows.length > 0;
  const versionsControlActions = [
    {
      icon: <CompareIcon />,
      callback: versionHandlersController.gitCompare(setShowTable),
      show: gridsHaveChanges,
    },
    {
      icon: <PushIcon />,
      callback: versionHandlersController.gitCompare(setShowTable),
      show: !showTable && gridsHaveChanges,
    },
    {
      icon: <RedoIcon />,
      callback: versionHandlersController.cancelChanges(
        setGridsData,
        setShowTable
      ),
      show: !showTable && gridsHaveChanges,
    },
  ];
  const actions: IToolbarActions = options.toolbarActions
    ? {
        defaultActions: [...options.toolbarActions, ...defaultActions],
        versionsControlActions,
      }
    : { defaultActions, versionsControlActions };

  return (
    <div className={classNames('girdsWrapper')}>
      <GridToolbar
        data={data}
        vscode={vscode}
        tableProps={tableProps}
        actions={actions}
        dispatch={dispatch}
        isTable={showTable}
      />
      {showTable ? (
        <Table
          {...tableProps}
          dispatch={dispatch}
          childComponents={childComponents}
        />
      ) : (
        <ChangesManager vscode={vscode} />
      )}
    </div>
  );
};

export default GridsView;
