// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BaiduTranstlate } from './combine';
import { insert } from './actions/translateAndInsert';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  let { window, languages, commands } = vscode;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "chinese-to-english" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "chinese-to-english.startTranslate",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      window.showInformationMessage(
        "Start Translate From Chinese-to-English!"
      );
    }
  );

  let insertContent = commands.registerCommand('chinese-to-english.getHumpResult', async () => {
    // const editor = vscode.window.activeTextEditor;
    // // createAnnotation.headerAnnotation(editor);
    const editor = vscode.window.activeTextEditor;
    const selection = editor && editor.selection;
    const text: string = editor?.document.getText(selection) || '';
    const { humpResult } = await BaiduTranstlate.getTranslateRes(text);
    insert(humpResult);
  });

  let provider = new (class implements vscode.HoverProvider {
    async provideHover(
      _document: vscode.TextDocument,
      _position: vscode.Position,
      _token: vscode.CancellationToken
    ) {
      const editor = vscode.window.activeTextEditor;
      const selection = editor && editor.selection;
      // range可能为空
      //获取选择区域位置
      let range: any = _document.getWordRangeAtPosition(_position);
      //根据位置确定内容
      let string = range ? _document.getText(range) : "";
      if (selection && !selection.isEmpty) {
        let text = _document.getText(selection);
        if (selection.contains(range)) {
          string = text;
        }
      }
      const { translateTool, translateString, humpResult, isZH } = await BaiduTranstlate.getTranslateRes(string);
      const hoverText = `**${translateTool}**\n\n ${string}[翻译]: ***${translateString}***\n\n${humpResult}`;
      const ms = new vscode.MarkdownString(hoverText);
      ms.isTrusted = true;
      return new vscode.Hover(ms);
    }
  })();

  languages.registerHoverProvider({ scheme: "file", language: "*" }, provider);
  context.subscriptions.push(disposable);
  context.subscriptions.push(insertContent);
}

// this method is called when your extension is deactivated
export function deactivate() { }
