export interface ApiOpenAiChatMessageAdditionalParameters {
    presencePenalty?:number;
    frequencyPenalty?:number;
    logitBias?:Map<string,number>;
}