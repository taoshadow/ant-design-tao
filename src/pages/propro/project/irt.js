// src/pages/propro/project/irt.js
// irt 项目 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-23 13:06:03
 * @UpdateTime          2019-10-16 15:56:30
 * @Archive             项目数据列表
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";

import {
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Row,
  Col,
  Drawer,
  Button,
  Dropdown,
  Select,
  Popconfirm,
  message,
  notification,
  Tabs,
  Input,
  Modal,
  Tooltip,
  Table,
  Divider,
  Tag,
  BackTop
} from "antd";

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
    project_irt_status = -1,
    project_irt_time = 0,
    project_irt_data = {},
    project_irt_delete_status = -1,
    project_irt_delete_time = 0,
    project_irt_delete_data = {},
    project_irt_scanning_update_status = -1,
    project_irt_scanning_update_time = 0,
    project_irt_scanning_update_data = {}
  } = state["project_irt"];

  (obj.project_irt_scanning_update_status = project_irt_scanning_update_status),
    (obj.project_irt_scanning_update_time = project_irt_scanning_update_time),
    (obj.project_irt_scanning_update_data = project_irt_scanning_update_data),
    (obj.project_irt_delete_status = project_irt_delete_status),
    (obj.project_irt_delete_time = project_irt_delete_time),
    (obj.project_irt_delete_data = project_irt_delete_data),
    (obj.project_irt_status = project_irt_status),
    (obj.project_irt_time = project_irt_time),
    (obj.project_irt_data = project_irt_data);

  return obj;
};

const project_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_project_irt: (data = null) => {
      const action = {
        type: "project_irt/get_project_irt",
        payload: data
      };
      dispatch(action);
    },
    delete_project_irt: data => {
      const action = {
        type: "project_irt/delete_project_irt",
        payload: data
      };
      dispatch(action);
    },
    project_irt_scanning_update: data => {
      const action = {
        type: "project_irt/project_irt_scanning_update",
        payload: data
      };
      dispatch(action);
    },

    set_state_newvalue: data => {
      const action = {
        type: "project_irt/set_state_newvalue",
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
class Project_irt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      project_irt_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      project_irt_status: -1,
      // 请求失败再次发起请求的尝试次数
      project_irt_false_time: 5,
      search_text: "",
      project_irt_table_columns: null,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      delete_project_irt_id: null
    };

    // 查询 project_irt 列表
    setTimeout(() => {
      // 默认获取全部
      this.query_project_irt();
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

    // 配置表格列参数
    this.config_table_columns();
  }

  // 查询 project_irt 列表
  query_project_irt = () => {
    let url = this.props.history.location.pathname;
    let obj = {};
    /****************************/
    let find_str = "/irt_project_name/";
    let index = url.lastIndexOf(find_str);
    let project_name = url.substring(index + find_str.length);
    if (3 < index) {
      // 找到 project_name 发起查询
      obj.project_name = project_name;
    }

    /***************/
    find_str = "/irt_type/";
    index = url.lastIndexOf(find_str);
    let type = url.substring(index + find_str.length);

    if (3 < index) {
      // 找到 type 发起查询
      obj.type = type;
    }

    this.props.get_project_irt(obj);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        project_irt_status: -1
      });
      // 立即重新发起查询
      this.query_project_irt();
    }, 800);
  };

  handle_project_irt = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "project_irt_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.project_irt_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_project_irt_data();
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
      let { project_irt_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= project_irt_false_time) {
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
          project_irt_false_time: project_irt_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_project_irt_data = () => {
    console.log(this.props.project_irt_data);

    /*
      currentPage: 1
      pageSize: 500
      projectList: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
      repository: "E:\data\"
      totalNumbers: 8
      totalPage: 1
    */

    let {
      projectList: project_irt,
      totalNumbers: total_numbers,
      pageSize: page_size,
      repository = ""
    } = this.props.project_irt_data;
    let { length: len0 } = project_irt;
    let [load_percentage_value, projects_arr] = [0, null];
    if (0 < len0) {
      projects_arr = new Array(len0);
      let obj_temp = {};
      load_percentage_value = Math.ceil((len0 / total_numbers) * 100);

      for (let i = 0; i < len0; i++) {
        // createDate: 1562567897630
        // description: ""
        // doPublic: false
        // iRtLibraryId: "5c6d2ec7dfdfdd2f947c6f39"
        // iRtLibraryName: "商业iRT"
        // id: "5d22e4d9a1eaff5cabc0fa37"
        // labels: []
        // lastModifiedDate: 1562567897630
        // libraryId: "5c9c2407dfdfdd356072c113"
        // libraryName: "HYE-64var"
        // name: "HYE110_6600_64_Var"
        // ownerName: "lms"
        // type: "DIA_SWATH"
        let {
          createDate: create_date,
          description,
          doPublic: do_public,
          iRtLibraryId: irt_library_id,
          iRtLibraryName: irt_library_name,
          id,
          labels,
          lastModifiedDate: last_modified_date,
          libraryId: library_id,
          libraryName: library_name,
          name: project_name,
          ownerName: owner_name,
          type
        } = project_irt[i];
        // 处理数据
        (obj_temp.index = i + 1),
          (obj_temp.key = "projects_arr_" + i),
          (obj_temp.create_date = tao.format_time(create_date)),
          (obj_temp.id = id),
          // 项目名称
          (obj_temp.project_name = project_name),
          (obj_temp.type = type),
          // 项目仓库路径
          (obj_temp.repository_path = repository + project_name),
          (obj_temp.owner_name = owner_name),
          (obj_temp.irt_library_name = irt_library_name),
          (obj_temp.library_name = library_name),
          // labels 标签 数组
          (obj_temp.labels = labels),
          (obj_temp.last_modified_date = tao.format_time(last_modified_date)),
          (projects_arr[i] = obj_temp),
          (obj_temp = {});
      }
    }
    this.setState({
      // 标记 成功
      project_irt_false_time: 5,
      load_percentage_value: load_percentage_value,
      total_numbers: total_numbers,
      project_irt_query_time: tao.current_format_time(),
      project_irt_data: projects_arr,
      // 标记数据为可用的状态
      project_irt_status: 0
    });

    return 0;
  };

  handle_table_search = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handle_table_reset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
  };

  /***************** operation  ****************/
  /***************** operation  ****************/
  /***************** operation  ****************/

  show_drawer_data = data => {
    // this.setState({
    //   drawer_data: drawer_data,
    //   drawer_visible: true
    // });
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

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 project_irt 数据变化
    if (10000 < this.props.project_irt_time) {
      // 资源有更新
      this.handle_project_irt();
    }

    if (10000 < this.props.project_irt_delete_time) {
      this.handle_delete_project_irt();
    }

    if (10000 < this.props.project_irt_scanning_update_time) {
      this.handle_project_irt_scanning_update();
    }

    if (0 != this.state.project_irt_status) {
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

    let { drawer_data, drawer_visible } = this.state;

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
            title={<FormattedHTMLMessage id="propro.console" />}
          >
            <Link to="/console">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.project_irt_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_project_irt_by_id_confirm}
          onCancel={this.delete_project_irt_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.project_irt_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_score_irt_data_detail" />
            }
            placement="left"
            closable={true}
            width={400}
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

        <div
          style={{
            background: "#FFFFFF",
            padding: "5px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
          <Table
            size={"middle"}
            columns={this.state.project_irt_table_columns}
            pagination={{
              position: "top",
              hideOnSinglePage: true,
              defaultPageSize: 100
            }}
            dataSource={this.state.project_irt_data}
          />
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

export default Project_irt;
