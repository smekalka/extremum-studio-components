import { useEffect, useState } from "react";
import { GridsController } from "../../service/gridsController";
import { HandlerDataFunc } from "../../types/functions";
import { RowsData } from "../../types/grid";

export const useGetGridsList = (controller: GridsController<any>, vscode: any, dataHandler?: HandlerDataFunc) => {
  const [gridsData, setGridsData] = useState<RowsData | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const updateDataFromServe = () => {

    setIsLoading(true);
    controller.getAll().then(res => {
      const finalData = dataHandler ? dataHandler(res) : res


      vscode.setState({
        init: finalData,
        data: finalData,
        ids: [],
        changed: [],
        newRows: [],
        removedRows:[],
      });

      setGridsData(finalData)
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const vscodeState = vscode.getState();

    if (!vscodeState){
      vscode.setState({})
    }

    const dataFromState = vscode.getState().data;

    if (!dataFromState || dataFromState.length === 0) {
      updateDataFromServe();
    } else {
      setGridsData(dataFromState);
    }
  }, []);
  useEffect(()=>{
    console.log(gridsData,"GRIDSDATA")
  },[gridsData])

  return { gridsData, setGridsData, updateDataFromServe, error, isLoading };
};
