// src/pages/propro/analysis/xic.js
// 分析概览详情页面

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-9-20 15:49:44
 * @UpdateTime          2019-9-22 16:45:24
 * @Archive             xic 数据
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
import report_svg from "../style/static/analysis/report.svg";
import list_svg from "../style/static/analysis/list.svg";
import score_svg from "../style/static/analysis/score.svg";
import identification_svg from "../style/static/analysis/identification.svg";
import export_svg from "../style/static/analysis/export.svg";
import delete_svg from "../style/static/analysis/delete.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  analysis View 初始化   ***************/
/***********  analysis View 初始化   ***************/

const analysis_xic_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    analysis_xic_status = -1,
    analysis_xic_time = 0,
    analysis_xic_data = {}
  } = state["analysis_xic"];

  (obj.analysis_xic_status = analysis_xic_status),
    (obj.analysis_xic_time = analysis_xic_time),
    (obj.analysis_xic_data = analysis_xic_data);

  return obj;
};

const analysis_xic_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_analysis_xic: data => {
      const action = {
        type: "analysis_xic/get_analysis_xic",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "analysis_xic/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  analysis View 初始化 end  ***************/

@connect(
  analysis_xic_state_to_props,
  analysis_xic_dispatch_to_props
)
class Xic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      analysis_xic_id: null,
      analysis_xic_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      analysis_xic_status: -1,
      // 请求失败再次发起请求的尝试次数
      analysis_xic_false_time: 5,
      analysis_xic_list_data: null,
      // 页面大小 通过调整它来设置
      page_size: null,
      total_numbers: null,
      load_percentage_value: 0,
      analysis_xic_list_query_time: null,
      search_text: ""
      //   language: this.props.language
    };

    setTimeout(() => {
      this.get_current_analysis_xic_id();
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
  get_current_analysis_xic_id = () => {
    // /analysis/xic/5d36ed2d9063e34625b75fad
    let url = this.props.history.location.pathname;
    console.log(url);
    // 提取 id
    let index = url.lastIndexOf("xic/");
    let id = url.substring(index + 4);
    console.log("id" + id);
    this.props.get_analysis_xic({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        analysis_xic_id: id
      });
    }, 40);
  };

  handle_analysis_xic = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "analysis_xic_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.analysis_xic_status) {
      // 数据获取成功

      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_analysis_xic_data();
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
      let { analysis_xic_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= analysis_xic_false_time) {
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
          analysis_xic_false_time: analysis_xic_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_analysis_xic_data = () => {
    console.log(this.props.analysis_xic_data);

    /*
      currentPage: 1
      datas: (1000) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
      overview: {classifier: "lda", createDate: 1563880749512, decoyDistributions: {…}, expId: "5d22faca8536e9793683a57e", expName: "C20181210yix_HCC_DIA_T_24A", …}
      overviewId: "5d36ed2d9063e34625b75fad"
      pageSize: 1000
      totalNum: 100000
      totalPage: 100
      */
    //   提取 model 层 传过来的数据
    let {
      datas = null,
      overview,
      pageSize: page_size,
      totalNum: total_numbers,
      totalPage: total_page,
      currentPage: current_page
    } = this.props.analysis_xic_data;

    let [len0, load_percentage_value, xic_data_arr] = [0, 0, null];
    if (null != datas) {
      len0 = datas.length;
    }

    /*
    datas
    0:
      dataRef: "5d36ed2d9063e34625b75fad-LRAEAGLGALPR_3-false"
      isDecoy: false
      isUnique: true
      mz: 408.5788
      mzMap: {b6: 598.33075, b7: 711.4148, b8: 768.4363, y4: 456.2929, y5: 513.31433, …}
      peptideRef: "LRAEAGLGALPR_3"
      proteinName: "1/sp|Q9NR77|PXMP2_HUMAN"
      rt: 22

    */
    if (0 < len0) {
      // 计算出加载的百分比
      load_percentage_value = Math.ceil((len0 / total_numbers) * 100);
      let obj_temp = {};
      xic_data_arr = new Array(len0);
      for (let i = 0; i < len0; i++) {
        (obj_temp.key = "xic_data_arr_" + i),
          (obj_temp.index = i + 1),
          (obj_temp.data_ref = datas[i].dataRef),
          (obj_temp.is_decoy = datas[i].isDecoy),
          (obj_temp.is_unique = datas[i].isUnique),
          (obj_temp.mz = datas[i].mz),
          // 离子断裂标记
          (obj_temp.mz_map = datas[i].mzMap),
          (obj_temp.peptide_ref = datas[i].peptideRef),
          (obj_temp.protein_name = datas[i].proteinName),
          (obj_temp.rt = datas[i].rt),
          (xic_data_arr[i] = obj_temp),
          (obj_temp = {});
      }
    }

    // let { weights = null } = overview;
    // // 默认为空
    // let arr_scores_weights = null;

    // if (null != weights) {
    //   // 提取特征分数和权重
    //   let index = 1;
    //   let obj_temp = {};

    //   Object.keys(weights).forEach(function(key) {
    //     if (1 == index) {
    //       // 改变数据结构
    //       arr_scores_weights = [];
    //     }
    //     // 提取数据 并完成格式化
    //     (obj_temp.key = "scores_weights_" + index),
    //       (obj_temp.name = key),
    //       (obj_temp.value = weights[key]),
    //       (obj_temp.index = index++),
    //       arr_scores_weights.push(obj_temp),
    //       (obj_temp = {});
    //   });
    // }

    this.setState({
      analysis_xic_data: this.props.analysis_xic_data,
      // 标记 成功
      analysis_xic_false_time: 5,
      load_percentage_value: load_percentage_value,
      total_numbers: total_numbers,
      analysis_xic_list_query_time: tao.current_format_time(),
      analysis_xic_list_data: xic_data_arr,
      // 标记数据为可用的状态
      analysis_xic_status: 0
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
          <FormattedHTMLMessage id="propro.analysis_xic_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.analysis_xic_reset" />
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

  render() {
    // 定义 解析 配置 表格
    const analysis_xic_list_table_columns = [
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
            <FormattedHTMLMessage id="propro.analysis_xic_list_index" />
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
            <FormattedHTMLMessage id="propro.analysis_xic_list_protein_name" />
          </span>
        ),
        dataIndex: "protein_name",
        key: "protein_name",
        width: 200,
        ...this.get_column_search_props("protein_name"),
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
        // 3 肽段名称
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_xic_list_peptide_name" />
          </span>
        ),
        dataIndex: "peptide_ref",
        key: "peptide_ref",
        ...this.get_column_search_props("peptide_ref"),
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

    // 监控 analysis_xic 数据变化
    if (10000 < this.props.analysis_xic_time) {
      // 资源有更新
      this.handle_analysis_xic();
    }

    if (0 != this.state.analysis_xic_status) {
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

    let { overview, datas } = this.props.analysis_xic_data;

    let data_slope = overview.slope;
    let {
      load_percentage_value,
      total_numbers,
      analysis_xic_list_query_time
    } = this.state;
    let data_intercept = overview.intercept;
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
          <FormattedHTMLMessage id="propro.analysis_xic_title" />
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
                  label={<FormattedHTMLMessage id="propro.analysis_xic_id" />}
                  span={2}
                >
                  {overview.id}
                </Descriptions.Item>

                {/* 实验名称 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_experiment_name" />
                  }
                  span={2}
                >
                  {overview.expName}
                </Descriptions.Item>

                {/* 分析代号 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_analyse_code" />
                  }
                  span={4}
                >
                  {overview.name}
                </Descriptions.Item>
                {/* 关联标准库 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_association_library_name" />
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
                {/* rz/mz */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_rz_mz" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_slope_intercept" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_sigma_spacing" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_peptide_recognized_ratio" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_creator" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_create_time" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_update_time" />
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
                    <FormattedHTMLMessage id="propro.analysis_xic_peakgroup_count" />
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
                  label={<FormattedHTMLMessage id="propro.analysis_xic_fdr" />}
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
                    <FormattedHTMLMessage id="propro.analysis_xic_proteins_count" />
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

                {/* 查询时间 */}
                <Descriptions.Item
                  span={4}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_list_load_time" />
                  }
                >
                  <span className={styles.font_primary_color}>
                    {analysis_xic_list_query_time}
                  </span>
                </Descriptions.Item>

                {/* 已经加载的页数 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_list_load_numbers" />
                  }
                >
                  <span
                    className={
                      0 >= datas.length
                        ? styles.font_red_color
                        : styles.font_primary_color
                    }
                  >
                    {datas.length}
                  </span>
                </Descriptions.Item>

                {/* 总页数 */}
                <Descriptions.Item
                  span={2}
                  label={
                    <FormattedHTMLMessage id="propro.analysis_xic_list_total_numbers" />
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
                  <FormattedHTMLMessage id="propro.analysis_xic_list_load_percentage" />
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
                  name="password"
                  onClick={this.handle_query_analysis_xic_list_by_id}
                >
                  <span>
                    &nbsp;
                    <FormattedHTMLMessage id="propro.analysis_xic_list_search" />
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
                columns={analysis_xic_list_table_columns}
                pagination={{
                  position: "bottom",
                  hideOnSinglePage: true,
                  defaultPageSize: 100
                }}
                dataSource={this.state.analysis_xic_list_data}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Xic;
