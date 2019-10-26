// src/pages/propro/project/extractor.js
// extractor 项目 批量执行完整流程

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-25 10:16:38
 * @UpdateTime          2019-10-23 16:50:33
 * @Archive             项目数据列表
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";

import {
  Badge,
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Row,
  Col,
  Drawer,
  Descriptions,
  Button,
  Dropdown,
  Select,
  Popconfirm,
  message,
  notification,
  Tabs,
  Input,
  InputNumber,
  Modal,
  Tooltip,
  Table,
  Divider,
  Tag,
  BackTop
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

import Highlighter from "react-highlight-words";
import ReactJson from "react-json-view";

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

import scanning_svg from "../style/static/project/scanning.svg";
import upload_svg from "../style/static/project/upload.svg";
import result_svg from "../style/static/project/result.svg";
import file_svg from "../style/static/project/file.svg";
import delete_svg from "../style/static/project/delete.svg";
import modify_svg from "../style/static/experiment/modify.svg";
import chart_svg from "../style/static/experiment/chart.svg";
import process_svg from "../style/static/experiment/process.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  project View 初始化   ***************/
/***********  project View 初始化   ***************/

const project_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    project_extractor_status = -1,
    project_extractor_time = 0,
    project_extractor_data = {},
    project_extractor_calculate_time = 0,
    project_extractor_calculate_status = 0,
    project_extractor_calculate_data = {}
  } = state["project_extractor"];

  (obj.project_extractor_calculate_time = project_extractor_calculate_time),
    (obj.project_extractor_calculate_status = project_extractor_calculate_status),
    (obj.project_extractor_calculate_data = project_extractor_calculate_data),
    (obj.project_extractor_status = project_extractor_status),
    (obj.project_extractor_time = project_extractor_time),
    (obj.project_extractor_data = project_extractor_data);

  return obj;
};

