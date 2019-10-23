// {
//     'statement' :'国际化配置',
//     'app.text': '杭州电子科技大学 管理学院 2016级 唐涛 tangtao2099@outlook.com ',
//     'app.learn-react-link': '我的主页',
//     'propro': {
//         'login' : '登录'
//     }

// }

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-7-12 19:18:52
 * @UpdateTime          2019-10-23 12:47:33
 * @Archive             国际化 中文 Chinese
 *
 */

/****************  中文  *******************************/
/****************  中文  *******************************/
/****************  中文  *******************************/

// src/locale/zh_CN.js
let language_ch = {
  // 共用
  // 设计 language 的思路 : 它是一个环境变量 可以直接在界面中读取 从而分析出当前页面的语言
  "propro.language": "zh",
  "propro.login": "登录",
  "propro.home": "首页",
  "propro.console": "控制台",
  "propro.author1": "TangTao",
  "propro.loading": "正在加载",
  "propro.reloading": "正在重新加载",

  "propro.logout": "退出",

  // 登录
  "propro.prompt_username": "用户名",
  "propro.prompt_password": "密码",
  "propro.login_username_error": "请输入用户名",
  "propro.login_password_error": "请输入密码",
  "propro.forgot_password": "忘记密码",
  "propro.apply_account": "申请账号",
  "propro.welcome_login": "欢迎来到 ",
  "propro.welcome_register": "欢迎申请 ",
  "propro.line1": "蛋白质组学分析平台",
  "propro.apply_account_confirm": "确定",
  "propro.apply_account_cancel": "取消",
  "propro.register_telephone_error": "联系电话不能为空",
  "propro.login_error": "登录失败",
  "propro.login_success": "登录成功",
  "propro.login_false": "用户名或密码错误",

  // notification
  "propro.notification_operation_warn_title": "操作警示",
  "propro.notification_warn_title": "警告",

  // basicLayout
  // 个人中心下面的弹窗
  "propro.personal_center": "个人中心",
  "propro.user_management": "用户管理",
  "propro.nick": "昵称",
  "propro.email": "邮箱",
  "propro.organization": "组织",
  "propro.telephone": "电话",
  // 首页
  "propro.logout_run": "正在退出",
  "propro.logout_success": "退出成功",

  // Modal 通用
  "propro.modal_title": "操作提示",
  "propro.modal_confirm": "确定",
  "propro.modal_cancel": "取消",

  // url错误
  "propro.url_error": "当前链接不存在",

  // 提示级别
  "propro.prompt_running": "运行...",
  "propro.prompt_success": "成功",
  "propro.prompt_failed": "失败",
  "propro.prompt_cancel": "取消",

  // 用户设定
  "propro.user_setting": "设置",
  "propro.user_account": "账户",
  "propro.user_password": "密码",
  "propro.user_username": "账号",
  "propro.user_saveinfo": "保存",
  "propro.user_current_password": "当前密码",
  "propro.user_new_password": "新密码",
  "propro.user_verify_password": "重复新密码",
  "propro.user_modal_title": "操作提示",
  "propro.user_modal_confirm": "确定",
  "propro.user_modal_cancel": "取消",
  "propro.user_update_account_success": "更新成功",
  "propro.user_update_account_failed": "更新失败",
  "propro.user_modal_password_warning":
    "( ๑ŏ ﹏ ŏ๑ )ﾉI’m sorry~, (1)请输入正确的原密码 (2)新密码长度至少为6 (3)两次新密码要相同",
  "propro.user_modal_know": "知道了",
  "propro.user_modal_warning": "温馨提醒",
  "propro.user_current_password_false": "你输入的当前密码不正确",

  // 控制台
  "propro.console_resource_title": "资源概览",
  "propro.console_task_running": "任务",
  "propro.console_lib": "标准库",
  "propro.console_irt_lib": "iRT校准库",
  "propro.console_public_lib": "公共标准库",
  "propro.console_public_irt": "公共iRT库",
  "propro.console_exp_swath": "DIA/SWATH",
  "propro.console_exp_prm": "PRM",
  "propro.console_project": "项目管理",
  "propro.console_overview": "分析概览",
  "propro.console_experiment_list": "实验列表",

  // 系统错误
  "propro.network_error":
    "..(｡•ˇ‸ˇ•｡)… 非常抱歉,PROPRO未能成功获取数据,请检查网络",

  // 公共标准库 列表
  "propro.public_standard_library_list_title": "公共标准库列表",
  "propro.public_standard_library_list_search": "搜索",
  "propro.public_standard_library_list_reset": "重置",
  "propro.public_standard_library_list_index": "序列号",
  "propro.public_standard_library_list_id": "标准库id",
  "propro.public_standard_library_list_name": "标准库名称",
  "propro.public_standard_library_list_protein_count": "蛋白质数目",
  "propro.public_standard_library_list_total_count": "肽段数目",
  "propro.public_standard_library_list_create_time": "创建时间",
  "propro.public_standard_library_list_is_public": "是否公开",
  "propro.public_standard_library_list_creator": "创建者",
  "propro.public_standard_library_list_operation": "操作",
  "propro.public_standard_library_list_detail": "详情",
  "propro.public_standard_library_list_protein_list": "蛋白质列表",
  "propro.public_standard_library_list_peptides_list": "肽段列表",
  "propro.public_standard_library_list_update": "更新公共标准库",

  // 标准库 列表
  "propro.standard_library_list_title": "标准库列表",
  "propro.standard_library_list_search": "搜索",
  "propro.standard_library_list_reset": "重置",
  "propro.standard_library_list_index": "序列号",
  "propro.standard_library_list_id": "标准库id",
  "propro.standard_library_list_name": "标准库名称",
  "propro.standard_library_list_protein_count": "蛋白质数目",
  "propro.standard_library_list_total_count": "肽段数目",
  "propro.standard_library_list_create_time": "创建时间",
  "propro.standard_library_list_is_public": "是否公开",
  "propro.standard_library_list_creator": "创建者",
  "propro.standard_library_list_operation": "操作",
  "propro.standard_library_list_detail": "详情",
  "propro.standard_library_list_protein_list": "蛋白质列表",
  "propro.standard_library_list_peptides_list": "肽段列表",
  "propro.standard_library_list_update": "更新标准库",
  "propro.standard_library_list_set_public": "公开标准库",

  // IRT 校准库 列表
  "propro.irt_standard_library_list_title": "IRT校准库列表",
  "propro.irt_standard_library_list_search": "搜索",
  "propro.irt_standard_library_list_reset": "重置",
  "propro.irt_standard_library_list_index": "序列号",
  "propro.irt_standard_library_list_id": "校准库id",
  "propro.irt_standard_library_list_name": "校准库名称",
  "propro.irt_standard_library_list_protein_count": "蛋白质数目",
  "propro.irt_standard_library_list_total_count": "肽段数目",
  "propro.irt_standard_library_list_create_time": "创建时间",
  "propro.irt_standard_library_list_is_public": "是否公开",
  "propro.irt_standard_library_list_creator": "创建者",
  "propro.irt_standard_library_list_operation": "操作",
  "propro.irt_standard_library_list_detail": "详情",
  "propro.irt_standard_library_list_protein_list": "蛋白质列表",
  "propro.irt_standard_library_list_peptides_list": "肽段列表",
  "propro.irt_standard_library_list_update": "更新校准库",
  "propro.irt_standard_library_list_set_public": "公开校准库",

  // 公共 irt 校准库 列表
  "propro.public_irt_standard_library_list_title": "公共IRT校准库列表",
  "propro.public_irt_standard_library_list_search": "搜索",
  "propro.public_irt_standard_library_list_reset": "重置",
  "propro.public_irt_standard_library_list_index": "序列号",
  "propro.public_irt_standard_library_list_id": "校准库id",
  "propro.public_irt_standard_library_list_name": "校准库名称",
  "propro.public_irt_standard_library_list_protein_count": "蛋白质数目",
  "propro.public_irt_standard_library_list_total_count": "肽段数目",
  "propro.public_irt_standard_library_list_create_time": "创建时间",
  "propro.public_irt_standard_library_list_is_public": "是否公开",
  "propro.public_irt_standard_library_list_creator": "创建者",
  "propro.public_irt_standard_library_list_operation": "操作",
  "propro.public_irt_standard_library_list_detail": "详情",
  "propro.public_irt_standard_library_list_protein_list": "蛋白质列表",
  "propro.public_irt_standard_library_list_peptides_list": "肽段列表",
  "propro.public_irt_standard_library_list_update": "更新IRT校准库",

  // 公共标准库详情
  "propro.public_standard_library_detail_title": "公共标准库详情页",
  "propro.public_standard_library": "公共标准库",
  "propro.public_standard_library_detail_id": "标准库ID",
  "propro.public_standard_library_detail_name": "标准库名称",
  "propro.public_standard_library_detail_library_type": "库类型",
  "propro.public_standard_library_detail_generator": "Generator",
  "propro.public_standard_library_detail_protein_count": "蛋白质数目",
  "propro.public_standard_library_detail_unique_protein_count":
    "Unique 蛋白质数目",
  "propro.public_standard_library_detail_deweight_protein_count":
    "Library 去除蛋白数目",
  "propro.public_standard_library_detail_peptide_count": "肽段数目",
  "propro.public_standard_library_detail_unique_peptide_count":
    "Unique 肽段数目",
  "propro.public_standard_library_detail_deweight_peptide_count":
    "Library 去除真肽段数目",
  "propro.public_standard_library_detail_fastade_weight_protein_count":
    "Fasta 去除蛋白数目",
  "propro.public_standard_library_detail_fastade_weight_peptide_count":
    "Fasta去除真肽段数目",
  "propro.public_standard_library_detail_description": "详情描述",
  "propro.public_standard_library_detail_creator": "创建者",
  "propro.public_standard_library_detail_create_time": "创建时间",
  "propro.public_standard_library_detail_last_modify_time": "最后修改时间",
  "propro.public_standard_library_detail_peptide_analyse": "肽段分析",
  "propro.public_standard_library_detail_peptide_link": "查看肽段",
  "propro.public_standard_library_detail_re_statistic_analyse":
    "重新统计蛋白质与肽段的数目",
  "propro.public_standard_library_detail_generating_pseudopeptides":
    "生成伪肽段",
  "propro.public_standard_library_detail_delete_pseudopeptides": "删除伪肽段",
  "propro.public_standard_library_detail_modify": "修改",
  "propro.public_standard_library_detail_delete": "删除",
  "propro.public_standard_library_detail_running": "运行",
  "propro.public_standard_library_detail_success": "成功",
  "propro.public_standard_library_detail_failed": "失败",
  "propro.public_standard_library_detail_delete_warning": "确认删除该标准库",
  "propro.public_standard_library_detail_delete_by_id": "删除标准库",
  "propro.public_standard_library_detail_peptide_list": "肽段列表",
  "propro.public_standard_library_detail_protein_list": "蛋白质列表",

  // irt 库 详情页面
  "propro.irt_standard_library_detail_title": "IRT 校准库详情页",
  "propro.irt_standard_library": "IRT 校准库",
  "propro.irt_standard_library_detail_id": "校准库ID",
  "propro.irt_standard_library_detail_name": "校准库名称",
  "propro.irt_standard_library_detail_library_type": "库类型",
  "propro.irt_standard_library_detail_generator": "Generator",
  "propro.irt_standard_library_detail_protein_count": "蛋白质数目",
  "propro.irt_standard_library_detail_unique_protein_count":
    "Unique 蛋白质数目",
  "propro.irt_standard_library_detail_deweight_protein_count":
    "Library 去除蛋白数目",
  "propro.irt_standard_library_detail_peptide_count": "肽段数目",
  "propro.irt_standard_library_detail_unique_peptide_count": "Unique 肽段数目",
  "propro.irt_standard_library_detail_deweight_peptide_count":
    "Library 去除真肽段数目",
  "propro.irt_standard_library_detail_fastade_weight_protein_count":
    "Fasta 去除蛋白数目",
  "propro.irt_standard_library_detail_fastade_weight_peptide_count":
    "Fasta去除真肽段数目",
  "propro.irt_standard_library_detail_description": "详情描述",
  "propro.irt_standard_library_detail_creator": "创建者",
  "propro.irt_standard_library_detail_create_time": "创建时间",
  "propro.irt_standard_library_detail_last_modify_time": "最后修改时间",
  "propro.irt_standard_library_detail_peptide_analyse": "肽段分析",
  "propro.irt_standard_library_detail_peptide_link": "查看肽段",
  "propro.irt_standard_library_detail_re_statistic_analyse":
    "重新统计蛋白质与肽段的数目",
  "propro.irt_standard_library_detail_generating_pseudopeptides": "生成伪肽段",
  "propro.irt_standard_library_detail_delete_pseudopeptides": "删除伪肽段",
  "propro.irt_standard_library_detail_modify": "修改",
  "propro.irt_standard_library_detail_delete": "删除",
  "propro.irt_standard_library_detail_running": "运行",
  "propro.irt_standard_library_detail_success": "成功",
  "propro.irt_standard_library_detail_failed": "失败",
  "propro.irt_standard_library_detail_delete_warning": "确认删除该校准库",
  "propro.irt_standard_library_detail_delete_by_id": "删除校准库",
  "propro.irt_standard_library_detail_peptide_list": "肽段列表",
  "propro.irt_standard_library_detail_protein_list": "蛋白质列表",

  // 公共 irt 库 详情
  "propro.public_irt_standard_library_detail_title": "公共 IRT 校准库详情页",
  "propro.public_irt_standard_library": "公共 IRT 校准库",
  "propro.public_irt_standard_library_detail_id": "校准库ID",
  "propro.public_irt_standard_library_detail_name": "校准库名称",
  "propro.public_irt_standard_library_detail_library_type": "库类型",
  "propro.public_irt_standard_library_detail_generator": "Generator",
  "propro.public_irt_standard_library_detail_protein_count": "蛋白质数目",
  "propro.public_irt_standard_library_detail_unique_protein_count":
    "Unique 蛋白质数目",
  "propro.public_irt_standard_library_detail_deweight_protein_count":
    "Library 去除蛋白数目",
  "propro.public_irt_standard_library_detail_peptide_count": "肽段数目",
  "propro.public_irt_standard_library_detail_unique_peptide_count":
    "Unique 肽段数目",
  "propro.public_irt_standard_library_detail_deweight_peptide_count":
    "Library 去除真肽段数目",
  "propro.public_irt_standard_library_detail_fastade_weight_protein_count":
    "Fasta 去除蛋白数目",
  "propro.public_irt_standard_library_detail_fastade_weight_peptide_count":
    "Fasta去除真肽段数目",
  "propro.public_irt_standard_library_detail_description": "详情描述",
  "propro.public_irt_standard_library_detail_creator": "创建者",
  "propro.public_irt_standard_library_detail_create_time": "创建时间",
  "propro.public_irt_standard_library_detail_last_modify_time": "最后修改时间",
  "propro.public_irt_standard_library_detail_peptide_analyse": "肽段分析",
  "propro.public_irt_standard_library_detail_peptide_link": "查看肽段",
  "propro.public_irt_standard_library_detail_re_statistic_analyse":
    "重新统计蛋白质与肽段的数目",
  "propro.public_irt_standard_library_detail_generating_pseudopeptides":
    "生成伪肽段",
  "propro.public_irt_standard_library_detail_delete_pseudopeptides":
    "删除伪肽段",
  "propro.public_irt_standard_library_detail_modify": "修改",
  "propro.public_irt_standard_library_detail_delete": "删除",
  "propro.public_irt_standard_library_detail_running": "运行",
  "propro.public_irt_standard_library_detail_success": "成功",
  "propro.public_irt_standard_library_detail_failed": "失败",
  "propro.public_irt_standard_library_detail_delete_warning":
    "确认删除该校准库",
  "propro.public_irt_standard_library_detail_delete_by_id": "删除校准库",
  "propro.public_irt_standard_library_detail_peptide_list": "肽段列表",
  "propro.public_irt_standard_library_detail_protein_list": "蛋白质列表",

  // 更新公共标准库
  "propro.public_standard_library_update_title": "更新公共标准库",
  "propro.public_standard_library_update_only_target_peptides":
    "仅录入真实肽段",
  "propro.public_standard_library_update_detail_description": "详情描述",
  "propro.public_standard_library_update_upload_csv_library":
    "请上传CSV/TraML格式的Library",
  "propro.public_standard_library_update_upload_file_description":
    "单击或拖动文件到此区域进行上传",
  "propro.public_standard_library_update_only_upload_peptide_list":
    "上传肽段列表",
  "propro.public_standard_library_update_submit": "更新",
  "propro.public_standard_library_update_success": "成功",
  "propro.public_standard_library_update_failed": "失败",
  "propro.public_standard_library_detail_delete_warning":
    "确认删除该公共标准库",
  "propro.public_standard_library_detail_delete_by_id": "删除公共标准库",

  // 更新标准库
  "propro.standard_library_update_title": "更新标准库",
  "propro.standard_library_update_only_target_peptides": "仅录入真实肽段",
  "propro.standard_library_update_detail_description": "详情描述",
  "propro.standard_library_update_upload_csv_library":
    "请上传CSV/TraML格式的Library",
  "propro.standard_library_update_upload_file_description":
    "单击或拖动文件到此区域进行上传",
  "propro.standard_library_update_only_upload_peptide_list": "上传肽段列表",
  "propro.standard_library_update_submit": "更新",
  "propro.standard_library_update_success": "成功",
  "propro.standard_library_update_failed": "失败",

  // 更新 irt 标准库
  "propro.irt_standard_library_update_title": "更新标准库",
  "propro.irt_standard_library_update_only_target_peptides": "仅录入真实肽段",
  "propro.irt_standard_library_update_detail_description": "详情描述",
  "propro.irt_standard_library_update_upload_csv_library":
    "请上传CSV/TraML格式的Library",
  "propro.irt_standard_library_update_upload_file_description":
    "单击或拖动文件到此区域进行上传",
  "propro.irt_standard_library_update_only_upload_peptide_list": "上传肽段列表",
  "propro.irt_standard_library_update_submit": "更新",
  "propro.irt_standard_library_update_success": "成功",
  "propro.irt_standard_library_update_failed": "失败",

  // 更新 公共 irt 标准库
  "propro.public_irt_standard_library_update_title": "更新标准库",
  "propro.public_irt_standard_library_update_only_target_peptides":
    "仅录入真实肽段",
  "propro.public_irt_standard_library_update_detail_description": "详情描述",
  "propro.public_irt_standard_library_update_upload_csv_library":
    "请上传CSV/TraML格式的Library",
  "propro.public_irt_standard_library_update_upload_file_description":
    "单击或拖动文件到此区域进行上传",
  "propro.public_irt_standard_library_update_only_upload_peptide_list":
    "上传肽段列表",
  "propro.public_irt_standard_library_update_submit": "更新",
  "propro.public_irt_standard_library_update_success": "成功",
  "propro.public_irt_standard_library_update_failed": "失败",

  // 标准库详情
  "propro.standard_library_detail_title": "标准库详情页",
  "propro.standard_library": "标准库",
  "propro.standard_library_detail_id": "标准库ID",
  "propro.standard_library_detail_name": "标准库名称",
  "propro.standard_library_detail_library_type": "库类型",
  "propro.standard_library_detail_generator": "Generator",
  "propro.standard_library_detail_protein_count": "蛋白质数目",
  "propro.standard_library_detail_unique_protein_count": "Unique 蛋白质数目",
  "propro.standard_library_detail_deweight_protein_count":
    "Library 去除蛋白数目",
  "propro.standard_library_detail_peptide_count": "肽段数目",
  "propro.standard_library_detail_unique_peptide_count": "Unique 肽段数目",
  "propro.standard_library_detail_deweight_peptide_count":
    "Library 去除真肽段数目",
  "propro.standard_library_detail_fastade_weight_protein_count":
    "Fasta 去除蛋白数目",
  "propro.standard_library_detail_fastade_weight_peptide_count":
    "Fasta去除真肽段数目",
  "propro.standard_library_detail_description": "详情描述",
  "propro.standard_library_detail_creator": "创建者",
  "propro.standard_library_detail_create_time": "创建时间",
  "propro.standard_library_detail_last_modify_time": "最后修改时间",
  "propro.standard_library_detail_peptide_analyse": "肽段分析",
  "propro.standard_library_detail_peptide_link": "查看肽段",
  "propro.standard_library_detail_re_statistic_analyse":
    "重新统计蛋白质与肽段的数目",
  "propro.standard_library_detail_generating_pseudopeptides": "生成伪肽段",
  "propro.standard_library_detail_delete_pseudopeptides": "删除伪肽段",
  "propro.standard_library_detail_modify": "修改",
  "propro.standard_library_detail_delete": "删除",
  "propro.standard_library_detail_running": "运行",
  "propro.standard_library_detail_success": "成功",
  "propro.standard_library_detail_failed": "失败",
  "propro.standard_library_detail_delete_warning": "确认删除该标准库",
  "propro.standard_library_detail_delete_by_id": "删除标准库",
  "propro.standard_library_detail_peptide_list": "肽段列表",
  "propro.standard_library_detail_protein_list": "蛋白质列表",

  // 创建标准库

  "propro.standard_library_create_title": "创建标准库",
  "propro.standard_library_detail_name": "标准库名称",
  "propro.standard_library_detail_library_type": "库类型",
  "propro.standard_library_detail_description": "详情描述",
  "propro.standard_library_create_upload_csv_library":
    "请上传CSV/TraML格式的Library",
  "propro.standard_library_create_upload_file_description":
    "单击或拖动文件到此区域进行上传",
  "propro.standard_library_create_only_upload_peptide_list": "上传肽段列表",
  "propro.standard_library_create_only_name": "标准库名称必须唯一",
  "propro.standard_library_create_submit": "创建",

  // 肽段列表页
  "propro.peptide_list_title": "肽段列表",
  "propro.peptide_list_library_information": "库信息",
  "propro.peptide_list_search": "查找",
  "propro.peptide_list_search_by_name_title": "查询库",
  "propro.peptide_list_search_by_name": "请输入库名称",
  "propro.peptide_list_name": "名称",
  "propro.peptide_list_id": "ID",
  "propro.peptide_list_total_numbers": "总记录",
  "propro.peptide_list_load_numbers": "已加载",
  "propro.peptide_list_search_time": "搜索用时",
  "propro.peptide_list_search_numbers": "搜索结果",
  "propro.peptide_list_see_detail": "查看详情",
  "propro.peptide_list_load_percentage": "加载进度",
  "propro.peptide_list_load_time": "查询时间",

  // 肽段列表详情
  "propro.peptide_detail_title": "肽段详情",

  // 蛋白质列表页
  "propro.protein_list_title": "蛋白质列表",
  "propro.protein_list_library_information": "库信息",
  "propro.protein_list_search": "查找",
  "propro.protein_list_search_by_name_title": "查询库",
  "propro.protein_list_search_by_name": "请输入库名称",
  "propro.protein_list_name": "名称",
  "propro.protein_list_id": "ID",
  "propro.protein_list_search_time": "搜索用时",
  "propro.protein_list_search_numbers": "搜索结果",
  "propro.protein_list_see_detail": "查看详情",
  "propro.protein_list_load_percentage": "加载进度",
  "propro.protein_list_total_numbers": "总记录",
  "propro.protein_list_load_time": "查询时间",

  // task list
  "propro.task_list_table_info": "任务信息",
  "propro.task_list_index": "No.",
  "propro.task_list_link_detail": "查看任务详情",
  "propro.task_list_load_time": "查询时间",
  "propro.task_list_name": "任务名称",
  "propro.task_list_id": "ID",
  "propro.task_list_title": "任务列表",
  "propro.task_list_status": "任务状态",
  "propro.task_list_task_template": "任务模板",
  "propro.task_list_reset": "重置",
  "propro.task_list_search": "搜索",
  "propro.task_list_create_date": "创建时间",
  "propro.task_list_running_total_time": "运行时间",
  "propro.task_list_last_modified_date": "最后修改时间",
  "propro.task_list_creator": "创建者",
  "propro.task_list_operation": "操作",
  "propro.task_list_operation_delete": "删除任务",
  "propro.task_list_delete_by_id_modal_warn": "确认删除该条任务",
  "propro.task_list_load_numbers": "已加载",
  "propro.task_list_total_numbers": "总记录",
  "propro.task_list_load_percentage": "加载进度",
  "propro.task_list_search_by_templates_title": "任务状态",
  "propro.task_list_search_by_templates_title_prompt": "指定任务状态",
  "propro.task_list_search": "查询任务",

  // 分析列表
  "propro.analysis_list_title": "分析概览",
  "propro.analysis_list_index": "No.",
  "propro.analysis_list_exp_name": "实验名称",
  "propro.analysis_list_view_experience": "查看实验",
  "propro.analysis_list_name": "分析代号",
  "propro.analysis_list_id": "分析概览ID",
  "propro.analysis_list_library_name": "标准库名称",
  "propro.analysis_list_exp_params": "实验参数",
  "propro.analysis_list_recognition_result": "识别结果",
  "propro.analysis_list_owner_name": "创建者",
  "propro.analysis_list_memorandum": "备忘录",
  "propro.analysis_list_all_times": "创建/更新时间",
  "propro.analysis_list_operation": "操作",
  "propro.analysis_list_report_tip": "分析报告",
  "propro.analysis_list_xic_tip": "XIC 数据",
  "propro.analysis_list_score_tip": "打分结果",
  "propro.analysis_list_identification_tip": "蛋白鉴定",
  "propro.analysis_list_export_tip": "导出已鉴定蛋白",
  "propro.analysis_list_delete_tip": "删除",
  "propro.analysis_list_create_time": "创建时间",
  "propro.analysis_list_update_time": "更新时间",
  "propro.analysis_list_search": "搜索",
  "propro.analysis_list_reset": "重置",
  "propro.analysis_list_delete_warning": "确认删除该条数据?",
  "propro.analysis_list_query_project_name": "查询实验列表",

  // 分析详情
  "propro.analysis_detail_title": "分析报告",
  "propro.analysis_detail_id": "ID",
  "propro.analysis_detail_analyse_code": "分析代号",
  "propro.analysis_detail_experiment_name": "实验 ID",
  "propro.analysis_detail_association_library_name": "关联标准库",
  "propro.analysis_detail_rz_mz": "mz/RT XIC窗口",
  "propro.analysis_detail_slope_intercept": "斜率/截距",
  "propro.analysis_detail_sigma_spacing": "Sigma/Spacing",
  "propro.analysis_detail_peptide_recognized_ratio": "肽段识别比例",
  "propro.analysis_detail_creator": "创建者",
  "propro.analysis_detail_create_time": "创建时间",
  "propro.analysis_detail_update_time": "更新时间",
  "propro.analysis_detail_peakgroup_count": "PeakGroup数目",
  "propro.analysis_detail_fdr": "FDR",
  "propro.analysis_detail_proteins_count": "蛋白质数目",
  "propro.analysis_detail_pp_rate": "PP Rate",
  "propro.analysis_detail_pp_rate_library": "PP Rate of Library",
  "propro.analysis_detail_operation": "操作",
  "propro.analysis_detail_feature_scores_weights": "特征分数 权重",
  "propro.analysis_detail_feature_scores_weights_index": "No",
  "propro.analysis_detail_feature_scores_weights_type": "特征分数类型",
  "propro.analysis_detail_feature_scores_weights_weights": "特征分数权重",
  "propro.analysis_detail_search": "搜索",
  "propro.analysis_detail_reset": "重置",

  // analysis xic 2019-9-24 19:55:58
  "propro.analysis_xic_title": "XIC 数据",
  "propro.analysis_xic_id": "ID",
  "propro.analysis_xic_experiment_name": "实验ID",
  "propro.analysis_xic_analyse_code": "分析代号",
  "propro.analysis_xic_association_library_name": "关联标准库",
  "propro.analysis_xic_rz_mz": "mz/RT XIC窗口",
  "propro.analysis_xic_slope_intercept": "斜率/截距",
  "propro.analysis_xic_sigma_spacing": "Sigma/Spacing",
  "propro.analysis_xic_peptide_recognized_ratio": "肽段识别比例",
  "propro.analysis_xic_creator": "创建者",
  "propro.analysis_xic_create_time": "创建时间",
  "propro.analysis_xic_update_time": "更新时间",
  "propro.analysis_xic_peakgroup_count": "PeakGroup数目",
  "propro.analysis_xic_fdr": "FDR",
  "propro.analysis_xic_proteins_count": "蛋白质数目",
  "propro.analysis_xic_list_load_time": "查询时间",
  "propro.analysis_xic_list_load_numbers": "已加载",
  "propro.analysis_xic_list_total_numbers": "总记录",
  "propro.analysis_xic_list_load_percentage": "加载进度",
  "propro.analysis_xic_list_operation_buttons": "操作",
  "propro.analysis_xic_list_delete": "删除",
  "propro.analysis_xic_list_search": "查找",
  "propro.analysis_xic_search": "搜索",
  "propro.analysis_xic_reset": "重置",
  "propro.analysis_xic_list_search": "查找",
  "propro.analysis_xic_list_index": "No",
  "propro.analysis_xic_list_protein_name": "蛋白质名称",
  "propro.analysis_xic_list_peptide_name": "肽段全称",
  "propro.analysis_xic_list_is_decoy": "是否伪肽段",
  "propro.analysis_xic_ion_fragment": "离子片段",
  "propro.analysis_xic_ion_fracture_mark": "断裂标记",
  "propro.analysis_xic_ion_fragment_charge_ratio": "碎片荷质比",
  "propro.analysis_xic_list_operation": "操作",
  "propro.analysis_xic_list_peptide_clinic": "肽段诊所",
  "propro.analysis_xic_list_operation_delete": "删除数据",

  // 打分数据
  "propro.analysis_score_title": "打分数据",
  "propro.analysis_score_id": "ID",
  "propro.analysis_score_analyse_code": "分析代号",
  "propro.analysis_score_association_library_name": "关联标准库",
  "propro.analysis_score_creator": "负责人",
  "propro.analysis_score_create_time": "创建时间",
  "propro.analysis_score_update_time": "更新时间",
  "propro.analysis_score_fdr": "FDR",
  "propro.analysis_score_list_load_time": "查询时间",
  "propro.analysis_score_list_load_numbers": "已加载",
  "propro.analysis_score_list_total_numbers": "总页数",
  "propro.analysis_score_list_load_percentage": "加载进度",
  "propro.analysis_score_search": "搜索",
  "propro.analysis_score_reset": "重置",
  "propro.analysis_score_list_search": "查找",
  "propro.analysis_score_list_index": "No",
  "propro.analysis_score_list_predict_result": "预测结果",
  "propro.analysis_score_list_predict_rt": "预测RT",
  "propro.analysis_score_list_decoy_target": "Decoy/Target",
  "propro.analysis_score_list_operation": "操作",
  "propro.analysis_score_list_view_data": "查看详情",
  "propro.analysis_score_list_data_detail": "数据详情",
  "propro.analysis_score_list_is_decoy": "Decoy",
  "propro.analysis_score_list_is_target": "Target",
  "propro.analysis_score_list_fdr": "FDR",

  // 蛋白鉴定
  "propro.analysis_protein_identification_title": "蛋白鉴定",
  "propro.analysis_protein_identification_id": "ID",
  "propro.analysis_protein_identification_analyse_code": "分析代号",
  "propro.analysis_protein_identification_association_library_name":
    "关联标准库",
  "propro.analysis_protein_identification_creator": "负责人",
  "propro.analysis_protein_identification_fdr": "FDR",
  "propro.analysis_protein_identification_create_time": "创建时间",
  "propro.analysis_protein_identification_update_time": "更新时间",
  "propro.analysis_protein_identification_list_load_time": "查询时间",
  "propro.analysis_protein_identification_list_load_numbers": "已加载",
  "propro.analysis_protein_identification_list_total_numbers": "总页数",
  "propro.analysis_protein_identification_list_load_percentage": "加载进度",
  "propro.analysis_protein_identification_search": "搜索",
  "propro.analysis_protein_identification_reset": "重置",
  "propro.analysis_protein_identification_list_search": "查找",
  "propro.analysis_protein_identification_list_operation_buttons": "操作",
  "propro.analysis_protein_identification_list_delete": "删除",
  "propro.analysis_protein_identification_list_delete_warning":
    "确认删除该条数据?",
  "propro.analysis_protein_identification_list_index": "NO.",
  "propro.analysis_protein_identification_list_protein_name": "蛋白名称",
  "propro.analysis_protein_identification_list_data": "数据",
  "propro.analysis_protein_identification_data_index": "No.",
  "propro.analysis_protein_identification_data_peptide_ref_name": "肽段全称",
  "propro.analysis_protein_identification_data_fdr": "FDR",
  "propro.analysis_protein_identification_data_identified_status": "状态",
  "propro.analysis_protein_identification_data_intensity_sum": "Intensity",
  "propro.analysis_protein_identification_data_operation": "操作",
  "propro.analysis_protein_identification_data_peptide_diagnosis": "肽段诊断",
  "propro.analysis_protein_identification_data_view_data": "数据详情",

  // experiment_list_title
  "propro.experiment_list_title": "实验数据列表",
  "propro.experiment_list_search": "搜索",
  "propro.experiment_list_reset": "重置",
  "propro.experiment_list_index": "No.",
  "propro.experiment_list_project_name": "项目名称",
  "propro.experiment_list_experiment_name": "实验名称",
  "propro.experiment_list_experiment_id": "实验ID",
  "propro.experiment_list_experiment_type": "实验类型",
  "propro.experiment_list_experiment_aird_size": "Aird Size",
  "propro.experiment_list_experiment_vendor_file_size": "厂商文件大小",
  "propro.experiment_list_experiment_window_ranges_size": "窗口数目",
  "propro.experiment_list_experiment_irt_result": "Irt 识别结果",
  "propro.experiment_list_experiment_last_modified_date": "最新更新时间",
  "propro.experiment_list_experiment_operation": "操作",
  "propro.experiment_list_experiment_operation_detail": "详情",
  "propro.experiment_list_experiment_operation_list": "分析列表",
  "propro.experiment_list_experiment_operation_modify": "修改",
  "propro.experiment_list_experiment_operation_irt": "计算irt",
  "propro.experiment_list_experiment_operation_process": "批量执行",
  "propro.experiment_list_experiment_detail": "实验详情",

  // 实验详情
  "propro.experiment_detail_title": "实验详情",
  "propro.experiment_detail_create_time": "创建时间",
  "propro.experiment_detail_last_modify_time": "更新时间",
  "propro.experiment_detail_swtach_data_detail": "Swatch 窗口数据详情",
  "propro.experiment_detail_list_delete_warning": "确定删除该实验数据?",
  "propro.experiment_detail_list_operation_delete": "删除实验数据",
  "propro.experiment_detail_list_operation_delete_undo": "撤销删除实验数据",
  "propro.experiment_detail_notification_operation_delete_description":
    "正在删除实验数据",

  // 更新实验数据
  "propro.experiment_update_title": "更新实验数据",
  "propro.experiment_edit_create_time": "创建时间",
  "propro.experiment_edit_last_modify_time": "更新时间",
  "propro.experiment_edit_swtach_data_detail": "Swatch 窗口数据详情",
  "propro.experiment_edit_slope": "斜率",
  "propro.experiment_edit_intercept": "截距",
  "propro.experiment_edit_description": "详情描述",
  "propro.experiment_edit_features": "特征字段",
  "propro.experiment_edit_list_delete_warning": "确定删除该实验数据?",
  "propro.experiment_edit_list_operation_delete": "删除实验数据",
  "propro.experiment_edit_list_operation_delete_undo": "撤销删除实验数据",
  "propro.experiment_edit_notification_operation_delete_description":
    "正在删除实验数据",

  // 项目列表
  "propro.project_list_title": "项目列表",
  "propro.project_list_table_index": "No.",
  "propro.project_list_project_name": "项目名称",
  "propro.project_list_search": "搜索",
  "propro.project_list_reset": "重置",
  "propro.project_list_table_project_name": "项目名称",
  "propro.project_list_table_view_experiment": "查看实验",
  "propro.project_list_table_experiment_type": "实验类型",
  "propro.project_list_table_project_repository": "项目仓库",
  "propro.project_list_table_owner_name": "负责人",
  "propro.project_list_table_default_irt_library": "默认irt校准库",
  "propro.project_list_table_update_time": "更新时间",
  "propro.project_list_table_create_time": "创建时间",
  "propro.project_list_table_operation": "操作",
  "propro.project_list_table_operation_scanning_update": "扫描更新",
  "propro.project_list_table_operation_file_management": "文件管理",
  "propro.project_list_table_operation_modify": "修改",
  "propro.project_list_table_operation_irt": "计算irt",
  "propro.project_list_table_operation_process": "批量执行",
  "propro.project_list_table_operation_view_result": "查看结果",
  "propro.project_list_table_operation_output_file": "下载结果",
  "propro.project_list_table_operation_delete": "删除",
  "propro.project_list_scanning_update_is_null": "没有扫描到新实验",

  // filemanager 文件管理
  "propro.project_filemanager_title": "文件管理",

  // project_modify
  "propro.project_modify_title": "更新项目",
  "propro.project_modify_update": "更新",

  "propro.end": "end"
};

export default language_ch;
