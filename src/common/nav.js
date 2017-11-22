import dynamic from 'dva/dynamic'
import checkWork from 'ROUTE/PersonalAffairs/checkWork'
import basic from 'LAYOUT/BasicLayout.js'
// const dynamicWrapper = (app, models, component) => dynamic({
//     app,
//     models: () => models.map(m => import(`../models/${m}.js`)),
//     component
// })

export const getNavData = {
    // {
        // component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayouts')),
        // layout: 'BasicLayout',
    name: '首页',
    path: '/',
    component: checkWork,
    indeRoute: {component: basic}
    // indexRoute: [
    //     {
    //         name: '个人事务管理',
    //         path: 'personalAffairs',
    //         childRoutes: [
    //             {
    //                 name: '考勤',
    //                 path: 'checkWork',
    //                 component: checkWork
    //             }
    //             // {
    //             //     name: '每日日志',
    //             //     path: 'dayLog',
    //             //     component: dynamicWrapper(app, ['personalAffairs'], () => import('../routes/PersonalAffairs/dayLog'))
    //             // },
    //             // {
    //             //     name: '工作量',
    //             //     path: 'effort',
    //             //     component: dynamicWrapper(app, ['personalAffairs'], () => import('../routes/PersonalAffairs/effort'))
    //             // },
    //             // {
    //             //     name: '周总结',
    //             //     path: 'weekSummary',
    //             //     component: dynamicWrapper(app, ['personalAffairs'], () => import('../routes/PersonalAffairs/weekSummary'))
    //             // },
    //             // {
    //             //     name: '个人信息',
    //             //     path: 'personalInfo',
    //             //     component: dynamicWrapper(app, ['personalAffairs'], () => import('../routes/PersonalAffairs/personalInfo'))
    //             // }
    //         ]
    //     }
    //     // {
    //     //     name: '项目管理',
    //     //     path: 'project',
    //     //     children: [
    //     //         {
    //     //             name: '项目信息',
    //     //             path: 'projectInfo',
    //     //             component: dynamicWrapper(app, ['projectManage'], () => import('../routes/ProjectManage/projectInfo'))
    //     //         },
    //     //         {
    //     //             name: '项目申请管理',
    //     //             path: 'projectApply',
    //     //             component: dynamicWrapper(app, ['projectManage'], () => import('../routes/ProjectManage/projectApply'))
    //     //         },
    //     //         {
    //     //             name: '分配管理',
    //     //             path: 'projectDistribute',
    //     //             component: dynamicWrapper(app, ['projectManage'], () => import('../routes/ProjectManage/projectDistribute'))
    //     //         },
    //     //         {
    //     //             name: '工作日志',
    //     //             path: 'workLog',
    //     //             component: dynamicWrapper(app, ['projectManage'], () => import('../routes/ProjectManage/workLog'))
    //     //         }
    //     //     ]
    //     // },
    //     // {
    //     //     name: '人事管理',
    //     //     path: 'workers',
    //     //     children: [
    //     //         {
    //     //             name: '人员管理',
    //     //             path: 'workerAffairs',
    //     //             component: dynamicWrapper(app, ['workerAffairs'], () => import('../routes/WorkerAffairs/workerAffairs'))
    //     //         },
    //     //         {
    //     //             name: '合同管理',
    //     //             path: 'contract',
    //     //             component: dynamicWrapper(app, ['workerAffairs'], () => import('../routes/WorkerAffairs/contract'))
    //     //         },
    //     //         {
    //     //             name: '招聘管理',
    //     //             path: 'recruit',
    //     //             component: dynamicWrapper(app, ['workerAffairs'], () => import('../routes/WorkerAffairs/recruit'))
    //     //         },
    //     //         {
    //     //             name: '考勤管理',
    //     //             path: 'checkWorkers',
    //     //             component: dynamicWrapper(app, ['workerAffairs'], () => import('../routes/WorkerAffairs/checkWorkers'))
    //     //         }
    //     //     ]
    //     // },
    //     // {
    //     //     name: '资产管理',
    //     //     path: 'property',
    //     //     children: [
    //     //         {
    //     //             name: '设备管理',
    //     //             path: 'device',
    //     //             component: dynamicWrapper(app, ['propertyManage'], () => import('../routes/PropertyManage/device'))
    //     //         },
    //     //         {
    //     //             name: '办公用品管理',
    //     //             path: 'stationary',
    //     //             component: dynamicWrapper(app, ['propertyManage'], () => import('../routes/PropertyManage/stationary'))
    //     //         },
    //     //         {
    //     //             name: '图书管理',
    //     //             path: 'books',
    //     //             component: dynamicWrapper(app, ['propertyManage'], () => import('../routes/PropertyManage/books'))
    //     //         }
    //     //     ]
    //     // },
    //     // {
    //     //     name: '任务管理',
    //     //     path: 'task',
    //     //     children: [
    //     //         {
    //     //             name: '任务信息',
    //     //             path: 'taskInfo',
    //     //             component: dynamicWrapper(app, ['taskManage'], () => import('../routes/TaskManage/taskInfo'))
    //     //         },
    //     //         {
    //     //             name: '历史任务',
    //     //             path: 'historyTask',
    //     //             component: dynamicWrapper(app, ['taskManage'], () => import('../routes/TaskManage/historyTask'))
    //     //         }
    //     //     ]
    //     // },
    //     // {
    //     //     name: '系统设置',
    //     //     path: 'setting',
    //     //     children: [
    //     //         {
    //     //             name: '主题设置',
    //     //             path: 'taskInfo',
    //     //             component: dynamicWrapper(app, ['setting'], () => import('../routes/Setting/taskInfo'))
    //     //         },
    //     //         {
    //     //             name: '修改密码',
    //     //             path: 'modifyPsw',
    //     //             component: dynamicWrapper(app, ['setting'], () => import('../routes/Setting/modifyPsw'))
    //     //         },
    //     //         {
    //     //             name: '权限分配',
    //     //             path: 'permission',
    //     //             component: dynamicWrapper(app, ['setting'], () => import('../routes/Setting/permission'))
    //     //         },
    //     //         {
    //     //             name: '操作日志',
    //     //             path: 'operateLog',
    //     //             component: dynamicWrapper(app, ['setting'], () => import('../routes/Setting/operateLog'))
    //     //         }
    //     //     ]
    //     // }
    // ]
    // }
    // {
    //     component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    //     path: '/user',
    //     layout: 'UserLayout',
    //     children: [
    //         {
    //             name: '登录',
    //             path: 'login',
    //             component: dynamicWrapper(app, ['login'])
    //         }
    //     ]
    // }
}
