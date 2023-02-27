import { CustomValidateFunc } from "./functions";
import { IToolbarAction } from "../grid-toolbar/GridToolbar";
//TODO - походу распространения гридов - добавлять сюда необходимые настройки
export interface IGridOptions {
  validation?: CustomValidateFunc;
  toolbarActions?: Array<IToolbarAction>;
}
