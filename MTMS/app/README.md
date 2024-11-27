**智慧医教移动端护培、药培、专培、技师、全科h5应用 **

## 工程结构
``` bash
MTMS 前端 - 两个项目
├── trainingsystem -- pc管理端
└── app            -- 移动端

MTMS/app/src  移动端主要逻辑代码
├── assets     -- 移动端使用到的图片,第三方js文件,样式文件
├── components -- 移动端公用组件
├── config     -- 移动端js配置文件
├── filter     -- 过滤器(没有什么用)
├── fonts      -- 字体
├── router     -- 移动端路由配置
├── scss       -- 一些样式重置文件
├── views      -- 移动端页面
├── vuex       -- 不推荐把存储的数据存入vuex中,推荐路由携带或者本地可以方便的对接代办事项

```

## 移动端技术选型
| 技术       | 说明                    | 官网                                   |
| ---------- | --------------------- | -------------------------------------- |
| Vue        | 前端框架                 | https://vuejs.org/                     |
| Vue-router | 路由框架              | https://router.vuejs.org/              |
| Vuex       | 全局状态管理框架    | https://vuex.vuejs.org/                |
| Element    | 前端UI框架            | https://element.eleme.cn/#/zh-CN/   |
| vant   | 前端UI框架                   | https://vant-contrib.gitee.io/vant/v2/#/zh-CN/  |
| echarts   | 图表UI框架               | https://echarts.apache.org/zh/index.html/  |
| Axios      | 前端HTTP框架          | https://github.com/axios/axios/         |
| jquery  | jquery                        | https://jquery.com/ |
| moment  | 时间管理工具            | https://momentjs.bootcss.com/  |
| core-js | ES兼容工具                 | https://overturejs.com/docs/core/Core.html/  |
| Buffer | 缓冲模块                      |  |

## 系统架构图
#### 等待产品补充
## 业务架构图
#### 等待产品补充
## 模块介绍
#### 等待产品补充
## 开发进度
http://192.168.2.49/%E6%99%BA%E6%85%A7%E5%8C%BB%E6%95%99.html
## 项目启动
``` bash
# 进入app项目
cd app

# 安装依赖
npm install

# 启动
npm run serve

# 打包
npm run build

```
## 本地调试
> 进入移动端系统
-    打开管理端页面http://localhost:8080/mpg/index.html#/
-    登录
-    新增一个窗口
-    打开移动端页面http://localhost:8080/pages/futuredoctorapp/index.html/#/wxIndex
-    本地调试-[本地调试](https://gitee.com/chenjiaweiZzz/graduation-project/raw/master/mini/images/Snipaste_2024-01-06_10-50-34.png)
-    !移动端首页是由住培进入,护培(其他培)的首页只是调试用,不应该暴露出去

## 快速的访问
http://localhost:8080/escortapp/#/:escort/comprehensive/list  个人综合考评   
http://localhost:8080/escortapp/#/:escort/caseReview/caseReviewHome  病历审核
http://localhost:8080/escortapp/#/:escort/graduateSummary/directorAppraisal 科主任出科鉴定
http://localhost:8080/escortapp/#/:escort/rt/rotation_doctor  护培轮转-护培生(住培轮转-住院医)   
http://localhost:8080/escortapp/#/:escort/rt/rotation_teacher  护培轮转-分带教(住培轮转-带教老师)
http://localhost:8080/escortapp/#/:escort/rt/rotation_secretary 护培轮转-总带教(住培轮转-科秘书)
http://localhost:8080/escortapp/#/:escort/rt/rotation_nurse 护培轮转-护士长
http://localhost:8080/escortapp/#/:escort/rotation_director/rotation_secretary 护培轮转-科主任
http://localhost:8080/escortapp/#/:escort/admin_report_check 护培轮转-护理部(住培轮转-管理者)
http://localhost:8080/escortapp/#/:escort/registration/secretary_signup 出科报名审核
http://localhost:8080/escortapp/#/:escort/inspection_List 巡查评分
http://localhost:8080/escortapp/#/:escort/attendance/main 考勤管理
http://localhost:8080/escortapp/#/:escort/tatistical/main 统计分析-护培
http://localhost:8080/escortapp/#/:escort/baseAudit/list  个人综合考评-基地
http://localhost:8080/escortapp/#/:escort/officeAudit/list 个人综合考评-教办
http://localhost:8080/escortapp/#/:escort/extranceExam/list 出科考核
http://localhost:8080/escortapp/#/:escort/turnManual/checkTeaList 轮转手册审核
http://localhost:8080/escortapp/#/:escort/overseer/grade 督导评分
http://localhost:8080/escortapp/#/:escort/overseer/couple_back 督导反馈
http://localhost:8080/escortapp/#/:escort/action/main/list 教学活动计划

## 权限配置
| 护培轮转-总带教      | 权限标识                   |
| -------------------- | -------------------------- |
| 待入科：入科确认     | app:wait:confirmInDept     |
| 轮转中：分配带教老师 | app:run:assignTeacher      |
| 轮转中：出科         | app:run:confirmOutDept     |
| 轮转中：出科考核     | app:run:outDeptTest        |
| 待出科：出科条件审核 | app:outwait:review         |
| 待出科：出科         | app:outwait:confirmOutDept |
| 待出科：出科考核     | app:outwait:outDeptTest    |
| 待出科：修改带教老师 | app:outwait:assignTeacher  |

| 教学活动计划 | 权限标识                    |
| ------------ | --------------------------- |
| 新增教学活动 | baseplat:app:addTeachActive |

| 出科考核        | 权限标识                    |
| -------------------- | --------------------------- |
| 出科考核：新增         | app:outDeptTest |

# create by Jern Chan 2023/11/4
# update by Jern Chan 2024/1/6
