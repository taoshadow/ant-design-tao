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
    experiment_edit_delete_status = -1,
    experiment_edit_delete_time = 0,
    experiment_edit_delete_data = {}
  } = state["experiment_edit"];

  (obj.experiment_edit_delete_status = experiment_edit_delete_status),
    (obj.experiment_edit_delete_time = experiment_edit_delete_time),
    (obj.experiment_edit_delete_data = experiment_edit_delete_data),
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
      search_text: "",
      experiment_edit_table_columns: null,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      delete_experiment_edit_id: null,
      analyse_overview_do_map: null
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

    this.setState({
      // 标记 成功
      experiment_edit_false_time: 5,
      experiment_edit_query_time: tao.current_format_time(),
      //   experiment_edit_data: experiments_arr,
      //   // 标记数据为可用的状态
      experiment_edit_status: 0
    });

    return 0;
  };

  show_drawer_data = data => {
    let drawer_data = null;
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

    if (10000 < this.props.experiment_edit_delete_time) {
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

    let { drawer_data, drawer_visible, experiment_edit_id } = this.state;


     /***************  解析experiment_edit_data  ******************/
    /***************  解析experiment_edit_data  ******************/
    let { experiment: detail_data } = this.props.experiment_edit_data;
    let {
      createDate = 0,
      lastModifiedDate = 0,
      irtResult: irt_result = null,
      windowRanges: window_ranges = [],
      instrument = {},
      softwares = [],
      compressors = [],
      features = "",
      parentFiles: parent_files = []
    } = detail_data;
    let create_date = tao.format_time(createDate);
    let last_modified_date = tao.format_time(lastModifiedDate);

    // 提取斜率和截距

    let [slope, intercept, slope_intercept] = [null, null, null];
    try {
      let { si = null } = irt_result;
      (slope = si.slope), (intercept = si.intercept);
    } catch (e) {
      (slope = null), (intercept = null);
    }

    if (null != intercept && null != slope && 0 != intercept) {
      slope_intercept = parseFloat(slope / intercept).toFixed(5);
    }

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

    /**** features ****/
    // 特征字段
    features += "";
    let features_list = features.split(";");
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
            <Link to={"/experiment/detail/" +  experiment_edit_id}>
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
          onOk={this.delete_experiment_edit_by_id_confirm}
          onCancel={this.delete_experiment_edit_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.experiment_edit_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_score_list_data_edit" />
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
                {/* 斜率/截距 */}
                <Descriptions.Item span={4} label="斜率/截距">
                  <div
                    style={{
                      wordWrap: "break-word",
                      wordBreak: "break-all",
                      padding: "5px"
                    }}
                    className={styles.font_green_color}
                  >
                    {null != slope ? (
                      slope
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                    &nbsp;/&nbsp;
                    {null != intercept ? (
                      intercept
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                    &nbsp;=&nbsp;
                    {null != slope_intercept ? (
                      slope_intercept
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
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
                <Descriptions.Item span={4} label="详情描述">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != detail_data.description ? (
                      detail_data.description
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </div>
                </Descriptions.Item>

                {/* 特征字段 */}
                <Descriptions.Item span={4} label="特征字段">
                  <div
                    style={{
                      padding: "5px"
                    }}
                    // className={styles.font_primary_color}
                  >
                    {null != features_arr ? (
                      features_arr
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
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
                      <span>原始谱图列表</span>
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
                      // onClick={this.delete_analysis_xic_list_by_id}
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
