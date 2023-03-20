import {CustomValidateFunc} from './functions';
import {IToolbarAction} from '../grid-toolbar/GridToolbar';
import {AttributeTableData} from "ka-table/models";
import {IDataRowProps} from "ka-table/props";
import React, {PropsWithChildren} from "react";

//TODO - походу распространения гридов - добавлять сюда необходимые настройки
export interface IGridOptions {
    validation?: CustomValidateFunc;
    toolbarActions?: Array<IToolbarAction>;
    onRowClickHandler?: (gridsProps:PropsWithChildren<IDataRowProps>,e: React.MouseEvent<HTMLElement, MouseEvent>, extendedEvent: AttributeTableData<IDataRowProps>) => void
}
