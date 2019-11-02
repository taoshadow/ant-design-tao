// /src/service/task_detail.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-11-2 20:24:49
 * @UpdateTime          2019-11-2 22:05:06
 * @Archive             任务详情
 */

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function query_task_detail(data) {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "" } = data;
  id += "";

  if (-1 == token || "" == data || "" == id) {
    // 不存在 token
    return "error";
  }

  let body_data = "";
  body_data += "taskId" + "=" + id + "&";

  console.log(body_data);
  return;
  return request("/propro_server/task/detail", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    body: body_data
  });
}
