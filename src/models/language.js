// path : /src/models/language.js

console.log("init models/language.js");
// 语言配置 所有页面共用   这个配置留给 language 专用 用于后续扩展开发
// navigator.language.split(/[-_]/)  zh-CN
// 默认从浏览器头读 但是只支持 中文 和 英语 没有读取成功 显示中文
// 先从本地数据库读
let local_language = localStorage.getItem("locale");
// 第二次尝试从浏览器头取
let language0 =
  "zh" == local_language || "en" == local_language
    ? local_language
    : navigator.language.split(/[-_]/)[0];
// 第三次 设置默认值
let language = "zh" == language0 || "en" == language0 ? language0 : "zh";
// 把值添加到 localStorage 解决刷新问题
localStorage.locale = language;

export default {
  namespace: "language",
  state: {
    // 设置 语言
    language: localStorage.locale
  },
  reducers: {
    changeLanguage(state, { payload: new_language }) {
      // 写入 localStorage
      localStorage.locale = new_language.language;
      return {
        // 更新语言配置
        language: new_language.language
      };
    }
  }
};
