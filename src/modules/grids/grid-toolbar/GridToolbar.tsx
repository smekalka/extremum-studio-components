import React, { FC, ReactElement, ReactNode} from "react";
import { ButtonToolbar } from "react-bootstrap";
import { search } from "ka-table/actionCreators";
import { DispatchFunc } from "ka-table/types";
import { ITableProps } from "ka-table";
import SearchIcon from "../icons/SearchIcon";
import classNames from "classnames";
import { RowsData } from "../types/grid";


export interface IToolbarActions {
  defaultActions: Array<IToolbarAction>,
  versionsControlActions: Array<IToolbarAction>
}

export interface IToolbarAction {
  icon: ReactElement | ReactNode;
  callback: () => void;
  show: boolean;
}

interface IGridToolbarProps {
  vscode: any;
  actions: IToolbarActions;
  dispatch: DispatchFunc;
  tableProps: ITableProps;
  isTable: boolean;
  data: RowsData;
}

const GridToolbar: FC<IGridToolbarProps> = ({
                                              vscode,
                                              actions,
                                              dispatch,
                                              tableProps,
                                              isTable,
                                            }) => {
  return (
    <div className="toolbarWrapper d-flex justify-content-between">
      <ButtonToolbar>
        {actions.defaultActions.map((action, i) => (
          <a
            key={i}
            className={classNames(
              "toolbarBtn",
              "action-label",
              { "opacity-50": !action.show },
              !action.show && "Disable"
            )}
            onClick={action.callback}
          >
            {action.icon}
          </a>
        ))}
      </ButtonToolbar>
      <div className="d-flex align-items-center me-4">
        <span
          className="me-4 fw-semibold">Changes: {vscode.getState().changed?.length + vscode.getState().newRows?.length + vscode.getState().removedRows?.length}</span>

        <ButtonToolbar>
          {actions.versionsControlActions.map((action, i) => (
            <a
              key={i}
              className={classNames(
                "toolbarBtn",
                "action-label",
                { "opacity-50": !action.show },
                !action.show && "Disable"
              )}
              onClick={action.callback}
            >
              {action.icon}
            </a>
          ))}
        </ButtonToolbar>
      </div>
      <div
        className={classNames(
          "searchWrapper",
          { "opacity-50": !isTable },
          !isTable && "Disable"
        )}
      >
        <input
          type="search"
          defaultValue={tableProps.searchText}
          onChange={(event) => {
            dispatch(search(event.currentTarget.value));
          }}
          className="top-element"
        />
        <div className="searchIcon position-absolute">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};
export default GridToolbar;
