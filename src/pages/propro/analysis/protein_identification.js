// src/pages/propro/analysis/protein_identification.js
// 打分数据页面

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-9-29 00:38:00
 * @UpdateTime          2019-10-3 20:39:41
 * @Archive             protein_identification 蛋白鉴定
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
  Button,
  Dropdown,
  Drawer,
  Select,
  Popconfirm,
  message,
  Tabs,
  Input,
  Modal,
  Descriptions,
  Tooltip,
  Table,
  Divider,
  Tag,
  InputNumber,
  Slider
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
import false_svg from "../style/static/analysis/false.svg";
import true_svg from "../style/static/analysis/true.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  analysis View 初始化   ***************/
/***********  analysis View 初始化   ***************/

const analysis_protein_identification_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    analysis_protein_identification_status = -1,
    analysis_protein_identification_time = 0,
    analysis_protein_identification_data = {}
  } = state["analysis_protein_identification"];

  (obj.analysis_protein_identification_status = analysis_protein_identification_status),
    (obj.analysis_protein_identification_time = analysis_protein_identification_time),
    (obj.analysis_protein_identification_data = analysis_protein_identification_data);

  return obj;
};

const analysis_protein_identification_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_analysis_protein_identification: data => {
      const action = {
        type:
          "analysis_protein_identification/get_analysis_protein_identification",
        payload: data
      };
      dispatch(action);
    },

    query_analysis_protein_identification: data => {
      const action = {
        type:
          "analysis_protein_identification/query_analysis_protein_identification",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "analysis_protein_identification/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  analysis View 初始化 end  ***************/

@connect(
  analysis_protein_identification_state_to_props,
  analysis_protein_identification_dispatch_to_props
)
class Analysis_protein_identification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      analysis_protein_identification_id: null,
      analysis_protein_identification_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      analysis_protein_identification_status: -1,
      // 请求失败再次发起请求的尝试次数
      analysis_protein_identification_false_time: 5,
      analysis_protein_identification_list_data: null,
      // 页面大小 通过调整它来设置
      page_size: null,
      total_numbers: null,
      load_page_numbers: 0,
      load_percentage_value: 0,
      analysis_protein_identification_list_query_time: null,
      search_text: "",
      // modal 配置
      modal_visible: false,
      // 抽屉
      drawer_visible: false,
      //
      drawer_data: null

      //   language: this.props.language
    };

    setTimeout(() => {
      this.get_current_analysis_protein_identification_id();
    }, 100);
    // 提取配置table
    this.config_table_columns();

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  // 解析url 获取到id 发起查询
  get_current_analysis_protein_identification_id = () => {
    // /analysis/protein_identification/5d36ed2d9063e34625b75fad
    let url = this.props.history.location.pathname;
    // 提取 id
    let str = "protein_identification/";
    let index = url.lastIndexOf(str);
    let id = url.substring(index + str.length);
    // 发起查询数据
    this.props.get_analysis_protein_identification({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        analysis_protein_identification_id: id
      });
    }, 80);
  };

  handle_analysis_protein_identification = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "analysis_protein_identification_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.analysis_protein_identification_status) {
      // 数据获取成功

      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_analysis_protein_identification_data();
      }, 200);
    } else {
      // 数据获取失败
      // 1-弹出警告
      Modal.error({
        title: "False",
        content: Languages[this.props.language]["propro.network_error"],
        okText: Languages[this.props.language]["propro.user_modal_know"]
      });

      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { analysis_protein_identification_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= analysis_protein_identification_false_time) {
        console.error(
          "@Author:tangtao; 系统已终止运行,请重新刷新页面; ",
          "初步诊断:未能成功连接到 propro-server 的服务器或者未能成功解析返回的数据"
        );
        // 终止发送
        return -1;
      }

      // 写入新的请求失败参数
      setTimeout(() => {
        this.setState({
          analysis_protein_identification_false_time: analysis_protein_identification_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_analysis_protein_identification_data = () => {
    /*
    currentPage: 1
    overview: {classifier: "lda", createDate: 1563191455079, decoyDistributions: {…}, expId: "5d2c65bb5c87654bb97127b5", expName: "C20181208yix_HCC_DIA_T_46A", …}
    overviewId: "5d2c689f21faa424be559603"
    pageSize: 10
    protMap:
        1/sp|O43148|MCES_HUMAN: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|P02671|FIBA_HUMAN: (256) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
        1/sp|P35241|RADI_HUMAN: (23) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|P54819|KAD2_HUMAN: (27) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|Q9BUT1|BDH2_HUMAN: (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|Q9H814|PHAX_HUMAN: (3) [{…}, {…}, {…}]
        1/sp|Q9NV70|EXOC1_HUMAN: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|Q9NZ01|TECR_HUMAN: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
        1/sp|Q86VQ6|TRXR3_HUMAN: (4) [{…}, {…}, {…}, {…}]
        1/sp|Q969H8|MYDGF_HUMAN: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
            bestRt: 1099.2033151715277
            dataRef: "5d36ed2d9063e34625b75fad-QAEMLDDLM(UniMod:35)EK_3-false"
            fdr: 0.5784523020874934
            featureScoresList: [{…}]
            fragIntFeature: ";y3:122072.90000000001;y4:31469.201;y5:34618.7;y10^2:27817.3;y10^3:230248.493;y6:0.0;"
            id: "5d36ed4a9063e34625b77654"
            identifiedStatus: 2
            intensitySum: 446226.59400000004
            isDecoy: false
            isUnique: true
            mz: 446.8687
            mzMap: {y3: 423.1908, y4: 536.27484, y5: 651.3018, y10^2: 605.77014, y10^3: 404.18253, …}
            overviewId: "5d36ed2d9063e34625b75fad"
            peptideId: "5d084f24e0073ca454d4eb10"
            peptideRef: "QAEMLDDLM(UniMod:35)EK_3"
            proteinName: "1/sp|P54819|KAD2_HUMAN"
            qValue: 0.5784523020874934
    __proto__: Object
    totalNum: 6511
    totalPage: 652
    */
    let {
      currentPage: current_page,
      overview,
      overviewId,
      pageSize: page_size,
      protMap: prot_map = null,
      totalNum: total_numbers,
      totalPage
    } = this.props.analysis_protein_identification_data;

    console.log(this.props.analysis_protein_identification_data);
    let [prot_map_list, load_page_numbers] = [null, 0];
    if (null != prot_map && "object" == typeof prot_map) {
      /*     
          // tangtao 2019 - 9 - 30 22: 31: 31 https://www.promiselee.cn/tao
          // 遍历对象 扩展开发 这里先不使用
          for (let [key, value] of Object.entries(prot_map)) {
            // 转换为 json
            // `${JSON.stringify(key)}: ${JSON.stringify(value)}`
            // console.log(key + "-->" + value);
          } 
      */

      prot_map_list = [];

      let [obj_temp, obj] = [{}, {}];
      let [i] = [0];
      //
      Object.keys(prot_map).forEach((key, index) => {
        i++,
          (obj = prot_map[key]),
          // key
          (obj_temp.key = "prot_map_list_" + index),
          // name
          (obj_temp.name = key),
          // index
          (obj_temp.index = index + 1),
          // 存入原始的数据
          (obj_temp.data = obj),
          (obj_temp.length = 0);

        if (null != obj) {
          let { length: len1 = -1 } = obj;
          obj_temp.length = 0 < len1 ? len1 : 0;
          // 为了效率 遍历 obj
          let [obj_temp1, temp1, arr_temp1] = [{}, null, null];

          if (0 < len1) {
            arr_temp1 = new Array(len1);
          }

          // 存入渲染的数据
          for (let i = 0; i < len1; i++) {
            // console.log(obj[i]);
            // bestRt: 1099.2033151715277
            // dataRef: "5d36ed2d9063e34625b75fad-QAEMLDDLM(UniMod:35)EK_3-false"
            // fdr: 0.5784523020874934
            // featureScoresList: [{…}]
            // fragIntFeature: ";y3:122072.90000000001;y4:31469.201;y5:34618.7;y10^2:27817.3;y10^3:230248.493;y6:0.0;"
            // id: "5d36ed4a9063e34625b77654"
            // identifiedStatus: 2
            // intensitySum: 446226.59400000004
            // isDecoy: false
            // isUnique: true
            // mz: 446.8687
            // mzMap: {y3: 423.1908, y4: 536.27484, y5: 651.3018, y10^2: 605.77014, y10^3: 404.18253, …}
            // overviewId: "5d36ed2d9063e34625b75fad"
            // peptideId: "5d084f24e0073ca454d4eb10"
            // peptideRef: "QAEMLDDLM(UniMod:35)EK_3"
            // proteinName: "1/sp|P54819|KAD2_HUMAN"
            // qValue: 0.5784523020874934
            temp1 = obj[i];
            obj_temp1.index = i + 1;
            obj_temp1.key = "tangtao_201910031518_" + index + "_" + i;
            obj_temp1.best_rt = temp1.bestRt;
            obj_temp1.data_ref = temp1.dataRef;
            obj_temp1.fdr = temp1.fdr;
            obj_temp1.feature_scores_list = temp1.featureScoresList;
            obj_temp1.frag_int_feature = temp1.fragIntFeature;
            obj_temp1.id = temp1.id;
            obj_temp1.identified_status = temp1.identifiedStatus;
            obj_temp1.intensity_sum = parseInt(temp1.intensitySum);
            obj_temp1.is_decoy = temp1.isDecoy;
            obj_temp1.is_unique = temp1.isUnique;
            obj_temp1.mz = temp1.mz;
            obj_temp1.mz_map = temp1.mzMap;
            obj_temp1.overview_Id = temp1.overviewId;
            obj_temp1.peptide_Id = temp1.peptideId;
            obj_temp1.peptide_ref = temp1.peptideRef;
            obj_temp1.protein_name = temp1.proteinName;
            obj_temp1.q_value = temp1.qValue;
            arr_temp1[i] = obj_temp1;
            obj_temp1 = {};
          }
          obj_temp.data_arr = arr_temp1;
        }

        // push data
        prot_map_list.push(obj_temp), (obj_temp = {}), (obj = {});
      });

      load_page_numbers = i;
    }

    // 计算加载百分比
    let load_percentage_value = Math.ceil(
      (load_page_numbers / total_numbers) * 100
    );

    // console.log(prot_map_list);

    this.setState({
      // 标记 成功
      analysis_protein_identification_false_time: 5,
      load_percentage_value: load_percentage_value,
      total_numbers: total_numbers,
      load_page_numbers: load_page_numbers,
      analysis_protein_identification_prot_map_list: prot_map_list,
      analysis_protein_identification_list_query_time: tao.current_format_time(),
      // analysis_protein_identification_list_data: protein_identification_data_arr,
      // 标记数据为可用的状态
      analysis_protein_identification_status: 0
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
          <FormattedHTMLMessage id="propro.analysis_protein_identification_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.analysis_protein_identification_reset" />
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

  handle_table_search = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handle_table_reset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
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

  handle_query_analysis_protein_identification_list = () => {
    // 查询 protein_identification 数据
    // 获取百分比
    let {
      load_percentage_value,
      total_numbers,
      analysis_protein_identification_id
    } = this.state;
    //
    let page_size = Math.ceil((load_percentage_value * total_numbers) / 100);
    page_size = page_size < 1000 ? 1000 : page_size;
    this.props.query_analysis_protein_identification({
      id: analysis_protein_identification_id,
      page_size: page_size
    });
    this.setState({
      // 设为默认值
      analysis_protein_identification_status: -1
    });
  };

  drawer_close = () => {
    //
    this.setState({
      drawer_visible: false
    });
  };

  data_list_view_data = list => {
    console.log(list);
  };

  config_table_columns = () => {
    setTimeout(() => {
      let analysis_protein_identification_data_table_columns = [
        {
          // 1  排序
          title: (
            <div
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_index" />
            </div>
          ),
          dataIndex: "index",
          key: "index",
          width: 50,
          render: text => {
            return (
              <div
                className={styles.font_second_color}
                style={{
                  fontSize: "8px",
                  fontWeight: "600"
                }}
              >
                {text}
              </div>
            );
          }
        },
        {
          // 2  肽段全称
          title: (
            <span
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_peptide_ref_name" />
            </span>
          ),
          dataIndex: "peptide_ref",
          key: "peptide_ref",
          width: 160,
          render: (text, list) => {
            let color_style = styles.font_black_color;
            if (false == list.is_unique) {
              // 警告
              color_style = styles.font_red_color;
            }
            return (
              <div
                style={{
                  fontSize: "8px",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  minWidth: "150px",
                  maxWidth: "150px"
                }}
                className={color_style}
              >
                {text}
              </div>
            );
          }
        },
        {
          // 3  status
          title: (
            <span
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_identified_status" />
            </span>
          ),
          dataIndex: "identified_status",
          key: "status",
          width: 60,
          render: text => {
            let obj = null;
            obj =
              0 == text ? (
                <img style={{ width: "22px" }} src={true_svg} />
              ) : (
                <img style={{ width: "22px" }} src={false_svg} />
              );

            return (
              <div
                style={{
                  fontSize: "8px",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  minWidth: "60px",
                  maxWidth: "60px",
                  textAlign: "center"
                }}
                className={styles.font_primary_color}
              >
                {obj}
              </div>
            );
          }
        },
        {
          // 4  FDR
          title: (
            <span
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_fdr" />
            </span>
          ),
          dataIndex: "fdr",
          key: "fdr",
          width: 130,
          render: text => {
            return (
              <div
                style={{
                  fontSize: "8px",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  minWidth: "125px",
                  maxWidth: "125px"
                }}
                className={styles.font_primary_color}
              >
                {text}
              </div>
            );
          }
        },
        {
          // 5  Intensity
          title: (
            <span
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_intensity_sum" />
            </span>
          ),
          dataIndex: "intensity_sum",
          key: "intensity_sum",
          width: 60,
          render: text => {
            return (
              <div
                style={{
                  fontSize: "8px",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  minWidth: "55px",
                  maxWidth: "55px"
                }}
                className={styles.font_primary_color}
              >
                {text}
              </div>
            );
          }
        },
        {
          // 6  操作
          title: (
            <span
              style={{
                fontSize: "8px",
                fontWeight: "600",
                letterSpacing: "1px"
              }}
            >
              <FormattedHTMLMessage id="propro.analysis_protein_identification_data_operation" />
            </span>
          ),

          key: "operation",
          render: list => {
            let is_decoy_btn = null;
            if (false == list.is_decoy) {
              // pass
              is_decoy_btn = (
                <button
                  type="button"
                  className="btn btn-outline-info"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    height: "25px",
                    lineHeight: "13px",
                    padding: "6px 8px",
                    margin: "5px 10px",
                    letterSpacing: "1px"
                  }}
                  // 暂时还未实现
                  // 提取到当前触发的数据

                  // onClick={() => {
                  //   // this.score_list_view_data(list.feature_scores_list);
                  // }}
                >
                  <span>
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_data_peptide_diagnosis" />
                  </span>
                </button>
              );
            } else {
              // null
            }
            let view_data_btn = (
              <button
                type="button"
                className="btn btn-outline-success"
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  height: "25px",
                  lineHeight: "13px",
                  padding: "6px 8px",
                  margin: "5px 10px",
                  letterSpacing: "1px"
                }}
                // 暂时还未实现
                // 提取到当前触发的数据

                onClick={() => {
                  this.data_list_view_data(list);
                }}
              >
                <span>
                  <FormattedHTMLMessage id="propro.analysis_protein_identification_data_view_data" />
                </span>
              </button>
            );
            return (
              <div
                style={{
                  fontSize: "12px"
                }}
                className={styles.font_primary_color}
              >
                {is_decoy_btn}
                {view_data_btn}
              </div>
            );
          }
        }
      ];

      //
      this.setState({
        analysis_protein_identification_data_table_columns: analysis_protein_identification_data_table_columns
      });
    }, 20);
  };

  render() {
    // 监控 analysis_protein_identification 数据变化
    if (10000 < this.props.analysis_protein_identification_time) {
      // 资源有更新
      this.handle_analysis_protein_identification();
    }

    if (0 != this.state.analysis_protein_identification_status) {
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

    /*

    id analysis_protein_identification_id

    */

    let { overview } = this.props.analysis_protein_identification_data;
    //
    let {
      analysis_protein_identification_id,
      load_page_numbers,
      total_numbers,
      analysis_protein_identification_list_query_time,
      load_percentage_value
    } = this.state;
    // 配置 analysis_protein_identification_list_table_columns

    let analysis_protein_identification_list_table_columns = [
      {
        // 1  排序
        title: (
          <div
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_index" />
          </div>
        ),
        dataIndex: "index",
        key: "index",
        width: 80,
        ...this.get_column_search_props("index"),
        render: text => {
          return (
            <div
              className={styles.font_second_color}
              style={{
                fontSize: "8px",
                fontWeight: "600"
              }}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 2  蛋白名称
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_protein_name" />
          </span>
        ),
        dataIndex: "name",
        key: "name",
        ...this.get_column_search_props("name"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "150px",
                maxWidth: "150px"
              }}
              className={styles.font_primary_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 2  数据
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_data" />
          </span>
        ),
        key: "data",
        key: "datas",
        render: list => {
          // console.log("---- render ----");
          console.log(list.data_arr);
          return (
            <Table
              size={"small"}
              bordered={true}
              columns={
                this.state.analysis_protein_identification_data_table_columns
              }
              pagination={{
                position: "top",
                hideOnSinglePage: true,
                showQuickJumper: false,
                defaultPageSize: 500
              }}
              dataSource={list.data_arr}
            />
          );
        }
      }
    ];

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
            title={<FormattedHTMLMessage id="propro.analysis_list_title" />}
          >
            <Link to="/analysis/list">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.analysis_protein_identification_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_protein_identification_by_id_confirm}
          onCancel={this.delete_protein_identification_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.irt_standard_library_detail_delete_warning" />
          </div>
        </Modal>

        <div
          style={{
            background: "#FFFFFF",
            padding: "15px 10px",
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
                bordered={true}
                column={4}
                size={"middle"}
                title={"详情"}
              >
                {/* id */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_id" />
                  }
                  span={2}
                >
                  {analysis_protein_identification_id}
                </Descriptions.Item>

                {/* 关联标准库 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_association_library_name" />
                  }
                  span={2}
                >
                  <span
                    className="badge badge-warning"
                    style={{
                      padding: "5px 5px"
                    }}
                  >
                    {overview.libraryName}
                  </span>
                  &nbsp;
                  <span
                    className={
                      "badge " +
                      styles.bg_second_color +
                      " " +
                      styles.font_white_color
                    }
                    style={{
                      padding: "5px 5px"
                    }}
                  >
                    {/* {library.creator} */}
                  </span>
                </Descriptions.Item>

                {/* 分析代号 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_analyse_code" />
                  }
                  span={4}
                >
                  {overview.name}
                </Descriptions.Item>

                {/* 负责人 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_creator" />
                  }
                  span={2}
                >
                  <span
                    className={
                      "badge " +
                      styles.bg_second_color +
                      " " +
                      styles.font_white_color
                    }
                    style={{
                      padding: "5px 5px"
                    }}
                  >
                    {overview.ownerName}
                  </span>
                </Descriptions.Item>

                {/* FDR */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_fdr" />
                  }
                  span={2}
                >
                  {0 != overview.fdr ? (
                    <span className={styles.font_primary_color}>
                      {overview.fdr}
                    </span>
                  ) : (
                    <span className={styles.font_red_color}>
                      {overview.fdr}
                    </span>
                  )}
                </Descriptions.Item>

                {/* 创建时间 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_create_time" />
                  }
                  span={2}
                >
                  <span className={styles.font_green_color}>
                    {tao.format_time(overview.createDate)}
                  </span>
                </Descriptions.Item>

                {/* 更新时间 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_update_time" />
                  }
                  span={2}
                >
                  <span className={styles.font_green_color}>
                    {tao.format_time(overview.lastModifiedDate)}
                  </span>
                </Descriptions.Item>

                {/* 查询时间 */}
                <Descriptions.Item
                  span={4}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_list_load_time" />
                  }
                >
                  <span className={styles.font_primary_color}>
                    {analysis_protein_identification_list_query_time}
                  </span>
                </Descriptions.Item>

                {/* 已经加载的页数 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_list_load_numbers" />
                  }
                >
                  <span
                    className={
                      0 >= load_page_numbers
                        ? styles.font_red_color
                        : styles.font_primary_color
                    }
                  >
                    {load_page_numbers}
                  </span>
                </Descriptions.Item>

                {/* 总页数 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_list_total_numbers" />
                  }
                >
                  <span
                    className={
                      0 == total_numbers
                        ? styles.font_red_color
                        : styles.font_primary_color
                    }
                  >
                    {total_numbers}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* 显示加载百分比 */}
            <Col
              span={24}
              style={{
                marginTop: "30px"
              }}
            >
              <div style={{ float: "left" }}>
                <div
                  style={{
                    float: "left",
                    height: "30px",
                    lineHeight: "30px"
                  }}
                >
                  <FormattedHTMLMessage id="propro.analysis_protein_identification_list_load_percentage" />
                  &nbsp;:
                </div>
                <div
                  style={{
                    width: "300px"
                  }}
                >
                  <Slider
                    min={0}
                    max={100}
                    style={{ margin: "10px 0px 0px 90px", height: "30px" }}
                    onChange={this.change_load_percentage_value}
                    value={Math.ceil(load_percentage_value)}
                  />
                </div>
              </div>

              <div>
                <InputNumber
                  min={1}
                  max={100}
                  style={{ marginLeft: "15px" }}
                  value={load_percentage_value}
                  onChange={this.change_load_percentage_value}
                />
                <Button
                  type="primary"
                  style={{
                    padding: "0px 15px",
                    margin: "0px 50px 0px 10px",
                    height: "32px",
                    lineHeight: "32px"
                  }}
                  onClick={
                    this.handle_query_analysis_protein_identification_list
                  }
                >
                  <span>
                    &nbsp;
                    <FormattedHTMLMessage id="propro.analysis_protein_identification_list_search" />
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          {/* table */}
          <Col
            span={24}
            style={{
              marginTop: "30px"
            }}
          >
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
                columns={analysis_protein_identification_list_table_columns}
                pagination={{
                  position: "top",
                  hideOnSinglePage: true,
                  showQuickJumper: false,
                  defaultPageSize: 50
                }}
                dataSource={
                  this.state.analysis_protein_identification_prot_map_list
                }
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Analysis_protein_identification;
