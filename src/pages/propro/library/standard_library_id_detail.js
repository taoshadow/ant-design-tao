// src/pages/propro/library/standard_library_id_detail.js
// 公共标准库列表id 详情

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-26 10:10:20
 * @UpdateTime          2019-9-2 22:00:19
 * @Archive             显示 标准库 指定 id 的详情
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
  Tooltip,
  Table,
  Divider,
  Tag,
  Descriptions,
  Badge
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
import detail_svg from "../style/static/library/detail.svg";
import proteins_list_svg from "../style/static/library/list.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  standard_library View 初始化   ***************/
/***********  standard_library View 初始化   ***************/

const standard_library_state_to_props = state => {
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    standard_library_list_id_detail_status,
    standard_library_list_id_detail_time,
    standard_library_id_detail_data,
    standard_library_id_aggregate_status,
    standard_library_id_aggregate_time,
    standard_library_id_delete_pseudopeptides_time,
    standard_library_id_delete_pseudopeptides_status,
    delete_standard_library_by_id_time,
    delete_standard_library_by_id_status
  } = state["standard_library_id_detail"];

  (obj.delete_standard_library_by_id_status = delete_standard_library_by_id_status),
    (obj.delete_standard_library_by_id_time = delete_standard_library_by_id_time),
    (obj.standard_library_id_delete_pseudopeptides_status = standard_library_id_delete_pseudopeptides_status),
    (obj.standard_library_id_delete_pseudopeptides_time = standard_library_id_delete_pseudopeptides_time),
    (obj.standard_library_list_id_detail_status = standard_library_list_id_detail_status),
    (obj.standard_library_list_id_detail_time = standard_library_list_id_detail_time),
    (obj.standard_library_id_detail_data = standard_library_id_detail_data),
    (obj.standard_library_id_aggregate_status = standard_library_id_aggregate_status),
    (obj.standard_library_id_aggregate_time = standard_library_id_aggregate_time);
  return obj;
};

