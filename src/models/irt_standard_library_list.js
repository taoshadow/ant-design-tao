// path : /src/models/irt_standard_library_list.js
/***
 * @Author          TangTao https://promiselee.cn/tao
 * @CreateTime      2019-9-3 21:46:23
 * @UpdateTime      2019-9-3 22:59:36
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         调用查询 irt 标准库 的业务逻辑
 *
 */

import * as irt_standard_library_list_service from "../service/irt_standard_library_list";
console.log("init models irt_standard_library_list.js");

//  开始执行
/********************** irt_standard_library_list model  执行 **********************/
/********************** irt_standard_library_list model  执行 **********************/
/********************** irt_standard_library_list model  执行 **********************/

let model = {
  namespace: "irt_standard_library_list",
  state: {
    // 资源列表数据
    // 通过 time 来判断是否更新了数据 通过 status 来判断数据的状态
    // -1 表示没有数据 0 有数据 -2 出错 获取数据失败
    irt_standard_library_list_status: -1,
    // 最新获取数据的时间戳
    irt_standard_library_list_time: 0,
    // 返回的数据
    irt_standard_library_list_data: 0,

    // 设置irt为公开
    irt_standard_library_list_set_public_status: -1,
    irt_standard_library_list_set_public_time: 0
  },

  effects: {
    // 获取资源列表 由用户切换到指定界面才会发起请求 节省资源
    *get_irt_standard_library_list({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(
          irt_standard_library_list_service.get_irt_standard_library_list,
          payload
        );
      } catch (e) {
        result = "";
      }
      yield put({
        type: "get_irt_standard_library_list_result",
        payload: result
      });
      return 0;
    },
    *set_library_public_by_id({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(
          irt_standard_library_list_service.set_library_public_by_id,
          payload
        );
      } catch (e) {
        result = "";
      }
      yield put({
        type: "set_library_public_by_id_result",
        payload: result
      });
      return 0;
    }
    // 更新 token
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
    get_irt_standard_library_list_result(state, { payload: result }) {
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
          obj.irt_standard_library_list_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.irt_standard_library_list_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.irt_standard_library_list_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.irt_standard_library_list_status = res_status;

      return obj;
    },
    set_library_public_by_id_result(state, { payload: result }) {
      let res_status = -1;
      let obj = {};
      for (let i in state) {
        obj[i] = state[i];
      }

      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错
      }

      obj.irt_standard_library_list_set_public_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.irt_standard_library_list_set_public_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.irt_standard_library_list_set_public_status = res_status;

      return obj;
    }

    //
  }
};
console.log("init models irt_standard_library_list.js end");

export default model;
