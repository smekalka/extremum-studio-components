import { CREATED_ROW_ID, NEW_ROW_ID } from '../const/componentsId';

export const isNewRow = (rowKeyValue: string) =>
  rowKeyValue.startsWith(NEW_ROW_ID);

export const isCreatedRow = (rowKeyValue: string) =>
  rowKeyValue.startsWith(CREATED_ROW_ID);
