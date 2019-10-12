// src/pages/propro/analysis/detail.js
// 分析概览详情页面

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-9-18 10:47:50
 * @UpdateTime          2019-9-20 15:44:11
 * @Archive             分析详情页面
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
import report_svg from "../style/static/analysis/report.svg";
import list_svg from "../style/static/analysis/list.svg";
import score_svg from "../style/static/analysis/score.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import identification_svg from "../style/static/analysis/identification.svg";
import export_svg from "../style/static/analysis/export.svg";
import delete_svg from "../style/static/analysis/delete.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  analysis View 初始化   ***************/
/***********  analysis View 初始化   ***************/

const analysis_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    analysis_detail_status = -1,
    analysis_detail_time = 0,
    analysis_detail_data = {}
  } = state["analysis_detail"];

  (obj.analysis_detail_status = analysis_detail_status),
    (obj.analysis_detail_time = analysis_detail_time),
    (obj.analysis_detail_data = analysis_detail_data);

  return obj;
};

const analysis_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_analysis_detail: data => {
      const action = {
        type: "analysis_detail/get_analysis_detail",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "analysis_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  analysis View 初始化 end  ***************/

@connect(
  analysis_state_to_props,
  analysis_dispatch_to_props
)
class Analysis_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      analysis_detail_id: null,
      analysis_detail_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      analysis_detail_status: -1,
      // 请求失败再次发起请求的尝试次数
      analysis_detail_false_time: 5,
      analysis_detail_feature_scores_weights_data: null,
      search_text: ""
      //   language: this.props.language
    };

    setTimeout(() => {
      this.get_current_analysis_detail_id();
    }, 100);

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  // 解析url 获取到id 发起查询
  get_current_analysis_detail_id = () => {
    // /analysis/detail/5d36ed2d9063e34625b75fad
    let url = this.props.history.location.pathname;
    // 提取 id
    let index = url.lastIndexOf("detail/");
    let id = url.substring(index + 7);
    console.log("id" + id);
    this.props.get_analysis_detail({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        analysis_detail_id: id
      });
    }, 40);
  };

  handle_analysis_detail = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "analysis_detail_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.analysis_detail_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_analysis_detail_data();
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
      let { analysis_detail_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= analysis_detail_false_time) {
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
          analysis_detail_false_time: analysis_detail_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_analysis_detail_data = () => {
    console.log(this.props.analysis_detail_data);

    /*
        badRts: [{bestRt: 1813.7325774549008, rt: 22}, {bestRt: 1311.3478990274189, rt: 10},…]
        decoyMap: {$ref: "$.data.overview.decoyDistributions"}
        intercept: -49.09821384487065
        library: {createDate: 1560824062441, creator: "王瑞敏", description: "肝癌标准库", doPublic: true,…}
        overview: {classifier: "lda", createDate: 1563880749512,…}
        rts: [{bestRt: 828.7311773845196, rt: -11.38761}, {bestRt: 1225.4692700604796, rt: -0.5},…]
        slope: 0.04273035759500789
        targetMap: {$ref: "$.data.overview.targetDistributions"}
        status: 0
      */
    //   提取 model 层 传过来的数据
    let {
      badRts: bad_rts,
      decoyMap: decoy_map,
      // 截距
      intercept,
      library,
      overview,
      rts,
      // 斜率
      slope,
      targetMap: target_Map
    } = this.props.analysis_detail_data;

    let { weights = null } = overview;
    // 默认为空
    let arr_scores_weights = null;

    if (null != weights) {
      // 提取特征分数和权重
      let index = 1;
      let obj_temp = {};

      Object.keys(weights).forEach(function(key) {
        if (1 == index) {
          // 改变数据结构
          arr_scores_weights = [];
        }
        // 提取数据 并完成格式化
        (obj_temp.key = "scores_weights_" + index),
          (obj_temp.name = key),
          (obj_temp.value = weights[key]),
          (obj_temp.index = index++),
          arr_scores_weights.push(obj_temp),
          (obj_temp = {});
      });
    }
    /*
        overview:
        classifier: "lda"
        createDate: 1563880749512
        decoyDistributions: {0-0_001: 12, 0_9-1_0: 0, 0_007-0_008: 24, 0_09-0_1: 484, 0_03-0_04: 348, …}
        expId: "5d22faca8536e9793683a57e"
        expName: "C20181210yix_HCC_DIA_T_24A"
        fdr: 0.01
        id: "5d36ed2d9063e34625b75fad"
        intercept: -49.09821384487065
        lastModifiedDate: 1563881359694
        libraryId: "5d0848fee0073c6ffc69752d"
        libraryName: "HCC_QE3_Lib"
        libraryPeptideCount: 300507
        matchedPeptideCount: 15823
        matchedProteinCount: 0
        mzExtractWindow: 0.03
        name: "C20181210yix_HCC_DIA_T_24A-HCC_QE3_Lib-20190723191909"
        note: ""
        ownerName: "lms"
        peakCount: 577264
        rtExtractWindow: 600
        scoreTypes: (21) ["MainScore", "WeightedTotalScore", "BseriesScore", "IntensityScore", "IsotopeCorrelationScore", "IsotopeOverlapScore", "LibraryCorr", "LibraryRsmd", "LogSnScore", "MassdevScore", "MassdevScoreWeighted", "NormRtScore", "XcorrCoelution", "XcorrCoelutionWeighted", "XcorrShape", "XcorrShapeWeighted", "LibraryDotprod", "LibraryManhattan", "LibrarySangle", "LibraryRootmeansquare", "YseriesScore"]
        shapeScoreThreshold: 0.5
        shapeScoreWeightThreshold: 0.6
        sigma: 3.75
        slope: 0.04273035759500789
        spacing: 0.01
        targetDistributions: {0-0_001: 8899, 0_9-1_0: 0, 0_007-0_008: 423, 0_09-0_1: 884, 0_03-0_04: 1512, …}
        totalPeptideCount: 212722
        type: "DIA_SWATH"
        weights: {LibraryManhattan: 0.3459202005192571, LibraryRsmd: -1.521525327950656, YseriesScore: 0.012926969049414507, MassdevScoreWeighted: -0.008662419807037882, XcorrCoelutionWeighted: 0.032132982781822576, …}
      */

    this.setState({
      analysis_detail_data: this.props.analysis_detail_data,
      // 标记 成功
      analysis_detail_false_time: 5,
      analysis_detail_feature_scores_weights_data: arr_scores_weights,
      // 标记数据为可用的状态
      analysis_detail_status: 0
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
          <FormattedHTMLMessage id="propro.analysis_detail_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.analysis_detail_reset" />
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

  render() {
    // 定义 解析 配置 表格
    const analysis_detail_feature_scores_weights_table_columns = [
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
            <FormattedHTMLMessage id="propro.analysis_detail_feature_scores_weights_index" />
          </div>
        ),
        dataIndex: "index",
        key: "index",
        width: 80,
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
        // 2  key
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_detail_feature_scores_weights_type" />
          </span>
        ),
        dataIndex: "name",
        key: "name",
        width: 200,
        ...this.get_column_search_props("name"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "200px",
                maxWidth: "200px"
              }}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 3  value
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_detail_feature_scores_weights_weights" />
          </span>
        ),
        dataIndex: "value",
        key: "value",
        ...this.get_column_search_props("value"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "400px",
                maxWidth: "400px"
              }}
              className={styles.font_primary_color}
            >
              {text}
            </div>
          );
        }
      }
    ];

    // 监控 analysis_detail 数据变化
    if (10000 < this.props.analysis_detail_time) {
      // 资源有更新
      this.handle_analysis_detail();
    }

    if (0 != this.state.analysis_detail_status) {
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
      overview,
      library,
      slope: data_slope,
      intercept: data_intercept
    } = this.props.analysis_detail_data;

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
          <FormattedHTMLMessage id="propro.analysis_detail_title" />
        </div>
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
                    <FormattedHTMLMessage id="propro.analysis_detail_id" />
                  }
                  span={2}
                >
                  {overview.id}
                </Descriptions.Item>

                {/* 实验名称 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_experiment_name" />
                  }
                  span={2}
                >
                  {overview.expName}
                </Descriptions.Item>

                {/* 分析代号 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_analyse_code" />
                  }
                  span={4}
                >
                  {overview.name}
                </Descriptions.Item>
                {/* 关联标准库 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_association_library_name" />
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
                    {library.creator}
                  </span>
                </Descriptions.Item>
                {/* rz/mz */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_rz_mz" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {overview.rtExtractWindow}&nbsp;/&nbsp;
                    {overview.mzExtractWindow}
                  </span>
                </Descriptions.Item>
                {/* 斜率/截距 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_slope_intercept" />
                  }
                  span={4}
                >
                  <span className={styles.font_primary_color}>
                    {data_slope}&nbsp;/&nbsp;{data_intercept}&nbsp;=&nbsp;
                    {0 != data_intercept ? (
                      data_slope / data_intercept
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </span>
                </Descriptions.Item>
                {/* sigma/spacing */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_sigma_spacing" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {overview.sigma}&nbsp;/&nbsp;{overview.spacing}
                  </span>
                </Descriptions.Item>
                {/* 肽段识别比例 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_peptide_recognized_ratio" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {overview.matchedPeptideCount}&nbsp;/&nbsp;
                    {overview.totalPeptideCount}&nbsp;=&nbsp;
                    {0 != overview.totalPeptideCount ? (
                      overview.matchedPeptideCount / overview.totalPeptideCount
                    ) : (
                      <span className={styles.font_red_color}>NULL</span>
                    )}
                  </span>
                </Descriptions.Item>
                {/* 负责人 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_creator" />
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
                {/* 创建时间 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_create_time" />
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
                    <FormattedHTMLMessage id="propro.analysis_detail_update_time" />
                  }
                  span={2}
                >
                  <span className={styles.font_green_color}>
                    {tao.format_time(overview.lastModifiedDate)}
                  </span>
                </Descriptions.Item>
                {/* PeakGroup数目 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_peakgroup_count" />
                  }
                  span={2}
                >
                  {0 < overview.peakCount ? (
                    <span className={styles.font_primary_color}>
                      {overview.peakCount}
                    </span>
                  ) : (
                    <span className={styles.font_red_color}>
                      {overview.peakCount}
                    </span>
                  )}
                </Descriptions.Item>
                {/* FDR */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_fdr" />
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
                {/* 蛋白质数目 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_proteins_count" />
                  }
                  span={2}
                >
                  {0 < overview.matchedProteinCount ? (
                    <span className={styles.font_primary_color}>
                      {overview.matchedProteinCount}
                    </span>
                  ) : (
                    <span className={styles.font_red_color}>
                      {overview.matchedProteinCount}
                    </span>
                  )}
                </Descriptions.Item>

                {/* PP Rate */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_pp_rate" />
                  }
                  span={2}
                >
                  {0 != overview.matchedProteinCount ? (
                    <span className={styles.font_primary_color}>
                      {overview.matchedPeptideCount /
                        overview.matchedProteinCount}
                    </span>
                  ) : (
                    <span className={styles.font_red_color}>NULL</span>
                  )}
                </Descriptions.Item>

                {/* PP Rate of library */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_pp_rate_library" />
                  }
                  span={2}
                >
                  {0 != library.proteinCount ? (
                    <span className={styles.font_primary_color}>
                      {library.totalCount / library.proteinCount}
                    </span>
                  ) : (
                    <span className={styles.font_red_color}>NULL</span>
                  )}
                </Descriptions.Item>
                {/* 特征分数 权重 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_feature_scores_weights" />
                  }
                  span={4}
                >
                  <Table
                    size={"small"}
                    columns={
                      analysis_detail_feature_scores_weights_table_columns
                    }
                    pagination={{
                      position: "bottom",
                      hideOnSinglePage: true,
                      defaultPageSize: 100
                    }}
                    scroll={{ y: 300 }}
                    bordered={true}
                    dataSource={
                      this.state.analysis_detail_feature_scores_weights_data
                    }
                  />
                </Descriptions.Item>
                {/* operation */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_detail_operation" />
                  }
                  span={2}
                >
                  {/* 报告 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_report_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-warning"}
                        style={{
                          padding: "3px 3px",
                          margin: "3px"
                        }}
                      >
                        <img
                          src={report_svg}
                          style={{
                            width: "20px"
                          }}
                        />
                      </div>
                    </Link>
                  </Tooltip>
                  {/* xic 数据 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_xic_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-primary"}
                        style={{
                          padding: "3px 3px",
                          margin: "3px"
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
                  {/* 打分数据 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_score_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-primary"}
                        style={{
                          padding: "3px 3px",
                          margin: "3px"
                        }}
                      >
                        <img
                          src={score_svg}
                          style={{
                            width: "20px"
                          }}
                        />
                      </div>
                    </Link>
                  </Tooltip>
                  {/* 鉴定肽段 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_identification_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-primary"}
                        style={{
                          padding: "3px 3px",
                          margin: "3px"
                        }}
                      >
                        <img
                          src={identification_svg}
                          style={{
                            width: "20px"
                          }}
                        />
                      </div>
                    </Link>
                  </Tooltip>
                  {/* 导出肽段 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_export_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-secondary"}
                        style={{
                          padding: "3px 3px",
                          margin: "3px"
                        }}
                      >
                        <img
                          src={export_svg}
                          style={{
                            width: "20px"
                          }}
                        />
                      </div>
                    </Link>
                  </Tooltip>
                  {/* 删除 */}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <FormattedHTMLMessage id="propro.analysis_list_delete_tip" />
                    }
                  >
                    <Link to={"/analysis/detail/" + overview.id}>
                      <div
                        className={"badge btn-danger"}
                        style={{
                          padding: "4px 4px",
                          margin: "3px"
                        }}
                      >
                        <img
                          src={delete_svg}
                          style={{
                            width: "20px"
                          }}
                        />
                      </div>
                    </Link>
                  </Tooltip>
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col
              lg={24}
              xl={24}
              xxl={24}
              className={styles.font_primary_color}
              style={{
                textAlign: "left",
                marginTop: "30px",
                fontSize: "14px",
                lineHeight: "30px"
              }}
            >
              chart
            </Col>
          </Row>
        </div>
        {/* Author: Tangtao HDU https://www.promiselee.cn/tao 2019-10-5 23:10:05 */}
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

export default Analysis_detail;
