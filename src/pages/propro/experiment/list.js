// src/pages/propro/experiment/list.js
// list 实验数据 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-7 01:19:51
 * @UpdateTime          2019-10-7 21:32:51
 * @Archive             实验数据列表
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
    experiment_list_status = -1,
    experiment_list_time = 0,
    experiment_list_data = {},
    experiment_list_delete_status = -1,
    experiment_list_delete_time = 0,
    experiment_list_delete_data = {}
  } = state["experiment_list"];

  (obj.experiment_list_delete_status = experiment_list_delete_status),
    (obj.experiment_list_delete_time = experiment_list_delete_time),
    (obj.experiment_list_delete_data = experiment_list_delete_data),
    (obj.experiment_list_status = experiment_list_status),
    (obj.experiment_list_time = experiment_list_time),
    (obj.experiment_list_data = experiment_list_data);

  return obj;
};

const experiment_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_experiment_list: (data = null) => {
      const action = {
        type: "experiment_list/get_experiment_list",
        payload: data
      };
      dispatch(action);
    },
    delete_experiment_list: data => {
      const action = {
        type: "experiment_list/delete_experiment_list",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "experiment_list/set_state_newvalue",
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
class Experiment_list extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      experiment_list_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      experiment_list_status: -1,
      // 请求失败再次发起请求的尝试次数
      experiment_list_false_time: 5,
      search_text: "",
      experiment_list_table_columns: null,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      delete_experiment_list_id: null,
      analyse_overview_do_map: null
      //   language: this.props.language
    };

    // 查询 experiment_list 列表
    setTimeout(() => {
      // 默认获取全部
      this.query_experiment_list();
    }, 100);

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });

    // 配置表格列参数
    this.config_table_columns();
  }

  // 查询 experiment_list 列表
  query_experiment_list = () => {
    let url = this.props.history.location.pathname;
    let obj = {};
    /************   list_project_name  ****************/
    let find_str = "/list_project_name/";
    let index = url.lastIndexOf(find_str);
    let project_name = url.substring(index + find_str.length);
    if (3 < index) {
      // 找到 project_name 发起查询
      obj.project_name = project_name;
    }

    /********  list_type  *******/
    find_str = "/list_type/";
    index = url.lastIndexOf(find_str);
    let type = url.substring(index + find_str.length);

    if (3 < index) {
      // 找到 type 发起查询
      obj.type = type;
    }

    this.props.get_experiment_list(obj);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        experiment_list_status: -1
      });
      // 立即重新发起查询
      this.query_experiment_list();
    }, 800);
  };

  handle_experiment_list = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "experiment_list_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.experiment_list_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_experiment_list_data();
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
      let { experiment_list_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= experiment_list_false_time) {
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
          experiment_list_false_time: experiment_list_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_experiment_list_data = () => {
    console.log(this.props.experiment_list_data);
    /*
      analyseOverviewDOMap: {5d22faca8536e9793683a57a: {…}, 5d22faca8536e9793683a57b: {…}, 5d22faca8536e9793683a57c: {…}, 5d22faca8536e9793683a57e: {…}}
      currentPage: 1
      experiments: (50) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
      pageSize: 50
      totalNum: 185
      totalPage: 4
    */
    let {
      analyseOverviewDOMap: analyse_overview_do_map = null,
      currentPage: current_page = null,
      experiments = null,
      pageSize: page_size = null,
      totalNum: total_numbers = null,
      totalPage: total_page = null,
      type = null,
      projectName: project_name = null,
      expName: exp_name = null
    } = this.props.experiment_list_data;

    let { length: len0 } = experiments;
    let [experiments_arr, load_percentage_value] = [null, 0];

    if (0 < len0) {
      //
      experiments_arr = new Array(len0);

      // tangtao 计算百分比
      load_percentage_value = Math.ceil((len0 / total_numbers) * 100);

      //
      /*
      0:
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

      let [index, obj_temp] = [0, {}];
      for (let i = 0; i < len0; i++) {
        //
        let {
          projectName,
          id,
          name,
          type,
          airdSize,
          airdIndexSize,
          vendorFileSize,
          windowRanges,
          instrument,
          irtResult = null,
          lastModifiedDate = null
        } = experiments[i];

        let window_ranges_size = 0;
        // 剔除数据
        airdSize = 0 < airdSize ? airdSize : 0;
        airdIndexSize = 0 < airdIndexSize ? airdIndexSize : 0;
        vendorFileSize = 0 < vendorFileSize ? vendorFileSize : 0;
        let { length: len1 = 0 } = windowRanges;
        window_ranges_size = 0 <= len1 ? len1 : 0;

        // 日期
        if (null != lastModifiedDate) {
          lastModifiedDate = tao.format_time(parseInt(lastModifiedDate));
        } else {
          lastModifiedDate = null;
        }

        (obj_temp.index = i + 1),
          (obj_temp.key = "experiments_arr_" + i),
          (obj_temp.project_name = projectName),
          (obj_temp.id = id),
          (obj_temp.name = name),
          (obj_temp.type = type),
          (obj_temp.aird_size = airdSize),
          (obj_temp.aird_index_size = airdIndexSize),
          (obj_temp.aird_size_value = parseInt(
            (airdSize + airdIndexSize) / 1024 / 1024
          )),
          (obj_temp.vendor_file_size_value = parseInt(
            vendorFileSize / 1024 / 1024
          )),
          (obj_temp.window_ranges = windowRanges),
          (obj_temp.window_ranges_size = window_ranges_size),
          (obj_temp.instrument = instrument),
          (obj_temp.irt_result = irtResult),
          (obj_temp.last_modified_date = lastModifiedDate),
          (experiments_arr[i] = obj_temp),
          (obj_temp = {});
      }
    }

    // 遍历 analyse_overview_do_map
    // let analyse_overview_do_map_arr = [];
    // Object.keys(analyse_overview_do_map).forEach((key, value) => {
    //   let obj_temp = {};
    //   // obj_temp.name
    //   console.log(key, value);
    // });

    this.setState({
      // 标记 成功
      experiment_list_false_time: 5,
      load_percentage_value: load_percentage_value,
      total_numbers: total_numbers,
      analyse_overview_do_map: analyse_overview_do_map,
      experiment_list_query_time: tao.current_format_time(),
      experiment_list_data: experiments_arr,
      // 标记数据为可用的状态
      experiment_list_status: 0
    });

    return 0;
  };

  get_column_search_props = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handle_table_search(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handle_table_search(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <FormattedHTMLMessage id="propro.experiment_list_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.experiment_list_reset" />
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.search_text]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  config_table_columns = () => {
    let experiment_list_table_columns = [
      {
        // 1  序列号
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_index" />
          </span>
        ),
        dataIndex: "index",
        key: "index",
        width: 60,
        ...this.get_column_search_props("index"),
        render: text => {
          return (
            <span
              className={styles.font_second_color}
              style={{
                fontSize: "8px",
                fontWeight: "600"
              }}
            >
              {text}
            </span>
          );
        }
      },
      {
        // 2  项目名称
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_project_name" />
          </span>
        ),
        key: "project_name",
        width: 110,
        ...this.get_column_search_props("project_name"),
        render: list => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "110px",
                maxWidth: "110px"
              }}
            >
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_view_experience" />
                }
              >
                <Link
                  to={"/library/analysis/detail/" + list.project_name}
                  style={{
                    fontSize: "8px"
                  }}
                >
                  {list.project_name}
                </Link>
              </Tooltip>
            </div>
          );
        }
      },
      {
        // 3  实验名称
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_name" />
          </span>
        ),
        dataIndex: "name",
        key: "name",
        width: 110,
        ...this.get_column_search_props("name"),
        render: (text, list) => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "110px",
                maxWidth: "110px",
                fontWeight: "600"
              }}
            >
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_detail" />
                }
              >
                <Link to={"/experiment/detail/" + list.id}>
                  <p
                    className={"badge-light " + styles.font_blue_color}
                    style={{
                      padding: "5px",
                      fontSize: "8px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    {text}
                  </p>
                </Link>
              </Tooltip>
            </div>
          );
        }
      },
      {
        // 4  实验ID
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_id" />
          </span>
        ),
        dataIndex: "id",
        key: "id",
        width: 110,
        ...this.get_column_search_props("id"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "110px",
                maxWidth: "110px"
              }}
              className={styles.font_primary_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 5  实验类型
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_type" />
          </span>
        ),
        dataIndex: "type",
        key: "type",
        width: 90,
        ...this.get_column_search_props("type"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "90px",
                maxWidth: "90px"
              }}
            >
              <span
                className={
                  "badge " +
                  styles.font_white_color +
                  " " +
                  styles.bg_primary_color
                }
                style={{
                  padding: "5px",
                  fontSize: "8px",
                  fontWeight: "600"
                }}
              >
                {text}
              </span>
            </div>
          );
        }
      },
      {
        // 6  aird_size_value & vendor_file_size_value
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <span className={styles.font_green_color}>
              <FormattedHTMLMessage id="propro.experiment_list_experiment_aird_size" />
            </span>
            <br />
            <span className={styles.font_primary_color}>
              <FormattedHTMLMessage id="propro.experiment_list_experiment_vendor_file_size" />
            </span>
          </span>
        ),
        dataIndex: "aird_size_value",
        key: "aird_size_value",
        width: 75,
        ...this.get_column_search_props("aird_size_value"),
        render: (text, list) => {
          let aird_size_span = null;
          if (0 < list.aird_size_value) {
            aird_size_span = (
              <span
                className={
                  "badge " +
                  styles.font_white_color +
                  " " +
                  styles.bg_green_color
                }
                style={{
                  padding: "5px",
                  fontSize: "8px",
                  fontWeight: "600",
                  minWidth: "55px"
                }}
              >
                {list.aird_size_value}&nbsp;MB
              </span>
            );
          } else {
            // 异常值
            aird_size_span = (
              <span
                className={
                  "badge " + styles.font_white_color + " " + styles.bg_red_color
                }
                style={{
                  padding: "5px",
                  fontSize: "8px",
                  fontWeight: "600",
                  minWidth: "55px"
                }}
              >
                0&nbsp;MB
              </span>
            );
          }

          let vendor_file_size_span = null;

          if (0 < list.vendor_file_size_value) {
            vendor_file_size_span = (
              <span
                className={
                  "badge " +
                  styles.font_white_color +
                  " " +
                  styles.bg_primary_color
                }
                style={{
                  padding: "5px",
                  fontSize: "8px",
                  fontWeight: "600",
                  minWidth: "55px"
                }}
              >
                {list.vendor_file_size_value}&nbsp;MB
              </span>
            );
          } else {
            // 异常值
            vendor_file_size_span = (
              <span
                className={
                  "badge " + styles.font_white_color + " " + styles.bg_red_color
                }
                style={{
                  padding: "5px",
                  fontSize: "8px",
                  fontWeight: "600",
                  minWidth: "55px"
                }}
              >
                0&nbsp;MB
              </span>
            );
          }

          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "75px",
                maxWidth: "75px"
              }}
            >
              {aird_size_span}
              <div
                style={{
                  height: "5px"
                }}
              >
                &nbsp;
              </div>
              {vendor_file_size_span}
            </div>
          );
        }
      },
      {
        // 7 Swath窗口数目
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              wordWrap: "break-word",
              wordBreak: "break-all",
              minWidth: "40px",
              maxWidth: "40px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_window_ranges_size" />
          </span>
        ),
        dataIndex: "window_ranges_size",
        key: "window_ranges_size",
        width: 40,
        ...this.get_column_search_props("window_ranges_size"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "40px",
                maxWidth: "40px",
                fontWeight: "600"
              }}
              className={styles.font_green_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 8 IRT 结果
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              wordWrap: "break-word",
              wordBreak: "break-all",
              minWidth: "100px",
              maxWidth: "100px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_irt_result" />
          </span>
        ),
        dataIndex: "irt_result",
        key: "irt_result",
        width: 100,
        ...this.get_column_search_props("window_ranges_size"),
        render: text => {
          /*
          irtResult:
          selectedPairs: (10) [Array(2), Array(2), Array(2), Array(2), 
            Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
          si: {intercept: -63.40565871766859, slope: 0.025800507652154296}
          unselectedPairs: []
          */

          let [value0, value1] = [null, null];
          if ("undefined" != typeof text && null != text) {
            // 正常
            let { si = null } = text;
            if (si != null) {
              let { slope = null, intercept = null } = si;
              // 更新
              value0 = null != slope ? slope : null;
              value1 = null != intercept ? intercept : null;
            }
          } else {
            // 数据异常 不用管
          }

          // 渲染样式
          let span0 = null;
          if (null != value0) {
            span0 = (
              <p
                className={"badge-light " + styles.font_green_color}
                style={{ padding: "5px", margin: "0px " }}
              >
                {value0}
              </p>
            );
          } else {
            span0 = (
              <p
                className={"badge-light " + styles.font_red_color}
                style={{ padding: "5px", margin: "0px " }}
              >
                NULL
              </p>
            );
          }

          let span1 = null;

          if (null != value1) {
            span1 = (
              <p
                className={"badge-light " + styles.font_primary_color}
                style={{ padding: "5px", margin: "0px " }}
              >
                {value1}
              </p>
            );
          } else {
            span1 = (
              <p
                className={"badge-light " + styles.font_red_color}
                style={{ padding: "5px", margin: "0px " }}
              >
                NULL
              </p>
            );
          }

          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "100px",
                maxWidth: "100px",
                fontWeight: "600"
              }}
              className={styles.font_green_color}
            >
              {span0}
              <div
                style={{
                  height: "5px"
                }}
              >
                &nbsp;
              </div>
              {span1}
            </div>
          );
        }
      },
      {
        // 9 最后修改时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              wordWrap: "break-word",
              wordBreak: "break-all",
              minWidth: "110px",
              maxWidth: "110px"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_last_modified_date" />
          </span>
        ),
        dataIndex: "last_modified_date",
        key: "last_modified_date",
        width: 110,
        ...this.get_column_search_props("last_modified_date"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "110px",
                maxWidth: "110px",
                fontWeight: "600"
              }}
              className={styles.font_green_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 10 操作
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              wordWrap: "break-word",
              wordBreak: "break-all"
            }}
          >
            <FormattedHTMLMessage id="propro.experiment_list_experiment_operation" />
          </span>
        ),
        key: "operation",
        width: 200,
        render: list => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "200px",
                maxWidth: "200px",
                fontWeight: "600"
              }}
              className={styles.font_green_color}
            >
              {/* 查看数据详情 */}
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_operation_detail" />
                }
              >
                <div
                  className={"badge " + styles.bg_orange_color}
                  style={{
                    padding: "4px 4px",
                    margin: "3px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    this.view_experiment_list_detail(list.index);
                  }}
                >
                  <img
                    src={detail_svg}
                    style={{
                      width: "20px"
                    }}
                  />
                </div>
              </Tooltip>

              {/* 修改数据 */}
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_operation_modify" />
                }
              >
                <Link to={"/experiment/edit/" + list.id}>
                  <div
                    className={"badge " + styles.bg_blue_color}
                    style={{
                      padding: "4px 4px",
                      margin: "3px",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={modify_svg}
                      style={{
                        width: "20px"
                      }}
                    />
                  </div>
                </Link>
              </Tooltip>

              {/* 查看分析列表数据 */}
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_operation_list" />
                }
              >
                <Link to={"/analysis/list_exp_id/" + list.id}>
                  <div
                    className={"badge " + styles.bg_second_color}
                    style={{
                      padding: "4px 4px",
                      margin: "3px",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={list_svg}
                      style={{
                        width: "20px"
                      }}
                    />
                  </div>
                </Link>
              </Tooltip>

              {/* irt 计算 */}
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_operation_irt" />
                }
              >
                <Link to={"/analysis/list_exp_id/" + list.id}>
                  <div
                    className={"badge " + styles.bg_primary_color}
                    style={{
                      padding: "4px 4px",
                      margin: "3px",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={chart_svg}
                      style={{
                        width: "20px"
                      }}
                    />
                  </div>
                </Link>
              </Tooltip>

              {/* 批量执行完整流程 */}
              <Tooltip
                placement="topLeft"
                title={
                  <FormattedHTMLMessage id="propro.experiment_list_experiment_operation_process" />
                }
              >
                <Link to={"/analysis/list_exp_id/" + list.id}>
                  <div
                    className={"badge " + styles.bg_green_color}
                    style={{
                      padding: "4px 4px",
                      margin: "3px",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={process_svg}
                      style={{
                        width: "20px"
                      }}
                    />
                  </div>
                </Link>
              </Tooltip>
            </div>
          );
        }
      }
    ];
    setTimeout(() => {
      this.setState({
        experiment_list_table_columns: experiment_list_table_columns
      });
    }, 40);
  };

  handle_table_search = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handle_table_reset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
  };

  delete_experiment_list_by_id = id => {
    // 调用删除对话框
    this.setState({
      delete_experiment_list_id: id,
      modal_visible: true
    });
  };

  delete_experiment_list_by_id_confirm = () => {
    this.setState({
      modal_visible: false
    });
    let { language } = this.props;
    message.loading(
      Languages[language]["propro.experiment_list_delete_tip"] +
        " : " +
        Languages[language]["propro.prompt_running"],
      2
    );
    // 延迟删除 为用户提供紧急停留时间
    setTimeout(() => {
      // 获取id
      let { delete_experiment_list_id } = this.state;
      this.props.delete_experiment_list({
        id: delete_experiment_list_id
      });
    }, 1500);
  };

  delete_experiment_list_by_id_cancel = () => {
    this.setState({
      modal_visible: false
    });
  };

  handle_delete_experiment_list = () => {
    //
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "experiment_list_delete_time",
      value: 0
    });

    let { experiment_list_delete_status, language } = this.props;
    if (0 == experiment_list_delete_status) {
      // 删除成功
      setTimeout(() => {
        message.success(
          Languages[language]["propro.experiment_list_delete_tip"] +
            " : " +
            Languages[language]["propro.prompt_success"],
          4
        );
      }, 200);
    } else {
      // 删除失败 可能出在网络
      setTimeout(() => {
        message.error(
          Languages[language]["propro.experiment_list_delete_tip"] +
            " : " +
            Languages[language]["propro.prompt_failed"],
          4
        );
      }, 200);

      return -1;
    }
    // 执行刷新到分析列表
    setTimeout(() => {
      // 重新加载数据
      this.refresh_data();
    }, 500);
  };

  /************   operation  *****************/
  /************   operation  *****************/
  /************   operation  *****************/
  view_experiment_list_detail = index => {
    // 注意 index 比数组的位置 多 1 所以可以根据 index 减一 定位 data 的位置

    if (index > 0) {
      index--;
    } else {
      // 上报错误
      tao.my_console("warn", "参数错误 at experiment list");
    }

    let { experiment_list_data: data } = this.state;

    // 提取出需要显示的关键数据

    let obj = {};
    try {
      /***** 仪器详情 instrument ******/
      let { instrument = null } = data[index];
      let { manufacturer = null, model = null } = instrument;
      // 制造商 manufacturer
      // 数据正确提取
      obj.manufacturer = null != manufacturer ? manufacturer : null;
      obj.model = null != model ? model : null;
    } catch (e) {
      tao.my_console("warn", "数据提取失败 at experiment list");
      // 继续执行
    }

    /************  提取id 找到识别结果  ****************/
    let { id } = data[index];
    // 根据id 尝试从 analyseOverviewDOMap 取新数据

    let { analyse_overview_do_map: data_map } = this.state;
    // 尝试提取
    if ("undefined" != typeof data_map[id]) {
      // 解析数据
      let {
        libraryPeptideCount = null,
        totalPeptideCount = null,
        matchedProteinCount = null,
        matchedPeptideCount = null
      } = data_map[id];
      //
      let pp_rate = null;
      if (
        0 != matchedProteinCount &&
        null != matchedProteinCount &&
        null != matchedPeptideCount
      ) {
        pp_rate = matchedPeptideCount / matchedProteinCount;
      }

      (obj.library_peptide_count = libraryPeptideCount),
        (obj.total_peptide_count = totalPeptideCount),
        (obj.matched_protein_count = matchedProteinCount),
        (obj.matched_peptide_count = matchedPeptideCount),
        (obj.pp_rate = pp_rate);
    }

    // 渲染数据
    console.log(obj);
    this.show_drawer_data(obj);

    // drawer_data drawer_visible
  };

  show_drawer_data = data => {
    let {
      manufacturer,
      model,
      library_peptide_count,
      total_peptide_count,
      matched_protein_count,
      matched_peptide_count,
      pp_rate
    } = data;

    let drawer_data = (
      <div>
        <div
          style={{ fontSize: "14px", fontWeight: "600", margin: "10px 0px" }}
        >
          <span className={styles.font_blue_color}>设备型号</span>
          <span className={styles.font_dark_color}>&nbsp;:&nbsp;</span>
          <span className={styles.font_primary_color}>
            {null != manufacturer ? (
              manufacturer
            ) : (
              <span className={styles.font_red_color}>NULL</span>
            )}
            &nbsp;&nbsp;
            <span
              className={"badge badge-secondary"}
              style={{ padding: "5px" }}
            >
              {null != model ? (
                model
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </span>
          </span>
        </div>
        {/* 识别结果 */}
        <div
          style={{ fontSize: "14px", fontWeight: "600", margin: "10px 0px" }}
        >
          <span className={styles.font_blue_color}>识别结果</span>
          <span className={styles.font_dark_color}>&nbsp;:&nbsp;</span>

          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              padding: "5px 10px "
            }}
          >
            <div>
              <span className={styles.font_second_color}>Peptides</span>
              &nbsp;:&nbsp;
              {null != matched_peptide_count ? (
                <span className={styles.font_green_color}>
                  {matched_peptide_count}
                </span>
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </div>

            <div>
              <span className={styles.font_second_color}>Proteins</span>
              &nbsp;:&nbsp;
              {null != matched_protein_count ? (
                <span className={styles.font_green_color}>
                  {matched_protein_count}
                </span>
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </div>

            <div>
              <span className={styles.font_second_color}>XIC Peptides</span>
              &nbsp;:&nbsp;
              {null != total_peptide_count ? (
                <span className={styles.font_green_color}>
                  {total_peptide_count}
                </span>
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </div>

            <div>
              <span className={styles.font_second_color}>Library Peptides</span>
              &nbsp;:&nbsp;
              {null != library_peptide_count ? (
                <span className={styles.font_green_color}>
                  {library_peptide_count}
                </span>
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </div>

            <div>
              <span className={styles.font_second_color}>PP Rate</span>
              &nbsp;:&nbsp;
              {null != pp_rate ? (
                <span className={styles.font_green_color}>{pp_rate}</span>
              ) : (
                <span className={styles.font_red_color}>NULL</span>
              )}
            </div>
          </div>
        </div>
      </div>
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

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 experiment_list 数据变化
    if (10000 < this.props.experiment_list_time) {
      // 资源有更新
      this.handle_experiment_list();
    }

    if (10000 < this.props.experiment_list_delete_time) {
      this.handle_delete_experiment_list();
    }

    if (0 != this.state.experiment_list_status) {
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
          <FormattedHTMLMessage id="propro.experiment_list_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_experiment_list_by_id_confirm}
          onCancel={this.delete_experiment_list_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.experiment_list_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_score_list_data_detail" />
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
            padding: "5px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
          <Table
            size={"middle"}
            columns={this.state.experiment_list_table_columns}
            pagination={{
              position: "top",
              hideOnSinglePage: true,
              defaultPageSize: 100
            }}
            dataSource={this.state.experiment_list_data}
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

export default Experiment_list;
