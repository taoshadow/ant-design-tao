// /src/service/project_filemanager.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-18 12:57:26
 * @UpdateTime          2019-10-18 12:59:11
 * @Archive
 */

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function get_project_filemanager(data = "") {
    // 读取最新的 token
    let token = tao.get_token();
    let { project_name = "" } = data;

    project_name += "";
    if (-1 == token || "" == project_name || 1 > project_name.length) {
        // 不存在 token
        return "error";
    }

    let body_data = "";

    body_data += "projectName" + "=" + project_name + "&";

    // 请求 实验数据 列表
    return request("/propro_server/project/filemanager", {
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

// 更新 token
export function send_json_file(data = "") {
    // 读取最新的 token
    let token = tao.get_token();
    let { project_name = "" } = data;

    project_name += "";
    if (-1 == token || "" == project_name || 1 > project_name.length) {
        // 不存在 token
        return "error";
    }

    let body_data = "";

    body_data += "projectName" + "=" + project_name + "&";

    // 请求 实验数据 列表
    return request("/propro_server/project/filemanager", {
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
