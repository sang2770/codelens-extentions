import * as vscode from "vscode";

export class CodelensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();
  onDidChangeCodeLenses?: vscode.Event<void> =
    this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = /^[-=+@;]/gm;
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    if (
      vscode.workspace.getConfiguration("codelens").get("enableCodeLens", true)
    ) {
      this.codeLenses = [];
      const regex = new RegExp(this.regex);
      const text = document.getText();
      let matches;
      while ((matches = regex.exec(text)) !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line);
        const indexOf = line.text.indexOf(matches[0]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = document.getWordRangeAtPosition(
          position,
          new RegExp(/[-=+@;]\d+/)
        );
        // const word = line.text.split(" ").at(0);
        if (range) {
          const word = document.getText(range);
          this.codeLenses.push(
            new vscode.CodeLens(range, {
              title: `Text start with special char: ${word}`,
              command: "codelens.codelensAction",
              arguments: [word, true],
            })
          );
        }
      }
      return this.codeLenses;
    }
  }
  resolveCodeLens?(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens> {
    if (
      vscode.workspace.getConfiguration("codelens").get("enableCodeLens", true)
    ) {
      console.log(codeLens);
      //   codeLens.command = {
      //     title: "Codelens provided by sample extension",
      //     tooltip: "Tooltip provided by sample extension",
      //     command: "codelens.codelensAction",
      //     arguments: ["Argument 1", false],
      //   };
      return codeLens;
    }
    return null;
  }
}
