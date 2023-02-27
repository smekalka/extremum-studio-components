import { Column } from "ka-table/models";
import { RowsData } from "./grid";

export type CustomValidateFunc = (
  value: string,
  column: Column,
) => string | undefined | null;

export type HandlerDataFunc = (data:RowsData) => RowsData
