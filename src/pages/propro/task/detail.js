// src/pages/propro/task/detail.js
// task_detail  任务 详情

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-11-2 20:20:23
 * @UpdateTime          2019-11-2 22:50:31
 * @Archive             任务 列表
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";
import $ from "jquery";

import {
  BackTop,
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Row,
  Col,
  Button,
  Dropdown,
  Select,
  Popconfirm,
  message,
  Tabs,
  Input,
  Modal,
  Tooltip,
  Table,
  Timeline,
  Divider,
  Descriptions,
  Tag,
  // 滑动输入框
  Slider,
  // 数字输入 文本框
  InputNumber
} from "antd";

let { Option } = Select;
import Highlighter from "react-highlight-words";

import tao from "../../../utils/common";
/****************  导入组件 end ***************************/

/****************  导入国际化语言 ***************************/
/****************  导入国际化语言 ***************************/
//   引入自定义的语言文件 js 格式
import messages_zh from "../../../locale/zh_CN";
import messages_en from "../../../locale/en_US";

const Languages = {
  zh: messages_zh,
  en: messages_en
};

/****************  导入国际化语言 end ***************************/

/****************  导入 styles ***************************/
/****************  导入 styles ***************************/
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/dashboard/console.less";
import "../../../layout/Common.css";
import delete_svg from "../style/static/task/delete.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import { throws } from "assert";

/****************  导入 styles end ***************************/

/***********  task_detail View 初始化   ***************/
/***********  task_detail View 初始化   ***************/

const task_detail_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    task_detail_data_status = -1,
    task_detail_time = 0,
    task_detail_data = {}
  } = state["task_detail"];

  (obj.task_detail_data_status = task_detail_data_status),
    (obj.task_detail_data = task_detail_data),
    (obj.task_detail_time = task_detail_time);
  return obj;
};