const standard_library_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_standard_library_list: id => {
      const action = {
        type: "standard_library_id_detail/get_library_list_id_detail",
        payload: id
      };
      dispatch(action);
    },
    // 重新统计
    aggregate: id => {
      const action = {
        type: "standard_library_id_detail/aggregate",
        payload: id
      };
      dispatch(action);
    },
    // 生成伪肽段
    generate: obj => {
      const action = {
        type: "standard_library_id_detail/generate",
        payload: obj
      };
      dispatch(action);
    },
    // 删除肽段
    delete_pseudopeptides: obj => {
      const action = {
        type: "standard_library_id_detail/delete_pseudopeptides",
        payload: obj
      };
      dispatch(action);
    },
    // 删除标准库
    delete_standard_library_by_id: obj => {
      const action = {
        type: "standard_library_id_detail/delete_standard_library_by_id",
        payload: obj
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "standard_library_id_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  standard_library View 初始化 end  ***************/

@connect(
  standard_library_state_to_props,
  standard_library_dispatch_to_props
)
class Standard_library_list_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standard_library_list_id_detail_status: -1,
      standard_library_id_detail_data: {},
      standard_library_id: -1,
      modal_visible: false
    };
    //   调用查询
    this.query_list_id_detail();
    // 配置 message
    message.config({
      top: 480,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  // 查询详情数据
  query_list_id_detail = () => {
    // /library/standard_library/detail/5c6d4e59fc6f9e0b70702806
    let url = this.props.history.location.pathname;
    // 提取 id
    let index = url.lastIndexOf("/");
    let id = url.substring(index + 1, url.length);
    this.props.get_standard_library_list(id);
    setTimeout(() => {
      // 写入 id
      this.setState({
        standard_library_id: id
      });
    }, 120);
  };

  handle_standard_library_list_id_detail = () => {
    // 更新
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "standard_library_list_id_detail_time",
      value: 0
    });

    if (0 == this.props.standard_library_list_id_detail_status) {
      // 成功获取数据
      setTimeout(() => {
        this.set_standard_library_id_detail_data(
          this.props.standard_library_id_detail_data
        );
      }, 220);
    } else {
      // 数据获取失败
      setTimeout(() => {
        this.setState({
          standard_library_list_id_detail_status: -1,
          standard_library_id_detail_data: {}
        });
      }, 220);
      Modal.error({
        title: "False",
        content: Languages[this.props.language]["propro.network_error"],
        okText: Languages[this.props.language]["propro.user_modal_know"]
      });
      return -1;
    }
  };

  set_standard_library_id_detail_data = obj => {
    // 提取关键参数
    let obj_data = {};
    let {
      createDate,
      creator,
      description,
      doPublic,
      fastaDeWeightPepCount,
      fastaDeWeightProtCount,
      generator,
      id,
      labels,
      lastModifiedDate,
      libraryDeWeightPepCount,
      libraryDeWeightProtCount,
      name,
      proteinCount,
      totalCount,
      totalUniqueCount,
      type,
      uniqueProteinCount
    } = obj;

    // 提取数据 rename
    (obj_data.create_date = tao.format_time(createDate)),
      (obj_data.creator = creator),
      (obj_data.description = description),
      (obj_data.do_public = doPublic),
      (obj_data.fastade_weight_pepcount = fastaDeWeightPepCount),
      (obj_data.fastade_weight_protcount = fastaDeWeightProtCount),
      (obj_data.generator = generator),
      (obj_data.id = id),
      (obj_data.labels = labels),
      (obj_data.last_modified_date = tao.format_time(lastModifiedDate)),
      (obj_data.library_deweight_pepcount = libraryDeWeightPepCount),
      (obj_data.library_deweight_protcount = libraryDeWeightProtCount),
      (obj_data.name = name),
      (obj_data.protein_count = proteinCount),
      (obj_data.total_count = totalCount),
      (obj_data.total_unique_count = totalUniqueCount),
      (obj_data.type = type),
      (obj_data.unique_protein_count = uniqueProteinCount);

    this.setState({
      standard_library_id_detail_data: obj_data,
      standard_library_list_id_detail_status: 0
    });
  };

  // 重新统计
  aggregate = () => {
    // 获取到当前页面的id
    let id = this.state.standard_library_id;
    this.props.aggregate(id);
    let { language } = this.props;
    message.loading(
      Languages[language][
        "propro.standard_library_detail_re_statistic_analyse"
      ] +
        " : " +
        Languages[language]["propro.standard_library_detail_running"],
      3.5
    );
  };

  // 生成伪肽段
  generate = value => {
    // 读取 id
    let { language } = this.props;

    let id = this.state.standard_library_id;

    let obj = {
      id: id,
      generator: value
    };
    // 调用 生成伪肽段 api

    this.props.generate(obj);
    //
    message.loading(
      Languages[language][
        "propro.standard_library_detail_generating_pseudopeptides"
      ] +
        " : " +
        Languages[language]["propro.standard_library_detail_running"],
      3.5
    );
  };

  handle_standard_library_id_aggregate = () => {
    // 更新
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "standard_library_id_aggregate_time",
      value: 0
    });

    let { language } = this.props;

    // 读取状态
    if (0 == this.props.standard_library_id_aggregate_status) {
      // 更新成功
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language][
            "propro.standard_library_detail_re_statistic_analyse"
          ] +
            " : " +
            Languages[language]["propro.standard_library_detail_success"],
          4
        );
      }, 220);
    } else {
      // 更新失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language][
            "propro.standard_library_detail_re_statistic_analyse"
          ] +
            " : " +
            Languages[language]["propro.standard_library_detail_failed"],
          4
        );
      }, 220);
    }
    return 0;
  };

  delete_pseudopeptides = () => {
    let id = this.state.standard_library_id;
    let { language } = this.props;

    let obj = {
      id: id
    };
    this.props.delete_pseudopeptides(obj);
    message.loading(
      Languages[language][
        "propro.standard_library_detail_delete_pseudopeptides"
      ] +
        " : " +
        Languages[language]["propro.standard_library_detail_running"],
      3.5
    );
  };

  handle_standard_library_id_delete_pseudopeptides = () => {
    // 处理 删除肽段
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "standard_library_id_delete_pseudopeptides_time",
      value: 0
    });

    let { language } = this.props;

    // 读取状态
    if (0 == this.props.standard_library_id_delete_pseudopeptides_status) {
      // 更新成功
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language][
            "propro.standard_library_detail_delete_pseudopeptides"
          ] +
            " : " +
            Languages[language]["propro.standard_library_detail_success"],
          4
        );
      }, 220);
    } else {
      // 更新失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language][
            "propro.standard_library_detail_delete_pseudopeptides"
          ] +
            " : " +
            Languages[language]["propro.standard_library_detail_failed"],
          4
        );
      }, 220);
    }
  };

  // 删除当前库
  delete_library_by_id = () => {
    // 获取到当前库的id
    // 发起警告
    this.setState({
      modal_visible: true
    });
  };
  delete_library_by_id_confirm = () => {
    let { standard_library_id } = this.state;

    this.props.delete_standard_library_by_id({ id: standard_library_id });
    this.setState({
      modal_visible: false
    });
  };
  delete_library_by_id_cancel = () => {
    this.setState({
      modal_visible: false
    });
  };

  handle_delete_standard_library_by_id = () => {
    // 处理删除标准库的结果
    // 时间戳归零
    this.props.set_state_newvalue({
      target: "delete_standard_library_by_id_time",
      value: 0
    });
    let { delete_standard_library_by_id_status, language } = this.props;

    if (0 == delete_standard_library_by_id_status) {
      // 删除成功
      // 弹出删除成功
      setTimeout(() => {
        message.success(
          Languages[language]["propro.standard_library_detail_delete_by_id"] +
            " : " +
            Languages[language]["propro.standard_library_detail_success"],
          4
        );
      }, 110);

      // 延时跳转到 标准库页面
      setTimeout(() => {
        this.props.history.push("/library/standard_library");
      }, 800);
    } else {
      setTimeout(() => {
        // 删除失败
        message.error(
          Languages[language]["propro.standard_library_detail_delete_by_id"] +
            " : " +
            Languages[language]["propro.standard_library_detail_failed"],
          4
        );
      }, 120);
    }
  };

  render() {
    // 监控 standard_library_list 数据变化
    if (10000 < this.props.standard_library_list_id_detail_time) {
      // 资源有更新
      this.handle_standard_library_list_id_detail();
    }
    if (0 != this.state.standard_library_list_id_detail_status) {
      // 加载 ...
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

    if (10000 < this.props.standard_library_id_aggregate_time) {
      // 重新统计 更新
      this.handle_standard_library_id_aggregate();
    }

    if (10000 < this.props.standard_library_id_delete_pseudopeptides_time) {
      // 删除肽段 更新
      this.handle_standard_library_id_delete_pseudopeptides();
    }

    // 监控删除标准库
    if (10000 < this.props.delete_standard_library_by_id_time) {
      this.handle_delete_standard_library_by_id();
    }

    const detail_data = this.state.standard_library_id_detail_data;

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
            title={<FormattedHTMLMessage id="propro.standard_library_title" />}
          >
            <Link to="/library/standard_library">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>

          <FormattedHTMLMessage id="propro.standard_library_detail_title" />
        </div>
        {/* 提示用户警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_library_by_id_confirm}
          onCancel={this.delete_library_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.standard_library_detail_delete_warning" />
          </div>
        </Modal>

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
                bordered={true}
                column={4}
                size={"middle"}
                title={
                  <Fragment>
                    <Row>
                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.standard_library_detail_creator" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_second_color}`}
                          style={{ padding: "5px 10px", color: "#ffffff" }}
                        >
                          {detail_data.creator}
                        </span>
                      </Col>
                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.standard_library_detail_create_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_green_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {detail_data.create_date}
                        </span>
                      </Col>

                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.standard_library_detail_last_modify_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_yellow_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {detail_data.last_modified_date}
                        </span>
                      </Col>
                    </Row>
                  </Fragment>
                }
              >
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_id" />
                  }
                  span={2}
                >
                  {detail_data.id}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_name" />
                  }
                  span={2}
                >
                  {detail_data.name}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_library_type" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {0 == detail_data.type ? (
                      <FormattedHTMLMessage id="propro.standard_library" />
                    ) : (
                      "IRT Library"
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_generator" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {detail_data.generator}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.protein_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.protein_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_unique_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.unique_protein_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.unique_protein_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_deweight_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.library_deweight_protcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.library_deweight_protcount
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.total_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.total_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_unique_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.total_unique_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.total_unique_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_deweight_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.library_deweight_pepcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.library_deweight_pepcount
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_fastade_weight_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.fastade_weight_protcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.fastade_weight_protcount
                    )}
                  </span>
                </Descriptions.Item>

                {/* Fasta去除真肽段数目 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_fastade_weight_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.fastade_weight_pepcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.fastade_weight_pepcount
                    )}
                  </span>
                </Descriptions.Item>

                {/* 详情描述 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_description" />
                  }
                  span={4}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {"" == detail_data.description ? (
                      <span className={styles.font_red_color}>NULL</span>
                    ) : (
                      detail_data.description
                    )}
                  </span>
                </Descriptions.Item>

                {/* 肽段分析 2019-9-2 10:57:34 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_peptide_analyse" />
                  }
                  span={4}
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px"
                    }}
                    onClick={this.aggregate}
                  >
                    {/* 重新统计 */}
                    <FormattedHTMLMessage id="propro.standard_library_detail_re_statistic_analyse" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    onClick={() => {
                      this.generate("shuffle");
                    }}
                  >
                    {/* 生成伪肽段 shuffle */}
                    <FormattedHTMLMessage id="propro.standard_library_detail_generating_pseudopeptides" />
                    (Shuffle)
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    // 这里为了处理冒泡 采用箭头方式传参
                    onClick={() => {
                      this.generate("nico");
                    }}
                  >
                    <FormattedHTMLMessage id="propro.standard_library_detail_generating_pseudopeptides" />
                    (Nico)
                  </button>

                  {/* 删除肽段 */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    onClick={this.delete_pseudopeptides}
                  >
                    <FormattedHTMLMessage id="propro.standard_library_detail_delete_pseudopeptides" />
                  </button>
                </Descriptions.Item>

                {/* 肽段 链接 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.standard_library_detail_peptide_link" />
                  }
                  span={4}
                >
                  <Link to={"/peptide/list/" + this.state.standard_library_id}>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      style={{
                        padding: "5px",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "20px"
                      }}
                    >
                      {/* 肽段列表 */}
                      <FormattedHTMLMessage id="propro.standard_library_detail_peptide_list" />
                    </button>
                  </Link>

                  <Link to={"/protein/list/" + this.state.standard_library_id}>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      style={{
                        padding: "5px",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "20px",
                        marginLeft: "10px"
                      }}
                    >
                      <FormattedHTMLMessage id="propro.standard_library_detail_protein_list" />
                    </button>
                  </Link>
                </Descriptions.Item>
              </Descriptions>

              <Col
                lg={24}
                style={{
                  margin: "30px 0px"
                }}
              >
                <Link
                  to={
                    "/library/standard_library/update/" +
                    detail_data.id +
                    "_" +
                    detail_data.name
                  }
                >
                  <button
                    type="button"
                    className="btn btn-info"
                    style={{
                      padding: "5px 10px",
                      height: "30px",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                  >
                    <FormattedHTMLMessage id="propro.standard_library_detail_modify" />
                  </button>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{
                    padding: "5px 10px",
                    height: "30px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    marginLeft: "30px"
                  }}
                  onClick={this.delete_library_by_id}
                >
                  <FormattedHTMLMessage id="propro.standard_library_detail_delete" />
                </button>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Standard_library_list_detail;
