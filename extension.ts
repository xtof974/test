import * as vscode from 'vscode';
import ChatGptViewProvider from './chatgpt-view-provider';
import AiChatApiService from './api/core/ai-chat-api.service';

export async function activate(context: vscode.ExtensionContext) {
	const aiChatApiService = new AiChatApiService(context);
	const chatViewProvider = new ChatGptViewProvider(context, aiChatApiService);
	

	context.subscriptions.push(
		vscode.commands.registerCommand('chatgpt-vscode-plugin.askGPT', askChatGPT),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.whyBroken', askGPTWhyBroken),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.explainPls', askGPTToExplain),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.refactor', askGPTToRefactor),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.addTests', askGPTToAddTests),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.resetToken', resetToken),
		vscode.window.registerWebviewViewProvider("chatgpt-vscode-plugin.view", chatViewProvider, {
			webviewOptions: { retainContextWhenHidden: true }
		})
	);

	async function askGPTToExplain() { await askChatGPT('Can you explain what this code does?'); }
	async function askGPTWhyBroken() { await askChatGPT('Why is this code broken?'); }
	async function askGPTToRefactor() { await askChatGPT('Can you refactor this code and explain what\'s changed?'); }
	async function askGPTToAddTests() { await askChatGPT('Can you add tests for this code?'); }

	async function resetToken() {
		await context.globalState.update('chatgpt-session-token', null);
		await context.globalState.update('chatgpt-clearance-token', null);
		await context.globalState.update('chatgpt-user-agent', null);
		await context.globalState.update('chatgpt-api-key', null);  
		await context.globalState.update('chatgpt-api-client-secret', null);
		await context.globalState.update('chatgpt-api-client-id', null);
		await aiChatApiService.ensureApiKey();
		// await vscode.window.showInformationMessage("Token reset, you'll be prompted for it next to you next ask ChatGPT a question.");
	}

	async function askChatGPT(userInput?: string) {
		if (!userInput) {
			userInput = await vscode.window.showInputBox({ prompt: "Ask ChatGPT a question" }) || "";
		}

		let editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedCode = editor.document.getText(vscode.window.activeTextEditor?.selection);
			const entireFileContents = editor.document.getText();

			const code = selectedCode
				? selectedCode
				: `This is the ${editor.document.languageId} file I'm working on: \n\n${entireFileContents}`;

			//chatViewProvider.sendOpenAiApiRequest(userInput, code);

			// Create question by adding prompt prefix to code, if provided
			const question = (code) ? `${userInput}: ${code}` : userInput;
			aiChatApiService.sendChatRequest(question).then((response) =>
			chatViewProvider.sendMessageToWebView({ type: 'addResponse', value: response })
			).catch(async (error) => await vscode.window.showErrorMessage("Error sending request to ChatGPT", error));
			chatViewProvider.sendMessageToWebView({ type: 'addQuestion', value: userInput, code });
		}
	}
}