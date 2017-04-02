declare type $$anyArgumentFunction<X> = (a1?: any, a2?: any, a3?: any, a4?: any, a5?: any, a6?: any, a7?: any, a8?: any, a9?: any, a10?: any)=>X;

declare type $$returnDispatchFunction<X> = (dispatch: X, getState?: ()=>Object)=>any;

declare type $$dispatch = (a: Object | $$anyArgumentFunction<$returnDispatchFunction<$$dispatch>>) => any;