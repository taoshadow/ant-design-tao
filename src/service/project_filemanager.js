/*
 * @Author: TangTao https://www.promiselee.cn/tao
 * @Date: 2019-11-16 00:10:34
 * @Last Modified by: TangTao tangtao2099@outlook.com
 * @Last Modified time: 2019-11-16 00:18:40
 */
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
import reqwest from "reqwest";

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

// 上传 json 文件
export async function send_json_file(data = "") {
    // 读取最新的 token
    let token = tao.get_token();

    let {
        json_file = null,
        filename,
        // 项目名称 服务器根据这个来解析是谁
        project_name,
        // 当前的索引 服务器原样返回 共前端判断到第几个了
        file_index
    } = data;

    project_name += "";
    if (
        -1 == token ||
        "" == project_name ||
        1 > project_name.length ||
        null == json_file
    ) {
        // 不存在 token
        return "error";
    }

    let body_data = new FormData();
    try {
        // 这里的命名采用 Java 命名方式
        body_data.append("projectName", project_name);
        body_data.append("fileIndex", file_index);
        body_data.append("fileName", filename);
        body_data.append("jsonFile", json_file);
    } catch (e) {
        return "error";
    }

    return await reqwest({
        url: "/propro_server/project/uploadJsonFile",
        method: "post",
        processData: false,
        data: body_data,
        // 声明以 json 数据进行交互 解析
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
