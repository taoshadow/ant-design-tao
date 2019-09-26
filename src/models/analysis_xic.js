// path : /src/models/analysis_xic.js
/***
 * @Author          TangTao https://promiselee.cn/tao
 * @CreateTime      2019-9-20 16:22:04
 * @UpdateTime      2019-9-25 10:50:22
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         调用查询 更新 删除 分析 结果
 *
 */

import * as analysis_xic_service from "../service/analysis_xic_service";
console.log("init models analysis_xic.js");

//  开始执行
/********************** analysis_xic model  执行 **********************/
/********************** analysis_xic model  执行 **********************/
/********************** analysis_xic model  执行 **********************/

let model = {
  namespace: "analysis_xic",
  state: {
    // 资源列表数据
    // 通过 time 来判断是否更新了数据 通过 status 来判断数据的状态
    // -1 表示没有数据 0 有数据 -2 出错 获取数据失败
    analysis_xic_status: -1,
    // 最新获取数据的时间戳
    analysis_xic_time: 0,
    // 返回的数据
    analysis_xic_data: 0,
    analysis_xic_delete_status: -1,
    // 删除数据的时间戳
    analysis_xic_delete_time: 0,
    // 返回的数据
    analysis_xic_delete_data: 0
  },

  effects: {
    // 获取资源列表 由用户切换到指定界面才会发起请求 节省资源
    *get_analysis_xic({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(analysis_xic_service.get_analysis_xic, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "get_analysis_xic_result",
        payload: result
      });
      return 0;
    },
    *delete_analysis_xic({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(analysis_xic_service.delete_analysis_xic, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "delete_analysis_xic_result",
        payload: result
      });
      return 0;
    },
    *query_analysis_xic({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(analysis_xic_service.query_analysis_xic, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "get_analysis_xic_result",
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
    get_analysis_xic_result(state, { payload: result }) {
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
          obj.analysis_xic_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.analysis_xic_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.analysis_xic_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.analysis_xic_status = res_status;

      return obj;
    },
    delete_analysis_xic_result(state, { payload: result }) {
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
          obj.analysis_xic_delete_data = result.data;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错 pass
      }

      obj.analysis_xic_delete_time = new Date().getTime();

      // 1 检查 返回数据状态
      if (-1 == res_status) {
        // 发生严重错误
        obj.analysis_xic_delete_status = res_status;
        return obj;
      }

      // 2 成功获取数据
      obj.analysis_xic_delete_status = res_status;

      return obj;
    }
  }
};
console.log("init models analysis_xic.js end");

export default model;
