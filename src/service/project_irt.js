// /src/service/project_irt.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-23 13:19:32
 * @UpdateTime          2019-10-23 13:28:41
 * @Archive             项目 计算irt
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取
export function get_project_irt(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "" } = data;

  id += "";

  if (-1 == token || "" == id || 3 > id.length) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "id" + "=" + id + "&";

  // 请求 实验数据 列表
  return request("/propro_server/project/edit", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送登录数据 注意 数据未加密
    body: body_data
  });
}
