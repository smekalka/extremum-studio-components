import { IGridOptions } from '../types/configuration';
import { CustomValidateFunc } from '../types/functions';
import { ADDITION_COLUMN, SELECTION_COLUMN } from '../const/uniqueColumnKey';
import { EditingMode, FilteringMode, ITableProps, SortingMode } from 'ka-table';
import { Column } from 'ka-table/models';
import { RowsData } from '../types/grid';
import { TFunction } from 'i18next';

export class GridConfigurator {
  private readonly options: IGridOptions;
  private tablePropsConfigurations!: ITableProps;
  private readonly tableColumns: Array<Column>;
  private readonly rowsData: RowsData;
  private readonly translator: TFunction<
    'translation',
    undefined,
    'translation'
  >;

  constructor(
    options: IGridOptions,
    columns: Array<Column>,
    rowsData: RowsData,
    translator: TFunction<'translation', undefined, 'translation'>
  ) {
    this.options = options;
    this.tableColumns = columns;
    this.rowsData = rowsData;
    this.translator = translator;
    this.buildConfiguration();
  }

  private useDefaultValidation: CustomValidateFunc = value => {
    if (!value) {
      return this.translator('Поле не может быть пустым');
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
        return (
          this.options.validation(value, column) ||
          this.useDefaultValidation(value, column)
        );
      } else {
        return this.useDefaultValidation(value, column);
      }
    }
  };
}
