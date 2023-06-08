import {useEffect, useState} from "react";
import {GridsController} from "../../service/gridsController";
import {HandlerDataFunc} from "../../types/functions";
import {RowsData} from "../../types/grid";

export const useGetGridsList = (controller: GridsController<any>, vscode: any, dataHandler?: HandlerDataFunc) => {
    const [gridsData, setGridsData] = useState<RowsData | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const updateDataFromServe = (isRefresh?: boolean) => {

        setIsLoading(true);
        controller.getAll().then(res => {
            const finalData = dataHandler ? dataHandler(res) : res

            console.log(finalData,"finalData")
            const state = {
                init: finalData,
                data: finalData,
                ids: [],
                changed: [],
                newRows: [],
                removedRows: [],
            }
            vscode.setState(state);

            if (isRefresh === false) {
                vscode.postMessage({command:"updateItemsFromGround",state})

            }

            setGridsData(finalData)
            setIsLoading(false);
        }).catch(err => {
            console.log("Catch error from grids,check columns", err)
            setError(err)
        })
    };

    useEffect(() => {
        window.addEventListener("message", event => {
            console.log(event,"EVEEEEnt")
            if (event.data.data.mesageType === "updateGrids"){
                console.log("AHAHAHAHAH")
                updateDataFromServe()
            }
        });
        console.log(window, "window")

        // @ts-ignore
        console.log(window.additionalWebviewData?.state, "state")
        // const vscodeState = vscode.getState();
        // @ts-ignore
        const vscodeState = window.additionalWebviewData?.state

        // if (!vscodeState) {
        //     vscode.setState({})
        // }
        if (!vscodeState) {
            vscode.setState({})
        } else {
            // @ts-ignore
            vscode.setState(window.additionalWebviewData?.state)
        }


        const dataFromState = vscode.getState().data;

        if (!dataFromState || dataFromState.length === 0) {
            updateDataFromServe();
        } else {
            setGridsData(dataFromState);
        }
    }, []);


    return {gridsData, setGridsData, updateDataFromServe, error, isLoading};
};
