import { ExtensionContext, languages, Command, CodeAction, CodeActionKind } from 'vscode';


// export async function makeCodeActionProvider (context: ExtensionContext, codeActionCommands: Command[]) {
export async function makeCodeActionProvider (context: ExtensionContext, codeActionCommand: string) {

	context.subscriptions.push(
		languages.registerCodeActionsProvider('*',
			{
				provideCodeActions() {

					const commandArray = [];

					// for (const command of codeActionCommand) {
					// 	commandArray.push(_createCommand(command));
          // }
          
          commandArray.push(_createCommand(codeActionCommand));
					return commandArray;
				}
			},
			{
				providedCodeActionKinds: [CodeActionKind.Source]
			})
	);
}

/**
 * 
 */
function _createCommand(command: string): CodeAction {
	const action = new CodeAction(`Insert Last Modified Time at top of file`, CodeActionKind.Source.append(`${command}`));
	action.command = { command: `insert-last-modified-time.insertTimeTop`, title: `Insert Last Modified Time at top of file` };
	return action;
}