const task_detail_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    query_task_detail: data => {
      const action = {
        type: "task_detail/query_task_detail",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "task_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  task_detail View 初始化 end  ***************/

@connect(
  task_detail_state_to_props,
  task_detail_dispatch_to_props
)
class Task_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的任务数据
      task_detail_data: [],
      task_detail_id: null,
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      task_detail_status: -1,
      // 请求失败再次发起请求的尝试次数
      task_detail_false_time: 5,
      task_detail_delete_id: null,
      query_task_detail_interval: null,
      delete_task_detail_modal_visible: false,
      query_task_detail_show: false,
      task_deatil_elements: null,
      // 记录查询数据的最新时间 要用客户端的时间
      task_detail_query_time: null,

      task_templates: null
    };

    // 查询 task_detail 详情
    this.query_task_detail();

    //  开启定时器 轮询查询
    this.enable_query_task_detail_interval();
    // 配置 message
    message.config({
      top: 400,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  enable_query_task_detail_interval = () => {
    // 加锁
    if (null == this.state.query_task_detail_interval) {
      setTimeout(() => {
        this.setState({
          query_task_detail_interval: setInterval(() => {
            this.query_task_detail();
          }, 3000)
        });
      }, 100);
    }
  };
  // 查询 project_filemanager 列表
  query_task_detail = () => {
    console.log("=--------------");
    let url = this.props.history.location.pathname;
    let obj = {};
    /****************************/
    let find_str = "/detail/";
    let index = url.lastIndexOf(find_str);
    // 取到的是任务 di
    let task_id = url.substring(index + find_str.length);
    if (3 < index) {
      // 找到 project_name 发起查询
      obj.id = task_id;
      // 存入state
      setTimeout(() => {
        this.setState({
          task_detail_id: task_id
        });
      }, 50);
    }

    this.props.query_task_detail(obj);
  };

  // task_detail 服务端返回数据
  handle_task_detail = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "task_detail_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.task_detail_data_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_task_detail_data();
      }, 200);
    } else {
      // 数据获取失败
      // 1-弹出警告

      setTimeout(() => {
        Modal.error({
          title: "False",
          content: Languages[this.props.language]["propro.network_error"],
          okText: Languages[this.props.language]["propro.user_modal_know"]
        });
      }, 80);

      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { task_detail_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= task_detail_false_time) {
        console.error(
          "@Author:tangtao; 抱歉,系统已终止运行,请重新刷新页面; ",
          "初步诊断:未能成功连接到 propro-server 的服务器 或者 未能成功解析返回的数据"
        );
        // 终止发送
        return -1;
      }

      // 写入新的请求失败参数
      setTimeout(() => {
        this.setState({
          task_detail_false_time: task_detail_false_time--
        });
      }, 90);

      return -1;
    }

    return 0;
  };

  change_task_detail_data = () => {
    //   提取 model 层 传过来的数据

    /*
    createDate: 1572708828354
    creator: "Admin"
    id: "5dbda1dcfeb7446f5809d9eb"
    lastModifiedDate: 1572708828465
    logs: (19) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    name: "IRT-HYE110_6600_64_Var:5c6d2ec7dfdfdd2f947c6f39-Num:7"
    startTime: 1572708828399
    status: "SUCCESS"
    taskTemplate: "IRT"
    totalCost: 65
    */
    let {
      lastModifiedDate: last_modified_date,
      id,
      creator,
      createDate: create_date,
      logs,
      //  任务名称
      name,
      startTime: start_time,
      status,
      totalCost: total_cost,
      taskTemplate: task_template
    } = this.props.task_detail_data.task;
    // 渲染数据
    let elements = new Array();
    elements.push(
      <Timeline.Item dot={<Icon type="clock-circle-o" />} key={"elements-id"}>
        <span className={styles.font_primary_color}>
          {tao.format_time(create_date)}
        </span>
        <br />
        <span className={styles.font_second_color}>
          <b>creator:</b>&nbsp;&nbsp;
        </span>
        {creator}
        <br />
        <b className={styles.font_second_color}>taskId:&nbsp;</b>
        &nbsp;&nbsp;
        {id}
        <br />
        <div style={{ maxWidth: "800px" }}>
          <b className={styles.font_second_color}>taskName:&nbsp;</b>
          &nbsp;&nbsp;
          <span className={styles.font_green_color}>{name}</span>
        </div>
      </Timeline.Item>
    );

    for (let i = 0, len = logs.length; i < len; i++) {
      let element = logs[i];
      elements.push(
        <Timeline.Item key={"elements-" + i}>
          <span className={styles.font_primary_color}>
            {tao.format_time(parseInt(element.time))}
          </span>
          <br />
          {element.content}
        </Timeline.Item>
      );
    }
    elements.push(
      <Timeline.Item dot={<Icon type="clock-circle-o" />} key={"elements-end"}>
        <span className={styles.font_primary_color}>
          {tao.format_time(last_modified_date)}
        </span>
        <br />
        <span
          className={
            "badge " + ("SUCCESS" == status ? "badge-success" : "badge-info")
          }
          style={{
            padding: "5px 10px",
            fontSize: "8px"
          }}
        >
          {status}
        </span>
      </Timeline.Item>
    );

    // 处理状态
    if ("SUCCESS" == status) {
      // 成功
      // 定位滚动条 到底部
      setTimeout(() => {
        $("html,body").animate(
          { scrollTop: parseInt(document.body.scrollHeight) },
          1000
        );
      }, 300);

      // 注销定时器
      // 尝试清空定时器
      try {
        clearInterval(this.state.query_task_detail_interval);
      } catch (e) {
        //
      } finally {
        setTimeout(() => {
          //  设置为 null
          this.setState({
            query_task_detail_interval: null
          });
        }, 120);
      }
    } else {
      // 提取失败
      // 不予理睬 注意 这种情况会导致请求失败一直发起请求 暂时先不考虑
      // pass
    }

    // 添加服务端数据
    this.setState({
      // 标记 成功
      task_detail_false_time: 5,
      // 标记数据为可用的状态
      task_detail_status: 0,
      task_deatil_elements: elements,
      query_task_detail_show: true,
      task_detail_query_time: tao.current_format_time()
    });

    return 0;
  };

  change_search_task_detail_by_templates = value => {
    value += "";

    if (0 >= value.length) {
      console.warn("你在搞啥?");
      return -1;
    }

    // 设置搜索模板
    this.setState({
      search_task_detail_by_templates: value
    });
  };

  change_load_percentage_value = value => {
    if (0 > value || 100 < value) {
      console.warn("你在搞啥?");
      return -1;
    }

    // 提取到最新 值

    this.setState({
      load_percentage_value: value
    });
  };

  render() {
    // 监控 task_detail 数据变化
    if (10000 < this.props.task_detail_time) {
      // 资源有更新
      this.handle_task_detail();
    }

    if (0 != this.state.task_detail_status) {
      return (
        <Fragment>
          <Row>
            <Col
              span={24}
              style={{
                textAlign: "center",
                marginTop: "30px"
              }}
            >
              <img src={preloader_svg} />
            </Col>
          </Row>
        </Fragment>
      );
    }

    return (
      <div>
        <div
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            fontWeight: "600",
            letterSpacing: "1px"
          }}
        >
          <Tooltip
            placement="topLeft"
            title={<FormattedHTMLMessage id="propro.task_list_title" />}
          >
            <Link to="/task/list">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.task_detail_title" />
        </div>

        {/* 提示用户警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.delete_task_detail_modal_visible}
          onOk={this.delete_task_detail_by_id_confirm}
          onCancel={this.delete_task_detail_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.task_detail_delete_by_id_modal_warn" />
          </div>
        </Modal>

        <div
          style={{
            background: "#FFFFFF",
            padding: "5px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
          {/* 任务状态 */}
          {this.state.query_task_detail_show && (
            <div
              style={{
                marginTop: "30px",
                padding: "0px 50px "
              }}
            >
              <Timeline
                pending={
                  null == this.state.query_task_detail_interval
                    ? false
                    : "Running..."
                }
              >
                {this.state.task_deatil_elements}
              </Timeline>
            </div>
          )}
        </div>
        {/* Author: Tangtao HDU https://www.promiselee.cn/tao */}
        <BackTop visibilityHeight={600}>
          <div>
            <img
              style={{
                width: "35px"
              }}
              src={arrow_up_svg}
            />
          </div>
        </BackTop>
      </div>
    );
  }
}

export default Task_detail;
