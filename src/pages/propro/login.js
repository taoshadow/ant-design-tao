// path : /src/pages/propro/login.js

import styles from './style/login.less';
import  './style/login.css';
import propro_logo_hori from '../../assets/propro-logo-hori.png';
import guomics_logo from '../../assets/guomics-logo.png';
import Link from 'umi/link';
import Redirect from 'umi/redirect';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { connect } from 'dva';
import {FormattedHTMLMessage} from "react-intl";
//   引入自定义的语言文件 js 格式
import messages_zh from "../../locale/zh_CN";
import messages_en from "../../locale/en_US";

const Languages = {
  'zh': messages_zh,
  'en': messages_en
};


import {
  Layout,Menu,
  Icon, 
  Switch,
  Breadcrumb,
  Row,
  Tag, 
  Col,
  Button,
  Dropdown,
  Select,
  Form,
  Input,
  Checkbox,
  message
} from 'antd';

  
/***********  Login View 初始化   ***************/
/***********  Login View 初始化   ***************/

// state 发生改变 回调该函数 该函数返回新状态 直接导致页面刷新
const loginStateToProps =(state) => {
  // 先从 models 里读取 是否显示登录  当前语言
  const language = state['language'].language;
  const { login_status, login_show, login_time } = state['login'];

  // 发送的对象
  let obj={};
  

  if('undefined'!=typeof(login_show)){
        obj.login_show=login_show;
  }

  if('undefined'!=typeof(language)){
    obj.language=language;
  }

  obj.login_status=login_status;
  // 先原样取出
  obj.login_time=login_time;

  // 再让 login_time 置 0 
  // 这样设计的巧妙之处在于 发生给 render 的是原值 但是这里处理就变成 0 
  // 这样就不需要再多次处理返回结果 只有点击登录时 login_time 才会更新
  // 但是缺点是 不是这个对象定义的数据 在这里发起来改变
  if(login_time>((new Date().getTime())-500)){
      // 这里 强制 置0 使得不用再判断
      state['login'].login_time=0;
  }

  return obj;
};


const loginDispatchToProps = (dispatch) => {
  return {
    changeLogin: (login) => {
      const action = {
        type: 'login/changeLogin',
        payload: login,
      };
      dispatch(action);
    },
    // 登录触发器
    doLogin: (login) => {
      const action = {
        type: 'login/doLogin',
        payload: login,
      };
      dispatch(action);
    },
  };
};

/***********  Login View 初始化 end  ***************/



@connect(loginStateToProps,loginDispatchToProps)
class LoginForm extends React.Component {

  constructor(props){
    super(props);
   
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 执行登录
        this.props.doLogin({
          login: values,
        });
      }
    });
  };

  applyCount= e => {
    this.props.changeLogin({
      login: false,
    });
  }



  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{
        width:'350px',
        textAlign:'center',
        margin:'auto',
      }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <div style={{
              marginBottom:'20px',
              fontSize:'20px',
              fontWeight:'600',
              letterSpacing:'1px',
            }}>
              <FormattedHTMLMessage
                  id="propro.welcome_login" /> <span style={{
                letterSpacing:'0px',
              }}>PROPRO</span> 
            </div>

            
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: <FormattedHTMLMessage
                  id="propro.login_username_error" /> }],
              })(
                <div className="input-group " style={{
                  // borderBottom:'1px solid #ddd',
                  marginBottom:'0px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="user" /></span>
                    </div>
                    <input type="text" maxLength='20' className={styles.input_login} placeholder={"zh"== this.props.language ? "用户名" : "Username"} />
                </div>,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: <FormattedHTMLMessage
                  id="propro.login_password_error" />}],
              })(
                <div className="input-group" style={{
                  marginTop:'-5px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="lock" /></span>
                    </div>
                    <input type="password" maxLength='30' className={styles.input_login} placeholder={"zh"== this.props.language ? "密码" : "Password"} />
                </div>,
              )}
            </Form.Item>

            <Form.Item style={{
              paddingTop:'30px',
              marginBottom:'10px',
            }}>

              <button type="button" className="btn btn-dark" style={{
                borderRadius:'23px',
                height:'46px',
                padding:'0px 30px',
                fontSize:'16px',
                minWidth:'120px',
                float:'left',
                marginLeft:'10px',
              }}
              onClick={this.handleSubmit}
              ><FormattedHTMLMessage
              id="propro.login" /></button>

              <button type="button" className="btn btn-outline-dark" style={{
                borderRadius:'23px',
                height:'46px',
                padding:'0px 30px',
                fontSize:'16px',
                minWidth:'120px',
                float:'right',
                marginRight:'10px',
              }}
              onClick={this.applyCount}
              ><FormattedHTMLMessage
              id="propro.apply_account" /></button>
            </Form.Item>


            <div style={{
              textAlign:'right',
              paddingRight:'10px',
            }}>

       
              <Link to='/login' style={{
                color:'#888',
              }}>
                <FormattedHTMLMessage
                id="propro.forgot_password" />
              </Link>

            </div>
          </Form>
      </div>

    );
  }
}

