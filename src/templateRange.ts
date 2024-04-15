import { window, Range } from 'vscode';


export async function get(template: string): Promise<Range|undefined> {
  
  const editor = window.activeTextEditor;
  
  const lines = template.split("\n");
  const numLines = lines.length;
  const templateRange = new Range(0, 0, numLines-1, lines[numLines-1].length);
  
  const textToSearch = editor?.document.getText(templateRange);
  
  // don't modifiy the global template
  let template2 = template.replaceAll(/([\*\/\[\]\{\}\(\)\?\^\$])/g, "\\$1");
  
  // because vscode "normalizes" \n => \r\n on Windows
  template2 = template2.replaceAll('\n', "\r?\n");
  
  // so any number of whitespaces in %% LMT %% still works
  template2 = template2?.replaceAll(/%%\s*LMT\s*%%/g, "[\\w\\W]*?");  
  
  const regex = new RegExp(template2);
  const found = textToSearch?.match(regex);
  
  if (found?.index || found?.index === 0) {
    const startPos = editor?.document.positionAt(found.index);
    const endPos = editor?.document.positionAt(found.index + found[0].length);
    if (startPos && endPos) return new Range(startPos, endPos);
  }
  else return undefined;  // put at top, no previous found
}