import * as vscode from 'vscode';
import { ApiChatMessageMsg, ApiChatMessageRequest } from '../config/configuration';

export default class AiChatApiService  {
    //private webView?: vscode.WebviewView;
    private apiClientId?: string;
    private apiClientSecret?: string;
    private messages:ApiChatMessageMsg[] = [];

constructor(private context: vscode.ExtensionContext) {}

public async sendChatRequest(prompt:string, options?:ApiChatMessageRequest): Promise<string> {
    let chatRequest:ApiChatMessageRequest = {
        prompt : prompt,
        messages: this.messages
    }
    await this.ensureApiKey();

        try {
            //this.openAiApi = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
        } catch (error: any) {
            vscode.window.showErrorMessage("Failed to connect to ChatGPT", error?.message);
            throw new Error(error?.message);
        }
   

    // Create question by adding prompt prefix to code, if provided
    //const question = (code) ? `${prompt}: ${code}` : prompt;

   /*  if (!this.webView) {
        await vscode.commands.executeCommand('chatgpt-vscode-plugin.view.focus');
    } else {
        this.webView?.show?.(true);
    } */

    let response: String = '';

    //this.sendMessageToWebView({ type: 'addQuestion', value: prompt, code });
    try {
        //let currentMessageNumber = this.message;
        let completion;
        try {
           /*  completion = await this.openAiApi.createCompletion({
                model: 'code-davinci-003',
                prompt: question,
                temperature: 0.5,
                max_tokens: 2048,
                stop: ['\n\n\n', '<|im_end|>'],
            }); */
            
        } catch (error: any) {
            await vscode.window.showErrorMessage("Error sending request to ChatGPT", error);
            throw new Error(error);
        }

       /*  if (this.message !== currentMessageNumber) {
            return;
        }

        response = completion?.data.choices[0].text || ''; */

        const REGEX_CODEBLOCK = new RegExp('\`\`\`', 'g');
        const matches = response.match(REGEX_CODEBLOCK);
        const count = matches ? matches.length : 0;
        if (count % 2 !== 0) {
            response += '\n\`\`\`';
        }

        console.log("RESPONSE")
        
        //this.sendMessageToWebView({ type: 'addResponse', value: response });
    } catch (error: any) {
        //await vscode.window.showErrorMessage("Error sending request to ChatGPT", error);
        throw new Error(error);
    }

    await this.wait(5000)
    throw new Error('TEST ERROR');
    return 'RESPONSE'
}



  private async wait(msec:number) {
    return new Promise(res => setTimeout(res, msec));
  }

private async isApiKeyExists() : Promise<boolean> {
    this.apiClientId = await this.context.globalState.get('chatgpt-api-client-id') as string;
    this.apiClientSecret = await this.context.globalState.get('chatgpt-api-client-secret') as string;

    return (!!this.apiClientId && !!this.apiClientSecret)
}

public async ensureApiKey() {

    if (!await this.isApiKeyExists()) {
        const apiClientIdInput = await vscode.window.showInputBox({
            prompt: "Please enter your ChatGPT API Client ID",
            ignoreFocusOut: true,
        });
        this.apiClientId = apiClientIdInput!;
        this.context.globalState.update('chatgpt-api-client-id', this.apiClientId);
        const apiClientSecretInput = await vscode.window.showInputBox({
            prompt: "Please enter your ChatGPT API Client Secret",
            ignoreFocusOut: true,
            password:true
        });
        this.apiClientSecret = apiClientSecretInput!;
        this.context.globalState.update('chatgpt-api-client-secret', this.apiClientSecret);
    }
}
}