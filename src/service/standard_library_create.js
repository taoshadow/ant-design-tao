// /src/service/standard_library_create.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime      2019-8-28 19:15:47
 * @UpdateTime      2019-8-29 10:39:45
 * @Archive
 */

import tao from "../utils/common";
import reqwest from "reqwest";

// 更新标准库
export async function create_library_by_name(data) {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }

  let body_data = new FormData();
  try {
    // 这里的命名采用 Java 命名方式
    body_data.append("name", data.name);
    body_data.append("libType", data.library_type);
    body_data.append("description", data.detail_description);

    let s = 0;
    data.peptide_file_list.forEach(file => {
      // 注意 这里只上传第一个 但是写好多文件上传的代码
      if (0 == s) {
        body_data.append("prmFile", file);
        s++;
      }
    });
    console.log(s);
    if (0 == s) {
      body_data.append("prmFile", null);
    }

    s = 0;
    data.csv_library_file_list.forEach(file => {
      if (0 == s) {
        body_data.append("libFile", file);
        s++;
      }
    });
  } catch (e) {
    return "error";
  }

  // 注意 这里使用 reqwest 异步里面声明阻塞 切勿乱调用 支持文件上传

  return await reqwest({
    url: "/propro_server/library/add",
    method: "post",
    processData: false,
    data: body_data,
    type: "json",
    headers: {
      token: token
    },
    success: res => {
      //  返回 json
      return res;
    },
    error: () => {
      return "error";
    }
  });
}

export async function query_task_id(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token || "" == data) {
    // 不存在 token
    return "error";
  }

  let body_data = new FormData();
  try {
    body_data.append("taskId", data.task_id);
  } catch (e) {
    return "error";
  }

  return await reqwest({
    url: "/propro_server/task/detail",
    method: "post",
    processData: false,
    data: body_data,
    type: "json",
    headers: {
      token: token
    },
    success: res => {
      //  返回 json
      return res;
    },
    error: () => {
      return "error";
    }
  });
}
