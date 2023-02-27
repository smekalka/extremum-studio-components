import React, { useState } from 'react';
import {
  deselectAllFilteredRows,
  selectAllFilteredRows,
} from 'ka-table/actionCreators';
import 'ka-table/style.css';
import '../grids.scss';
import { IHeadCellProps } from 'ka-table/props';

export const SelectionHeader: React.FC<
  IHeadCellProps & { selectedData: any[] }
> = ({ dispatch, areAllRowsSelected, selectedData }) => {
  const [opacity, setOpacity] = useState(0);

  return (
    <input
      type="checkbox"
      onMouseOver={() => setOpacity(1)}
      onMouseOut={() => setOpacity(0)}
      style={{
        opacity: areAllRowsSelected || selectedData.length > 0 ? 1 : opacity,
      }}
      checked={areAllRowsSelected}
      onChange={(event) => {
        if (event.currentTarget.checked) {
          dispatch(selectAllFilteredRows());
        } else {
          dispatch(deselectAllFilteredRows());
        }
      }}
    />
  );
};
