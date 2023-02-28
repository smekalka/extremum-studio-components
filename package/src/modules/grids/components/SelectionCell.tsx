import React, { useState } from 'react';
import {
  deselectRow,
  selectRow,
  selectRowsRange,
} from 'ka-table/actionCreators';
import 'ka-table/style.css';
import '../grids.scss';
import { ICellTextProps } from 'ka-table/props';

export const SelectionCell: React.FC<ICellTextProps> = ({
  rowKeyValue,
  dispatch,
  isSelectedRow,
  selectedRows,
}) => {
  const [opacity, setOpacity] = useState(0);
  return (
    <input
      type="checkbox"
      onMouseOver={() => setOpacity(1)}
      onMouseOut={() => setOpacity(0)}
      style={{ opacity: isSelectedRow ? 1 : opacity }}
      checked={isSelectedRow}
      onChange={(event: any) => {
        if (event.nativeEvent.shiftKey) {
          dispatch(selectRowsRange(rowKeyValue, [...selectedRows].pop()));
        } else if (event.currentTarget.checked) {
          dispatch(selectRow(rowKeyValue));
        } else {
          dispatch(deselectRow(rowKeyValue));
        }
      }}
    />
  );
};
