// /src/pages/propro/protein/detail.js

// 蛋白质列表详情  此界面与 peptide/detail 代码很多地方一样

// /src/pages/propro/peptide/detail.js

// 肽段列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-31 19:06:42
 * @UpdateTime          2019-8-28 22:17:29
 * @Archive             肽段列表详情  公共标准库 标准库 irt 共用
 *
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";
import $ from "jquery";

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
  Badge,
  Form,
  Radio,
  Checkbox,
  Upload,
  Timeline
} from "antd";
const { TextArea } = Input;
const { Option } = Select;
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
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import create from "antd/lib/icon/IconFont";

/****************  导入 styles end ***************************/

/***********  peptide_detail View 初始化   ***************/
/***********  peptide_detail View 初始化   ***************/

const peptide_detail_state_to_props = state => {
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    peptide_detail_data,
    peptide_detail_time,
    peptide_detail_data_status
  } = state["peptide_detail"];

  (obj.peptide_detail_data = peptide_detail_data),
    (obj.peptide_detail_time = peptide_detail_time),
    (obj.peptide_detail_data_status = peptide_detail_data_status);
  return obj;
};

const peptide_detail_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    query_peptide_detail: data => {
      const action = {
        type: "peptide_detail/query_peptide_detail",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "peptide_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  peptide_detail View 初始化 end  ***************/

@connect(
  peptide_detail_state_to_props,
  peptide_detail_dispatch_to_props
)
class Peptide_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 库id
      peptide_detail_id: null,
      // 第一个id 用于返回
      peptide_detail_prefix_id: null,
      peptide_detail_name: null,
      // 判断当前肽段属于的库类型
      peptide_detail_id_library_type: null,
      // 库是否公开
      peptide_detail_id_library_public: false,
      // 库的详情的链接
      peptide_detail_id_library_detail_link: null,
      // 离子片段 表格格式化数据
      peptide_detail_ion_fragment_data: null,
      // 伪肽段 表格格式化数据
      peptide_detail_decoy_fragment_data: null,
      // 默认没有数据 状态为 -1  出错 -2 成功 0
      peptide_detail_data_status: -1,
      // 库类型 默认是 library
      peptide_detail_all_librarys: null,
      peptide_detail_table_data: null,
      search_text: null
    };
    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
    setTimeout(() => {
      // 获取当前肽段的id
      this.get_current_peptide_detail_id();
    }, 300);
  }

  get_current_peptide_detail_id = () => {
    // /peptide/detail/5d0848fee0073c6ffc69752d/5d084f24e0073ca454d2c711
    let url = this.props.history.location.pathname;
    // 提取 id
    let index = url.lastIndexOf("/");
    let id = url.substring(index + 1);
    // 提取返回的 id 巧妙利用 detail/
    let index1 = url.lastIndexOf("detail/");
    let prefix_id = url.substring(index1 + 7, index);
    this.props.query_peptide_detail({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        peptide_detail_id: id,
        peptide_detail_prefix_id: prefix_id
      });
    }, 90);
  };

  // 处理新的肽段资源
  handle_peptide_detail = () => {
    // 首先时间戳归零
    this.props.set_state_newvalue({
      target: "peptide_detail_time",
      value: 0
    });
    let {
      peptide_detail_data_status,
      language,
      peptide_detail_data
    } = this.props;

    if (0 == peptide_detail_data_status) {
      //   成功
      setTimeout(() => {
        /*
        charge: 3
        decoyFragmentMap: {y9: {…}, y9^2: {…}, y4: {…}, y10^2: {…}, y5: {…}, …}
        decoySequence: "LWIGLDQTKCNK"
        decoyUnimodMap: {9: "4"}
        fragmentMap: {y9: {…}, y9^2: {…}, y4: {…}, y10^2: {…}, y5: {…}, …}
        fullName: "NTWDC(UniMod:4)GLQILKK"
        id: "5d084f24e0073ca454d2c6fa"
        isUnique: true
        libraryId: "5d0848fee0073c6ffc69752d"
        mz: 492.594021180667
        peptideRef: "NTWDC(UniMod:4)GLQILKK_3"
        proteinName: "1/sp|P53007|TXTP_HUMAN"
        rt: 54.9
        sequence: "NTWDCGLQILKK"
        unimodMap: {4: "4"}
          */

        let {
          libraryInfo: library_info,
          peptide: peptide_data
        } = peptide_detail_data;
        let library_type = null;
        let is_public = true == library_info.doPublic ? true : false;
        let detail_link = "/library/";
        if (0 == library_info.type) {
          // 标准库
          // 这里要与 irt 库区分开
          library_type = "standard";
          detail_link +=
            true == is_public ? "public_library" : "standard_library";
        } else if (1 == library_info.type) {
          // irt 库
          library_type = "irt";
        } else {
          // 数据有错误
          //  直接终止 不写入 state 这样数据就不会显示出来
          console.warn(
            "@Author:TangTao : 系统检测到数据异常",
            "初步诊断:服务器端的数据未能解析成功"
          );
          return -1;
        }

        // 生成计算详情链接
        detail_link += "/detail/" + this.state.peptide_detail_prefix_id;

        // 离子片段
        let { fragmentMap: map, decoyFragmentMap: decoy_map } = peptide_data;
        let { length: len0 } = Object.keys(map);
        let ion_fragment_arr = null;
        let obj_temp = {};
        let j = 0;

        if (0 < len0) {
          ion_fragment_arr = new Array(len0);
          for (let i in map) {
            obj_temp.key = "ion_fragment_arr_" + j;
            let { mz, intensity, annotations, cutInfo } = map[i];
            // 断裂标记
            obj_temp.fracture_mark = cutInfo;
            // 碎片荷质比
            obj_temp.mz = mz;
            // 强度
            obj_temp.intensity = intensity;
            // Annotations
            obj_temp.annotations = annotations;
            // 带电量
            // null
            ion_fragment_arr[j++] = obj_temp;
            obj_temp = {};
          }
        }

        // 伪肽段碎片 格式化数据 2019-9-1 00:04:07
        let { length: len1 } = Object.keys(decoy_map);
        let decoy_fragment_arr = null;
        // 创建数组前校验参数是否合法 否则异常数据将会导致bug
        if (0 < len1) {
          decoy_fragment_arr = new Array(len1);
          obj_temp = {};
          j = 0;
          for (let i in decoy_map) {
            obj_temp.key = "decoy_fragment_arr" + j;
            let { mz, intensity, annotations, cutInfo } = decoy_map[i];
            // 断裂标记
            obj_temp.fracture_mark = cutInfo;
            // 碎片荷质比
            obj_temp.mz = mz;
            // 强度
            obj_temp.intensity = intensity;
            // Annotations
            obj_temp.annotations = annotations;
            // 带电量
            // null 暂时跳过
            decoy_fragment_arr[j++] = obj_temp;
            obj_temp = {};
          }
        }

        this.setState({
          peptide_detail_data_status: 0,
          // 是否是公开的
          peptide_detail_id_library_public: is_public,
          // 库的类型
          peptide_detail_id_library_type: library_type,
          // 离子片段数据
          peptide_detail_ion_fragment_data: ion_fragment_arr,
          // 伪肽段数据
          peptide_detail_decoy_fragment_data: decoy_fragment_arr,
          // 生成的肽段所属库的详情链接
          peptide_detail_id_library_detail_link: detail_link
        });
        return -1;
      }, 200);
    } else {
      //   数据获取失败
      Modal.error({
        title: "False",
        content: Languages[language]["propro.network_error"],
        okText: Languages[language]["propro.user_modal_know"]
      });
      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      setTimeout(() => {
        this.get_current_peptide_detail_id();
      }, 15000);
    }
  };

  render() {
    if (10000 < this.props.peptide_detail_time) {
      this.handle_peptide_detail();
    }

    if (0 != this.state.peptide_detail_data_status) {
      // 说明还没有可以使用的数据 提示加载 ...
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
      peptide: peptide_data,
      libraryInfo: library_info
    } = this.props.peptide_detail_data;

    // 离子片段 伪肽段 表格数据配置
    let ion_and_decoy_fragment_data_columns = [
      {
        title: "断裂标记",
        dataIndex: "fracture_mark",
        render: data => {
          return (
            <div
              style={{
                fontSize: "12px"
              }}
            >
              {data}
            </div>
          );
        }
      },
      {
        title: "碎片荷质比",
        dataIndex: "mz",
        render: data => {
          return (
            <div
              style={{
                fontSize: "12px"
              }}
              className={styles.font_primary_color}
            >
              {data}
            </div>
          );
        }
      },
      {
        title: "强度",
        dataIndex: "intensity",
        render: data => {
          return (
            <div
              style={{
                fontSize: "12px"
              }}
              className={styles.font_primary_color}
            >
              {data}
            </div>
          );
        }
      },
      {
        title: "Annotations",
        dataIndex: "annotations",
        render: data => {
          return (
            <div
              style={{
                fontSize: "12px"
              }}
            >
              {data}
            </div>
          );
        }
      }
    ];

    // 计算出当前肽段的所属库类型 是否公开
    let {
      peptide_detail_id_library_public: is_public,
      peptide_detail_id_library_type
    } = this.state;
    let [Is_public, Library_type] = [null, null];
    if (is_public) {
      Is_public = (
        <span
          className={
            "badge " + styles.font_white_color + " " + styles.bg_green_color
          }
          style={{
            padding: "5px 8px"
          }}
        >
          Public
        </span>
      );
    } else {
      Is_public = (
        <span
          className={
            "badge " + styles.font_white_color + " " + styles.bg_red_color
          }
          style={{
            padding: "5px 8px"
          }}
        >
          Private
        </span>
      );
    }

    if ("standard" == peptide_detail_id_library_type) {
      // 标准库
      Library_type = (
        <span
          className={
            "badge " + styles.font_white_color + " " + styles.bg_primary_color
          }
          style={{
            padding: "5px 8px"
          }}
        >
          标准库
        </span>
      );
    } else {
      // irt 库
      Library_type = (
        <span
          className={
            "badge " + styles.font_white_color + " " + styles.bg_blue_color
          }
          style={{
            padding: "5px 8px"
          }}
        >
          IRT 库
        </span>
      );
    }

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
          {/*  注意 这里是蛋白质链接 */}

          <Tooltip
            placement="topLeft"
            title={<FormattedHTMLMessage id="propro.protein_list_title" />}
          >
            <Link to={"/protein/list/" + this.state.peptide_detail_prefix_id}>
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.peptide_detail_title" />
        </div>
        <Row>
          <Col
            span={24}
            lg={24}
            xl={24}
            xxl={24}
            style={{
              background: "#FFFFFF",
              padding: "20px",
              fontSize: "14px",
              border: "1px solid #e5e9f2",
              maxWidth: "1200px",
              overflow: "auto"
            }}
          >
            <Descriptions
              title={
                <span className={styles.font_second_color}>
                  ID:&nbsp;{this.state.peptide_detail_id}
                </span>
              }
              bordered
              size="middle"
              column={2}
              style={{
                overflowX: "auto",
                overflowY: "auto"
              }}
            >
              <Descriptions.Item span={2} label="标准库ID">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  <Tooltip placement="top" title={"查看详情"}>
                    <Link to={this.state.peptide_detail_id_library_detail_link}>
                      {this.state.peptide_detail_prefix_id}
                    </Link>
                  </Tooltip>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  {Library_type}
                  &nbsp; &nbsp;
                  {Is_public}
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="蛋白质名称">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  {peptide_data.proteinName}
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="PeptideRef">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  {peptide_data.peptideRef}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="肽段完整名称(包含修饰基团)">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  {peptide_data.fullName}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="肽段荷质比MZ">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_primary_color}
                >
                  {peptide_data.mz}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="RT">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_primary_color}
                >
                  {peptide_data.rt}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="带电量">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_primary_color}
                >
                  {peptide_data.charge}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="修饰基团">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  {JSON.stringify(peptide_data.unimodMap)}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="肽段序列">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  {peptide_data.sequence}
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="离子片段">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  <Table
                    columns={ion_and_decoy_fragment_data_columns}
                    dataSource={this.state.peptide_detail_ion_fragment_data}
                    size="middle"
                    pagination={{
                      hideOnSinglePage: true
                    }}
                  />
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="伪肽段">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  {peptide_data.decoySequence}
                </div>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="伪肽段碎片">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                >
                  <Table
                    columns={ion_and_decoy_fragment_data_columns}
                    dataSource={this.state.peptide_detail_decoy_fragment_data}
                    size="middle"
                    pagination={{
                      hideOnSinglePage: true
                    }}
                  />
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Peptide_detail;
