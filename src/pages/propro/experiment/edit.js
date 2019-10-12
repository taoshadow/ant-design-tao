// src/pages/propro/experiment/edit.js
// 编辑 list 实验数据

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-11 12:39:09
 * @UpdateTime          2019-10-11 12:39:30
 * @Archive             编辑实验数据列表
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";
import ReactJson from "react-json-view";

import {
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Descriptions,
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

const { TextArea } = Input;
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

import proteins_list_svg from "../style/static/library/list.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
import public_library_scg from "../style/static/library/public.svg";
import update_library_svg from "../style/static/library/update.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import detail_svg from "../style/static/experiment/detail.svg";
import list_svg from "../style/static/experiment/list.svg";
import modify_svg from "../style/static/experiment/modify.svg";
import chart_svg from "../style/static/experiment/chart.svg";
import process_svg from "../style/static/experiment/process.svg";

/****************  导入 styles end ***************************/

/***********  experiment View 初始化   ***************/
/***********  experiment View 初始化   ***************/

const experiment_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    experiment_edit_status = -1,
    experiment_edit_time = 0,
    experiment_edit_data = {},
    experiment_edit_list_delete_status = -1,
    experiment_edit_list_delete_time = 0,
    experiment_edit_list_delete_data = {}
  } = state["experiment_edit"];

  (obj.experiment_edit_list_delete_status = experiment_edit_list_delete_status),
    (obj.experiment_edit_list_delete_time = experiment_edit_list_delete_time),
    (obj.experiment_edit_list_delete_data = experiment_edit_list_delete_data),
    (obj.experiment_edit_status = experiment_edit_status),
    (obj.experiment_edit_time = experiment_edit_time),
    (obj.experiment_edit_data = experiment_edit_data);

  return obj;
};

