import { ApiOpenAiChatMessageAdditionalParameters } from "./configuration.open-ai";

/* export interface ApiConfiguration {
    clientId: string;
    clientSecret:string;
} */

export interface ApiChatMessageMsg {
    role:string;
    text:string;
}

export interface ApiChatMessageError {
    code:string;
    label:string;
}

export interface ApiChatMessageRequest {
    model? :string;
    prompt:string;
    topP?:number;
    temperature?:number;
    maxCandidate?:number;
    maxToken?:number;
    stopSequences?:string[];
    messages:ApiChatMessageMsg[];
    additionalParameters?: ApiOpenAiChatMessageAdditionalParameters | Object ;
    includeRaw?:boolean;
}

export interface ApiChatMessageResponse {
    candidates:ApiChatMessageMsg[];
    rawResponse?:Object;
}