<template>
  <div class="teachingPlan-self">
    <!--弹窗111-->
    <el-dialog title="查看教学活动计划" :visible.sync="isShow" size="small" class="class-activit" :close-on-click-modal="false"
      @close="closeDialog()" :class="{'overdialog':activeplandialog}">
      <el-form :model="dialogForm" label-width="80px" style="height: 100%">
        <div class="detailfromtop">
          <el-button @click="quitpdf" type="primary" style="height: 32px;margin-top: 10px;">导出PDF</el-button>
          <el-tabs v-model="activeName" @tab-click="jumpthere">
            <el-tab-pane label="活动详情" name="first"></el-tab-pane>
            <el-tab-pane label="签到情况" name="second"></el-tab-pane>
            <el-tab-pane label="现场记录" name="third"></el-tab-pane>
            <el-tab-pane label="活动反馈" name="fourth"></el-tab-pane>
          </el-tabs>
        </div>
        <div id="dialogscollid" class="dialogtitletab" style="max-height:500px;overflow-y: scroll;padding-bottom: 50px">
          <div class="locationpoint locationpoint_one" id="btn">活动详情 </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-col :span="8" style="text-align: right">
                <label style="margin-right: 5px"><span class="red">*</span>活动级别:</label>
              </el-col>
              <el-col :span="16">
                {{dialogForm.actionlevelname}}
              </el-col>
            </el-col>

            <el-col :span="12">
              <el-col :span="8" style="text-align: right;padding-right: 12px">
                <label style="margin-right:8px; "><span class="red">*</span>科室:</label>
              </el-col>
              <el-col :span="16">
                <div>
                  {{dialogForm.deptname}}
                </div>
              </el-col>
            </el-col>

          </el-row>

          <el-row :gutter="24">
            <el-col :span="4">
              <label><span class="red">*</span>活动主题:</label>
            </el-col>
            <el-col :span="8">
              <div>
                {{dialogForm.theme}}
              </div>
            </el-col>

            <el-col :span="4">
              <label><span class="red">*</span>活动类型:</label>
            </el-col>
            <el-col :span="8">
              <div>
                {{dialogForm.typename}}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24" v-for="(item,index) in timeArr">
            <el-col :span="4">
              <label><span class="red">*</span>活动日期:</label>
            </el-col>
            <el-col :span="4">
              <div>
                {{item.date}}
              </div>
            </el-col>
            <el-col :span="3">
                <label><span class="red">*</span>开始时间:</label>
            </el-col>
            <el-col :span="4">
                <div>
                    {{item.startTime}}
                </div>
            </el-col>
            <el-col :span="3">
                <label><span class="red">*</span>结束时间:</label>
            </el-col>
            <el-col :span="4">
                <div>
                    {{item.endTime}}
                </div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="4">
              <label><span class="red">*</span>主讲人:</label>
            </el-col>
            <el-col :span="8">
              <div>
                <span style="margin-right: 5px" v-for="item in dialogForm.speakerlist">
                  {{item.uname}}
                </span>
              </div>
            </el-col>

            <el-col :span="4">
              <label><span class="red">*</span>活动地点:</label>
            </el-col>
            <el-col :span="8">
              <div>
                {{dialogForm.place}}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="4">
              <label>参与人员:</label>
            </el-col>
            <el-col :span="20">
              <div v-if="dialogForm.actionplanlevel == 'office' ">
                <span v-if="dialogForm.attendinfolist">{{dialogForm.attendinfolist.length}}人</span>
              </div>
              <div v-if="dialogForm.actionplanlevel == 'hospital' ">
                <span v-if="dialogForm.attendercount">{{dialogForm.attendercount}}人</span>
              </div>
              <div v-if="dialogForm.actionplanlevel == 'base' ">
                <span v-for="item in dialogForm.attendinfolist" style="margin-right: 5px">
                  <span v-if="item.type == 0">{{item.attendbusinfo}}</span>

                  <span v-else>{{item.attendbusinfo}}人</span>
                </span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="4">
              <label>备注:</label>
            </el-col>
            <el-col :span="20">
              <div>
                {{dialogForm.remark}}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-col :span="4" style="text-align: right;">
                <p>附件&nbsp;&nbsp;</p>
              </el-col>
              <el-col :span="20">
                <div v-for="item in dialogForm.fileuploadlist">
                  <!--detail_filelist-->
                  <a target="_blank" :href="'/file/download2?file=' + fileurltitle +item.fileurl + '&name=' + item.filename " :download="item.filename">
                    {{item.filename}}
                  </a>

                  <a target="_blank" :href="'/file/download2?file=' + fileurltitle +item.url + '&name=' + item.name" :download="item.name">
                    {{item.name}}
                  </a>
                </div>
                <!--2018-11-17 视频位-->
                <div v-for="item in detailvideolist">
                  <a target="_blank" :href="'/file/download2?file=' + fileurltitle +item.fileurl + '&name=' + item.filename " :download="item.filename">
                    {{item.filename}}
                  </a>
                </div>
              </el-col>
            </el-col>
          </el-row>

          <div class="separation_line"></div>
          <div>
            <div class="locationpoint locationpoint_two" id="btn1">签到情况</div>

            <el-row :gutter="24">
              <el-col :span="12">
                <div id="echart" style="width: 320px;height:300px;"></div>
              </el-col>
              <el-col :span="12" class="sigincoun">
                <el-form-item label="签到率:">
                  <div>
                    {{signform.signpercent || 0}}%
                  </div>
                </el-form-item>
                <el-form-item label="应到人数:">
                  {{signform.signnormalcount}}
                </el-form-item>
                <el-form-item label="实到人数:">
                  {{signform.signincount}}
                </el-form-item>
                <el-form-item label="请假人数:">
                  {{signform.signleavecount}}
                </el-form-item>
                <el-form-item label="缺勤人数:">
                  {{signform.signabsencecount}}
                </el-form-item>
                <el-form-item label="计划外签到人数:">
                  {{signform.signoutcount}}
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-tabs v-model="ecattabactiveName">
                  <el-tab-pane :label="signincountlabel" name="ecattabfirst">
                    <div class="siginnormal" v-for="item in signform.signinlist">
                      <span>{{item.uname}}</span>
                      <span class="signspan">{{item.username}}</span>
                      <span>{{item.statusstr}}</span>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="signabsencecountlabel" name="ecattabsecond">
                    <div class="siginnormal" v-for="item in signform.notsignlist">
                      <span>{{item.uname}}</span>
                      <span class="signspan">{{item.username}}</span>
                      <span>{{item.statusstr}}</span>
                    </div>
                  </el-tab-pane>

                  <el-tab-pane :label="signleavecountlabel" name="ecattabthird">
                    <div class="siginnormal" v-for="item in signform.signleavelist">
                      <span>{{item.uname}}</span>
                      <span class="signspan">{{item.username}}</span>
                      <span>{{item.statusstr}}</span>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane :label="signoutcountlabel" name="ecattabfourth">
                    <div class="siginnormal" v-for="item in signform.signoutlist">
                      <span>{{item.uname}}</span>
                      <span class="signspan">{{item.username}}</span>
                      <span>{{item.statusstr}}</span>
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <div class="detailmore" @click="clickdetailmore">查看更多</div>
              </el-col>
            </el-row>
          </div>

          <div class="separation_line"></div>

          <div class="recodespot">
            <div class="locationpoint locationpoint_three" id="btn2">现场记录</div>
            <!--出科考核类型下增添的内容-->
            <el-row class="position_relative" :gutter="24" v-if="dialogForm.typename == '出科考核' ">
              <el-col :span="24">
                <div class="grid-content bg-purple">
                  <label>&nbsp;&nbsp;&nbsp;出科考核类型: </label>
                  <span>{{fieldrecordlist.cktypename}}</span>
                </div>
              </el-col>
              <el-col :span="24" v-if="fieldrecordlist.cktype == 1">
                <div class="grid-content bg-purple-light">
                  <label>&nbsp;&nbsp;&nbsp;考核项目:</label>
                  <span>{{fieldrecordlist.ckproname}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <label>&nbsp;&nbsp;&nbsp;考核老师:</label>
                  <span style="margin-right: 5px" v-for="item in dialogForm.speakerlist">
                    {{item.uname}}
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <label style="display: block;float: left">&nbsp;&nbsp;&nbsp;被考核学员:</label>
                  <span v-if="dialogForm.actionplanlevel == 'hospital' ">
                    {{dialogForm.attendercount}}人
                  </span>
                  <span v-else class="kaohepeople">
                    <span v-for="item in dialogForm.attendinfolist">{{item.attendbusinfo}}</span>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <label>&nbsp;&nbsp;&nbsp;考核时间:</label>
                  <span>{{dialogForm.starttimestr}} - {{dialogForm.endtimestr}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-light">
                  <label>&nbsp;&nbsp;&nbsp;考核地点:</label>
                  <span>{{dialogForm.place}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div><label style="width: 100px;text-align: right">&nbsp;&nbsp;&nbsp;成绩汇总表:</label></div>
                <div class="field_situation">
                  <span v-for="(item,index) in examinationpiclist1">
                    <img v-if="item.type == 4" @click="previewImg(item,index)" :src="detailpicurl + item.fileurl"></img>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div><label>&nbsp;&nbsp;&nbsp;{{fieldrecordlist.cktype == 1 ? "技能考核评分原始表" : "综合面对面考核评分原始表"}}:</label></div>
                <div class="field_situation">
                  <span v-for="(item,index) in examinationpiclist2">
                    <img v-if="item.type == 5" @click="previewImg(item,index)" :src="detailpicurl + item.fileurl"></img>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div><label>&nbsp;&nbsp;&nbsp;{{fieldrecordlist.cktype == 1 ? "技能考核现场图片" : "综合面对面考核现场图片"}}:</label></div>
                <div class="field_situation">
                  <span v-for="(item,index) in examinationpiclist3">
                    <img v-if="item.type == 6" @click="previewImg(item,index)" :src="detailpicurl + item.fileurl"></img>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                  <label>活动纪要:</label>
                  <span>{{fieldrecordlist.description}}</span>
                </div>
              </el-col>
            </el-row>

            <el-row class="position_relative" :gutter="24" v-else>
              <div class="field_situation">
                <span v-for="(item,index) in fieldrecordlist.piclist">
                  <img v-if="item.type == 2" @click="previewImg(item,index)" :src="detailpicurl + item.fileurl"></img>
                </span>
              </div>
              <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                  <label style="width:78px;float:left;">活动纪要:</label>
                  <span style="width: 450px;float: left">{{fieldrecordlist.description}}</span>
                </div>
              </el-col>
            </el-row>

            <div v-if="dialogForm.teachtypekey == 2 || dialogForm.teachtypekey == 3">
              <el-row>
                <el-col :span="24">
                  <el-col :span="12">
                    <div class="grid-content bg-purple"><label>住&nbsp&nbsp院&nbsp&nbsp号: </label><span>{{fieldrecordlist.inpatientno}}</span></div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light"><label>床号:</label><span>{{fieldrecordlist.bedno}}</span></div>
                  </el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <label>&nbsp;&nbsp;&nbsp;主要诊断:</label>
                    <span>{{fieldrecordlist.maindiagnosis}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content bg-purple-dark">
                    <label style="float:left;">&nbsp;&nbsp;&nbsp;病情简介:</label>
                    <div style="width: 450px;float: left">{{fieldrecordlist.caseinfo}}</div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <el-row class="position_relative" :gutter="24">
              <div class="field_situation">
                <span v-for="(item,index) in type3piclist">
                  <img v-if="item.type == 3" @click="previewImg(item,index)" :src="detailpicurl + item.fileurl"></img>
                </span>
              </div>
            </el-row>
          </div>
          <div class="separation_line"></div>
          <div class="active-btm recodespot">
            <div class="locationpoint locationpoint_four" id="btn3">活动反馈</div>
            <el-row :gutter="20">
              <el-col :span="20">
                <div style="margin:5px;">
                  <span>得分 :{{score}}分&nbsp;/&nbsp;总分{{totalscore}}分</span>
                  <span style="float: right;">反馈人数 :{{evaluatepeoplecount}}人&nbsp;/&nbsp;总人数{{evaluatepeopletotalcount}}人</span>
                </div>
              </el-col>
              <el-col :span="20" v-for="(item,index) in evaluationlist" :key="item.id">
                <div style="margin: 5px;">
                  <span>{{item.title}}</span>
                  <span class="crode_right">&nbsp;
                    <i :class='{active: i == index}' @click="detailedscoring(item.id,index)" class='u-icon-arr icon el-icon-arrow-down'></i>
                  </span>
                  <span class="crode_right">{{item.avgscore}}分</span>
                </div>
                <div v-if="dscoringflag && item.id == thisdscorid">
                  <div v-for="item in detailscore">
                    <div style="margin: 5px;">
                      <span>&emsp;{{item.name}}</span>
                      <span class="crode_right">{{item.score}}分</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="20">
                <div style="margin: 5px;">收获和建议:</div>
              </el-col>
              <el-col :span="20" v-for="(item,index) in suglist" :key="index">
                <div style="margin: 5px;">
                  <div style="word-break: break-all"> <i>{{index+1}}.</i>{{item.advise}}</div>
                  <div style="margin: 5px;">
                    <span></span>
                    <span class="crode_right">{{item.uname}}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!--详情查看更多参与人员列表-->
    <el-dialog title="参与人员" :visible.sync="detailmoredialog" size="small" :close-on-click-modal="false" @close="detailmoredialog = false">
      <el-button type="primary" @click="more_export">批量导出</el-button>
      <div class="moreseach">
        <div>
          <el-input v-model="moremodel"></el-input>
        </div>
        <el-button type="primary" @click="moreseach">查询</el-button>
      </div>

      <el-table :data="moreData" style="width: 100%">
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="username" label="学号/工号">
        </el-table-column>
        <el-table-column prop="statusstr" label="状态">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="查看大图" size="small" :visible.sync="previewPic" :close-on-click-modal="false">
      <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none">
        <el-carousel-item v-for="(item,index) in imgList" :key="index">
          <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie, exportPdf } from '../config/util';
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/chart/pie';
  export default {
    props: {
      id: {
        type: String,
        default() {
          return ""
        }
      },
      activeplandialog: {
        type: Boolean,
        default() {
          return false
        }
      }

    },
    watch: {
      activeplandialog(newVal, oldVal) {
        this.isShow = newVal
        if (newVal) {
          this.getData()
        }
      }
    },
    data() {
      return {
        imgList: [],
        detailvideolist: [],
        timeArr: [],
        previewPic: false,
        moreData: [],
        moremodel: "",
        isShow: false,
        dialogForm: {},
        fileurltitle: "",
        activeName: "first",

        detailmoredialog: false,
        opinionData: [],
        signform: {},
        //饼图区域参与人员名单
        ecattabactiveName: 'ecattabfirst',  //默认顶部为活动详情
        signincountlabel: '',//     计划内签到人员
        signabsencecountlabel: '',//       缺勤人员
        signleavecountlabel: '',//      请假人数
        signoutcountlabel: '',//       计划外签到人员

        //现场记录
        detailpicurl: '',        //图片展示需要拼接的url头部信息
        // minipiclist: [],     //照片
        fieldrecordlist: [], //现场记录
        examinationpiclist1: [],//出科考核下的三种类型的图片
        examinationpiclist2: [],
        examinationpiclist3: [],
        //查看大图区域

        bigpicture: false,
        bigpicture2: false,
        exambigpicture1: false,
        exambigpicture2: false,
        exambigpicture3: false,



        type3piclist: [],
        //活动反馈
        score: '',           //得分
        totalscore: '',      //总分
        evaluatepeoplecount: '',//反馈人数
        evaluatepeopletotalcount: '',//总人数
        evaluationlist: [],  //
        suglist: [],
        i: '',//样式控制
        dialog: '',
        dscoringflag: false,
        thisdscorid: "",
        detailscore: [],
        activeItemIndex: ""
      }
    },
    created() {

    },
    methods: {
      previewImg(item, index) {
        if (item.type == 2) {
          this.imgList = this.fieldrecordlist.piclist
        } else if (item.type == 3) {
          this.imgList = this.type3piclist
        } else if (item.type == 4) {
          this.imgList = this.examinationpiclist1
        } else if (item.type == 5) {
          this.imgList = this.examinationpiclist2
        } else if (item.type == 6) {
          this.imgList = this.examinationpiclist3
        }
        this.activeItemIndex = index
      },
      //查看更多-批量导出
      more_export() {
        let data = {
          command: "actionplanbase/getactionplanuser",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          actionplanid: this.id,
          name: ''
        };
        exportExcel(data);
      },
      //查看更多单个搜索
      moreseach() {
        this.clickdetailmore({ seachname: this.moremodel });
      },
      //查看更多
      clickdetailmore(v) {
        let self = this;
        this.detailmoredialog = true;
        this.moremodel = '';
        if (!v.seachname) {
          v.seachname = '';
        }
        post('/actionplanbase/getactionplanuser', {
          command: 'actionplanbase/getactionplanuser',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          actionplanid: this.id,
          name: v.seachname,
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.moreData = data.beanlist;
          }
        }).catch(function (error) {
          //console.log(error)
        })
      },
      //导出PDF
      quitpdf(id) {
        let self = this;
        let data = {
          command: "actionplan/exportactionplandetailpdf",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
          clientflag: 0,
          actionplanid: this.id
        };
        exportPdf(data);
      },
      /*查看弹窗头部锚点查看*/
      jumpthere(t, v) {
        if (t.index == 0) {
          document.getElementById('btn').scrollIntoView();
        } else if (t.index == 1) {
          document.getElementById('btn1').scrollIntoView();
        } else if (t.index == 2) {
          document.getElementById('btn2').scrollIntoView();
        } else if (t.index == 3) {
          document.getElementById('btn3').scrollIntoView(true);
        } else {
          return
        }
      },
      closeDialog() {
        this.$emit("update:activeplandialog", false)
      },
      getData() {
        post('/actionplan/getactionplandetail', {
          command: 'actionplan/getactionplandetail',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
          clientflag: 0,
          actionplanid: this.id,        //修改计划ID
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.dialogForm = data.bean;
            this.fileurltitle = data.fdfsurl;
            this.timeArr = JSON.parse(data.bean.actiontime)
            this.getdetailechart();//查询饼图数据
            this.getscorefeedbackstatistics();//活动反馈
            this.singelgetpicinfo({ actionplanid: this.id, key: 1 });//活动记录
            // this.activeplandialog = true;//打开弹窗
            this.$nextTick(() => {
              this.activeName = 'first';
              document.getElementById('btn').scrollIntoView();
            });
          }
        }).catch(function (error) {
          // console.log(error);
        })
      },
      //饼图
      initpie(id) {
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption({
          title: {
            text: '签到情况统计',
            subtext: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'top',
            data: ['签到人数', '缺勤人数']
          },
          series: [
            {
              name: '签到情况统计',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.opinionData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'// ['#00b4f4','#f7c416']//
                }
              }
            }
          ]
        });
      },
      //饼图 echart 数据查询接口调用
      getdetailechart() {
        // let self = this;
        post('/actionplan/signinfo', {
          command: 'actionplan/signinfo',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          actionplanid: this.id,     //修改计划ID
          uid: getCookie('uid'),
        }).then((data) => {
          if (data && data.errcode == 0) {
            //人数
            this.opinionData = [
              { 'value': data.bean.signpercent, 'name': '签到率' },
              { 'value': 100 - Number(data.bean.signpercent), 'name': '缺勤率' },
            ];
            this.signform = data.bean;
            this.signincountlabel = '计划内签到人员' + '(' + data.bean.signincount + ')';
            this.signabsencecountlabel = '缺勤人员' + '(' + data.bean.signabsencecount + ')';
            this.signleavecountlabel = '请假人员' + '(' + data.bean.signleavecount + ')';
            this.signoutcountlabel = '计划外签到人员' + '(' + data.bean.signoutcount + ')';
            this.$nextTick(function () {
              this.initpie('echart')
            });
          }
        }).catch((error) => {
          //console.log(error);
        });
      },
      //反馈评分统计
      getscorefeedbackstatistics() {
        // let self = this;
        post('/teachingactivityplan/teachingactionplancount', {
          command: 'teachingactivityplan/teachingactionplancount',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          teachingplanid: this.id,       //修改计划ID
          type: 6
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.score = data.score;
            this.totalscore = data.totalscore;
            this.evaluatepeoplecount = data.evaluatepeoplecount;
            this.evaluatepeopletotalcount = data.evaluatepeopletotalcount;
            this.evaluationlist = data.evaluationlist;
            this.suglist = data.suglist;
          }
        }).catch(function (error) {
          //console.log(error);
        });
      },
      //2019-01-10 修改，获取现场记录图片，视频 ，附件
      singelgetpicinfo(obj) {
        // let self = this;
        let _list = [];
        post('/actionplan/getuploadpicinfo', {
          command: 'actionplan/getuploadpicinfo',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          actionplanid: obj.actionplanid,
          searchflag: 1,//0查询暂存    1：查询实际提交信息
        }).then((data) => {
          if (data && data.errcode == 0) {
            if (obj.key == 1) {
              //现场记录
              this.type3piclist = [];
              this.examinationpiclist1 = [];
              this.examinationpiclist2 = [];
              this.examinationpiclist3 = [];
              this.detailvideolist = [];
              this.fieldrecordlist = data.bean;
              if (data.bean.piclist && data.bean.piclist.length > 0) {
                data.bean.piclist.map(item => {
                  if (item.type == 3) {
                    this.type3piclist.push(item)
                  } else if (item.type == 4) {
                    this.examinationpiclist1.push(item)
                  } else if (item.type == 5) {
                    this.examinationpiclist2.push(item)
                  } else if (item.type == 6) {
                    this.examinationpiclist3.push(item)
                  } else if (item.type == 7) {
                    this.detailvideolist.push(item)
                  }
                })
              }
              this.detailpicurl = data.fdfsurl;
            } else if (obj.key == 2) {
              //视频位
              if (data.bean.piclist && data.bean.piclist.length > 0) {
                data.bean.piclist.map(item => {
                  if (item.type == 7) {
                    _list.push(
                      {
                        name: item.filename,
                        uri: item.fileurl,
                        url: data.fdfsurl + item.fileurl
                      }
                    )
                  };
                })
              };
              this.propvideolist = _list;
              this.uploadvideodialog = true;
            } else if (obj.key == 3) {
              //附件
              if (data.bean.piclist && data.bean.piclist.length > 0) {
                data.bean.piclist.map(item => {
                  if (item.type == 1) {
                    _list.push(
                      {
                        name: item.filename,
                        uri: item.fileurl,
                        url: data.fdfsurl + item.fileurl
                      }
                    )
                  };
                })
              };
              this.propfilelist = _list;
              this.uploadfiledialog = true;
            } else {
              return
            };
          } else if (data && data.errdesc) {
            this.$message({
              message: data.errdesc,
              type: 'warning'
            });
          } else {
            this.$message({
              message: '后台响应失败！！！',
              type: 'warning'
            })
          };
        }).catch((error) => {
          //console.log(error);
        });
      },
    }
  }
