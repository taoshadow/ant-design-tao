// /src/service/project_modify.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-18 13:48:23
 * @UpdateTime          2019-10-11 13:03:32
 * @Archive             修改 项目列表数据
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取
export function get_project_modify(data = "") {
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

// 唐涛 更新 at 2019-10-23 10:01:58
export function update_project_modify_data(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "", type = "" } = data;

  id += "";
  type += "";

  if (
    -1 == token ||
    "" == id ||
    3 > id.length ||
    "" == type ||
    1 > type.length
  ) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "id" + "=" + id + "&";
  body_data += "type" + "=" + type + "&";

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
