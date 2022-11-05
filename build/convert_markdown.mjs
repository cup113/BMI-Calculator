import * as markdown from "./markdown.mjs";
markdown.markdown_html("./README.md", "./public/readme.html", "BMI 计算器的使用说明", "Jason Li");
markdown.markdown_html("./CHANGELOG.md", "./public/changelog.html", "BMI-Calculator 更新日志", "Jason Li");
console.log("All tasks are successfully finished.")