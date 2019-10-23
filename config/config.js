export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true,
        locale: {
          enable: true
        },
        dva: true
      }
    ]
  ],

  routes: [
    {
      path: "/login",
      component: "../layout/LoginLayout",
      routes: [
        {
          path: "/login",
          component: "propro/login"
        }
      ]
    }
    // {
    //   path: "/",
    //   component: "../layout/BasicLayout",
    //   routes: [
    //     // 首页默认切换到控制台 首页还没有制作
    //     {
    //       path: "/",
    //       component: "propro/dashboard/console"
    //     },
    //     {
    //       path: "/console",
    //       component: "propro/dashboard/console"
    //     },
    //     {
    //       path: "/home",
    //       component: "propro/dashboard/home"
    //     },
    //     {
    //       path: "/login",
    //       component: "propro/login"
    //     },
    //     {
    //       path: "/user/setting",
    //       component: "propro/user/setting"
    //     },
    //     {
    //       path: "/error/login",
    //       component: "propro/error/login"
    //     },
    //     {
    //       path: "/public_standard_library/list",
    //       component: "propro/public_standard_library/list"
    //     },
    //     {
    //       path: "/public_standard_library/detail/*",
    //       component: "propro/public_standard_library/detail"
    //     },
    //     {
    //       // 显示标准库 指定id的 详情 * id
    //       path: "/standard_library/detail/*",
    //       component: "propro/standard_library/detail"
    //     },
    //     {
    //       // 更新IRT标准库 指定id的 详情 * id_name
    //       path: "/irt_standard_library/update/*",
    //       component: "propro/irt_standard_library/update"
    //     },
    //     {
    //       path: "/public_irt_standard_library/list",
    //       component: "propro/public_irt_standard_library/list"
    //     },
    //     {
    //       path: "/public_irt_standard_library/detail/*",
    //       component: "propro/public_irt_standard_library/detail"
    //     },
    //     {
    //       path: "/public_irt_standard_library/update/*",
    //       component: "propro/public_irt_standard_library/update"
    //     },
    //     {
    //       // 更新公共标准库 指定id * id_name
    //       path: "/public_standard_library/update/*",
    //       component: "propro/public_standard_library/update"
    //     },
    //     {
    //       // 更新标准库 指定id * id_name
    //       path: "/standard_library/update/*",
    //       component: "propro/standard_library/update"
    //     },
    //     {
    //       path: "/standard_library_create",
    //       component: "propro/library/standard_library_create"
    //     },
    //     {
    //       // 肽段列表 指定id * id
    //       path: "/peptide/list/*",
    //       component: "propro/peptide/list"
    //     },
    //     {
    //       // 肽段列表 指定id和 peptideRef * id * ref
    //       path: "/peptide/list_ref/*/ref/*",
    //       component: "propro/peptide/list"
    //     },
    //     {
    //       // 肽段列表详情 id 第一个* 肽段列表的id 第二个* 肽段列表里面的详情的id
    //       path: "/peptide/detail/*/*",
    //       component: "propro/peptide/detail"
    //     },
    //     {
    //       // 蛋白质列表 指定库的id * id
    //       path: "/protein/list/*",
    //       component: "propro/protein/list"
    //     },
    //     {
    //       // 肽段列表详情 id 第一个* 肽段列表的id 第二个* 肽段列表里面的详情的id
    //       path: "/protein/detail/*/*",
    //       component: "propro/protein/detail"
    //     },
    //     {
    //       // irt 标准库 列表
    //       path: "/irt_standard_library/list",
    //       component: "propro/irt_standard_library/list"
    //     },
    //     {
    //       // irt 标准库 列表
    //       path: "/irt_standard_library/detail/*",
    //       component: "propro/irt_standard_library/detail"
    //     },
    //     {
    //       // 标准库 列表
    //       path: "/standard_library/list",
    //       component: "propro/standard_library/list"
    //     },
    //     {
    //       // 任务 列表
    //       path: "/task/list",
    //       component: "propro/task/list"
    //     },
    //     {
    //       // 分析 列表
    //       path: "/analysis/list",
    //       component: "propro/analysis/list"
    //     },
    //     {
    //       // 分析 列表 指定 exp_id
    //       path: "/analysis/list_exp_id/*",
    //       component: "propro/analysis/list"
    //     },
    //     {
    //       // 分析 详情
    //       path: "/analysis/detail/*",
    //       component: "propro/analysis/detail"
    //     },
    //     {
    //       // 分析 详情
    //       path: "/analysis/xic/*",
    //       component: "propro/analysis/xic"
    //     },
    //     {
    //       // 打分数据
    //       path: "/analysis/score/*",
    //       component: "propro/analysis/score"
    //     },
    //     {
    //       // 蛋白鉴定结果
    //       path: "/analysis/protein_identification/*",
    //       component: "propro/analysis/protein_identification"
    //     },
    //     {
    //       // 实验列表 默认打开全部
    //       path: "/experiment/list/*",
    //       component: "propro/experiment/list"
    //     },
    //     {
    //       // 实验列表 查询指定的 project name
    //       path: "/experiment/list_project_name/*",
    //       component: "propro/experiment/list"
    //     },
    //     {
    //       // 实验列表 查询指定的 type
    //       path: "/experiment/list_type/*",
    //       component: "propro/experiment/list"
    //     },
    //     {
    //       // 实验列表详情
    //       path: "/experiment/detail/*",
    //       component: "propro/experiment/detail"
    //     },
    //     {
    //       // 编辑实验列表
    //       path: "/experiment/edit/*",
    //       component: "propro/experiment/edit"
    //     },
    //     {
    //       // 查看 项目列表
    //       path: "/project/list",
    //       component: "propro/project/list"
    //     },
    //     {
    //       // 修改 项目列表 modify * id
    //       path: "/project/modify/*",
    //       component: "propro/project/modify"
    //     },
    //     {
    //       // 查看 项目列表 文件管理 * 项目名称
    //       path: "/project/filemanager/*",
    //       component: "propro/project/filemanager"
    //     }
    //   ]
    // }
  ],
  // 设置转发
  proxy: {
    "/propro_server": {
      target: "http://localhost:805/",
      // 去掉头部
      pathRewrite: { "^/propro_server": "" },
      changeOrigin: true
    }
  },

  // 配置主题
  theme: {
    // "@primary-color": "#30b767",
    "@primary-color": "#47bac1",
    "@layout-body-background": "#f5f9fc"
  }
};
