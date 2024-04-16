// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  ExtensionContext,
  languages,
  commands,
  Disposable,
  workspace,
  window,
} from "vscode";
import { CodelensProvider } from "./provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const codelensProvider = new CodelensProvider();

  languages.registerCodeLensProvider("*", codelensProvider);

  commands.registerCommand("codelens.enableCodeLens", () => {
    workspace.getConfiguration("codelens").update("enableCodeLens", true, true);
  });

  commands.registerCommand("codelens.disableCodeLens", () => {
    workspace
      .getConfiguration("codelens")
      .update("enableCodeLens", false, true);
  });

  commands.registerCommand("codelens.codelensAction", (args: any) => {
    window.showInformationMessage(`CodeLens action clicked with args=${args}`);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
