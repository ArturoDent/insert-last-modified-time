import { window, Range } from 'vscode';


export async function get(template: string): Promise<Range|undefined> {
  
  const editor = window.activeTextEditor;
  
  const lines = template.split("\n");
  const numLines = lines.length;
  const templateRange = new Range(0, 0, numLines-1, lines[numLines-1].length);
  
  const textToSearch = editor?.document.getText(templateRange);
  
  // so these symbols don't conflict with the regex created below
  template = template.replaceAll(/([\*\/\[\]\{\}\(\)\?\^\$])/g, "\\$1");
  
  // because vscode "normalizes" \n => \r\n on Windows
  template = template.replaceAll('\n', "\r?\n");
  
  // so any number of whitespaces in %% LMT %% still works
  template = template?.replaceAll(/%%\s*LMT\s*%%/g, "[\\w\\W]*?");
  
  const regex = new RegExp(template);
  const found = textToSearch?.match(regex);
  
  if (found?.index || found?.index === 0) {
    const startPos = editor?.document.positionAt(found.index);
    const endPos = editor?.document.positionAt(found.index + found[0].length);
    if (startPos && endPos) return new Range(startPos, endPos);
  }
  else return undefined;  // put at top, no previous found
}