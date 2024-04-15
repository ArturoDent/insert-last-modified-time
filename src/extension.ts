import * as vscode from 'vscode';
import { getSettings } from "./configs";
import * as dateTime from "./dateTime";
import * as templateRange from "./templateRange";
import * as codeActions from "./codeActions";

// globals defined in 'global.d.ts' 

// declare global {
//   let previousTemplate: string | undefined;
//   let currentTemplate: string | undefined;
// }

export async function activate(context: vscode.ExtensionContext) {
  
  // let { template : previousTemplate, template : currentTemplate} = await getSettings();
  
  // prepare for a keybinding too
	let disposable = vscode.commands.registerCommand('insert-last-modified-time.insertTimeTop', async (args) => {

    // args is not null when from a keybinding only
    let position: vscode.Position | vscode.Range;    
    const editor = vscode.window?.activeTextEditor;
    
    if (!editor) return;
    
    let timeMS: number;
    const thisURI: vscode.Uri | undefined = editor.document?.uri;
    
    if (!thisURI) return;
    else if (thisURI.scheme === 'vscode-data') return;  // settings and keybindings
    else timeMS = await dateTime.get(thisURI);
    
    let { template, locales, options } = await getSettings();
    // if (currentTemplate !== template) {
    //   previousTemplate = currentTemplate;
    //   currentTemplate = template;
    // }
    
    // in the document
    const replaceRange: vscode.Range | undefined = await templateRange.get(String(template));
    
    const lmt = new Intl.DateTimeFormat(locales, options).format(timeMS);
    
    template = template?.replaceAll(/%%\s*LMT\s*%%/g, lmt);
    
    // if no replaceRange, insert at top
    if (!replaceRange) {
      position = new vscode.Position(0, 0);
      template += '\n';
    }
    else position = replaceRange;
    
    if (position)
      editor.edit(editBuilder => {
        editBuilder.replace(position, String(template));
      });
  });
  
  context.subscriptions.push(disposable);
  codeActions.makeCodeActionProvider(context, 'insert-last-modified-time.insertTimeTop');
  
   // prepare for a keybinding too
	let disposable2 = vscode.commands.registerCommand('insert-last-modified-time.insertTimeCursor', async (args) => {
    // args is not null when from a keybinding only

    let position: vscode.Position;    
    const editor = vscode.window?.activeTextEditor;
    
    if (!editor) return;
    
    if (editor?.selection) position = editor?.selection.active;
    else return;
    
    let timeMS: number;
    const thisURI: vscode.Uri | undefined = editor.document?.uri;
    
    if (!thisURI) return;
    else if (thisURI.scheme === 'vscode-data') return;  // settings and keybindings
    else timeMS = await dateTime.get(thisURI);
    
    const { locales, options } = await getSettings(); 
    
    const lmt = new Intl.DateTimeFormat(locales, options).format(timeMS);
    
    if (position)
      editor.edit(editBuilder => {
        editBuilder.replace(position, lmt);
      });
    
 });
  context.subscriptions.push(disposable2);
  
  // ---------------------------------------------------------------------------------------------

  // const configChange = vscode.workspace.onDidChangeConfiguration(async (event) => {

  //   if (event.affectsConfiguration(EXTENSION_NAME)) {  // decorateFiles
      
  //     await getSettings();

  //     // are all the options valid?
  //     if (event.affectsConfiguration(`${EXTENSION_NAME}.options`)) {
        
        // if (options.dateStyle || options.timeStyle) {
        //   if (options.weekday || options.hour || options.month || options.year || options.day ||
        //     options.minute || options.second || options.fractionalSecondDigits) {
            
        //     vscode.window
        //       .showErrorMessage(`You cannot use the options 'dateStyle' or 'timeStyle' with options like 'hour', 'month', etc..`,
        //         ...['Fix setting', 'Ignore'])   // two buttons
        //       .then(selected => {
        //         if (selected === 'Fix setting') vscode.commands.executeCommand('workbench.action.openSettingsJson', { revealSetting: { key: 'insertLastModifiedTime.options' } });  // seems to do the same as realSetting
        //         // vscode.commands.executeCommand('workbench.action.openSettingsJson', { revealSetting: { key: badSetting, edit: true } });  // seems to do the same as realSetting
        //         else vscode.commands.executeCommand('leaveEditorMessage');
        //       });
        //   }
        // }
  //     }
            
            

  //     if (event.affectsConfiguration(`${EXTENSION_NAME}.template`)) {
        
  //       // is the template valid? contains '%% LMT %%'
  //     }
  //   }
  // });
  // context.subscriptions.push(configChange);
}

export function deactivate() {}
