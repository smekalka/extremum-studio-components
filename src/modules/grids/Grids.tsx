import React, { FC } from 'react';
import { Column } from 'ka-table/models';
import { IGridOptions } from './types/configuration';
import { GridsController } from './service/gridsController';
import { useGetGridsList } from './utils/hooks/useGetGridsList';
import GridsView from './GridsView';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { HandlerDataFunc } from './types/functions';

export interface IGridsProps {
  columns: Array<Column>;
  options: IGridOptions;
  vscode: any;
  controller: GridsController<any>;
  dataHandler?: HandlerDataFunc;
  language: string;
}

const Grids: FC<IGridsProps> = ({
  controller,
  dataHandler,
  language,
  ...gridsViewProps
}) => {
  const {
    gridsData,
    setGridsData,
    updateDataFromServe,
    isLoading,
  } = useGetGridsList(controller, gridsViewProps.vscode, dataHandler);

  return !isLoading ? (
    gridsData && (
      <GridsView
        controller={controller}
        data={gridsData}
        updateDataFromServe={updateDataFromServe}
        setGridsData={setGridsData}
        language={language}
        {...gridsViewProps}
      />
    )
  ) : (
    <Container>
      <Row className="w-100">
        <Col md={12} className="d-flex justify-content-center pt-5">
          <Spinner />
        </Col>
      </Row>
    </Container>
  );
};

export default Grids;
