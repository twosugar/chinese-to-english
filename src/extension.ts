// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BaiduTranstlate } from './combine';
let timer = null
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  let { window, languages, commands } = vscode;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "chinese-to-english" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "chinese-to-english.startTranslate",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showWarningMessage(
        "start translate from Chinese-to-English!"
      );
    }
  );
  let provider = new (class implements vscode.HoverProvider {
    async provideHover(
      _document: vscode.TextDocument,
      _position: vscode.Position,
      _token: vscode.CancellationToken
    ) {
      const editor = vscode.window.activeTextEditor;
      const selection = editor && editor.selection;
      // range可能为空
      let range: any = _document.getWordRangeAtPosition(_position);
      let string = range ? _document.getText(range) : "";
      if (selection && !selection.isEmpty) {
        let text = _document.getText(selection);
        // position在selection范围内
        // (selection.contains(range) || ~string.indexOf(text)) && (string = text)
        if (selection.contains(range) || ~string.indexOf(text)) {
          string = text;
        }
      }
      const { translateTool, translateString, humpResult, isZH } = await BaiduTranstlate.getTranslateRes(string);
      const commentCommandUri = vscode.Uri.parse(
        `command:chinese-to-english.helloWorld`
      );
      const hoverText = `**${translateTool}**\n\n ${string}[翻译]: ***[${translateString}](${commentCommandUri})***\n\n${humpResult}`;
      const ms = new vscode.MarkdownString(hoverText);
      ms.isTrusted = true;
      return new vscode.Hover(ms);
    }
  })();

  languages.registerHoverProvider({ scheme: "file", language: "*" }, provider);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
