// path : /src/models/project_list.js
/***
 * @Author          TangTao https://promiselee.cn/tao
 * @CreateTime      2019-10-13 18:57:41
 * @UpdateTime      2019-10-11 13:02:24
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         调用查询 更新 删除 实验列表 结果
 *
 */

import * as project_list_service from "../service/project_list";
console.log("init models project_list.js");

//  开始执行
/********************** project_list model  执行 **********************/
/********************** project_list model  执行 **********************/
/********************** project_list model  执行 **********************/

let model = {
  namespace: "project_list",
  state: {
    // 资源列表数据
    // 通过 time 来判断是否更新了数据 通过 status 来判断数据的状态
    // -1 表示没有数据 0 有数据 -2 出错 获取数据失败
    project_list_status: -1,
    // 最新获取数据的时间戳
    project_list_time: 0,
    // 返回的数据
    project_list_data: 0,
    project_list_delete_status: -1,
    project_list_delete_time: 0,
    project_list_delete_data: null,
    project_list_scanning_update_status: -1,
    project_list_scanning_update_time: 0,
    project_list_scanning_update_data: null
  },

  effects: {
    // 获取资源列表 由用户切换到指定界面才会发起请求 节省资源
    *get_project_list({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(project_list_service.get_project_list, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "get_project_list_result",
        payload: result
      });
      return 0;
    },
    *delete_project_list({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(project_list_service.delete_project_list, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "delete_project_list_result",
        payload: result
      });
      return 0;
    },
    *project_list_scanning_update({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(project_list_service.project_list_scanning_update, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "project_list_scanning_update_result",
        payload: result
      });
      return 0;
    }

    // ...
  },

  reducers: {
    // 设置指定的state key = value
    set_state_newvalue(state, { payload: result }) {
      let obj = {};
      for (let i in state) {
        obj[i] = state[i];
      }
      //
      try {
        obj[result.target] = result.value;
      } catch (e) {
        // pass
      }
      return obj;
    },
    get_project_list_result(state, { payload: result }) {
      // 尝试提取返回结果
      let res_status = -1;
      let obj = {};
      for (let i in state) {
        obj[i] = state[i];
      }

      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 尝试写入 data
          obj.project_list_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.project_list_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.project_list_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.project_list_status = res_status;

      return obj;
    },
    delete_project_list_result(state, { payload: result }) {
      // @AUTHOR:tangtao HDU https://www.promiselee.cn/tao
      // 尝试提取返回结果
      let res_status = -1;
      let obj = {};

      for (let i in state) {
        obj[i] = state[i];
      }

      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 尝试写入 data
          obj.project_list_delete_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.project_list_delete_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.project_list_delete_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.project_list_delete_status = res_status;

      return obj;
    },
    project_list_scanning_update_result(state, { payload: result }) {
      // @AUTHOR:tangtao HDU https://www.promiselee.cn/tao
      // 尝试提取返回结果
      let res_status = -1;
      let obj = {};

      for (let i in state) {
        obj[i] = state[i];
      }

      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 尝试写入 data
          obj.project_list_scanning_update_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.project_list_scanning_update_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.project_list_scanning_update_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.project_list_scanning_update_status = res_status;

      return obj;
    }
  }
};
console.log("init models project_list.js end");

export default model;
