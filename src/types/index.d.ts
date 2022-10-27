declare let _spPageContextInfo: any;

declare module SPClientTemplates {
    export const TemplateManager: any
}

declare module SP {
    export const UI: any
}

declare function ExecuteOrDelayUntilScriptLoaded(callback: () => void, script: string);
declare function GetCtxFromView(viewId: string);
declare function AJAXRefreshView(event: any, state: any);
