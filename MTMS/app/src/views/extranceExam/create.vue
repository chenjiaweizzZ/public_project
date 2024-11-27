<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>创建出科考核
      <!--create-->
      <div
        slot="headerRight"
        @click="submit"
        style="font-size: 0.3rem"
        v-if="iscreate"
        :class="{noclick:issubmit}"
      >提交</div>
      <!--更新提交-->
      <div
        slot="headerRight"
        @click="modifyFn"
        style="font-size: 0.3rem"
        v-if="beforeexam"
        :class="{noclick:issubmit}"
      >提交</div>
      <!--考试中-->
      <div
        slot="headerRight"
        @click="examingModify"
        style="font-size: 0.3rem"
        v-if="examing"
        :class="{noclick:issubmit}"
      >提交</div>
    </c-header>
    <div class="g-main">
      <ul class="main reset cjwk">
        <li>
          <label>考核级别</label>
          <div>
            <van-radio-group v-model="surelevel" :disabled="examing||isoverdue">
              <van-radio
                :name="item.levelcode=='base' ? 1 : 0"
                v-for="(item,i) of levelList "
                v-if="item.levelvalue==1"
                @click="sureLevelFn"
              >{{item.levelname}}</van-radio>
            </van-radio-group>
          </div>
        </li>
        <!--科室基地-->
        <li @click="selLevel()" :class="{noclick:examing||isoverdue}">
          <label>{{levelname}}</label>
          <span v-if="examing||isoverdue">{{selectlevels.name||selectlevels.deptname}}</span>
          <span class="choice" v-else>{{selectlevels.name||selectlevels.deptname}}</span>
        </li>
        <li @click="seltypeFn" :class="{noclick:examing||isoverdue}">
          <label>考核类型</label>
          <span v-if="examing||isoverdue">{{typename.name}}</span>
          <span class="choice" v-else>{{typename.name}}</span>
        </li>
        <li @click="initexamitems" v-show="typename.name">
          <label>考核项目</label>
          <p class="choice">
            <i v-for="(val,index) in selectexamitems">{{val.examitemname}}</i>
          </p>
        </li>
        <li @click="getstarttime.show = true;" :class="{noclick:examing||isoverdue}">
          <label>考核开始时间</label>
          <span v-if="examing||isoverdue">{{ starttime }}</span>
          <span class="choice" v-else>{{ starttime }}</span>
        </li>
        <li @click="getendtime.show = true;" :class="{noclick:isoverdue}">
          <label>考核结束时间</label>
          <span v-if="isoverdue">{{ endtime }}</span>
          <span class="choice" v-else>{{ endtime }}</span>
        </li>
        <li>
          <label>考核地点</label>
          <input v-if="isoverdue" type="text" v-model="address" placeholder="请输入考核地点" />
          <input v-else type="text" v-model="address" placeholder="请输入考核地点" />
        </li>
        <li @click="initteacher()">
          <label>考官</label>
          <p class="choice">
            <i v-for="(val,index) in teacher">{{val.name}}</i>
          </p>
        </li>
        <li @click="initstudent()">
          <label>考核学员</label>
          <p class="choice">
            <i v-for="(val,index) in student">{{val.name}}</i>
          </p>
        </li>
        <li>
          <label>备注</label>
          <textarea
            cols="30"
            rows="20"
            maxlength="100"
            v-model="remark"
            placeholder="请输入备注"
            @focus="textareaFocus"
            @blur="textareaBlur"
            :disabled="true"
            v-if="isoverdue"
          ></textarea>
          <textarea
            cols="30"
            rows="20"
            maxlength="100"
            v-model="remark"
            placeholder="请输入备注"
            @focus="textareaFocus"
            @blur="textareaBlur"
            v-else
          ></textarea>
        </li>
      </ul>
      <!--查看考核项目-->
      <c-modal :config="selectExamitem">
        <div class="flex-item class-sel-list">
          <div class="list info-list list-inner">
            <ul class="doctorupdata">
              <li v-for="(val,index) in selectexamitems">
                {{val.examitemname}}
                <i
                  class="deleteitem"
                  @click="deletedoctor('examitem',index)"
                  v-if="!examing&&!isoverdue