const experiment_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_experiment_edit: data => {
      const action = {
        type: "experiment_edit/get_experiment_edit",
        payload: data
      };
      dispatch(action);
    },
    delete_experiment_edit: data => {
      const action = {
        type: "experiment_edit/delete_experiment_edit",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "experiment_edit/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  experiment View 初始化 end  ***************/

@connect(
  experiment_state_to_props,
  experiment_dispatch_to_props
)
class Experiment_edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //   查询到的标准库数据
      experiment_edit_data: [],
      experiment_edit_id: null,

      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      experiment_edit_status: -1,

      // 请求失败再次发起请求的尝试次数
      experiment_edit_false_time: 5,
      experiment_edit_query_time: 0,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      delete_experiment_edit_id: null,
      // -1 默认不允许删除 0 允许删除
      delete_experiment_edit_list_status: -1,
      intercept: null,
      slope: null,
      description: null,
      features_arr: null,
      features_str: null,
      features_source: null
    };

    // 查询 experiment_edit 列表
    setTimeout(() => {
      this.query_experiment_edit();
    }, 100);

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
    // 配置 notification
    notification.config({
      placement: "topRight",
      bottom: 50,
      duration: 4
    });
  }

  // 查询数据接口
  query_experiment_edit = () => {
    //
    let url = this.props.history.location.pathname;
    let find_str = "/edit/";
    let index = url.lastIndexOf(find_str);
    let id = url.substring(index + find_str.length);

    let obj = {};
    if (3 < index) {
      // 找到 id 添加
      obj.id = id;
      // 延时写入
      setTimeout(() => {
        this.setState({
          experiment_edit_id: id
        });
      }, 30);
    } else {
      // 找不到 数据异常
      tao.my_console(
        "warn",
        "@Author:tangtao; url非法 ",
        "初步诊断:url值不正确"
      );
    }

    setTimeout(() => {
      this.props.get_experiment_edit(obj);
    }, 40);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        experiment_edit_status: -1
      });
      // 立即重新发起查询
      this.query_experiment_edit();
    }, 800);
  };

  handle_experiment_edit = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "experiment_edit_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.experiment_edit_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_experiment_edit_data();
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
      let { experiment_edit_false_time } = this.state;

      // 2-判断是否需要再次发起请求
      if (0 >= experiment_edit_false_time) {
        // 提示错误警告
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
          experiment_edit_false_time: experiment_edit_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_experiment_edit_data = () => {
    console.log(this.props.experiment_edit_data);

    /*
      experiment:
        airdIndexPath: "E:\data\HYE110_6600_64_Var\HYE110_TTOF6600_64var_lgillet_I160305_001.json"
        airdIndexSize: 3431589
        airdPath: "E:\data\HYE110_6600_64_Var\HYE110_TTOF6600_64var_lgillet_I160305_001.aird"
        airdSize: 2471259255
        compressors: (2) [{…}, {…}]
        createDate: 1562567900202
        features: "TripleTOF 6600:;sourceFileFormat:WIFF;byte_order:LITTLE_ENDIAN;rawId:HYE110_TTOF6600_64var_lgillet_I160305_001-Pedro Sample A - 64 variable;ignoreZeroIntensity:True;overlap:1;propro_client_version:1.7.0;aird_version:2;"
        iRtLibraryId: "5c6d2ec7dfdfdd2f947c6f39"
        id: "5d22e4dca1eaff5cabc0fa39"
        instrument: {analyzer: Array(3), detector: Array(1), manufacturer: "SCIEX", model: "TripleTOF 6600", source: Array(1)}
        irtResult: {selectedPairs: Array(10), si: {…}, unselectedPairs: Array(0)}
        lastModifiedDate: 1562902402129
        name: "HYE110_TTOF6600_64var_lgillet_I160305_001"
        ownerName: "lms"
        parentFiles: []
        projectId: "5d22e4d9a1eaff5cabc0fa37"
        projectName: "HYE110_6600_64_Var"
        softwares: (2) [{…}, {…}]
        type: "DIA_SWATH"
        vendorFileSize: 3463541784
        windowRanges: (64) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    */

    // 提取斜率和截距

    let { experiment } = this.props.experiment_edit_data;

    let {
      irtResult: irt_result = null,
      description = null,
      features = ""
    } = experiment;
    let [slope, intercept] = [null, null];
    try {
      let { si = null } = irt_result;
      (slope = si.slope), (intercept = si.intercept);
    } catch (e) {
      (slope = null), (intercept = null);
    }

    /**** features ****/
    // 特征字段
    features += "";
    let features_list = features.split(";");
    let { length: len5 } = features_list;
    let features_str = "";
    if (0 < len5) {
      //
      for (let i = 0; i < len5; i++) {
        //
        features_str += features_list[i] + "\n";
      }
    }

    this.setState({
      // 标记 成功
      experiment_edit_false_time: 5,
      experiment_edit_query_time: tao.current_format_time(),
      intercept: intercept,
      slope: slope,
      description: description,
      features_str: features_str,
      // 原始特征字段
      features_source: features,
      //   experiment_edit_data: experiments_arr,
      //   // 标记数据为可用的状态
      experiment_edit_status: 0
    });

    this.change_state_features_arr();

    return 0;
  };

  /************   operation  *****************/
  /************   operation  *****************/
  /************   operation  *****************/

  show_drawer_data = () => {
    let drawer_data = null;
    let view_data = null;
    //   提取出窗口数据
    let { experiment = null } = this.props.experiment_edit_data;
    if (null != experiment) {
      try {
        let { windowRanges: window_ranges = [] } = experiment;
        let { length: len0 } = window_ranges;
        if (0 < len0) {
          // 有数据
          view_data = window_ranges;
        }
      } catch (error) {
        view_data = null;
      }
    }

    drawer_data = (
      <ReactJson
        name={"PROPRO"}
        theme={"summerfruit:inverted"}
        iconStyle={"circle"}
        style={{
          fontSize: "15px",
          fontWeight: "500"
        }}
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

  drawer_close = () => {
    // 关闭抽屉
    this.setState({
      drawer_visible: false
    });
  };

  view_swatch_data = () => {
    // 调用侧边栏
    setTimeout(() => {
      this.show_drawer_data();
    }, 100);
  };

  // 截距
  change_state_intercept = obj => {
    // 值先全部保留 最后进行转换为 float
    this.setState({
      intercept: obj.target.value
    });
  };

  // 斜率
  change_state_slope = obj => {
    // 值先全部保留 最后进行转换为 float
    this.setState({
      slope: obj.target.value
    });
  };

  // 详情描述
  change_state_description = obj => {
    // 值先全部保留 最后进行转换为 float
    this.setState({
      description: obj.target.value
    });
  };

  // 特征字段
  change_state_features_str = obj => {
    // 处理数据
    let str = obj.target.value;
    // 剔除\n\nstr之间的空白字符 并且用分号连接
    str = str.replace(/\n/g, ";");

    // 值先全部保留
    this.setState({
      features_str: obj.target.value,
      features_source: str
    });

    // Author:tangtao https://www.promiselee.cn/tao
    // 注意 要先写入 state 再去改变 所以使用延时回调
    setTimeout(() => {
      this.change_state_features_arr();
    }, 30);
  };

  // handle

  change_state_features_arr = () => {
    let str = this.state.features_source;
    setTimeout(() => {
      let features_list = str.split(";");
      let { length: len5 } = features_list;
      let features_arr = null;
      if (0 < len5) {
        //
        features_arr = new Array(len5);
        for (let i = 0; i < len5; i++) {
          //
          features_arr[i] = (
            <div
              key={"features_arr_" + i}
              className={"badge badge-light " + styles.font_green_color}
              style={{
                padding: "4px 6px",
                margin: "5px 5px",
                wordWrap: "break-word",
                wordBreak: "break-all"
              }}
            >
              {features_list[i]}
            </div>
          );
        }
      }

      // 值先全部保留
      this.setState({
        features_arr: features_arr
      });
    }, 150);
  };

  delete_experiment_edit_list_by_id = () => {
    this.setState({
      modal_visible: true
    });
  };

  delete_experiment_edit_list_by_id_confirm = () => {
    this.setState({
      modal_visible: false,
      // 允许删除
      delete_experiment_edit_list_status: 0
    });
    // 执行删除操作
    let { language } = this.props;

    setTimeout(() => {
      message.loading(
        Languages[language]["propro.experiment_edit_list_operation_delete"] +
          " : " +
          Languages[language]["propro.prompt_running"],
        4
      );
    }, 30);

    // 提供撤销操作
    setTimeout(() => {
      let btn_obj = (
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
          onClick={this.undo_delete_experiment_edit_list_by_id}
        >
          撤销
        </button>
      );
      notification.warn({
        message:
          Languages[language]["propro.notification_operation_warn_title"],
        description:
          Languages[language][
            "propro.experiment_edit_notification_operation_delete_description"
          ] + " ...",
        btn: btn_obj,
        duration: 3
      });
    }, 300);

    // // 故意延迟 供用户撤销
    setTimeout(() => {
      this.delete_experiment_edit_list_by_id_execute();
    }, 3500);
  };

  delete_experiment_edit_list_by_id_cancel = () => {
    this.setState({
      modal_visible: false
    });
  };

  // 执行删除 不可逆
  delete_experiment_edit_list_by_id_execute = () => {
    //
    setTimeout(() => {
      // 获取id
      let {
        experiment_edit_id,
        delete_experiment_edit_list_status = -1
      } = this.state;
      if (0 == delete_experiment_edit_list_status) {
        this.props.delete_experiment_edit({ id: experiment_edit_id });
      } else {
        tao.my_console("info", "tangtao : 撤销成功");
        let { language } = this.props;

        message.info(
          Languages[language][
            "propro.experiment_edit_list_operation_delete_undo"
          ] +
            " : " +
            Languages[language]["propro.prompt_success"],
          4
        );

        return -1;
      }
      // 重新置位
      this.setState({
        delete_experiment_edit_list_status: -1
      });
    }, 100);
  };

  // 撤销删除操作
  undo_delete_experiment_edit_list_by_id = () => {
    // 立即撤销
    setTimeout(() => {
      this.setState({
        delete_experiment_edit_list_status: -1
      });
    }, 30);
  };

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 experiment_edit 数据变化
    if (10000 < this.props.experiment_edit_time) {
      // 资源有更新
      this.handle_experiment_edit();
    }

    if (10000 < this.props.experiment_edit_list_delete_time) {
      this.handle_delete_experiment_edit();
    }

    if (0 != this.state.experiment_edit_status) {
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
      experiment_edit_id,
      // 截距
      intercept,
      // 斜率
      slope,
      // 详情描述
      description,
      // 特征字段
      features_str,
      features_arr
    } = this.state;

    /***************  解析experiment_edit_data  ******************/
    /***************  解析experiment_edit_data  ******************/
    let { experiment: detail_data } = this.props.experiment_edit_data;
    let {
      createDate = 0,
      lastModifiedDate = 0,
      windowRanges: window_ranges = [],
      instrument = {},
      softwares = [],
      compressors = [],
      features = "",
      parentFiles: parent_files = []
    } = detail_data;
    let create_date = tao.format_time(createDate);
    let last_modified_date = tao.format_time(lastModifiedDate);

    // Swatch窗口数目
    let { length: len0 = -1 } = window_ranges;
    let window_ranges_size = 0;
    if (0 < len0) {
      //
      window_ranges_size = len0;
    }

    // 从仪器 instrument 中提取 制造商 和 型号
    let {
      manufacturer = null,
      model = null,
      source = null,
      analyzer = [],
      detector = []
    } = instrument;

    /**** analyzer ****/

    let { length: len1 } = analyzer;
    let analyzer_arr = null;
    if (0 < len1) {
      //
      analyzer_arr = new Array(len1);
      for (let i = 0; i < len1; i++) {
        //
        analyzer_arr[i] = (
          <span
            key={"analyzer_arr_" + i}
            className={"badge badge-info"}
            style={{
              padding: "4px 6px",
              margin: "5px 5px"
            }}
          >
            {analyzer[i]}
          </span>
        );
      }
    }

    /**** detector ****/

    let { length: len2 } = detector;
    let detector_arr = null;
    if (0 < len2) {
      //
      detector_arr = new Array(len2);
      for (let i = 0; i < len2; i++) {
        //
        detector_arr[i] = (
          <span
            key={"detector_arr_" + i}
            className={"badge badge-info"}
            style={{
              padding: "4px 6px",
              margin: "5px 5px"
            }}
          >
            {detector[i]}
          </span>
        );
      }
    }

    /**** parentFiles ****/

    let { length: len_files } = parent_files;
    let parent_files_arr = null;
    if (0 < len_files) {
      //
      parent_files_arr = new Array(len_files);
      for (let i = 0; i < len_files; i++) {
        //
        parent_files_arr[i] = (
          <div
            key={"parent_files_arr_" + i}
            className={"badge badge-light"}
            style={{
              padding: "4px 6px",
              margin: "5px 5px",
              wordWrap: "break-word",
              wordBreak: "break-all"
            }}
          >
            {parent_files[i].name}&nbsp;:&nbsp;{parent_files[i].type}
          </div>
        );
      }
    }

    /**** softwares ****/

    let { length: len3 } = softwares;
    let softwares_arr = null;
    if (0 < len3) {
      //
      softwares_arr = new Array(len3);
      for (let i = 0; i < len3; i++) {
        //
        softwares_arr[i] = (
          <div
            key={"softwares_arr_" + i}
            className={"badge badge-light"}
            style={{
              padding: "4px 6px",
              margin: "5px 5px",
              wordWrap: "break-word",
              wordBreak: "break-all"
            }}
          >
            {softwares[i].name}&nbsp;:&nbsp;{softwares[i].version}
          </div>
        );
      }
    }

    /**** compressors ****/

    let { length: len4 } = compressors;
    let compressors_arr = null;
    if (0 < len4) {
      //
      compressors_arr = new Array(len4);
      for (let i = 0; i < len4; i++) {
        //
        compressors_arr[i] = (
          <div
            key={"compressors_arr_" + i}
            className={"badge badge-light"}
            style={{
              padding: "4px 6px",
              margin: "5px 5px",
              wordWrap: "break-word",
              wordBreak: "break-all"
            }}
          >
            {compressors[i].target}&nbsp;:&nbsp;{compressors[i].method}
          </div>
        );
      }
    }

    /***************  解析experiment_edit_data  ******************/
    /***************  解析experiment_edit_data  ******************/

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
            title={<FormattedHTMLMessage id="propro.experiment_detail_title" />}
          >
            <Link to={"/experiment/detail/" + experiment_edit_id}>
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.experiment_update_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_experiment_edit_list_by_id_confirm}
          onCancel={this.delete_experiment_edit_list_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.experiment_edit_list_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.experiment_edit_swtach_data_detail" />
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

        <div
          style={{
            background: "#FFFFFF",
            padding: "15px 10px",
            fontSize: "14px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
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
                          {detail_data.ownerName}
                        </span>
                      </Col>
                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.experiment_edit_create_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_green_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {create_date}
                        </span>
                      </Col>

                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.experiment_edit_last_modify_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_yellow_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {last_modified_date}
                        </span>
                      </Col>
                    </Row>
                  </Fragment>
                }
              >
                <Descriptions.Item span={2} label="实验ID">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_primary_color}
                  >
                    {detail_data.id}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item span={2} label="项目ID">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_primary_color}
                  >
                    {detail_data.projectId}
                  </div>
                </Descriptions.Item>

                {/* 实验名称 */}
                <Descriptions.Item span={4} label="实验名称">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {detail_data.name}
                  </div>
                </Descriptions.Item>

                {/* 别名 */}
                <Descriptions.Item span={2} label="别名">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_primary_color}
                  >
                    {detail_data.alias}
                  </div>
                </Descriptions.Item>

                {/* 实验类型 */}
                <Descriptions.Item span={2} label="实验类型">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_second_color}
                  >
                    {detail_data.type}
                  </div>
                </Descriptions.Item>

                {/* 项目ID */}
                <Descriptions.Item span={2} label="项目ID">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_primary_color}
                  >
                    {detail_data.projectId}
                  </div>
                </Descriptions.Item>

                {/* 项目名称 */}
                <Descriptions.Item span={2} label="项目名称">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {detail_data.projectName}
                  </div>
                </Descriptions.Item>

                {/* Aird文件路径 */}
                <Descriptions.Item span={4} label="Aird文件路径">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {detail_data.airdPath}
                  </div>
                </Descriptions.Item>

                {/* Aird索引文件路径 */}
                <Descriptions.Item span={4} label="Aird索引文件路径">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {detail_data.airdIndexPath}
                  </div>
                </Descriptions.Item>

                {/* iRT标准库ID */}
                <Descriptions.Item span={4} label="iRT标准库ID">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_primary_color}
                  >
                    {detail_data.iRtLibraryId}
                  </div>
                </Descriptions.Item>

                {/* 斜率 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <span className={styles.font_second_color}>
                      <FormattedHTMLMessage id="propro.experiment_edit_slope" />
                    </span>
                  }
                >
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_green_color}
                  >
                    <Input value={slope} onChange={this.change_state_slope} />
                  </div>
                </Descriptions.Item>

                {/* 截距 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <span className={styles.font_second_color}>
                      <FormattedHTMLMessage id="propro.experiment_edit_intercept" />
                    </span>
                  }
                >
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_green_color}
                  >
                    <Input
                      value={intercept}
                      className={styles.font_primary_color}
                      onChange={this.change_state_intercept}
                    />
                  </div>
                </Descriptions.Item>
                {/* Swatch窗口数目 */}
                <Descriptions.Item span={4} label="Swatch窗口数目">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_green_color}
                  >
                    {0 < window_ranges_size ? (
                      window_ranges_size
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      style={{
                        padding: "5px",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "20px",
                        marginLeft: "30px"
                      }}
                      // 这里为了处理冒泡 采用箭头方式传参
                      onClick={this.view_swatch_data}
                    >
                      查看详情
                    </button>
                  </div>
                </Descriptions.Item>

                {/* 设备信息 制造商 型号 */}
                <Descriptions.Item span={4} label="设备信息">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    <span
                      className={styles.font_primary_color}
                      style={{
                        fontWeight: "600"
                      }}
                    >
                      {null != manufacturer ? (
                        manufacturer
                      ) : (
                        <span className={styles.font_red_color}>NULL</span>
                      )}
                    </span>
                    &nbsp; &nbsp;
                    <span
                      className={"badge badge-secondary "}
                      style={{
                        fontWeight: "600",
                        padding: "5px"
                      }}
                    >
                      {null != model ? (
                        model
                      ) : (
                        <span className={styles.font_red_color}>NULL</span>
                      )}
                    </span>
                  </div>
                </Descriptions.Item>

                {/* Source */}
                <Descriptions.Item span={4} label="Source">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != source ? (
                      source
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* Analyzer */}
                <Descriptions.Item span={4} label="Analyzer">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != analyzer_arr ? (
                      analyzer_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* Detector */}
                <Descriptions.Item span={4} label="Detector">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != detector_arr ? (
                      detector_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* File Name & type */}
                <Descriptions.Item span={4} label="Files">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != parent_files_arr ? (
                      parent_files_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* Softwares Name & type */}
                <Descriptions.Item span={4} label="Softwares">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != softwares_arr ? (
                      softwares_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* Compressors */}
                <Descriptions.Item span={4} label="Compressors">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != compressors_arr ? (
                      compressors_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* 详情描述 */}
                <Descriptions.Item
                  span={4}
                  label={
                    <span className={styles.font_second_color}>
                      <FormattedHTMLMessage id="propro.experiment_edit_description" />
                    </span>
                  }
                >
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    <TextArea
                      value={description}
                      onChange={this.change_state_description}
                      autosize={{ minRows: 3, maxRows: 6 }}
                    />
                  </div>
                </Descriptions.Item>

                {/* 特征字段 */}
                <Descriptions.Item
                  span={4}
                  label={
                    <span className={styles.font_second_color}>
                      <FormattedHTMLMessage id="propro.experiment_edit_features" />
                    </span>
                  }
                >
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    <div
                      style={{
                        padding: "10px",
                        marginBottom: "10px"
                      }}
                    >
                      <div
                        className={styles.font_second_color}
                        style={{ fontSize: "14px", padding: "10px 0px" }}
                      >
                        实际效果
                      </div>

                      {null != features_arr ? (
                        features_arr
                      ) : (
                        <span className={styles.font_red_color}>NULL</span>
                      )}
                    </div>

                    <TextArea
                      value={features_str}
                      style={{
                        padding: "10px"
                      }}
                      onChange={this.change_state_features_str}
                      autosize={{ minRows: 4, maxRows: 8 }}
                    />
                  </div>
                </Descriptions.Item>

                {/* 操作 */}
                <Descriptions.Item span={4} label="操作">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      style={{
                        fontWeight: 400,
                        fontSize: "12px",
                        margin: "5px 5px",
                        height: "24px",
                        lineHeight: "14px",
                        padding: "5px",
                        letterSpacing: "1px"
                      }}
                      // 暂时还未实现
                      // onClick={this.delete_analysis_xic_list_by_id}
                    >
                      <span>更新</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      style={{
                        fontWeight: 400,
                        fontSize: "12px",
                        margin: "5px 5px",
                        height: "24px",
                        lineHeight: "14px",
                        padding: "5px",
                        letterSpacing: "1px"
                      }}
                      // 暂时还未实现
                      onClick={this.delete_experiment_edit_list_by_id}
                    >
                      删除
                    </button>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
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

export default Experiment_edit;
