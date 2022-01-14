/*
 * @Description: 翻译并且替换
 * @Date: 2022-01-14 18:07:05
 * @FilePath: /chinese-to-english/src/actions/translateAndInsert.ts
 * @LastEditTime: 2022-01-14 19:11:52
 */
import * as vscode from "vscode";

function insert(humpResult: string) {
    if (!humpResult) {
        return;
    }
    const editor: any = vscode.window.activeTextEditor;
    const selection = editor && editor.selection;
    editor?.edit((res: any) => {
        res.replace(selection, humpResult); // 插入
    });

}

export {
    insert
};