"
                >删&emsp;除</i>
              </li>
            </ul>
          </div>
        </div>
      </c-modal>
      <!--查看已选考官 -->
      <c-modal :config="selectTeacher">
        <div class="flex-item class-sel-list">
          <div class="list info-list list-inner">
            <ul class="doctorupdata">
              <li v-for="(val,index) in teacher">
                {{val.name}}
                <template v-if="val.username">-{{val.username}}</template>
                <i class="deleteitem" @click="deletedoctor('examiner',index)">删&emsp;除</i>
              </li>
            </ul>
          </div>
        </div>
      </c-modal>
      <!--查看已选考核学员人员 -->
      <c-modal :config="selectStudent">
        <div class="flex-item class-sel-list">
          <div class="list info-list list-inner">
            <ul class="doctorupdata">
              <li v-for="(val,index) in student">
                <span>
                  {{val.name}}
                  <template v-if="val.username">-{{val.username}}</template>
                  <template v-if="val.count">({{val.count}}人)</template>
                </span>
                <i class="deleteitem" @click="deletedoctor('student',index)">删&emsp;除</i>
              </li>
            </ul>
          </div>
        </div>
      </c-modal>
      <!--选择考官 -->
      <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
        <div v-show="choiceteacher" class="department g-wrapper">
          <c-header>
            <div slot="headerLeft">
              <a @click="choiceteacher = false" class="header-back-btn">
                <img src="../../assets/images/icon_fanhui.png" />
              </a>
            </div>选择考官
          </c-header>
          <div class="search">
            <input type="text" v-model="searchname" placeholder="搜索" @keyup="searchteacher()" />
            <i @click="searchteacher()"></i>
          </div>
          <div class="g-main">
            <div class="flex-item class-sel-list" style="padding-bottom: 0.6rem;">
              <div class="list info-list list-inner">
                <div class="item" v-for="item in teacherlist">
                  <label class="flex flex-start flex-row">
                    <div class="fitem">{{item.name}}-{{item.username}}</div>
                    <input class="checkbox" type="checkbox" :value="item" v-model="teacher" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="result" @click="selectTeacher.show = true">
            <p>已选考官（{{teacher.length}}）</p>
          </div>
        </div>
      </transition>
      <!--选择考核项 -->
      <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
        <div v-show="choicetype" class="department g-wrapper">
          <c-header>
            <div slot="headerLeft">
              <a @click="choicetype = false" class="header-back-btn">
                <img src="../../assets/images/icon_fanhui.png" />
              </a>
            </div>选择考核项
            <div slot="headerRight" @click="examitemFn" style="font-size: 0.3rem">提交</div>
          </c-header>
          <div class="search">
            <input
              type="text"
              v-model="searchitemsname"
              placeholder="搜索"
              @keyup="searchtypeitems()"
            />
            <i @click="searchtypeitems()"></i>
          </div>
          <div class="g-main g-main-typeitems">
            <van-tabs class="reset" @click="examitemsSwitch">
              <van-tab title="我的考核项">
                <van-list>
                  <div class="typeitems-wrap">
                    <div class="items" v-for="(item,i) in mytypeitemslist">
                      <label>
                        <input
                          type="checkbox"
                          class="checkbox"
                          v-model="myitemsselect"
                          :value="{examitemid:item.examitemid,examitemname:item.examitemname}"
                          :disabled="item.status == 0"
                        />
                        <p>{{item.examitemname}}</p>
                      </label>
                      <span
                        class="yl"
                        @click="scoresheetPreview(item.examitemid,item.examitemname)"
                        v-if="item.status"
                      ></span>
                      <span class="sc" :class="{'sc_active':item.active}" @click="scFn(item)" v-if="item.status"></span>
                    </div>
                  </div>
                </van-list>
              </van-tab>

              <van-tab title="全部考核项">
                <van-list>
                  <div class="typeitems-wrap">
                    <div class="items" v-for="(item,i) in alltypeitemslist">
                      <label>
                        <input
                          type="checkbox"
                          class="checkbox"
                          v-model="myitemsselect"
                          :value="{examitemid:item.examitemid,examitemname:item.examitemname}"
                          :key="item.examitemid"
                          :disabled="item.status == 0"
                        />
                        <p>{{item.examitemname}}</p>
                      </label>

                      <span
                        class="yl"
                        @click="scoresheetPreview(item.examitemid,item.examitemname)"
                        v-if="item.status"
                      ></span>
                      <span class="sc" @click="scFn(item)" :class="{'sc_active':item.active}" v-if="item.status"></span>
                    </div>
                  </div>
                </van-list>
              </van-tab>
            </van-tabs>
          </div>
          <div class="result" @click="selectExamitem.show = true">
            <p>已选考核项（{{selectexamitems.length}}）</p>
          </div>
        </div>
      </transition>
      <!--选择考核学员 -->
      <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
        <div v-show="choicestudent" class="department g-wrapper">
          <c-header>
            <div slot="headerLeft">
              <a @click="choicestudent = false" class="header-back-btn">
                <img src="../../assets/images/icon_fanhui.png" />
              </a>
            </div>考核学员
            <div slot="headerRight"></div>
          </c-header>
          <div class="g-main">
            <div class="kh-c">
              <ul class="title">
                <li>姓名</li>
                <li>学号</li>
                <li>专业基地</li>
              </ul>
              <ul class="kh-c-list">
                <li v-for="(item,index) of studentlist">
                  <label class="flex flex-start flex-row">
                    <div class="fixed">
                      <input
                        type="checkbox"
                        :value="{uid:item.uid,name:item.name,seiid:item.seiid,username:item.username}"
                        v-model="student"
                        class="checkbox"
                      />
                    </div>
                    <div class="stdname">
                      <div class="stdname-d">{{item.name}}</div>
                    </div>
                    <div>{{item.username}}</div>
                    <div class="base">{{item.basename}}</div>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div class="result allselectbtn">
            <label>
              <p>
                <input
                  type="checkbox"
                  class="checkbox"
                  @click="allstdSelect"
                  :checked="student.length==studentlist.length"
                />
                {{allselectsign}}
              </p>
            </label>
          </div>
          <div class="result" @click="selectStudent.show = true">
            <p>考核人员（{{student.length}}）</p>
          </div>
        </div>
      </transition>
    </div>
    <!--评分项的预览-->
    <scoresheet-preview
      :examitemid="examitemidpreview"
      v-if="examitempreviewvisible"
      :examitemname="examitempreviewname"
      @setPreviewVisible="setPreviewVisible"
    ></scoresheet-preview>
    <!--选择科室-->
    <c-picker :config="officelist" @confirm="selectdept"></c-picker>
    <!--选择基地-->
    <c-picker :config="baselist" @confirm="selectbase"></c-picker>
    <!--选择考核类型 -->
    <c-picker :config="seltype" @confirm="selecttype"></c-picker>
    <!--选择开始时间-->
    <c-timepicker :config="getstarttime" @confirm="selectstarttime"></c-timepicker>
    <!--选择结束时间-->
    <c-timepicker :config="getendtime" @confirm="selectendtime"></c-timepicker>\
    <div class="rotationh">
      <div class="rotationc">
      <van-popup
        v-model="popShow"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-nav-bar
          title="请选择"
          left-text="取消"
          right-text="确定"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
        />
        <van-toast></van-toast>
        <div class="popCK">
          <div class="popCBox">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item v-for="(item,index) in columns" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox">
            <el-tree
              show-checkbox
              :check-strictly="true"
              :data="deptList"
              :props="defaultProps"
              @check-change="checkClick"
              node-key="id"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
    </div>
    <div class="rotationc">
      <van-popup
        v-model="popShow2"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-nav-bar
          title="请选择"
          left-text="取消"
          right-text="确定"
          left-arrow
          @click-left="onClickLeft2"
          @click-right="onClickRight2"
        />
        <van-toast></van-toast>
        <div class="popCK">
          <div class="popCBox">
            <van-sidebar v-model="activeKey2" @change="onChange2">
              <van-sidebar-item v-for="(item,index) in columns2" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox">
            <el-tree
              show-checkbox
              :check-strictly="true"
              :data="deptList2"
              :props="defaultProps"
              @check-change="checkClick2"
              node-key="id"
              ref="tree2"
            ></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import Vue from "vue";
