// src/pages/propro/analysis/protein_identification.js
// 打分数据页面

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-9-29 00:38:00
 * @UpdateTime          2019-9-29 14:14:30
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
    delete_analysis_protein_identification: data => {
      const action = {
        type:
          "analysis_protein_identification/delete_analysis_protein_identification",
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
    this.props.get_analysis_protein_identification({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        analysis_protein_identification_id: id
      });
    }, 40);
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
    // this.setState({
    //   // 标记 成功
    //   analysis_protein_identification_false_time: 5,
    //   load_percentage_value: load_percentage_value,
    //   total_numbers: total_numbers,
    //   analysis_protein_identification_list_query_time: tao.current_format_time(),
    //   analysis_protein_identification_list_data: protein_identification_data_arr,
    //   // 标记数据为可用的状态
    //   analysis_protein_identification_status: 0
    // });

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

    let {
      overview,
      protein_identifications
    } = this.props.analysis_protein_identification_data;

    let { length: load_page_numbers } = protein_identifications;
    let {
      load_percentage_value,
      total_numbers,
      analysis_protein_identification_id,
      analysis_protein_identification_list_query_time,
      drawer_data,
      drawer_visible
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
        // 2  预测结果
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_predict_result" />
          </span>
        ),

        dataIndex: "identified_status",
        key: "identified_status",
        width: 100,
        ...this.get_column_search_props("identified_status"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "30px",
                maxWidth: "30px"
              }}
            >
              {0 == text ? (
                <img
                  style={{
                    width: "18px"
                  }}
                  src={true_svg}
                />
              ) : (
                <img
                  style={{
                    width: "18px"
                  }}
                  src={false_svg}
                />
              )}
            </div>
          );
        }
      },
      {
        // 2  RT
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_predict_rt" />
          </span>
        ),
        dataIndex: "rt",
        key: "rt",
        width: 100,
        ...this.get_column_search_props("rt"),
        render: text => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "70px",
                maxWidth: "70px"
              }}
              className={styles.font_primary_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 3 FDR
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_fdr" />
          </span>
        ),
        dataIndex: "fdr",
        key: "fdr",
        ...this.get_column_search_props("fdr"),
        render: (text, list) => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "120px",
                maxWidth: "120px"
              }}
              className={styles.font_primary_color}
            >
              {text}
            </div>
          );
        }
      },
      {
        // 4 'Decoy':'Target'
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_decoy_target" />
          </span>
        ),
        dataIndex: "peptide_ref",
        key: "peptide_ref",
        ...this.get_column_search_props("peptide_ref"),
        render: (text, list) => {
          let span = "";

          if (true == list.is_decoy) {
            span = (
              <span className={styles.font_primary_color}>
                <span
                  className="badge badge-info"
                  style={{
                    padding: "5px 5px"
                  }}
                >
                  <FormattedHTMLMessage id="propro.analysis_protein_identification_list_is_decoy" />
                </span>
                &nbsp;{text}
              </span>
            );
          } else {
            span = (
              <span className={styles.font_second_color}>
                <span
                  className="badge badge-warning"
                  style={{
                    padding: "5px 5px"
                  }}
                >
                  <FormattedHTMLMessage id="propro.analysis_protein_identification_list_is_target" />
                </span>
                &nbsp;{text}
              </span>
            );
          }

          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "350px",
                maxWidth: "350px"
              }}
              className={styles.font_primary_color}
            >
              {span}
            </div>
          );
        }
      },
      {
        // 5  RT
        title: (
          <span
            style={{
              fontSize: "8px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.analysis_protein_identification_list_operation" />
          </span>
        ),
        // dataIndex: "rt",
        key: "operation",
        render: list => {
          let { length: len0 = -1 } = list.feature_protein_identifications_list;
          let numbers = null;

          numbers =
            0 < len0 ? (
              <span className={styles.font_dark_color}>{len0}</span>
            ) : (
              <span className={styles.font_red_color}>0</span>
            );
          return (
            <div
              style={{
                fontSize: "12px"
              }}
              className={styles.font_primary_color}
            >
              <button
                type="button"
                className="btn btn-outline-success"
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  height: "25px",
                  lineHeight: "13px",
                  padding: "6px 8px",
                  letterSpacing: "1px"
                }}
                // 暂时还未实现
                // 提取到当前触发的数据

                onClick={() => {
                  this.protein_identification_list_view_data(
                    list.feature_protein_identifications_list
                  );
                }}
              >
                <span>
                  <FormattedHTMLMessage id="propro.analysis_protein_identification_list_view_data" />
                  &nbsp;
                  {numbers}
                </span>
              </button>
            </div>
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

        {/* 抽屉 */}

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_protein_identification_list_data_detail" />
            }
            placement="left"
            closable={true}
            width={500}
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
                  this.state.analysis_protein_identification_list_data
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
