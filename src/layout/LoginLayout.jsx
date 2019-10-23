import {
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Row,
  Card,
  Col,
  Button,
  Dropdown,
  Select,
  Badge,
  Tag
} from "antd";

import Link from "umi/link";

// import {Slider_menu} from './sider';
import "antd/dist/antd.less";
import styles from "./LoginLayout.less";
// import logo from'../assets/propro-logo-hori.png'
import "./LoginLayout.css";
import "./Common.css";
import prorpo_logo from "../assets/propro-logo-vertical.png";

import { connect } from "dva";

/***********  国际化配置   ***************/
/***********  国际化配置   ***************/
//  1 引入组件
import {
  IntlProvider,
  addLocaleData,
  FormattedMessage,
  FormattedHTMLMessage
} from "react-intl";

//  2 引入语言包支持
import locale_en from "react-intl/locale-data/en";
import locale_zh from "react-intl/locale-data/zh";

//  3 引入自定义的语言文件 json 格式
import messages_zh from "../locale/zh_CN";
import messages_en from "../locale/en_US";

const Languages = {
  zh: messages_zh,
  en: messages_en
};

//  4 设置语言支持
addLocaleData([...locale_en, ...locale_zh]);
/***********  国际化配置 end  ***************/

/***********  自定义日志配置   ***************/
/***********  自定义日志配置   ***************/

// 开发模式
let dev_consolelog = function() {
  let len = arguments.length;
  for (let i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
};

/***********  自定义日志配置 end   ***************/

/***********  语言初始化   ***************/
/***********  语言初始化   ***************/

// state 发生改变 回调该函数 该函数返回新状态 直接导致页面刷新
const languageStateToProps = state => {
  // 先从 models 里读取
  const language = state["language"].language;
  return {
    language
  };
};

// 语言改变触发器
const languageDispatchToProps = dispatch => {
  return {
    changeLanguage: language => {
      const action = {
        //  触发类型
        type: "language/changeLanguage",
        // 数据 payload 传入新的语言
        payload: language
      };
      // 触发
      dispatch(action);
    }
  };
};

/***********  语言初始化 end  ***************/

const { Header, Footer, Content, Sider } = Layout;

const { SubMenu } = Menu;

//  select 复选框
const { Option } = Select;

// 登录
@connect(
  languageStateToProps,
  languageDispatchToProps
)
export default class LoginLayout extends React.Component {
  // state = {
  //   theme: 'dark',
  //   current: '1',
  // };

  // changeTheme = value => {
  //   this.setState({
  //     theme: value ? 'dark' : 'light',
  //   });
  // };

  // handleClick = e => {
  //   console.log('click ', e);
  //   this.setState({
  //     current: e.key,
  //   });
  // };

  constructor(props) {
    super(props);
    dev_consolelog("Initializing Login ...");

    dev_consolelog("Initialization Login successful .");
  }

  //  切换语言 触发
  changeLanguage = e => {
    dev_consolelog(`change language ${e}`);
    this.props.changeLanguage({
      language: e
    });
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  state = {
    // current: 'mail',
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    // 提取目标语言 从 model 中获取
    const language = this.props.language;
    return (
      <IntlProvider locale={language} messages={Languages[language]}>
        <Layout style={{ minHeight: "120vh", minWidth: "1150px" }}>
          <Layout>
            <Content
              style={{
                margin: "0px",
                padding: 0,
                background: "#fff",
                minHeight: 280
                // borderRadius:'5px',
              }}
            >
              <div
                style={{
                  background: "#FFFFFF"
                }}
              >
                <Row
                  style={{
                    // minHeight:'900px',
                    color: "#333"
                  }}
                >
                  <Col
                    span={24}
                    style={{
                      borderBottom: "1px solid #ddd",
                      height: "60px",
                      lineHeight: "50px",
                      padding: "5px 10px 0px",
                      fontSize: "18px"
                    }}
                  >
                    <Col span={6} style={{}}>
                      <Link to="/home">
                        <img
                          src={prorpo_logo}
                          style={{
                            maxHeight: "40px"
                          }}
                        />
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                          className={styles.myfont}
                        >
                          &nbsp;PROPRO
                        </span>
                      </Link>
                    </Col>

                    <Col
                      span={6}
                      offset={12}
                      style={{
                        textAlign: "right"
                      }}
                    >
                      <Select
                        defaultValue={language}
                        style={{
                          padding: "5px 5px"
                          // marginLeft:'3px',
                          // height:'55px',
                        }}
                        onChange={this.changeLanguage}
                      >
                        <Option value="zh">中文</Option>
                        <Option value="en">English</Option>
                      </Select>

                      <Button
                        type="primary"
                        style={{
                          padding: "0px 10px",
                          marginLeft: "8px",
                          height: "32px",
                          lineHeight: "32px"
                        }}
                      >
                        <Link
                          to="/home"
                          style={{
                            color: "#fff",
                            letterSpacing: "1px"
                          }}
                        >
                          <span>
                            &nbsp;
                            <FormattedHTMLMessage id="propro.home" />
                          </span>
                        </Link>
                      </Button>
                    </Col>
                  </Col>
                </Row>
              </div>

              <div
                style={{
                  minHeight: "100vh",
                  padding: 0,
                  margin: 0,
                  background: "rgba(255,255,255,0.1)"
                }}
              >
                {this.props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </IntlProvider>
    );
  }
}
