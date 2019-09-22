// path : /src/models/task_list.js
/***
 * @Author          TangTao https://www.promiselee.cn/tao
 * @CreateTime      2019-9-9 16:23:09
 * @UpdateTime      2019-9-9 21:57:14
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         任务列表数据
 *
 */

import * as task_list_service from "../service/task_list";
console.log("init models task_list.js");

//  开始执行
/********************** task_list model  执行 **********************/
/********************** task_list model  执行 **********************/
/********************** task_list model  执行 **********************/

let model = {
  namespace: "task_list",
  state: {
    // 资源列表数据
    // 通过 time 来判断是否更新了数据 通过 status 来判断数据的状态
    // -1 表示没有数据 0 有数据 -2 出错 获取数据失败
    task_list_data_status: -1,
    // 最新获取数据的时间戳
    task_list_time: 0,
    task_list_data: 0,
    delete_task_list_by_id_status: -1,
    delete_task_list_by_id_time: 0
  },

  effects: {
    // 更新
    *query_task_list({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        result = yield call(task_list_service.query_task_list, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "query_task_list_result",
        payload: result
      });
      return 0;
    },
    *delete_task_list_by_id({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        result = yield call(task_list_service.delete_task_list_by_id, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "delete_task_list_by_id_result",
        payload: result
      });
      return 0;
    },
    *query_task_list_by_custom({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        result = yield call(
          task_list_service.query_task_list_by_custom,
          payload
        );
      } catch (e) {
        result = "";
      }
      yield put({
        type: "query_task_list_result",
        payload: result
      });
      return 0;
    }
  },

  reducers: {
    // 设置指定的state key = value
    set_state_newvalue(state, { payload: result }) {
      let obj = {};
      for (let i in state) {
        obj[i] = state[i];
      }
      try {
        obj[result.target] = result.value;
      } catch (e) {
        // pass
      }
      return obj;
    },

    query_task_list_result(state, { payload: result }) {
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

          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错
      }

      obj.task_list_time = new Date().getTime();
      // 1 检查 返回数据状态

      if (-1 == res_status) {
        // 发生严重错误
        obj.task_list_data_status = res_status;
        //
        return obj;
      }

      // 2 成功获取数据
      obj.task_list_data_status = res_status;

      if (0 == res_status) {
        // 注入数据
        obj.task_list_data = result.data;
      }
      return obj;
    },

    delete_task_list_by_id_result(state, { payload: result }) {
      // 尝试提取 删除 任务 的 返回结果
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

      obj.delete_task_list_by_id_time = new Date().getTime();
      // 1 检查 返回数据状态

      if (-1 == res_status) {
        // 发生严重错误
        obj.delete_task_list_by_id_status = res_status;
        //
        return obj;
      }

      // 2 成功获取数据
      obj.delete_task_list_by_id_status = res_status;

      return obj;
    }

    //
  }
};
console.log("init models task_list.js end");

export default model;
