import {CREATED_ROW_ID, NEW_ROW_ID} from '../const/componentsId';

export const isNewRow = (rowKeyValue: string) => {
    return rowKeyValue.startsWith(NEW_ROW_ID);

}

export const isCreatedRow = (rowKeyValue: string) => {
    return rowKeyValue.startsWith(CREATED_ROW_ID);

}
