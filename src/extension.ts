// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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
    "chinese-to-english.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showWarningMessage(
        "Hello VS Code bbb from Chinese-to-English!"
      );
    }
  );
let provider = new class implements vscode.HoverProvider {
	provideHover(
		_document: vscode.TextDocument,
		_position: vscode.Position,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.Hover> {
		const editor = vscode.window.activeTextEditor;
		const selection = editor && editor.selection;
		// range可能为空
		let range:any = _document.getWordRangeAtPosition(_position);
		let string = range ? _document.getText(range) : "";
		if (selection && !selection.isEmpty) {
			let text = _document.getText(selection);
			// position在selection范围内
			// (selection.contains(range) || ~string.indexOf(text)) && (string = text)
			if (selection.contains(range) || ~string.indexOf(text)) {
				string = text;
			}
		}
		console.log('string',string);
		const commentCommandUri = vscode.Uri.parse(`command:chinese-to-english.helloWorld`);
		const contents = new vscode.MarkdownString(`[${string}](${commentCommandUri})`);

		// command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
		// 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
		// 以便你期望的命令command URIs生效
		contents.isTrusted = true;

		return new vscode.Hover(contents);
	}
}();
 
  languages.registerHoverProvider({ scheme: "file", language: "*" }, provider);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
