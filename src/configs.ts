// import * as vscode from 'vscode';
import {workspace, window, WorkspaceConfiguration} from 'vscode';

export const EXTENSION_NAME = "insertLastModifiedTime";

// last modified time (LMT) settings
export interface LMTSettings {
  template: string | undefined,
  locales: string | undefined,
  options: Intl.DateTimeFormatOptions | undefined
};

export interface Options {
  locales?: string,       // optional in Options, required in LMTSettings
  [key:string]: string | undefined;
}


export async function getSettings(): Promise<LMTSettings> {
  
  let configs: WorkspaceConfiguration | undefined;
  const langID = window.activeTextEditor?.document.languageId || '';
  const URI = window.activeTextEditor?.document.uri;
  
  if (!langID)
    configs = workspace.getConfiguration(EXTENSION_NAME);  // this may not be necessary
  else 
    configs= workspace.getConfiguration(EXTENSION_NAME, { languageId: langID, uri: URI });
 
  let template: string = await configs?.get('template') || '';
  let allOptions: Options = await configs?.get('options') || {};
  
  // check if locales is an array
  let { locales, ...options } = allOptions;
  
  // if (!locales) locales = 'en-US';  // to set a default
  if (!locales) locales = undefined;
  
  return {
    template,
    locales,
    options
  };
}