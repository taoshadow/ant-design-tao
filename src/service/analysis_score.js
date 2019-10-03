// /src/service/analysis_score_service.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-9-27 10:50:07
 * @UpdateTime          2019-9-27 11:03:18
 * @Archive
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取 score 数据
export function get_analysis_score(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  let { id = "" } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "overviewId" + "=" + id + "&";

  // 查询打分分数数据
  return request("/propro_server/score/list", {
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

// 查询 score 数据
export function query_analysis_score(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  console.log(data);
  let { id = "", page_size = -1 } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length || 0 >= page_size) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "overviewId" + "=" + id + "&";
  body_data += "pageSize" + "=" + page_size + "&";

  // 查询打分数据
  return request("/propro_server/score/list", {
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