const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);

// 注册表单
@connect(loginStateToProps,loginDispatchToProps)
class RegisterForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  switchLogin= e => {
    this.props.changeLogin({
      login: true,
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{
        width:'350px',
        textAlign:'center',
        margin:'auto',
      }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <div style={{
              marginBottom:'20px',
              fontSize:'20px',
              fontWeight:'600',
              letterSpacing:'1px',
            }}>
              <FormattedHTMLMessage
                  id="propro.welcome_register" /> <span style={{
                letterSpacing:'0px',
              }}>PROPRO</span> 
            </div>

            <Form.Item>
              {getFieldDecorator('username1', {
                rules: [{ required: true, message: <FormattedHTMLMessage
                  id="propro.login_username_error" /> }],
              })(
                <div className="input-group " style={{
                  // borderBottom:'1px solid #ddd',
                  marginBottom:'0px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="user" /></span>
                    </div>
                    <input type="text" maxLength='20' className={styles.input_login} placeholder={"zh"== this.props.language ? "用户名" : "Username"} />
                </div>,
              )}
            </Form.Item>


            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: <FormattedHTMLMessage
                  id="propro.login_password_error" />}],
              })(
                <div className="input-group" style={{
                  marginTop:'-5px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="lock" /></span>
                    </div>
                    <input type="password" maxLength='30' className={styles.input_login} placeholder={
                    "zh"== this.props.language ? "密码" : "Password"} />
                </div>,
              )}
            </Form.Item>


            <Form.Item>
              {getFieldDecorator('telephone', {
                rules: [{ required: true, message: <FormattedHTMLMessage
                  id="propro.register_telephone_error" />}],
              })(
                <div className="input-group" style={{
                  marginTop:'-5px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="phone" /></span>
                    </div>
                    <input type="text" maxLength='30' className={styles.input_login} placeholder={"zh"== this.props.language ? "联系电话" : "Telephone number"} />
                </div>,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('dingtalk_id', {
                rules: [{ required: false, }],
              })(
                <div className="input-group" style={{
                  marginTop:'-5px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="dingding" /></span>
                    </div>
                    <input type="text" maxLength='30' className={styles.input_login} placeholder={"zh"== this.props.language ? "钉钉 ID" : "DingTalk ID"} />
                </div>,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('organization', {
                rules: [{ required: false, }],
              })(
                <div className="input-group" style={{
                  marginTop:'-5px',
                }}>
                    <div className="input-group-prepend" style={{
                            fontSize:'20px',
                            lineHeight:'30px',
                            height:'30px',
                          }} >
                          <span style={{
                            fontSize:'16px',
                            lineHeight:'20px',
                          }} ><Icon type="team" /></span>
                    </div>
                    <input type="text" maxLength='30' className={styles.input_login} placeholder={"zh"== this.props.language ? "组织" : "Organization"} />
                </div>,
              )}
            </Form.Item>

            <Form.Item style={{
              paddingTop:'30px',
              marginBottom:'10px',
            }}>

              <button type="button" className="btn btn-dark" style={{
                borderRadius:'23px',
                height:'46px',
                padding:'0px 30px',
                fontSize:'16px',
                minWidth:'120px',
                float:'left',
                marginLeft:'10px',
              }}
              onClick={this.handleSubmit}
              ><FormattedHTMLMessage
              id="propro.apply_account_confirm" /></button>

              <button type="button" className="btn btn-outline-dark" style={{
                borderRadius:'23px',
                height:'46px',
                padding:'0px 30px',
                fontSize:'16px',
                minWidth:'120px',
                float:'right',
                marginRight:'10px',
              }}
              onClick={this.switchLogin}
              ><FormattedHTMLMessage
              id="propro.apply_account_cancel" /></button>
            </Form.Item>


          </Form>
      </div>

    );
  }
}



const WrappedRegisterForm = Form.create({ name: 'normal_register' })(RegisterForm);



@connect(loginStateToProps,loginDispatchToProps)
export default class Login extends React.Component {
  constructor(props){
    super(props);
   
    
    // 配置 message
    message.config({
      top: 120,
      duration: 2,
      maxCount: 5,
      getContainer:()=>document.body,
    });
    // 提示页面正在加载 因为react 初始化时用户或者开发时不易察觉 通过 loading 提示
    message.loading('Loading..', 0.5);
   
  }

  // 登录结果前端处理
  handle_login=(login_status,language)=>{
    let login_result = '' ;
     // // 需要处理 登录结果
    if('error'==login_status||-1==login_status){
      // 提示登录失败
      setTimeout(() => {
        login_result=Languages[language]["propro.login_error"];
        message.error(login_result,3);   
      }, 100);
     
    }else if(0==login_status){
      // 登录成功
      // 这个关闭时间延长 使得它跳转到控制台时 它仍然存在 增强过渡效果
      setTimeout(() => {
        login_result=Languages[language]["propro.login_success"];
        message.success(login_result,5);
      }, 80);
      setTimeout(()=>{
        message.loading(Languages[language]["propro.loading"],2,()=>{
          // 跳转
          this.props.history.push('/home');
        });
      },1000);
    }else if(-2==login_status||-3==login_status){
      // -2 用户名不存在  -3 密码错误
      // 统一提示用户名或密码错误
      setTimeout(() => {
        login_result=Languages[language]["propro.login_false"];
        message.warn(login_result,3);        
      }, 100);

    }
  }





  render(){
    const {login_show,login_status,login_time,language}=this.props;
      
      // 根据 login_time 判断是否需要处理结果
      if(login_time>((new Date().getTime())-500)){
          this.handle_login(login_status,language);
      }

      return (
        <div className={styles.main} >
          <Row>
            <Col span={13}
            style={{
              fontSize:'22px',
              textAlign:'center',
              // background:'#eee111',
            }}
            >
              
              <div style={{
                fontWeight:'500',
                fontSize:'50px',
                letterSpacing :'1px',
              }}>
              <FormattedHTMLMessage id="propro.line1" />
              <div id='propro1'></div>
              </div>
              <div style={{
                fontWeight:'900',
                fontSize:'70px',
              }}>
                    <span style={{
                      color:'#212529',
                    }}>
                      Propro 
                      &nbsp;
                    </span>

                <span style={{
                  fontSize:'10px',
                  fontWeight:'500',
                }}>
                1.1.1-Release
                </span>
              </div>
 

              <div style={{
                // fontWeight:'500',
                fontSize:'28px',
                paddingTop:'10px',
              }}>
                Focus on
                  <span style={{
                    fontWeight:'900',
                  }}>
                  &nbsp;DIA/SWATH &amp; PRM&nbsp;
                  </span>
                analysis
              </div>

              <div style={{
                paddingTop:'0px',
              }}>
                  <Tag 
                    style={{
                      cursor:'pointer',
                    }}
                    color="#716aca">
                      <a href='https://www.java.com/' target='_blank'>
                          Java OpenJDK
                      </a>
                  </Tag>
                  
                  <Tag 
                  style={{
                    cursor:'pointer',
                  }}
                  color="#36a3f7">
                    <a href='https://spring.io/projects/spring-boot/' target='_blank'>
                          SpringBoot
                    </a>
                  </Tag>
                  <Tag 
                  style={{
                    cursor:'pointer',
                  }}
                  color="#5867dd">
                      <a href='https://github.com/Propro-Studio/propro-server' target='_blank'>
                              GitHub
                      </a>
                  </Tag>
                  <Tag 
                  style={{
                    cursor:'pointer',
                  }}
                  color="#00c5dc">
                      <a href='https://gitee.com/lums/propro' target='_blank'>
                              Gitee
                      </a>
                  </Tag>
                  <Tag 
                  style={{
                    cursor:'pointer',
                  }}
                  color="#ffb822">
                      <a href='https://www.apache.org/licenses/LICENSE-2.0.html' target='_blank'>
                            Apache License 2.0
                      </a>
                  </Tag>

                  <Tag 
                  style={{
                    cursor:'pointer',
                  }}
                  color="#f4516c">
                      <a href='https://www.yuque.com/proteomicspro/documentation' target='_blank'>
                              Documents
                      </a>
                  </Tag>
              </div>
              

              <div style={{
                    paddingTop:'100px',
              }}>

                <a href='http://www.proteomics.pro/' target='_blank'>
                    <img src={propro_logo_hori} style={{
                      maxHeight:'80px',
                      cursor:'pointer',
                    }} />
                </a>

                <a href='http://www.guomics.com/' target='_blank'>
                    <img src={guomics_logo} style={{
                      marginLeft:'80px',
                      maxHeight:'100px',
                      cursor:'pointer',
                    }} />
                </a>
                
              </div>


            </Col>
            {/* 登录 注册 */}
            <Col span={11} style={{
              paddingLeft:'10px',
              margin:'auto',
              textAlign:'center',
            }} >
              {/* 判断是否需要渲染 登录 */}
              {true == login_show ? <WrappedLoginForm /> :<WrappedRegisterForm /> }
              
            </Col>
          </Row>
        </div>
      
      );
}

}



