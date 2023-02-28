import { v4 as uuidv4 } from "uuid";



export interface IGridsController<T> {
  getAll: () => Promise<Array<T>>;
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
  postMsg: (path: string) => void
) => void

// export function getAllHandler(path: string,vscode:any) {
//   const message: MsgFromController = {
//     command: "get-list",
//     request: {
//       id: requestId,
//       path: "signals.subscriptions"
//     }
//   };
//   vscode.postMessage(message);
//   console.log(path,"path")
//   return function(target: any, method: string, descriptor: PropertyDescriptor) {
//     console.log(target.vscode,"target")
//     return descriptor.value
//   };
// }

export abstract class GridsController<T> implements IGridsController<T> {

  private readonly vscode: any;
  private readonly waitSet = new Map<string, { promise: Promise<Array<T>>, resAndRejPromise: ResAndRejPromise<T> }>();

  protected constructor(vscode: any) {
    this.vscode = vscode;
    this.addMessageHandler();
  }

  private addMessageHandler = () => {
    window.addEventListener("message", event => {
      const message = event.data; // The JSON data our extension sent
      if (message.data.id) {

        this.waitSet.get(message.data.id)?.resAndRejPromise.resolve(message.data.data);
      }
    });
  };


  public getAll() {
    console.log("call")
    const requestId = uuidv4();
    const resAndRejPromise: ResAndRejPromise<T> = {} as ResAndRejPromise<T>;
    const postMsg = (path:string) =>{
      const message: MsgFromController = {
        command: "get-list",
        request: {
          id: requestId,
          path
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
    console.log(this.waitSet,"wait",this.vscode)
    this.getAllHandler(postMsg);
    const requestPromise = this.waitSet.get(requestId);
    return requestPromise!.promise;
  }

  protected abstract getAllHandler: GetAllHandler;

}
