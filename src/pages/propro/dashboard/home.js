// /src/pages/propro/dashboard/home.js

/***
 * @Author              TangTao
 * @Email               tangtao2099@outlook.com   https://www.promiselee.cn
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-9 01:31:04
 * @UpdateTime          2019-10-4 00:03:37
 * @Archive             用户设置界面
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";

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
  Tooltip
} from "antd";

const { confirm } = Modal;

const { TabPane } = Tabs;

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
import styles from "../style/user/setting.less";
import add_svg from "../style/static/dashboard/add.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
/****************  导入 styles end ***************************/
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Row
          type="flex"
          justify="space-around"
          style={{
            margin: "0px -15px"
          }}
        >
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
          <Col
            span={8}
            style={{
              background: "#ffffff",
              padding: "10px 0px",
              margin: "20px 10px",
              minHeight: "100px",
              border: "1px solid #e5e9f2"
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "right",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e9f2"
              }}
            >
              <div
                style={{
                  float: "left"
                }}
              >
                <span
                  style={{
                    cursor: "pointer"
                  }}
                >
                  公共标准库
                </span>
                <div
                  style={{
                    // paddingLeft: "20px",
                    fontSize: "12px",
                    fontWeight: 300,
                    paddingTop: "5px",
                    color: "#9699a2",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  standard libraries
                </div>
              </div>

              <span
                className={"badge " + `${styles.bg_primary_color}`}
                style={{
                  padding: "10px 10px",
                  marginTop: "5px",
                  marginRight: "20px",
                  fontSize: "26px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                9
              </span>
            </div>

            <div
              style={{
                paddingLeft: "20px",
                paddingTop: "20px"
              }}
            >
              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_second_color}`}
                  style={{
                    padding: "5px 10px"
                  }}
                >
                  <img
                    src={add_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>

              <Tooltip title="标准库列表">
                <button
                  type="button"
                  className={"btn " + `${styles.bg_primary_color}`}
                  style={{
                    padding: "5px 10px",
                    marginLeft: "20px"
                  }}
                >
                  <img
                    src={unordered_list_svg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
