// ! Please run in the root directory
'use strict';
import {marked} from "marked";
import * as fs from "fs";

export function markdown_html(input_path, output_path, title, author) {
    const html_body = marked.parse(fs.readFileSync(input_path).toString()).trimEnd();
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="author" content="${author}"><title>${title}</title></head>
<body>
${html_body}
</body>
</html>`;
    fs.writeFileSync(output_path, html);
    console.log(`Convert ${input_path} successfully`);
}