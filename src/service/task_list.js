// /src/service/task_list.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-9-9 16:35:18
 * @UpdateTime          2019-9-9 16:39:49
 * @Archive             查询任务列表
 */

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function query_task_list() {
  // 读取最新的 token
  let token = tao.get_token();
  if (-1 == token) {
    // 不存在 token
    return "error";
  }

  return request("/propro_server/task/list", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST"
  });
}

export function delete_task_list_by_id(data) {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "" } = data;
  if (-1 == token || "" == data || "" == id) {
    // 不存在 token
    return "error";
  }

  let body_data = "";
  body_data += "id" + "=" + id + "&";

  return request("/propro_server/task/delete", {
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

// 查询自定义规则的任务列表
export function query_task_list_by_custom(data) {
  // 读取最新的 token
  let token = tao.get_token();
  let {
    search_task_list_by_templates: templates = null,
    page_size = null
  } = data;

  if (-1 == token || "" == data) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  if (null != page_size && 0 < page_size) {
    body_data += "pageSize" + "=" + page_size + "&";
  }

  if (null != templates) {
    body_data += "taskTemplate" + "=" + templates + "&";
  }

  console.log(body_data);
  return request("/propro_server/task/list", {
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
