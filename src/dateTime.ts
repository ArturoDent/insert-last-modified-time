// import * as vscode from 'vscode';
import { Uri, workspace} from 'vscode';



// export async function get(URI: vscode.Uri) {
export async function get(URI: Uri) {
  
  // const fs = vscode.workspace.fs;
  const fs = workspace.fs;
  
  const lastModifiedMS = (await fs.stat(URI)).mtime;
  
  return lastModifiedMS;
}