</script>
<style scoped>
  .red {
    color: red;
  }

  .el-col {
    line-height: 36px;
  }

  .separation_line {
    width: 100%;
    margin: 15px 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .field_situation {
    width: 100%;
    margin: 15px;

  }

  .field_situation img {
    width: 80px;
    height: 80px;
    display: inline-block;
    margin-right: 8px;
  }

  .position_relative {
    position: relative;
  }

  .bigpicture {
    width: 600px;
    height: 50%;
    z-index: 999;
  }

  .crode_right {
    display: inline-block;
    float: right
  }



  .el-row {
    margin: 15px 0px;
  }

  .el-col-4>label {
    width: 100%;
    height: 100%;
    text-align: right;
    line-height: 36px;
  }



  /*参与人员dialog*/

  .dialogClass {
    /* width: 1000px;*/
  }

  .checkallfont {
    font-weight: 900;
  }

  .userListHeader {
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    padding: 10px 10px;
    border: 1px solid #d3dce6;
  }

  .headerText {
    float: left;
    line-height: 40px;
    margin-left: 200px;
  }

  .typeOrGrade {
    clear: both;
    margin: 0px 0px 20px 0px;
    border: 1px solid #d3dce6;
  }

  .leftTree {
    float: left;
    width: 30%;
    box-sizing: border-box;
  }

  .rightTable {
    float: left;
    width: 70%;
    min-height: 500px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
  }

  .delBtn {
    float: left;
    margin-left: 10px;
  }

  .selectedTable {
    height: 560px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .right-selectedTable {
    height: 500px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .bottomBtnsSure {
    margin-left: 75%;
  }

  .querybtn {
    margin-left: 20px;
  }

  .dialogtitletab {
    width: 100%;
    height: auto;
    /* padding-right: 15px; */
    border: 1px solid #C0C0C0;
  }

  .el-tab-pane {
    max-height: 350px;
  }

  .siginnormal {
    display: inline-block;
    text-align: center;
  }

  .siginnormal>span {
    min-width: 40px;
    margin: 0px 10px;
  }

  .siginnormal>.siginspan {
    min-width: 60px;
    margin: 0px 15px;
  }

  .detailmore {
    width: 95%;
    text-align: right;
    color: #409eff;
  }

  .moreseach {
    width: 277px;
    float: right;
    margin-bottom: 20px;
  }

  .moreseach>div {
    width: 200px;
    float: left;
  }

  .moreseach>.el-button {
    margin-left: 15px;
  }

  .moretable {
    clear: both;
    margin-top: 20px;
  }

  .sigincoun .el-form-item {
    margin-bottom: 0px;
  }

  .meetingmar>.el-col-4 {
    padding-right: 0px;
    text-align: right;
  }

  .meetingmar>.el-col-20 {
    padding-left: 0px;
  }

  .overdialog {
    height: 100%;
    overflow: inherit;
  }

  .active-btm {
    padding-bottom: 80px;
  }

  .el-carousel__item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .kaohepeople {
    display: inline-block;
    width: 470px;
    float: left;
    margin-left: 5px;
  }

  .kaohepeople span {
    width: 150px;
    text-overflow: ellipsis;
    line-height: 15px;
  }

  .locationpoint {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0px 0px 15px;
  }

  .recodespot>.el-row {
    margin-left: 10px !important;
  }

  .grid-content label {
    width: 100px;
    text-align: right;
  }

  .locationpoint_one,
  .locationpoint_two {
    margin-left: 18px;
  }

  .locationpoint_three,
  .locationpoint_four {
    margin-left: 23px;
  }

  ::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  /* .detailForm {
    padding-left: 15px;
  }

  .addTimeicon {
    width: 16px;
    height: 16px;
    vertical-align: -3px;
    margin-right: 3px;
  } */
</style>
<style>
.teachingPlan-self .el-form {
  border: 1px solid #e5e5e5;
  padding: 0 15px;
}
</style>