import moment from "moment";
import methods from "../../methods";
import cHeader from "../header";
import cModal from "../../components/modal";
import cTab from "../../components/tab";
import cTabs from "../../components/tabs";
import cTimepicker from "../../components/timepicker";
import cPickers from "../../components/default-cpicker";
import cPicker from "../../components/default-picker";
import { mapState, mapActions } from "vuex";
import scoresheetPreview from "./scoresheetPreview";
let bus = new Vue();
export default {
  components: {
    cHeader,
    cModal,
    cTab,
    cTabs,
    cTimepicker,
    cPicker,
    cPickers,
    scoresheetPreview
  },
  data() {
    return {
      // new data
      allselectsign: "全选", //考核学员全选
      allselectstate: false,
      haha: [],
      addstdlist: [],
      delstdlist: [],
      addteclist: [],
      delteclist: [],
      getstudent: [],
      getteacher: [],
      iscreate: "",
      isoverdue: "",
      examing: "",
      beforeexam: "",
      searchStudent: "",
      isshowdialog: !this.isoverdue ? true : false,
      searchIndex: 0,
      modify: false,
      loading: false,
      issubmit: false,
      choicelevel: false,
      examType: "", //考核类型
      searchitemsname: "", //考核项名字
      address: "",
      allitemsselect: [], //全部考核项中的选中
      myitemsselect: [], //我的考核项中的选中
      selectexamitems: [],
      getselectexamitems: [],
      getstudent: [],
      //基地and科室
      officelist: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      mytypeitemslist: [], //我的考核项
      alltypeitemslist: [], //全部考核项
      selectexamitem: [],
      bus: bus,
      data: "",
      levelList: [], //考核级别
      levelname: "科室", //显示当前在选择什么
      surelevel: "", //选择的考核级别
      selectlevels: { name: "", id: "" }, //选中的科室/基地

      baselist: {
        show: false,
        mainlist: [],
        valueKey: "deptname"
      },
      choicetype: false,
      isstutype: "grade",
      getstarttime: {
        show: false,
        istime: true,
        isday: true
      },
      getendtime: {
        show: false,
        istime: true,
        isday: true
      },

      seltype: {
        show: false,
        mainlist: [],
        valueKey: "name"
      },
      typeitems: {
        show: false,
        mainlist: [],
        valueKey: "name"
      },
      typelist: [],
      searchname: "",
      choiceteacher: false, //选择考官
      choicestudent: false, //选择参与人员
      starttime: "", //选择的开始时间
      endtime: "", //选择的结束时间
      typename: { id: "", name: "" }, //选择的活动类型
      placename: "", //选择的活动地点
      teacher: [], //选择的考官
      student: [], //选择的学生
      remark: "", //备注
      teacherlist: [], //老师列表
      studentlist: [], //学生列表
      tempstudentlist: [], //学生弹框列表
      examtype: "",
      selectExamitem: {
        show: false,
        title: "考核项"
      },
      selectTeacher: {
        show: false,
        title: "已选考官"
      },
      selectStudent: {
        show: false,
        title: "考核人员"
      },
      timer: "",
      examitemidpreview: "",
      examitempreviewvisible: false,
      examitempreviewname: "",
      popShow: false,
      columns: [],
      deptList: [],
      hosIdByDeptSave: 0,
      oriactiveKey: 0,
      activeKey: 0,
      deptnameidList: [],
      orideptnameidList: [],
      defaultProps: {
        children: "childrens",
        label: "name",
        disabled: function(data, node) {
          // 禁用回收站选项
          if (data.havePermission == 1) {
            return false;
          } else {
            return true;
          }
        }
      },
      
      popShow2: false,
      columns2: [],
      deptList2: [],
      hosIdByDeptSave2: 0,
      oriactiveKey2: "",
      activeKey2: 0,
      deptnameidList2: [],
      orideptnameidList2: [],

    };
  },
  computed: {},
  watch: {
    surelevel: function(val) {
      if (val === 1) {
        this.levelname = "基地";
      }
      if (val == 0) {
        this.levelname = "科室";
      }
    },
    myitemsselect(val) {
      this.unique();
    },
    allitemsselect() {
      this.unique();
    }
  },
  mounted() {
    var self = this;
    // this.initLevel();//考核级别
    // this.initalldept();
    // this.inittypelist().then((data)=>{
    //     this.getturndetail()//获取考核详情;
    // });//考核类型
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    Promise.all([
      this.initLevel(),
      this.initalldept(),
      this.inittypelist()
    ]).then(() => {
      if (this.$route.query.id) {
        this.getturndetail(); //获取考核详情;
      }
    });
    if (this.$route.query.editflag == 0) {
      this.isoverdue = true;
      this.beforeexam = false;
      this.examing = false;
    } else if (this.$route.query.editflag == 1) {
      this.isoverdue = false;
      this.beforeexam = true;
      this.examing = false;
    } else if (this.$route.query.editflag == 2) {
      this.isoverdue = false;
      this.examing = true;
      this.beforeexam = false;
    } else {
      this.isoverdue = false;
      this.beforeexam = false;
      this.examing = false;
      this.iscreate = true;
    }
    self.getTree();
  },
  methods: {
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    ...methods,
    //考核学员全选
    allstdSelect() {
      if (this.student.length != this.studentlist.length) {
        this.student = JSON.parse(JSON.stringify(this.studentlist));
        for (let i = 0; i < this.student.length; i++) {
          let ai = this.student[i];
          delete ai["basename"];
        }
      } else {
        this.student = [];
        this.allselectsign = "全选";
      }
    },
    setPreviewVisible() {
      this.examitempreviewvisible = false;
    },
    examitemsSwitch(index) {
      this.examitemsfn(index);
    },
    scoresheetPreview(examitemid, examitemname) {
      this.examitemidpreview = examitemid;
      this.examitempreviewvisible = true;
      this.examitempreviewname = examitemname;
      // this.$router.push({
      //     path:'/extranceExam/scoresheetPreview',
      //     query:{
      //         examitemid:examitemid,
      //         examitemname:examitemname
      //     }
      // })
    },
    exammingStd() {
      this.addstdlist = [];
      this.delstdlist = [];
      //新增加的值;
      for (let std of this.student) {
        let isExist = false;
        for (let gstd of this.getstudent) {
          if (std.uid == gstd.uid) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          this.addstdlist.push(std);
        }
      }
      this.addstdlist.map(item => {
        this.$set(item, "stdid", item.uid);
        delete item["name"];
        delete item["uid"];
      });
      //删除的值
      for (let i = 0; i < this.delstudent.length; i++) {
        for (let j = 0; j < this.student.length; j++) {
          if (this.student[j].uid == this.delstudent[i].uid) {
            this.delstudent.splice(i--, 1);
            break;
          }
        }
      }
      this.delstdlist = JSON.parse(JSON.stringify(this.delstudent));
      this.delstdlist.map(item => {
        this.$set(item, "stdid", item.uid);
        delete item["uid"];
        delete item["name"];
      });
    },
    examingTec() {
      this.addteclist = [];
      this.delteclist = [];
      //新增加的值;\
      console.log(this.teacher,this.getteacher)
      for (let tec of this.teacher) {
        let isExist = false;
        for (let gtec of this.getteacher) {
          if (tec.id == gtec.id) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          this.addteclist.push(tec);
        }
      }
      let addteclist = [];
      this.addteclist.map(item => {
        addteclist.push(item.id);
      });
      this.addteclist = addteclist;
      //删除的值
      console.log(this.delteacher)
      for (let i = 0; i < this.delteacher.length; i++) {
        for (let j = 0; j < this.teacher.length; j++) {
          if (this.teacher[j].id == this.delteacher[i].id) {
            this.delteacher.splice(i--, 1);
            break;
          }
        }
      }
      this.delteclist = JSON.parse(JSON.stringify(this.delteacher));
      let delteclist = [];
      for (let item of this.delteclist) {
        delteclist.push(item.id);
      }
      this.delteclist = delteclist;
    },
    examingModify() {
      let self = this;
      if (!this.selectlevels.id) {
        this.$toast("考核考核级别！");
        return;
      }
      if (!this.typename) {
        this.$toast("请选择考核类型！");
        return;
      }
      if (this.typename && this.typename.key == 1) {
        if (this.selectexamitems.length == 0) {
          this.$toast("请添加考核项");
          return;
        }
      }
      if (!this.starttime) {
        this.$toast("请选择考核开始时间！");
        return;
      }
      if (!this.endtime) {
        this.$toast("请选择考核结束时间！");
        return;
      }
      if (!this.address) {
        this.$toast("请选择考核地点！");
        return;
      }
      if (this.teacher.length <= 0) {
        this.$toast("请选择考官！");
        return;
      }
      if (this.student.length <= 0) {
        this.$toast("请选择考核学员！");
        return;
      }
      if (
        moment(this.endtime).format("X") <= moment(this.starttime).format("X")
      ) {
        this.$toast("结束时间必须大于开始时间！");
        return;
      }
      this.exammingStd();
      this.examingTec(); //获取添加或者删除的考官;
      this.issubmit = true;
      this.showConfirm({
        title: "温馨提示",
        msg: "您是否确认提交？",
        theme: "modal-confirm modal-white",
        cancel: function() {},
        ok: function() {
          self
            .post("/turnExamInfo/tempmodifyturnexam", {
              command: "turnExamInfo/tempmodifyturnexam",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              endtime: self.endtime,
              place: self.address,
              remark: self.remark,
              id: self.$route.query.id,
              addstdlist: self.addstdlist,
              delstdlist: self.delstdlist,
              addteclist: self.addteclist,
              delteclist: self.delteclist
            })
            .done(data => {
              self.issubmit = false;
              if (data && data.errcode == 0) {
                self.$toast("提交成功~");
                self.$router.push({ 
                  // path: "/extranceExam/list"
                  name: 'extranceExamlist',
                 });
              } else if (data.errdesc) {
                self.$toast(data.errdesc);
              } else {
                self.$toast("服务器错误，请联系管理员。");
              }
            })
            .fail(function(error) {
              self.issubmit = false;
            });
        }
      });
    },
    //切换考核级别
    sureLevelFn(index) {
      this.resetForm();
      this.activeKey = 0;
      this.activeKey2 = 0;
      this.deptList = this.columns[0].childrens
      this.deptList2 = this.columns2[0].childrens
      this.oriactiveKey = 0
      this.oriactiveKey2 = 0;
      this.hosIdByDeptSave = "";
      this.hosIdByDeptSave2 = ""
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree2.setCheckedKeys([]);
    },
    //重置表单
    resetForm() {
      this.selectlevels = { name: "", deptname: "" };
      this.typename = { id: "", name: "" };
      this.selectexamitems = [];
      this.teacher = [];
      this.student = [];
      this.selectexamitems = [];
      this.allitemsselect = [];
      this.myitemsselect = [];
    },
    setscActive() {
      this.alltypeitemslist.map(item => {
        item.active = false;
        this.mytypeitemslist.map(innerItem => {
          if (innerItem.examitemid == item.examitemid) {
            item.active = true;
            innerItem.active = true;
          }
        });
      });
    },
    unique() {
      let obj = {};
      let newArr = [];
      this.selectexamitems = this.allitemsselect.concat(this.myitemsselect);
      for (var item of this.selectexamitems) {
        if (!obj[item["examitemid"]]) {
          newArr.push(item);
          obj[item["examitemid"]] = true;
        }
      }
      this.selectexamitems = newArr;
    },
    getturndetail() {
      this.post("/turnExamInfo/turnexamdetail", {
        command: "turnExamInfo/turnexamdetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: this.$route.query.id
      }).done(res => {
        if (res.errcode == 0) {
          this.surelevel = res.examlevel;
          this.selectlevels.deptname = res.deptname;
          this.selectlevels.id = res.deptid;
          this.$set(this.typename, "name", this.filterType(res.exam_typeid));
          this.starttime = res.starttime;
          this.endtime = res.endtime;
          this.address = res.place;
          this.remark = res.remark;
          //获取examitemlist详情
          this.getselectexamitems = res.examitemlist;
          this.allitemsselect = this.getselectexamitems;
          this.myitemsselect = this.getselectexamitems;
          this.selectexamitems = this.getselectexamitems;

          this.student = res.studentlist;
          this.teacher = res.teacherlist;
          this.typename.id = res.exam_typeid;
          this.typename.key = res.examtype;
          this.examtype = Number(res.examtype);
          this.teacher.map(item => {
            this.$set(item, "name", item.teachername);
            this.$set(item, "id", item.teacherid);
            delete item["teachername"];
            delete item["teacherid"];
          });
          this.student.map(item => {
            this.$set(item, "name", item.studentname);
            this.$set(item, "uid", item.studentid);
            this.$set(item, "seiid", item.seiid);
            delete item["studentname"];
            delete item["studentid"];
            // delete item['username']
          });
          this.getstudent = JSON.parse(JSON.stringify(this.student));
          this.delstudent = JSON.parse(JSON.stringify(this.student));
          this.getteacher = JSON.parse(JSON.stringify(this.teacher));
          this.delteacher = JSON.parse(JSON.stringify(this.teacher));
        }
      });
    },
    //选择考核类型
    seltypeFn() {
      if (!this.isoverdue || this.examing) {
        if (!this.selectlevels.id) {
          this.$toast("请先选择科室/基地");
          return;
        }
        this.seltype.show = true;
      }
    },
    //搜藏
    scFn(item) {
      //加入收藏
      if (!item.active) {
        this.post("/turnExamInfo/collectexamitem", {
          command: "turnExamInfo/collectexamitem",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          examitemid: item.examitemid
        }).done(res => {
          if (res.errcode == 0) {
            this.examitemsfn(0);
            // this.$set(this.alltypeitemslist[i],'active',true);
          }
        });
      }
      //取消收藏
      if (item.active) {
        this.post("/turnExamInfo/removeexamitem", {
          command: "turnExamInfo/removeexamitem",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          examitemid: item.examitemid
        }).done(res => {
          if (res.errcode == 0) {
            this.examitemsfn(0);
          }
        });
      }
    },
    //搜索考核项
    searchtypeitems() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.searchIndex == 1) {
          this.gettypeitemslist(this.searchitemsname);
        } else {
          this.examitemsfn(this.searchIndex, this.searchitemsname);
        }
      }, 250);
    },
    //考核项提交
    examitemFn() {
      this.unique();
      this.choicetype = false;
    },
    //考核项切换
    examitemsfn(index, name) {
      this.searchIndex = index;
      if (index === 0) {
        //我的考核项查询
        this.post("/turnExamInfo/querymyexamitemlist", {
          command: "turnExamInfo/querymyexamitemlist",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          examitemname: name,
          sysType: 1,
          examitemtype: this.examtype
        })
          .done(res => {
            if (res.errcode == 0) {
              this.mytypeitemslist = res.examitemlist;
              this.setscActive();
            } else {
              this.$toast(res.errdesc);
            }
          })
          .fail(() => {
            this.$toast("服务器错误，请联系管理员。");
          });
      }
    },
    //考核提交
    khClick() {
      this.choicestudent = false;
    },
    //选择科室
    selectdept(param) {
      this.officelist.show = false;
      this.selectlevels.name = param.deptname;
      this.selectlevels.id = param.id;
    },
    //选择基地
    selectbase(param) {
      this.baselist.show = false;
      this.selectlevels.name = param.deptname;
      this.selectlevels.id = param.id;
    },
    //考核级别
    initLevel() {
      let self = this;
      return new Promise((resolve, reject) => {
        this.post("/turnExamInfo/getturnexamlevel", {
          command: "turnExamInfo/getturnexamlevel",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid")
        }).done(res => {
          resolve();
          if (res.errcode == 0) {
            this.levelList = res.turnexamlevellist;
          }
        });
      });
    },
    selectBase(index, item) {
      if (this.allBase) {
        this.allBase = false;
        this.basesubmitlist = [];
      }
      for (let i = 0; i < this.oneBase.length; i++) {
        if (i === index) {
          this.oneBase[index]
            ? this.oneBase.splice(index, 1, false)
            : this.oneBase.splice(index, 1, true);
        }
      }
    },

    //获取开始时间
    selectstarttime(data) {
      this.starttime = data;
    },
    //获取结束时间
    selectendtime(data) {
      this.endtime = data;
    },
    //获取基地的数据
    initalldept() {
      let self = this;
      return new Promise((resolve, reject) => {
        this.post("/actionplanbase/getusermanagerdept", {
          command: "actionplanbase/getusermanagerdept",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid")
          // paramcode:"actionplanaddroles",//只在教学计划中增加的参数
        }).done(res => {
          resolve();
          if (res && res.errcode == 0) {
            self.baselist.mainlist = res.beanlist.baselist;
            self.officelist.mainlist = res.beanlist.officelist;
          } else if (res.errdesc) {
            self.$toast(res.errdesc);
          } else {
            self.$toast("服务器错误，请联系管理员。");
          }
        });
      });
    },
    //获取活动类型
    inittypelist() {
      let self = this;
      return new Promise((resolve, reject) => {
        this.post("/traineestudent/queryDictionaryList", {
          command: "traineestudent/queryDictionaryList",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          code: "turnexam_type"
        }).done(data => {
          resolve("fadf");
          if (data && data.errcode == 0) {
            this.seltype.mainlist = data.dic_list;
            this.seltype.mainlist = this.seltype.mainlist.filter(item => {
              if (item.key != 3) {
                return item;
              }
            });
          } else if (data.errdesc) {
            this.toast(data.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
        });
      });
    },
    filterType(id) {
      for (let item of this.seltype.mainlist) {
        if (item.key == id) {
          return item.name;
        }
      }
    },
    //start 选择科室/基地
    selLevel() {
      if (this.surelevel === 0) {
        //科室
        // this.officelist.show = true; //科室
        this.showPop();
      } else if (this.surelevel === 1) {
        //基地
        // this.baselist.show = true;
        this.showPop2();
      } else {
        this.$toast("请先选择考核级别");
      }
      //   this.resetForm();
    },
    //选择考核类型
    selecttype(data) {
      console.log(data)
      this.typename = data;
      this.seltype.show = false;
      if (data.key == "2") {
        this.examtype = 2;
      }
      if (data.key == "1") {
        this.examtype = 1;
      }
      this.selectexamitems = []
      this.allitemsselect = []
      this.myitemsselect = []
      console.log(this.examtype)
    },
    //显示考核项目页面
    initexamitems() {
      if (this.isoverdue || this.examing) {
        this.selectExamitem.show = true;
      } else {
          this.choicetype = true;
        this.gettypeitemslist(this.searchitemsname);
        //初始化我的考核项
        this.examitemsfn(0);
      }
    },
    //获得考核项数据列表
    gettypeitemslist(name) {
      this.post("/turnannualresult/queryexamitemlist", {
        command: "turnannualresult/queryexamitemlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        examitemname: name,
        deptid: this.selectlevels.id,
        examitemtype: this.examtype,
        sysType: 1
      })
        .done(data => {
          if (data && data.errcode == 0) {
            this.alltypeitemslist = data.examitemlist;
          } else {
            this.$toast(data.errdesc);
          }
          this.setscActive();
        })
        .fail(() => {
          this.toast("服务器错误，请联系管理员。");
        });
    },
    //start 选择考官
    initteacher() {
      if (!this.isoverdue) {
        if (!this.selectlevels.id) {
          this.$toast("请先选择科室或基地");
        } else {
          this.choiceteacher = true;
          this.initteacherlist(this.selectlevels.id, "");
        }
      } else {
        this.selectTeacher.show = true;
      }
    },
    //end 选择考官
    closeteacher() {
      if (this.teacher.length <= 0) {
        this.$toast("请选择考官");
      } else {
        this.choiceteacher = false;
      }
    },
    //获取考官
    initteacherlist(param, search_info) {
      let self = this;
      // this.post("/turnExamInfo/queryexaminerlist", {
      //   command: "turnExamInfo/queryexaminerlist",
      //   sessionid: $.cookie("sid"),
      //   loginid: $.cookie("uid"),
      //   search_info: search_info, //查询考官字段
      //   dept_id: param
      // })
      //   .done(data => {
      //     if (data && data.errcode == 0) {
      //       this.teacherlist = data.dept_teach_list; //考官人员
      //     } else {
      //       this.$toast(data.errdesc);
      //     }
      //   })
      //   .fail(() => {
      //     this.toast("服务器错误，请联系管理员。");
      //   });
      let params
      if(self.surelevel) {
        params = {
          keyword: search_info,
          deptId: "",
          teachingType: 1,
          baseId: param
        }
      }else {
        params = {
          keyword: search_info,
          deptId: param,
          teachingType: 1,
          baseId: ""
        }
      }
      self
        .post("/base/teachers/listExaminer", params)
        .done(data => {
            this.teacherlist = data.model; //考官人员
        });
    },
    //搜索考官
    searchteacher() {
      console.log(this.selectlevels)
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.initteacherlist(this.selectlevels.id, this.searchname);
      }, 250);
    },
    //选择考核学员
    initstudent() {
      if (!this.isoverdue) {
        if (!this.selectlevels.id) {
          this.$toast("请先选择科室/基地");
        } else if (!this.typename.id) {
          this.$toast("请选择考核类型");
        } else {
          this.choicestudent = true;
          this.initstudentlist(this.selectlevels.id, "");
        }
      } else {
        this.selectStudent.show = true;
      }
    },
    //获取考核人员
    initstudentlist(param, search_info) {
      let self = this;
      let options = {};
      if (this.surelevel == 1) {
        options = {
          base_id: param,
          dept_id: ""
        };
      } else {
        options = {
          dept_id: param
        };
      }
      this.post("/turnExamInfo/queryexamineelist", {
        command: "turnExamInfo/queryexamineelist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        search_info: this.searchStudent,
        examtype: this.examtype,
        ...options
      })
        .done(data => {
          if (data && data.errcode == 0) {
            this.studentlist = data.dept_stu_list;
          } else {
            this.$toast("当前没有查询到该类型的学员。");
          }
        })
        .fail(() => {
          this.$toast("请联系管理人员");
        });
    },
    //搜索考核人员
    searchstudent() {
      let self = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.initstudentlist(this.selectlevels.id, this.studentname);
      }, 250);
    },
    //删除考核项/人员/考官
    deletedoctor(type, index) {
      let self = this;
      let type_zh;
      let deleteData = [];
      if (type == "student") {
        type_zh = "考核人员";
        deleteData = this.student;
      }
      if (type == "examitem") {
        type_zh = "考核项";
        deleteData = this.selectexamitems;
      }
      if (type == "examiner") {
        type_zh = "考官";
        deleteData = this.teacher;
      }

      if (type) {
        this.showConfirm({
          title: "温馨提示",
          msg: `您是否要删除当前？${type_zh}`,
          theme: "modal-confirm modal-white",
          cancel: function() {},
          ok: function() {
            if (type == "student") {
              self.student.splice(index, 1);
            }
            if (type == "examiner") {
              self.teacher.splice(index, 1);
            }
            if (type == "examitem") {
              let examitemid = deleteData[index].examitemid;
              self.selectexamitems.splice(index, 1);
              self.allitemsselect.map((item, i) => {
                if (item.examitemid == examitemid) {
                  self.allitemsselect.splice(i, 1);
                }
              });
              self.myitemsselect.map((item, i) => {
                if (item.examitemid == examitemid) {
                  self.myitemsselect.splice(i, 1);
                }
              });
            }
          }
        });
      }
    },
    // 修改
    modifyFn() {
      let self = this;
      if (this.surelevel === "") {
        this.$toast("请选择考核级别");
        return;
      }
      if (!this.selectlevels.id) {
        this.$toast("请选择科室或者基地！");
        return;
      }
      if (!this.typename.id) {
        this.$toast("请选择考核类型！");
        return;
      }
      if (this.typename && this.typename.key == 1) {
        if (this.selectexamitems.length == 0) {
          this.$toast("请添加考核项");
          return;
        }
      }
      if (!this.starttime) {
        this.$toast("请选择考核开始时间！");
        return;
      }
      if (!this.endtime) {
        this.$toast("请选择考核结束时间！");
        return;
      }
      if (!this.address) {
        this.$toast("请填写考核地点！");
        return;
      }
      if (this.teacher.length <= 0) {
        this.$toast("请选择考官！");
        return;
      }

      if (
        moment(this.endtime).format("X") <= moment(this.starttime).format("X")
      ) {
        this.$toast("结束时间必须大于开始时间！");
        return;
      }
      let $student = []; //考核学员
      this.student.map(item => {
        $student.push({ stdid: item.uid, seiid: item.seiid });
      });
      let $teacher = []; //考官
      this.teacher.map(item => {
        $teacher.push(item.id);
      });
      let $examitemlist = [];
      this.selectexamitems.map(item => {
        $examitemlist.push(item.examitemid);
      });
      this.issubmit = true;
      this.showConfirm({
        title: "温馨提示",
        msg: "您是否确认提交？",
        theme: "modal-confirm modal-white",
        cancel: function() {},
        ok: function() {
          self
            .post("/turnExamInfo/modifyturnexam", {
              command: "turnExamInfo/modifyturnexam",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              id: self.$route.query.id,
              examLevel: self.surelevel,
              deptId: self.selectlevels.id,
              startTime: self.starttime,
              endTime: self.endtime,
              examTypeId: parseInt(self.typename.key),
              examType: parseInt(self.typename.key),
              place: self.address,
              remark: self.remark,
              stdlist: $student,
              teclist: $teacher,
              examitemlist: $examitemlist
            })
            .done(data => {
              self.issubmit = false;
              if (data && data.errcode == 0) {
                self.$toast("提交成功~");
                self.$router.push({ 
                  // path: "/extranceExam/list" 
                  name: 'extranceExamlist',
                });
              } else if (data.errdesc) {
                self.$toast(data.errdesc);
              } else {
                self.$toast("服务器错误，请联系管理员。");
              }
            })
            .fail(function(error) {
              self.issubmit = false;
            });
        }
      });
    },
    // 提交
    submit() {
      let self = this;
      if (this.surelevel === "") {
        this.$toast("请选择考核级别");
        return;
      }
      if (!this.selectlevels.id) {
        this.$toast("请选择科室或者基地！");
        return;
      }
      if (!this.typename.id) {
        this.$toast("请选择考核类型！");
        return;
      }
      if (this.typename && this.typename.key == 1) {
        if (this.selectexamitems.length == 0) {
          this.$toast("请添加考核项");
          return;
        }
      }
      if (!this.starttime) {
        this.$toast("请选择考核开始时间！");
        return;
      }
      if (!this.endtime) {
        this.$toast("请选择考核结束时间！");
        return;
      }
      if (!this.address) {
        this.$toast("请选择考核地点！");
        return;
      }
      if (this.teacher.length <= 0) {
        this.$toast("请选择考官！");
        return;
      }
      // if(this.student.length <= 0){
      //     this.$toast('请选择考核学员！');
      //     return
      // }
      if (
        moment(this.endtime).format("X") <= moment(this.starttime).format("X")
      ) {
        this.$toast("结束时间必须大于开始时间！");
        return;
      }
      let $student = []; //考核学员可以为空
      if (this.student.length > 0) {
        this.student.map(item => {
          $student.push({ stdid: item.uid, seiid: item.seiid });
        });
      }

      // let options={};
      // if(this.student.length>0){
      //     this.student.map(item=>{
      //         $student.push({stdid:item.uid,seiid:item.seiid});
      //     });
      //     options={stdlist:$student};
      // }

      let $teacher = []; //考官
      this.teacher.map(item => {
        $teacher.push(item.id);
      });
      let $examitemlist = [];
      this.selectexamitems.map(item => {
        $examitemlist.push(item.examitemid);
      });
      this.issubmit = true;
      this.showConfirm({
        title: "温馨提示",
        msg: "您是否确认提交？",
        theme: "modal-confirm modal-white",
        cancel: function() {
          self.issubmit = false;
        },
        ok: function() {
          self
            .post("/turnExamInfo/addturnexam", {
              command: "turnExamInfo/addturnexam",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              examLevel: self.surelevel,
              deptId: self.selectlevels.id,
              startTime: self.starttime,
              endTime: self.endtime,
              examTypeId: parseInt(self.typename.key),
              examType: parseInt(self.typename.key),
              place: self.address,
              remark: self.remark,
              teclist: $teacher,
              stdlist: $student,
              examitemlist: $examitemlist
            })
            .done(data => {
              self.issubmit = false;
              if (data && data.errcode == 0) {
                self.$toast("新增成功~");
                self.$router.push({ 
                  // path: "/extranceExam/list"
                  name: 'extranceExamlist',
                 });
              } else if (data.errdesc) {
                self.$toast(data.errdesc);
              } else {
                self.$toast("服务器错误，请联系管理员。");
              }
            })
            .fail(function(error) {
              self.issubmit = false;
            });
        }
      });
    },

    textareaFocus() {
      $(".g-main").css("padding-bottom", "6rem");
    },
    textareaBlur() {
      $(".g-main").css("padding-bottom", "0");
    },

    back() {
      let self = this;
      this.showConfirm({
        title: "温馨提示",
        msg: "你当前操作尚未提交保存，是否确认返回？",
        theme: "modal-confirm modal-white",
        cancel: function() {},
        ok: function() {
          window.history.back();
        }
      });
    },
    showPop() {
      let self = this;
      self.popShow = true;
    },
    getTree() {
      let self = this;
      self.post("/base/dept/getMyDeptTree", {
        showHospital: 1,
        showNoDeptHospital: 0,
        needBaseDept: 0,
        hospitalId: "",
      }).done(res => {
        if(res && res.resCode == 200) {
          if(Array.isArray(res.model) && res.model.length > 0) {
              self.columns = res.model
              self.deptList = res.model[0].childrens
            // self.init()
          }
        }
      })
      self.post("/base/dept/getHosBaseTree").done(res => {
        if(res && res.resCode == 200) {
          if(Array.isArray(res.model) && res.model.length > 0) {
              self.columns2 = res.model
              self.deptList2 = res.model[0].childrens
            // self.init()
          }
        }
      })
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptList = self.columns[index].childrens;
    },
    checkClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    onClickLeft() {
      let self = this;
      self.popShow = false;
      self.activeKey = self.oriactiveKey;
      self.deptnameidList = self.orideptnameidList;
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
    },
    onClickRight() {
      let self = this;
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        self.hosIdByDept = self.hosIdByDeptSave;
        self.oriactiveKey = self.activeKey
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        self.selectdept({
          deptname: this.$refs.tree.getCheckedNodes()[0].name,
          id: this.$refs.tree.getCheckedNodes()[0].id
        })
        // self.init()
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },


    showPop2() {
      let self = this;
      self.popShow2 = true;
    },
    
    onChange2(index) {
      let self = this;
      self.hosIdByDeptSave2 = self.columns2[index].id;
      self.deptList2 = self.columns2[index].childrens;
    },
    checkClick2(data, checked, node) {
      if (checked) {
        this.$refs.tree2.setCheckedKeys([data.id]);
      }
    },
    onClickLeft2() {
      let self = this;
      self.popShow2 = false;
      self.activeKey2 = self.oriactiveKey2;
      self.deptnameidList2 = self.orideptnameidList2;
      this.$refs.tree2.setCheckedKeys(self.orideptnameidList);
    },
    onClickRight2() {
      let self = this;
      if (
        this.$refs.tree2.getCheckedKeys()[0] &&
        this.$refs.tree2.getCheckedNodes()[0]
      ) {
        self.hosIdByDept2 = self.hosIdByDeptSave;
        self.oriactiveKey2 = self.activeKey
        self.orideptnameidList2 = this.$refs.tree2.getCheckedKeys();
        self.popShow2 = false;
        self.selectbase({
          deptname: this.$refs.tree2.getCheckedNodes()[0].name,
          id: this.$refs.tree2.getCheckedNodes()[0].id
        })
        // self.init()
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },


    
  }
};
</script>
<style lang="scss" scoped>
@import "../../scss/mixin.scss";
@import "./css/create.scss";
.fixed {
  position: absolute;
}
//考核项
.typeitems-wrap {
  .items {
    display: flex;
    border-bottom: 1px solid $borderColor;
    height: 0.6rem;
    justify-content: center;
    align-items: center;
    label {
      flex: 1;
      display: flex;
      input {
        margin: 0 0.2rem;
      }
      p {
        flex: 1;
      }
    }

    span {
      margin-right: 0.2rem;
    }
    span.yl {
      width: 0.4rem;
      height: 0.4rem;
      background: url("../../assets/images/yl.png") no-repeat;
      background-size: 0.4rem 0.4rem;
    }

    span.sc {
      width: 0.4rem;
      height: 0.4rem;
      background: url("../../assets/images/sc.png") no-repeat;
      background-size: 0.4rem 0.4rem;
    }

    span.sc.sc_active {
      background: url("../../assets/images/sc_active.png") no-repeat;
      background-size: 0.4rem 0.4rem;
    }
  }
}
.choice.noedit:after {
  background: none;
}
.allselectbtn {
  bottom: 0.7rem;
  text-align: right;
  input {
    float: left;
    margin-top: 0.14rem;
  }
  label {
    width: 100%;
    display: block;
  }
}
.allselectbtn p[data-v-5a3fbd4c]:after {
  background: none;
}
</style>

<style lang="scss">
.cjwk .van-radio-group {
  display: flex;
  .van-radio {
    display: flex;
  }
}
</style>