const project_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_project_extractor: (data = null) => {
      const action = {
        type: "project_extractor/get_project_extractor",
        payload: data
      };
      dispatch(action);
    },
    project_extractor_calculate: data => {
      const action = {
        type: "project_extractor/project_extractor_calculate",
        payload: data
      };
      dispatch(action);
    },

    set_state_newvalue: data => {
      const action = {
        type: "project_extractor/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  project View 初始化 end  ***************/

@connect(
  project_state_to_props,
  project_dispatch_to_props
)
class Project_extractor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      project_extractor_data: [],
      project_extractor_id: null,
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      project_extractor_status: -1,
      // 自动跳转标记
      project_extractor_jump_status: -1,
      // 请求失败再次发起请求的尝试次数
      project_extractor_false_time: 5,
      search_text: "",
      //   前端格式化后的 project 数据
      project_extractor_project_data: null,
      project_extractor_exps_arr: null,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      project_extractor_default_extractor_library_select: "",
      project_data_sigma: 3.75,
      project_data_spacing: 0.01,
      project_data_mz: 0.05,
      drawer_data: null
    };

    // 查询 project_extractor 列表
    setTimeout(() => {
      // 默认获取全部
      this.query_project_extractor();
    }, 100);

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });

    notification.config({
      placement: "topRight",
      duration: 4.5
    });
  }

  // 查询 project_extractor 列表
  query_project_extractor = () => {
    let url = this.props.history.location.pathname;
    let obj = {};
    /****************************/
    let find_str = "/extractor/";
    let index = url.lastIndexOf(find_str);
    let id = url.substring(index + find_str.length);
    if (3 < index) {
      // 找到 project_name 发起查询
      obj.id = id;
    }

    setTimeout(() => {
      this.setState({
        project_extractor_id: id
      });
    }, 40);

    setTimeout(() => {
      //   开始查询
      this.props.get_project_extractor(obj);
    }, 100);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        project_extractor_status: -1
      });
      // 立即重新发起查询
      this.query_project_extractor();
    }, 800);
  };

  handle_project_extractor = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "project_extractor_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.project_extractor_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_project_extractor_data();
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
      }, 40);
      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { project_extractor_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= project_extractor_false_time) {
        tao.my_console(
          "error",
          "@Author:tangtao; 系统已终止运行,请重新刷新页面; ",
          "初步诊断:未能成功连接到 propro-server 的服务器或者未能成功解析返回的数据"
        );
        // 终止发送
        return -1;
      }

      // 写入新的请求失败参数
      setTimeout(() => {
        this.setState({
          project_extractor_false_time: project_extractor_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_project_extractor_data = () => {
    console.log(this.props.project_extractor_data);

    this.setState({
      // 标记 成功
      project_extractor_false_time: 5,
      //   project_extractor_project_data: obj,
      //   project_extractor_query_time: tao.current_format_time(),
      //   project_extractor_exps_arr: exps_arr,
      //   project_extractor_default_extractor_librarys_arr: default_extractor_librarys_arr,
      //   project_extractor_default_extractor_library_select:
      //     extractor_library_name + " " + extractor_library_id,
      //   // 标记数据为可用的状态
      project_extractor_status: 0
    });

    return 0;
  };

  /***************** operation  ****************/
  /***************** operation  ****************/
  /***************** operation  ****************/

  // 显示侧边栏数据
  show_drawer_data = data => {
    this.setState({
      drawer_data: drawer_data,
      drawer_visible: true
    });
  };

  drawer_close = () => {
    // 关闭抽屉
    this.setState({
      drawer_visible: false
    });
  };

  /*************  handle  *********************/
  /*************  handle  *********************/
  /*************  handle  *********************/

  set_project_extractor_default_extractor_library_select = e => {
    //
    this.setState({
      project_extractor_default_extractor_library_select: e
    });
  };

  set_project_data_sigma = e => {
    //
    let val = parseFloat(e);
    this.setState({
      project_data_sigma: val
    });
  };

  set_project_data_spacing = e => {
    //
    let val = parseFloat(e);
    this.setState({
      project_data_spacing: val
    });
  };

  set_project_data_mz = e => {
    //
    let val = parseFloat(e);

    this.setState({
      project_data_mz: val
    });
  };

  project_extractor_view_experiment_by_index = index => {
    let { exps = [] } = this.props.project_extractor_data;

    let view_data = null;
    try {
      view_data = exps[index];
    } catch (e) {
      // 传入空对象
      view_data = { warning: "no data" };
      tao.my_console(
        "warn",
        "@Author:tangtao; 参数传入错误,请检查源代码; ",
        "初步诊断:传入的数组是否合法,数组的索引似乎不正确"
      );
    }
    let drawer_data = (
      <ReactJson
        name={"PROPRO"}
        theme={"summerfruit:inverted"}
        iconStyle={"circle"}
        style={{
          fontSize: "16px",
          fontWeight: "600"
        }}
        collapsed={2}
        displayDataTypes={false}
        collapseStringsAfterLength={140}
        src={view_data}
      />
    );

    this.setState({
      drawer_data: drawer_data,
      drawer_visible: true
    });
  };

  project_extractor_jump_to_task_list = (status = -1) => {
    let { project_extractor_jump_status } = this.state;
    if (0 == status || 0 == project_extractor_jump_status) {
      // 立即跳转
      setTimeout(() => {
        // 立即锁住 不允许再次发起跳转
        this.setState({
          project_extractor_jump_status: -1
        });
      }, 30);
      // 延迟跳转
      setTimeout(() => {
        this.props.history.push("/task/list");
      }, 200);

      return;
    }
    return -1;
  };

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 project_extractor 数据变化
    if (10000 < this.props.project_extractor_time) {
      // 资源有更新
      this.handle_project_extractor();
    }

    if (10000 < this.props.project_extractor_calculate_time) {
      this.handle_project_extractor_calculate();
    }

    if (10000 < this.props.project_extractor_scanning_update_time) {
      this.handle_project_extractor_scanning_update();
    }

    if (0 != this.state.project_extractor_status) {
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

    let {
      drawer_data,
      drawer_visible,
      project_extractor_project_data: project_data = {}
    } = this.state;

    return 111;
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
            title={<FormattedHTMLMessage id="propro.project_list_title" />}
          >
            <Link to="/project/list">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.project_extractor_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_project_extractor_by_id_confirm}
          onCancel={this.delete_project_extractor_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.project_extractor_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.project_extractor_experiment_detail" />
            }
            placement="left"
            closable={true}
            width={600}
            style={{
              wordWrap: "break-word",
              wordBreak: "break-all",
              minWidth: "585px",
              maxWidth: "585px"
            }}
            onClose={this.drawer_close}
            visible={drawer_visible}
          >
            {drawer_data}
          </Drawer>
        )}

        <Row>
          <Col
            lg={24}
            xl={24}
            xxl={20}
            className={styles.font_primary_color}
            style={{
              textAlign: "left",
              fontSize: "14px",
              lineHeight: "30px"
            }}
          >
            <Descriptions
              bordered
              size="middle"
              column={4}
              style={{
                overflowX: "auto",
                overflowY: "auto"
              }}
              title={
                <Fragment>
                  <Row>
                    <Col lg={8}>
                      负责人 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_second_color}`}
                        style={{ padding: "5px 10px", color: "#ffffff" }}
                      >
                        {project_data.owner_name}
                      </span>
                    </Col>
                    <Col lg={8}>
                      创建时间 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_yellow_color}`}
                        style={{ padding: "5px 10px", color: "#FFFFFF" }}
                      >
                        {project_data.create_date}
                      </span>
                    </Col>

                    <Col lg={8}>
                      更新时间 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_green_color}`}
                        style={{ padding: "5px 10px", color: "#FFFFFF" }}
                      >
                        {project_data.last_modified_date}
                      </span>
                    </Col>
                  </Row>
                </Fragment>
              }
            >
              <Descriptions.Item span={2} label="项目ID">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_primary_color}
                >
                  {project_data.id}
                </div>
              </Descriptions.Item>

              {/* 实验名称 */}
              <Descriptions.Item span={2} label="项目名称">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  // className={styles.font_primary_color}
                >
                  {project_data.name}
                </div>
              </Descriptions.Item>

              {/* 实验类型 */}
              <Descriptions.Item span={4} label={<span>实验类型</span>}>
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  {project_data.type}
                </div>
              </Descriptions.Item>

              {/* 默认extractor校准库 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>
                    默认extractor校准库
                  </span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <Select
                    style={{ width: 500 }}
                    onChange={
                      this
                        .set_project_extractor_default_extractor_library_select
                    }
                    optionFilterProp="children"
                    defaultValue={
                      this.state
                        .project_extractor_default_extractor_library_select
                    }
                    value={
                      this.state
                        .project_extractor_default_extractor_library_select
                    }
                    maxTagCount={40}
                  >
                    {
                      this.state
                        .project_extractor_default_extractor_librarys_arr
                    }
                  </Select>
                </div>
              </Descriptions.Item>

              {/* 设定 sigma */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>设定 Sigma</span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <InputNumber
                    value={this.state.project_data_sigma}
                    onChange={this.set_project_data_sigma}
                    style={{ width: 200 }}
                    step={0.1}
                    maxLength={20}
                  />
                  <span
                    className={styles.font_gray_color}
                    style={{
                      fontSize: "12px"
                    }}
                  >
                    &nbsp;&nbsp;
                    <FormattedHTMLMessage id="propro.project_extractor_default_sigma" />
                  </span>
                </div>
              </Descriptions.Item>

              {/* 设定 Spacing */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>设定 Spacing</span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <InputNumber
                    value={this.state.project_data_spacing}
                    onChange={this.set_project_data_spacing}
                    style={{ width: 200 }}
                    step={0.01}
                    maxLength={20}
                  />
                  <span
                    className={styles.font_gray_color}
                    style={{
                      fontSize: "12px"
                    }}
                  >
                    &nbsp;&nbsp;
                    <FormattedHTMLMessage id="propro.project_extractor_default_spacing" />
                  </span>
                </div>
              </Descriptions.Item>

              {/* MZ数据提取窗口 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>
                    MZ数据提取窗口
                  </span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <InputNumber
                    value={this.state.project_data_mz}
                    onChange={this.set_project_data_mz}
                    style={{ width: 200 }}
                    step={0.01}
                    maxLength={20}
                  />
                  <span
                    className={styles.font_gray_color}
                    style={{
                      fontSize: "12px"
                    }}
                  >
                    &nbsp;&nbsp;
                    <FormattedHTMLMessage id="propro.project_extractor_default_mz" />
                  </span>
                </div>
              </Descriptions.Item>

              {/* 实验数据 */}
              <Descriptions.Item
                span={4}
                label={<span>实验数据</span>}
                style={{}}
              >
                <div
                  style={{
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  {this.state.project_extractor_exps_arr}
                </div>
              </Descriptions.Item>

              {/* 操作 */}
              <Descriptions.Item span={4} label={<span>操作</span>}>
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      margin: "5px 5px",
                      height: "30px",
                      lineHeight: "20px",
                      padding: "5px 10px",
                      letterSpacing: "1px"
                    }}
                    // 暂时还未实现
                    onClick={this.project_extractor_calculate}
                  >
                    <FormattedHTMLMessage id="propro.project_extractor_calculate" />
                  </button>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
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

export default Project_extractor;
