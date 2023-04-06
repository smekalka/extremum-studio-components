import {v4 as uuidv4} from "uuid";
import {RowsData} from "../types/grid";


export interface IGridsController<T> {
    getAll: () => Promise<Array<T>>;
    createItems: (body: RowsData) => void
    removeItems: (body: RowsData) => void
    updateItems: (body: RowsData) => void
}

type MsgFromController = {
    command: string,
    request: {
        id: string,
        path: string,
    }
}

type ResAndRejPromise<T> =
    {
        resolve: (value: (T[] | PromiseLike<T[]>)) => void;
        reject: (reason?: any) => void;
    }

type GetAllHandler = (
    postMsg: () => void
) => void
type CRUDItemsHandler = (
    postMsg: () => void
) => void

export abstract class GridsController<T> implements IGridsController<T> {

    private readonly vscode: any;
    private readonly waitSet = new Map<string, { promise: Promise<Array<T>>, resAndRejPromise: ResAndRejPromise<T> }>();
    private readonly modelName: string;
    private readonly itemIdType: string;
    private readonly itemSDKPath:string

    protected constructor(vscode: any, modelName, itemIdType: string,itemSDKPath:string) {
        this.vscode = vscode;
        this.modelName = modelName;
        this.itemIdType = itemIdType;
        this.itemSDKPath = itemSDKPath;
        this.addMessageHandler();

    }

    private addMessageHandler = () => {
        window.addEventListener("message", event => {
            const message = event.data; // The JSON data our extension sent
            if (message.data.id) {
                this.waitSet.get(message.data.id).resAndRejPromise.resolve(message.data.data);
            }
        });
    };


    public getAll() {
        const requestId = uuidv4();
        const resAndRejPromise: ResAndRejPromise<T> = {} as ResAndRejPromise<T>;

        const postMsg = () => {
            const message: MsgFromController = {
                command: "get-list",
                request: {
                    id: requestId,
                    path:this.itemSDKPath,
                }
            };
            this.vscode.postMessage(message);
        }
        this.waitSet.set(requestId, {
            promise: new Promise((resolve, reject) => {
                resAndRejPromise.resolve = resolve;
                resAndRejPromise.reject = reject;
            }), resAndRejPromise
        });
        this.getAllHandler(postMsg);

        const requestPromise = this.waitSet.get(requestId);

        return requestPromise!.promise;
    }

    public updateItems(body: RowsData) {
        const postMsg = () => {
            this.postMsgOnCRUDOperation(body, 'update-items');
        }
        this.updateItemsHandler(postMsg);
    }

    public removeItems(body: RowsData) {
        const postMsg = () => {
            this.postMsgOnCRUDOperation(body, 'remove-items');
        }
        this.removeItemsHandler(postMsg);
    }

    public createItems(body: RowsData) {
        const postMsg = () => {
            this.postMsgOnCRUDOperation(body, 'create-items');
        }
        this.createItemsHandler(postMsg);
    }


    private postMsgOnCRUDOperation = (body: RowsData, command: string) => {
        const {modelName, itemIdType} = this
        const messageOnCreateItems = {
            command,
            path: this.itemSDKPath,
            itemIdType,
            modelName,
            body
        };
        this.vscode.postMessage(messageOnCreateItems)
    }

    protected abstract getAllHandler: GetAllHandler;
    protected abstract createItemsHandler: CRUDItemsHandler;
    protected abstract removeItemsHandler: CRUDItemsHandler;
    protected abstract updateItemsHandler: CRUDItemsHandler;
}
