import { IGridOptions } from '../types/configuration';
import { CustomValidateFunc } from '../types/functions';
import { ADDITION_COLUMN, SELECTION_COLUMN } from '../const/uniqueColumnKey';
import { EditingMode, FilteringMode, ITableProps, SortingMode } from 'ka-table';
import { Column } from 'ka-table/models';
import { RowsData } from '../types/grid';

export class GridConfigurator {
  private readonly options: IGridOptions;
  private tablePropsConfigurations!: ITableProps;
  private readonly tableColumns: Array<Column>;
  private readonly rowsData: RowsData;
  private readonly translator: any;

  constructor(
    options: IGridOptions,
    columns: Array<Column>,
    rowsData: RowsData,
    translator: any
  ) {
    this.options = options;
    this.tableColumns = columns;
    this.rowsData = rowsData;
    this.translator = translator;
    this.buildConfiguration();
  }

  private useDefaultValidation: CustomValidateFunc = value => {
    if (!value) {
      return this.translator('Field can not be empty');
    }
  };

  private buildConfiguration = () => {
    this.tablePropsConfigurations = {
      columns: [
        {
          key: SELECTION_COLUMN,
          isEditable: false,
        },
        ...this.tableColumns,
        {
          key: ADDITION_COLUMN,
          width: 60,
        },
      ],
      data: this.rowsData,
      rowKeyField: 'id',
      sortingMode: SortingMode.Single,
      filteringMode: FilteringMode.HeaderFilter,
      editingMode: EditingMode.Cell,
    };
  };

  public getTablePropsConfigurations = () => this.tablePropsConfigurations;

  public useFinalValidation: CustomValidateFunc = (value, column) => {
    if (column.key !== ADDITION_COLUMN) {
      if (this.options.validation) {
        return this.options.validation(value, column);
      } else {
        return this.useDefaultValidation(value, column);
      }
    }
  };
}
