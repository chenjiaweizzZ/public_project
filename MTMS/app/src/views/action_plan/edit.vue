<template>
  <div class="g-wrapper new-edit-active">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>编辑教学活动计划
      <div slot="headerRight" @click="submit" style="font-size: 0.3rem">提交</div>
    </c-header>
    <div class="g-main">
      <!-- <ul class="main">
                <li>
                    <label>活动级别</label>
                    <div>
                        <span class="radio-box" @click="selectlevel(item)" :class="{'radio-active':item.checkflag,'radio-disabled' : item.levelvalue == 0}" v-for="(item,index) in levellist">{{item.levelname}}</span>
                    </div>
                </li>
                <li @click="sellevel()" >
                    <label>{{levelname}}</label>
                    <span class="choice">{{selectlevels.deptname || selectlevels.name}}</span>
                </li>
                <li>
                    <label>活动主题</label>
                    <input type="text" v-model="theme" placeholder="请输入活动主题" autofocus>
                </li>
                <li @click="seltype.show = true">
                    <label>活动类型</label>
                    <span class="choice">{{typename.name}}</span>
                </li>
                <li @click="changestart">
                    <label>开始时间</label>
                    <span class="choice">{{ starttime }}</span>
                </li>
                <li @click="getendtime.show = true;">
                    <label>结束时间</label>
                    <span class="choice">{{ endtime }}</span>
                </li>
                <li>
                    <label>活动地点</label>
                    <input type="text" v-model="placename" placeholder="请输入活动地点" autofocus>
                </li>
                <li @click="initteacher()">
                    <label>主讲人</label>
                    <p class="choice">
                        <i v-for='(val,index) in teacher'>{{val.name}}</i>
                    </p>
                </li>
                <li @click="initstudent">
                    <label>参与人员</label>
  
                    <p class="choice">

                        <i v-if="surelevel.levelcode == 'hospital' ">{{hosactivecount}}</i>
                        <i v-if="surelevel.levelcode == 'base' ">{{newbasecount}}</i>
                        <i v-if="surelevel.levelcode == 'office' " v-for='(val,index) in student_turndoctor'>{{val.name}}</i>
                        <i v-if="surelevel.levelcode == 'office' " v-for='(val,index) in student_trainee'>{{val.name}}</i>
                    </p>
                </li>
                <li>
                    <label>备注</label>
                    <textarea cols="30" rows="20" v-model="remark" placeholder="请输入备注" @focus='textareaFocus' @blur='textareaBlur'></textarea>
                </li>
      </ul>-->

      <div class="self-form-add">
        <div class="whiteCol">
          <div class="selectRdaio">
            <span>活动级别</span>
            <van-radio-group v-model="levelcode" class="selfRdaio" :disabled="disabled">
              <van-radio
                :name="item.levelcode"
                :disabled="item.levelvalue == 0"
                v-for="(item,index) in levellist"
                :key="index"
              >{{item.levelname}}</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="afhakfa">
          <van-cell
          :title="levelname"
          :value="form.dept"
          is-link
          size="large"
          :class="form.dept=='请选择' ? '' : 'weightCol'"
        />
        </div>
        

        <div class="margin-gap">
          <van-field
            v-model="form.theme"
            label="活动主题"
            placeholder="请输入"
            size="large"
            input-align="right"
            maxlength="120"
          />
          <van-cell
            title="活动类型"
            :value="form.type"
            is-link
            size="large"
            @click="seltype.show = true"
            :class="form.type=='请选择' ? '' : 'weightCol'"
          />
        </div>
        <div class="margin-gap gap-time" v-for="(item,index) in timeArr" :key="index">
          <van-cell title="活动时间">
            <img src="../../assets/images/deleteIcon.png" @click="deleteTime(index)" />
          </van-cell>
          <van-cell
            title="活动日期"
            :value="item.date"
            is-link
            size="large"
            @click="selectDate(index)"
            :class="item.date=='请选择' ? '' : 'weightCol'"
          />
          <van-cell
            title="开始时间"
            :value="item.startTime"
            is-link
            size="large"
            @click="selectTime(index,0)"
            :class="item.startTime=='请选择' ? '' : 'weightCol'"
          />
          <van-cell
            title="结束时间"
            :value="item.endTime"
            is-link
            size="large"
            @click="selectTime(index,1)"
            :class="item.endTime=='请选择' ? '' : 'weightCol'"
          />
        </div>
        <div class="whiteCol" v-if="showAddtime">
          <div class="addTime" @click="addTime">
            <div>添加活动时间</div>
          </div>
        </div>

        <div class="margin-gap">
          <van-field
            v-model="form.address"
            label="活动地点"
            placeholder="请输入"
            size="large"
            input-align="right"
            maxlength="512"
          />
        </div>
        <div class="margin-gap">
          <van-field
            v-model="form.period"
            label="学时"
            placeholder=""
            size="large"
            input-align="right"
            maxlength="512"
            readonly
            v-if="periodShow"
          />
          <van-cell
            title="主讲人"
            :value="form.speakers"
            is-link
            size="large"
            @click="initteacher"
            :class="form.speakers=='请选择' ? '' : 'weightCol'"
          />
          <van-cell
            title="参与人员"
            :value="form.student"
            is-link
            size="large"
            @click="initstudent"
            :class="form.student=='请选择' ? '' : 'weightCol'"
          />
        </div>
        <div class="margin-gap bottom-gap">
          <div class="otherInfo">
            <span>备注</span>
          </div>
          <van-field
            v-model="form.remark"
            type="textarea"
            placeholder="请输入"
            @input="oninput"
            :autosize="autosize"
             maxlength="100"
          >
            <template slot="label">{{form.remark.length}}/100</template>
          </van-field>
        </div>
        <div class="bottom">
          <div class="submitBtn" @click="submit">提交</div>
        </div>
        <van-popup v-model="showDate" position="bottom" overlay>
          <van-datetime-picker
            v-model="date"
            type="date"
            :min-date="minDate"
            @confirm="closeDate"
            @cancel="cancelDate"
          />
        </van-popup>
        <van-popup v-model="showTime" position="bottom" overlay>
          <van-datetime-picker
            v-model="selectTimePick"
            type="time"
            @confirm="closeTime"
            @cancel="cancelTime"
          />
        </van-popup>
      </div>
      <!--查看已选主讲人 -->
      <c-modal :config="selectTeacher">
        <div class="flex-item class-sel-list">
          <div class="list info-list list-inner">
            <ul class="doctorupdata">
              <li v-for="(val,index) in teacher">
                {{val.name}}
                <template v-if="val.username">-{{val.username}}</template>
                <i class="deleteitem" @click="deletedoctor(val.id,0)">删&emsp;除</i>
              </li>
            </ul>
          </div>
        </div>
      </c-modal>

      <!--查看已选参与人员 -->
      <c-modal :config="selectDoctor">
        <div class="flex-item class-sel-list">
          <div class="list info-list list-inner">
            <ul class="doctorupdata">
              <li v-for="(val,index) in student">
                <span>
                  {{val.name}}
                  <template v-if="val.username">-{{val.username}}</template>
                  <template v-if="val.count">({{val.count}}人)</template>
                </span>
                <i
                  v-if="val.type !==1"
                  class="deleteitem"
                  @click="deletedoctor(val.id,1,val.type)"
                >删&emsp;除1</i>
              </li>
            </ul>
            <template v-if="surelevel.levelcode == 'office' || surelevel.levelcode == 'hospital'">
              <ul class="doctorupdata">
                <li v-for="(val,index) in student_turndoctor">
                  <span>
                    {{val.name}}
                    <template v-if="val.username">-{{val.username}}</template>
                    <template v-if="val.count">({{val.count}}人)</template>
                  </span>
                  <i
                    v-if="val.type !==1"
                    class="deleteitem"
                    @click="deletedoctor(val.id,1,val.type)"
                  >删&emsp;除</i>
                </li>
              </ul>
              <ul class="doctorupdata">
                <li v-for="(val,index) in student_trainee">
                  <span>
                    {{val.name}}
                    <template v-if="val.username">-{{val.username}}</template>
                    <template v-if="val.count">({{val.count}}人)</template>
                  </span>
                  <i
                    v-if="val.type !==1"
                    class="deleteitem"
                    @click="deletedoctor(val.id,1,val.type)"
                  >删&emsp;除3</i>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </c-modal>
      <!--选择主讲人 -->
      <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
        <div v-show="choiceteacher" class="department g-wrapper">
          <c-header>
            <div slot="headerLeft">
              <a @click="choiceteacher = false" class="header-back-btn">
                <img src="../../assets/images/icon_fanhui.png" />
              </a>
            </div>选择主讲人
            <div slot="headerRight" @click="closeteacher" style="font-size: 0.3rem">确定</div>
          </c-header>

          <div class="search">
            <input type="text" v-model="searchname" placeholder="搜索" />
            <i @click="searchteacher()"></i>
          </div>

          <div class="g-main">
            <div class="flex-item class-sel-list" style="padding-bottom: 0.6rem;">
              <div class="list info-list list-inner">
                <div class="item" v-for="item in teacherlist">
                  <label class="flex flex-start flex-row">
                    <div class="fitem">{{item.name}}-{{item.username}}</div>
                    <input
                      class="checkbox"
                      type="checkbox"
                      :value="{id:item.id,name:item.name}"
                      v-model="teacher"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="result" @click="selectTeacher.show = true">
            <p>已选主讲人（{{teacher.length}}）</p>
          </div>
        </div>
      </transition>
      <!--选择参与人员 -->
      <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
        <div v-show="choicestudent" class="department g-wrapper">
          <c-header>
            <div slot="headerLeft">
              <a @click="choicestudent = false" class="header-back-btn">
                <img src="../../assets/images/icon_fanhui.png" />
              </a>
            </div>选择参与人员
            <div
              slot="headerRight"
              @click="confirmselofficetrainee1(0)"
              style="font-size: 0.3rem"
            >确定</div>
          </c-header>

          <!-- <div class="search" v-if="surelevel.levelcode != 'hospital'">
            <input type="text" v-model="studentname" placeholder="搜索" />
            <i @click="searchstudent()"></i>
          </div> -->

          <div class="g-main">
            <!-- <template v-if="surelevel.levelcode == 'hospital'"> -->
              <!--<ul>
                                <li class="choice"  @click = 'getgradelist(gradelist,"grade","hospital")'>根据年级选择</li>
                                <li class="choice" @click = 'getgradelist(stutypelist,"type","hospital")'>根据学员类型选择</li>
              </ul>-->
              <!-- <div>111</div> -->
              <!-- <ul>
                <li class="choice" @click="initstudentlist('turndoctor')">住院医</li>
                <li class="choice" @click="initstudentlist('trainee')">实习生</li>
              </ul> -->
              <!-- <hospital-actplan :hosdata="hosdata" @hospitalsubmitdata="funhossubmitlist" @close="choicestudent = false"></hospital-actplan> -->
            <!-- </template> -->
            <template v-if="surelevel.levelcode == 'base'">
              <ul>
                <li
                  class="checkbase"
                  :class="{'checkbase-active':item.ischecked}"
                  @click="checkbase(item)"
                  v-for="(item,index) in basechecklist"
                >{{item.name}}({{item.count}}人)</li>
              </ul>
            </template>
            <template v-else>
              <ul>
                <li class="choice" @click="initstudentlist('turndoctor')">护培生</li>
                <!-- <li class="choice" @click="initstudentlist('trainee')">实习生</li> -->
              </ul>
            </template>
            <!--hospital-choice-->
            <c-modal :config="selhospital">
              --------
              <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                  <div class="item" v-for="it in studentlist">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">
                        {{it.name}}
                        <template v-if="it.count">({{it.count}}人)</template>
                      </div>
                      <input type="checkbox" v-model="student" :value="it" class="checkbox" />
                    </label>
                  </div>
                </div>
              </div>
              <template slot="buttons">
                <button type="button" class="btn" @click="selhospital.show = false;">确定</button>
              </template>
            </c-modal>
            <!--office-choice-->
            <c-modal :config="seloffice">
              <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                  <div class="item" @click="choiceall('turndoctor')">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">全部</div>
                      <input
                        type="checkbox"
                        :checked="student_turndoctor.length == selofficelist.length"
                        class="checkbox"
                      />
                    </label>
                  </div>
                  <div class="item" v-for="it in selofficelist">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">{{it.name}}-{{it.username}}</div>
                      <input
                        type="checkbox"
                        v-model="student_turndoctor"
                        :value="it"
                        class="checkbox"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <template slot="buttons">
                <button type="button" class="btn" @click="confirmselofficetrainee(0)">确定</button>
              </template>
            </c-modal>

            <c-modal :config="selofficetrainee">
              <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                  <div class="item" @click="choiceall('trainee')">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">全部</div>
                      <input
                        type="checkbox"
                        :checked="student_trainee.length == selofficetraineelist.length"
                        class="checkbox"
                      />
                    </label>
                  </div>
                  <div class="item" v-for="it in selofficetraineelist">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">{{it.name}}-{{it.username}}</div>
                      <input type="checkbox" v-model="student_trainee" :value="it" class="checkbox" />
                    </label>
                  </div>
                </div>
              </div>
              <template slot="buttons">
                <button type="button" class="btn" @click="confirmselofficetrainee(1)">确定</button>
              </template>
            </c-modal>
            <!--search-choice-->
            <c-modal :config="searchconfig">
              <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                  <div class="item" v-for="it in searchlist">
                    <label class="flex flex-start flex-row">
                      <div class="fitem">{{it.name}}-{{it.username}}</div>
                      <input type="checkbox" v-model="searchArr" :value="it" class="checkbox" />
                    </label>
                  </div>
                </div>
              </div>
              <template slot="buttons">
                <button type="button" class="btn" @click="confirmselofficetrainee1(1)">确定</button>
              </template>
            </c-modal>
          </div>
          <div
            class="result"
            @click="selectDoctor.show = true"
            v-if="surelevel.levelcode != 'base'"
          >
            <p>
              已选参与人
              <template v-if="surelevel.levelcode != 'base'">
                ({{ Number(student.length) + Number(student_turndoctor.length)
                + Number(student_trainee.length)}})
              </template>
              <template v-else>({{student.length}})</template>
            </p>
          </div>
        </div>
      </transition>
    </div>

    <!--选择科室-->
    <c-picker :config="seldept" @confirm="selectdept"></c-picker>
    <!--选择活动类型 -->
    <c-picker :config="seltype" @confirm="selecttype"></c-picker>

    <!--选择开始时间-->
    <c-timepicker :config="getstarttime" @confirm="selectstarttime"></c-timepicker>

    <!--选择结束时间-->
    <c-timepicker :config="getendtime" @confirm="selectendtime"></c-timepicker>
  </div>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import methods from "../../methods";
import cHeader from "../header";
import cModal from "../../components/modal";
import cTab from "../../components/tab";
import cTabs from "../../components/tabs";
import cTimepicker from "../../components/timepicker";
import cPicker from "../../components/default-picker";
import hospitalActplan from "./hos_actplan_people.vue";
import { mapState, mapActions } from "vuex";
let bus = new Vue();
export default {
  components: {
    cHeader,
    cModal,
    cTab,
    cTabs,
    cTimepicker,
    cPicker,
    hospitalActplan
  },
  data() {
    return {
      searchConfig: {
        pid: 0,
        id: 0
      },
      hospitalId: 0,
      deptId: 0,
      date: "",
      searchFlag: true,
      searchArr: [],
      levelcode: "",
      bus: bus,
      data: "",
      detailid: "",
      levellist: [], //活动级别
      levelname: "科室", //显示当前在选择什么
      surelevel: "", //选择的活动级别
      hospitallist: "", //医院列表
      selectlevels: "", //选中的科室
      baselist: "", //基地列表
      officelist: "", //科室列表
      isstutype: "grade",
      status: "",
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
      seldept: {
        show: false,
        mainlist: [],
        valueKey: function(value) {
          return value.deptname || value.name;
        }
      },
      seltype: {
        show: false,
        mainlist: [],
        valueKey: "name"
      },
      selhospital: {
        show: false,
        title: "选择参与人员",
        hideOnClickOut: true
      },
      isallseloffice: false,
      isallselofficetrainee: false,
      student_turndoctor: [],
      student_trainee: [],
      selofficelist: [],
      selofficetraineelist: [],
      seloffice: {
        show: false,
        title: "选择住院医",
        hideOnClickOut: true
      },
      selofficetrainee: {
        show: false,
        title: "选择实习生",
        hideOnClickOut: true
      },
      searchname: "",
      studentname: "",
      choiceteacher: false, //选择主讲人
      choicestudent: false, //选择参与人员
      theme: "", //活动主题
      starttime: "", //选择的开始时间
      endtime: "", //选择的结束时间
      typename: "", //选择的活动类型
      placename: "", //选择的活动地点
      teacher: [], //选择的主讲人
      student: [], //选择的学生
      remark: "", //备注
      teacherlist: [], //老师列表
      studentlist: [], //学生列表
      selectDoctor: {
        show: false,
        title: "已选参与人员"
      },
      selectTeacher: {
        show: false,
        title: "已选主讲人"
      },
      selectStudent: {
        show: false,
        title: "选择参与人员"
      },

      typelist: "",
      technicallist: [],
      gradelist: [],
      stutypelist: [],
      basechecklist: [
        {
          name: "正在该基地轮转的学员",
          id: "",
          attendbusinfo: "turn",
          type: 1,
          count: "",
          ischecked: false
        },
        {
          name: "专业在该基地的学员",
          id: "",
          attendbusinfo: "base",
          type: 1,
          count: "",
          ischecked: false
        }
      ],
      isCheckedAll: false,
      searchconfig: {
        show: false,
        title: "选择搜索的参与人员"
      },
      searchlist: [],
      hospitalbusidlist: "",
      hospitalattend: "",
      filelist: [],
      // 2018-11-21
      hosdata: {},
      hossubmitlist: {},
      hosactivecount: "", //参与人员人数
      editsubmitlist: [], //edit提交的院级参与人
      resultdatalist: [], //重置的数据
      //18-11-30
      newbasecount: "",
      timeFlag: 0,
      showTime: false,
      selectTimePick: "",
      currentIndex: "",
      minDate: new Date(),
      showDate: false,
      level: "",
      timeArr: [{ date: "请选择", startTime: "请选择", endTime: "请选择" }],
      form: {
        dept: "请选择",
        theme: "",
        type: "请选择",
        address: "",
        speakers: "请选择",
        remark: "",
        student: "请选择",
        period: ''
      },
      periodShow: false,
      autosize: { maxHeight: 60, minHeight: 60 },
      showAddtime: false,
      disabled: false,
      teachingActionPlanPeriodSetList: []
    };
  },
  computed: {},
  filters: {},
  watch: {
    surelevels: function(val, oldval) {
      if (val !== oldval) {
        this.teacherlist = [];
        this.studentlist = [];
        this.teacher = [];
        this.student = [];
      }
    },
    teacher: function(val) {
      if (val.length == 0) {
        this.selectTeacher.show = false;
      }
    },
    student: function(val) {
      if (val.length == 0) {
        this.selectDoctor.show = false;
      }
    }
  },
  created() {
    this.detailid = this.$route.query.id;
  },
  mounted() {
    var self = this;
    this.initalldept();
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.getPeriodSetList()
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
    oninput(val) {
      if (val.length > 250) {
        this.form.remark = val.slice(0, 250);
      }
    },
    confirmselofficetrainee1(type) {
      if (!this.searchFlag) {
        return;
      }
      this.searchFlag = false;
      let stemp = [];
      if (type == 1) {
        if (this.surelevel.levelcode == "base") {
          this.searchArr.forEach(citem => {
            let flag = true;
            this.student.forEach(item => {
              if (item.id == citem.id) {
                flag = false;
              }
            });
            if (flag) {
              citem.type = 0;
              this.student.push(citem);
            }
          });
        } else {
          let allSelect = this.student_trainee.concat(this.student_turndoctor);
          this.searchArr.forEach(citem => {
            let flag = true;
            allSelect.forEach(item => {
              if (item.id == citem.id) {
                flag = false;
              }
            });
            if (flag) {
              citem.type = 3;
              this.student_trainee.push(citem);
            }
          });
        }
      }
      if (this.surelevel.levelcode == "office" || this.surelevel.levelcode == "hospital") {
        this.student_turndoctor.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
        this.student_trainee.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
      } else if (this.surelevel.levelcode == "base") {
        this.student.forEach(item => {
          let str = "";
          if (item.count) {
            str = item.name + "-" + item.count + "人";
          } else {
            str = item.name;
          }

          stemp.push(str);
        });
      }
      this.searchFlag = true;
      console.log("fhafja",this.form.student)
      console.log(type)
      if (type == 1) {
        this.searchconfig.show = false;
      } else {
        this.form.student = stemp.length == 0 ? "请选择" : stemp.join("、");
        this.choicestudent = false;
      }
    },
    confirmselofficetrainee(type) {
      let stemp = [];
    //   if (this.surelevel.levelcode == "office" || this.surelevel.levelcode == "hospital") {
        
    //   }
      if (this.surelevel.levelcode == "base") {
        this.student.forEach(item => {
          let str = item.name + "-" + val.count + "人";
          stemp.push(str);
        });
      }else {
          this.student_turndoctor.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
        this.student_trainee.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
      }
      console.log(stemp)
      this.form.student = stemp.length == 0 ? "请选择" : stemp.join("、");
      if (type == 0) {
        this.seloffice.show = false;
      } else {
        this.selofficetrainee.show = false;
      }
      // this.selofficetrainee.show = false;
    },
    confirmStudent() {
      let stemp = [];
      if (this.surelevel.levelcode == "office" || this.surelevel.levelcode == "hospital") {
        this.student_turndoctor.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
        this.student_trainee.forEach(item => {
          let str = item.name;
          stemp.push(str);
        });
      } else if (this.surelevel.levelcode == "base") {
        this.student.forEach(item => {
          let str = item.name + "-" + val.count + "人";
          stemp.push(str);
        });
      }
      this.form.student = stemp.join("、");
      this.selhospital.show = false;
    },
    cancelTime() {
      this.showTime = false;
    },
    closeTime(val) {
      let current = this.timeArr[this.currentIndex];
      this.showTime = false;
      if (this.timeFlag == 0) {
        current.startTime = val;
      } else {
        current.endTime = val;
      }
      if (current.startTime != "请选择" && current.endTime != "请选择") {
        let tempS = current.startTime.split(":");
        let tempE = current.endTime.split(":");
        if (Number(tempS[0]) > Number(tempE[0])) {
          current.endTime = "";
          this.toast("开始时间不得大于结束时间！");
        } else if (
          Number(tempE[0]) == Number(tempS[0]) &&
          Number(tempS[1]) > Number(tempE[1])
        ) {
          current.endTime = "";
          this.toast("开始时间不得大于结束时间！");
        }
      }
      if (current.date != "" && current.date != undefined) {
        let temp = current.date.replace(/-/g, "/");
        // let temp = moment(current.date).format('YYYY-M/M-DD')
        if (this.timeFlag == 0) {
          current.start = !!val ? new Date(temp + " " + val).getTime() : "";
        }
        if (this.timeFlag == 1) {
          current.end = !!val ? new Date(temp + " " + val).getTime() : "";
        }
      }
      this.timeArr.splice(this.currentIndex, 1, current);
    },
    selectTime(index, flag) {
      if (this.timeArr[index].disabled) {
        this.toast("当前时间不可更改！");
        return false;
      }
      this.currentIndex = index;
      this.timeFlag = flag;
      this.showTime = true;
    },
    cancelDate() {
      this.showDate = false;
    },
    closeDate(val) {
      console.log(val, "----");
      this.showDate = false;
      let current = this.timeArr[this.currentIndex];
      current.date = moment(val.getTime()).format("YYYY-MM-DD");

      if (val == undefined || val == "") {
        current.start = "";
        current.end = "";
      } else {
        let temp = current.date.replace(/-/g, "/");
        if (current.startTime != "" && current.startTime != "请选择") {
          // let temp = moment(val.getTime()).format('YYYY/MM/DD')
          current.start = new Date(temp + " " + current.startTime).getTime();
        }
        if (current.endTime != "" && current.endTime != "请选择") {
          // let temp = moment(val.getTime()).format('YYYY/MM/DD')
          current.end = new Date(temp + " " + current.endTime).getTime();
        }
      }
      console.log(current, "current");
      this.timeArr.splice(this.currentIndex, 1, current);
    },
    selectDate(index) {
      if (this.timeArr[index].disabled) {
        this.toast("当前日期不可更改！");
        return false;
      }
      this.showDate = true;
      this.currentIndex = index;
    },
    deleteTime(index) {
      if (this.timeArr.length == 1) {
        return false;
      }
      if (this.timeArr[index].disabled) {
        this.toast("当前日期不可删除！");
        return false;
      }
      this.timeArr.splice(index, 1);
    },
    addTime() {
      this.timeArr.push({
        date: "请选择",
        startTime: "请选择",
        endTime: "请选择",
        start: "",
        end: ""
      });
    },
    checkTime() {
      let timeFlag = true;
      let isempty = true;
      this.timeArr.forEach((item, index) => {
        if (item.date == "请选择") {
          isempty = false;
        } else if (item.startTime == "请选择") {
          isempty = false;
        } else if (item.endTime == "请选择") {
          isempty = false;
        }

        if (isempty) {
          this.timeArr.forEach((citem, cindex) => {
            if (index != cindex) {
              if (!(citem.start >= item.end || citem.end <= item.start)) {
                timeFlag = false;
              }
            }
          });
        }
      });
      return { timeFlag, isempty };
    },
    //回传的院级参与人
    funhossubmitlist(data) {
      //
      this.hossubmitlist = data;
      this.hosdata = data.gradelist
        .concat(data.stutypelist)
        .concat(data.baselist);
      this.hosdata.attendinfolist = data.gradelist
        .concat(data.stutypelist)
        .concat(data.baselist);
      this.hosdata.deptid = this.selectlevels.id;
      this.hosdata.starttimestr = this.starttime;
      this.hosdata.endtimestr = this.endtime;
      this.hosactivecount = data.count;
      this.hosdata.resultdatalist = this.resultdatalist;
      let stemp = [];
      if (this.surelevel.levelcode == "hospital") {
        stemp.push(data.count);
      }
      this.form.student = stemp.join("、");
    },

    init() {
      //获取详情
      let self = this;
      this.post("/actionplan/getactionplandetail", {
        command: "actionplan/getactionplandetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        actionplanid: self.detailid,
        clientflag: 1
      }).done(data => {
        if (data && data.errcode == 0) {
            self.hosIdByDept = data.bean.hospital;
            self.deptId = data.bean.deptid;
            self.date = data.bean.createtime.slice(0,10);
          self.status = data.bean.status;
          self.hosdata = data.bean; //院级活动参与人
          self.levellist.map(value => {
            if (value.levelcode == data.bean.actionplanlevel) {
              value.checkflag = true;
              self.surelevel = value;
            }
          }); //选中的活动类型
          if (data.bean.attendinfolist && data.bean.attendinfolist.length > 0) {
            for (let i = 0; i < data.bean.attendinfolist.length; i++) {
              if (data.bean.attendinfolist[i].bustype) {
                self.hospitalattend = data.bean.attendinfolist[i].bustype;
                break;
              }
            }
          }
          self.selectlevels = {
            name: data.bean.deptname,
            id: data.bean.deptid
          }; //选中的科室
          if (data.bean.actionplanlevel == "hospital") {
            self.searchConfig.id = data.deptid
            // self.hospitalbusidlist = [];
            // self.resultdatalist = data.bean.attendinfolist;
            // self.hosdata.resultdatalist = data.bean.attendinfolist;
            // if (
            //   data.bean.attendinfolist &&
            //   data.bean.attendinfolist.length > 0
            // ) {
            //   //self.isstutype = data.bean.attendinfolist[0].bustype ;
            //   data.bean.attendinfolist.map(value => {
            //     self.hosactivecount = value.attendbusinfo;
            //     if (value.type == 1) {
            //       self.hospitalbusidlist.push(value.attendbusid);
            //     }
            //     value.id = value.attendbusid;
            //     self.editsubmitlist = data.bean.attendinfolist;
            //   });
            // }
            // self.seldept.mainlist = self.hospitallist;
            self.seldept.mainlist = self.officelist;
          } else if (data.bean.actionplanlevel == "base") {
            self.newbasecount =
              data.bean.attendinfolist[0].attendbusinfo + "人";
            self.seldept.mainlist = self.baselist;
            if (
              data.bean.attendinfolist &&
              data.bean.attendinfolist.length > 0
            ) {
              data.bean.attendinfolist.map(val => {
                if (val.type == 1) {
                  self.basechecklist.map(value => {
                    if (val.bustype == value.attendbusinfo) {
                      value.ischecked = true;
                    }
                  });
                }
              });
            }
          } else if (data.bean.actionplanlevel == "office") {
            self.seldept.mainlist = self.officelist;
            self.searchConfig.pid = data.bean.hospital;
            self.searchConfig.id = data.bean.deptid;
          } //科室列表
          self.initteacherlist(self.selectlevels.id);
          if (data.bean.status != 0) {
            self.disabled = true;
          }
          self.form.period = data.bean.period;
          self.periodShow = !!data.bean.period;
          self.form.dept = data.bean.showofficename;
          self.form.theme = data.bean.theme;
          self.form.address = data.bean.place;
          self.levelcode = data.bean.actionplanlevel;
          self.theme = data.bean.theme; //活动主题
          self.typename = { name: data.bean.typename, key: data.bean.type }; //活动类型
          self.form.type = data.bean.typename; //活动类型
          let speakerTemp = [];
          data.bean.speakerlist.forEach(item => {
            speakerTemp.push(item.uname);
          });
          self.form.speakers = speakerTemp.join("、");
          // self.starttime = data.bean.starttimestr;
          // self.endtime = data.bean.endtimestr;
          self.timeArr = JSON.parse(data.bean.actiontime);
          self.form.remark = data.bean.remark;
          // self.timeArr
          self.timeArr.forEach(item => {
            let currentTime = new Date().getTime();
            let temp = item.date.replace(/-/g, "/");
            item.start = new Date(temp + " " + item.startTime).getTime();
            item.end = new Date(temp + " " + item.endTime).getTime();
            let tempS = item.startTime.split(":");
            let tempE = item.endTime.split(":");
            item.startTime = tempS[0] + ":" + tempS[1];
            item.endTime = tempE[0] + ":" + tempE[1];
            item.status = data.bean.status;
            if (data.bean.status != 0) {
              if (item.start > currentTime) {
                item.disabled = false;
                self.showAddtime = true;
              } else {
                item.disabled = true;
              }
            } else {
              item.disabled = false;
              self.showAddtime = true;
            }
          });
          self.teacher = [];
          data.bean.speakerlist.map(value => {
            self.teacher.push({ name: value.uname, id: value.uid });
          });
          self.student = [];
          if (data.bean.attendinfolist && data.bean.attendinfolist.length > 0) {
            if (data.bean.actionplanlevel == "office" || data.bean.actionplanlevel == "hospital") {
              data.bean.attendinfolist.map(value => {
                let arr = value.attendbusinfo.split("-");
                if (value.type == 2) {
                  self.student_turndoctor.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // username: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                } else if (value.type == 3) {
                  self.student_trainee.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // username: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                }else if (value.type == 0) {
                  console.log("this is  0")
                  self.student_turndoctor.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // username: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                }
                 else {
                  self.student.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // username: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                }
              });
            } else {
              data.bean.attendinfolist.map(value => {
                if (value.type == 1) {
                  self.student.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // count: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                } else {
                  self.student.push({
                    // name: value.attendbusinfo.split("-")[0],
                    id: value.attendbusid,
                    type: value.type,
                    // username: value.attendbusinfo.split("-")[1]
                    name: arr.slice(0, -1).join('-'),
                    username: arr[arr.length-1]
                  });
                }
              });
            }
          } else {
            self.student = [];
          }
          let stemp = [];
          if (data.bean.actionplanlevel == "hospital") {
            // stemp.push(self.hospitalcount);
            self.student_turndoctor.forEach(item => {
              let str = item.name;
              stemp.push(str);
            });
            self.student_trainee.forEach(item => {
              let str = item.name;
              stemp.push(str);
            });
          } else if (data.bean.actionplanlevel == "office") {
            self.student_turndoctor.forEach(item => {
              let str = item.name;
              stemp.push(str);
            });
            self.student_trainee.forEach(item => {
              let str = item.name;
              stemp.push(str);
            });
          } else if (data.bean.actionplanlevel == "base") {
            self.student.forEach(item => {
              let str = "";
              if (item.count) {
                str = item.name + "-" + item.count + "人";
              } else {
                str = item.name;
              }

              stemp.push(str);
            });
            // stemp.push(self.newbasecount)
          }
          self.form.student = stemp.join("、");

          self.placename = data.bean.place; //活动地点
          self.remark = data.bean.remark; //备注
          self.filelist = data.bean.fileuploadlist; //备注
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取开始时间
    selectstarttime(data) {
      this.starttime = data;
    },
    //获取结束时间
    selectendtime(data) {
      this.endtime = data;
    },
    //获取所在的节点
    initalldept() {
      let self = this;
      this.post("/actionplanbase/getusermanagerdept", {
        command: "actionplanbase/getusermanagerdept",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        paramcode: "actionplanaddroles" //只在教学计划中增加的参数
      }).done(res => {
        if (res && res.errcode == 0) {
          self.hospitallist = res.beanlist.hospitallist;
          self.baselist = res.beanlist.baselist;
          self.officelist = res.beanlist.officelist;
          self.initlevellist();
          self.initgrade();
          self.initstutype();
          self.inittypelist();
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取活动级别列表
    initlevellist() {
      let self = this;
      this.post("/actionplanbase/getactionplanlevel", {
        command: "actionplanbase/getactionplanlevel",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      }).done(res => {
        if (res && res.errcode == 0) {
          let _levellist = res.actionplanlevellist;
          let hospital, base;
          _levellist.map(value => {
            this.$set(value, "checkflag", false);
            if (value.levelcode == "hospital") {
              hospital = value;
            }
            if (value.levelcode == "base") {
              base = value;
            }
          });
          self.levellist = _levellist;
          self.init();
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取活动类型
    inittypelist() {
      let self = this;
      this.post("/turnbaseinfo/turnbaseinfolevel", {
        command: "turnbaseinfo/turnbaseinfolevel",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        code: "teachtype"
      }).done(data => {
        if (data && data.errcode == 0) {
          self.seltype.mainlist = JSON.parse(data.baseinfolevellist);
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //start 选择科室
    sellevel() {
      if (!this.surelevel) {
        this.toast("请先选择活动级别");
      } else {
        this.seldept.show = true;
      }
    },
    //end 选择科室
    selectdept(data) {
      this.selectlevels = data;
      this.teacherlist = [];
      this.teacher = [];
      this.studentlist = [];
      this.student = [];
      this.student_turndoctor = [];
      this.student_trainee = [];
      if (this.surelevel.levelcode == "office") {
        this.initteacherlist(this.selectlevels.id);
      } else if (this.surelevel.levelcode == "base") {
        this.basechecklist.map(value => {
          value.id = this.selectlevels.id;
        });
      }
      this.seldept.show = false;
      this.form.dept = this.selectlevels.deptname || this.selectlevels.name;
    },
    //选择活动级别
    selectlevel(param) {
      let self = this;
      if (self.status == 1) {
        self.toast("进行中的教学活动计划不允许修改活动级别。");
        return;
      }
      if (param == this.surelevel) {
        return;
      }
      this.teacherlist = [];
      this.teacher = [];
      this.studentlist = [];
      this.student = [];
      this.selectlevels = "";
      this.surelevel = param;
      this.levellist.map(value => {
        if (value.levelcode == param.levelcode) {
          value.checkflag = true;
        } else {
          value.checkflag = false;
        }
      });
      if (param.levelcode == "hospital") {
        this.levelname = "院校";
        self.seldept.mainlist = self.hospitallist;
        self.selectlevels = self.hospitallist[0];
      } else if (param.levelcode == "base") {
        this.levelname = "基地";
        self.seldept.mainlist = self.baselist;
        self.selectlevels = self.baselist[0];
      } else {
        this.levelname = "科室";
        self.seldept.mainlist = self.officelist;
        self.selectlevels = self.officelist[0];
        self.initteacherlist(self.selectlevels.id);
      }
    },
    //选择活动类型
    selecttype(data) {
      let periodcor = ''
      this.teachingActionPlanPeriodSetList.forEach(i => {
        if(i.paramValue == data.key) {
          periodcor = i.param1
        }
      })
      this.form.period = periodcor
      this.periodShow = !!periodcor
      this.typename = data;
      this.form.type = data.name;
      this.seltype.show = false;
    },
    //start 选择主讲人
    initteacher() {
      if (!this.selectlevels.id) {
        this.toast("请先选择科室");
      } else {
        this.choiceteacher = true;
      }
    },
    //开始时间
    changestart() {
      if (this.status == 1) {
        this.toast("进行中的教学活动计划不允许修改开始时间。");
      } else {
        this.getstarttime.show = true;
      }
    },
    //end 选择主讲人
    closeteacher() {
      if (this.teacher.length <= 0) {
        this.toast("请选择主讲人");
      } else {
        this.choiceteacher = false;
        let temp = [];
        console.log(this.teacher);
        this.teacher.forEach(item => {
          temp.push(item.name);
        });
        this.form.speakers = temp.join("、");
      }
    },
    //获取主讲人
    initteacherlist(param) {
      let self = this;
      // this.post("/actionplanbase/getspeaker", {
      //   command: "actionplanbase/getspeaker",
      //   sessionid: $.cookie("sid"),
      //   loginid: $.cookie("uid"),
      //   actionplanlevel: "office",
      //   deptid: param
      // }).done(data => {
      //   if (data && data.errcode == 0) {
      //     self.teacherlist = data.speakerlist;
      //   } else if (data.errdesc) {
      //     self.toast(data.errdesc);
      //   } else {
      //     self.toast("服务器错误，请联系管理员。");
      //   }
      // });
      let params;
      if(this.levelcode == "hospital") {
        params = {
          hospitalId: self.searchConfig.id,
        }
        self.searchConfig.id = param
      }else if(this.levelcode == "office") {
        params = {
          hospitalId: self.searchConfig.pid,
          deptId: self.searchConfig.id
        }
      }
      this.post(
            "/base/teachers/listSpeaker",params
          ).done(res => {
            self.teacherlist = res.model;
          })
    },
    //搜索主讲人
    searchteacher() {
      let self = this;
      // if (self.searchname == "" && self.surelevel.levelcode == "office") {
      //   self.initteacherlist(self.selectlevels.id);
      // } else if (!self.searchname) {
      //   this.toast("请输入您要搜索的内容");
      //   return;
      // } else {
      //   this.post("/actionplanbase/getspeakerforsearch", {
      //     command: "actionplanbase/getspeakerforsearch",
      //     sessionid: $.cookie("sid"),
      //     loginid: $.cookie("uid"),
      //     actionplanlevel: self.surelevel.levelcode,
      //     speakername: self.searchname
      //   }).done(data => {
      //     if (data && data.errcode == 0) {
      //       self.teacherlist = [];
      //       data.attendlist.map(value => {
      //         self.teacherlist.push({
      //           name: value.name,
      //           id: value.id,
      //           username: value.username
      //         });
      //       });
      //       if (self.teacherlist.length == 0) {
      //         self.toast("未搜索到哟~");
      //       }
      //     } else if (data.errdesc) {
      //       self.toast(data.errdesc);
      //     } else {
      //       self.toast("服务器错误，请联系管理员。");
      //     }
      //   });
      // }
      let params;
      if(this.levelcode == "hospital") {
        params = {
          hospitalId: self.searchConfig.id,
          keyword: self.searchname
        }
        self.searchConfig.id = param
      }else if(this.levelcode == "office") {
        params = {
          hospitalId: self.searchConfig.pid,
          deptId: self.searchConfig.id,
          keyword: self.searchname
        }
      }
      this.post(
            "/base/teachers/listSpeaker",params
          ).done(res => {
            self.teacherlist = res.model;
          })
    },
    //start 选择参与人
    initstudent() {
      var { timeFlag, isempty } = this.checkTime();
      if (!this.selectlevels.id) {
        this.toast("请先选择科室");
        return;
      } else if (!isempty) {
        this.toast("请选择日期或者时间!");
      } else if (!timeFlag) {
        this.toast("请检查活动日期是否重复!");
      } else {
        if (this.surelevel.levelcode == "base") {
          this.getgradelist(this.selectlevels.id, "base", "base");
          this.getgradelist(this.selectlevels.id, "turn", "base");
        }
        this.choicestudent = true;
      }
    },
    //获取年级信息
    initgrade() {
      let self = this;
      this.post("/turnbaseinfo/turnbaseinfolevel", {
        command: "turnbaseinfo/turnbaseinfolevel",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        code: "turngrade"
      }).done(data => {
        if (data && data.errcode == 0) {
          self.gradelist = [];
          let _data = JSON.parse(data.baseinfolevellist);
          _data.map(value => {
            self.gradelist.push(value.id);
          });
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取学员类型信息
    initstutype() {
      let self = this;
      this.post("/hr/querylevellist", {
        command: "hr/querylevellist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        code: "stud_type"
      }).done(data => {
        if (data && data.errcode == 0) {
          self.stutypelist = [];
          let _data = data.levellist;
          _data.map(value => {
            self.stutypelist.push(value.key);
          });
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取年级或者学员
    getgradelist(param, params, type) {
      let self = this;
      self.studentlist = [];
      self.hospitalattend = params;
      self.hospitalbusidlist = param;
      let opitions = {};
      if (type == "hospital") {
        opitions.hospitalbusidlist = param;
        opitions.hospitalattend = params;
        if (self.isstutype !== params) {
          self.isstutype = params;
          if (self.student && self.student.length > 0) {
            for (let i = self.student.length - 1; i >= 0; i--) {
              if (self.student[i].type == 1) {
                self.student.splice(i, 1);
              }
            }
          }
        }
      } else if (type == "base") {
        opitions.deptid = param;
        opitions.baseattend = params;
      }
      this.post("/actionplanbase/getattender", {
        command: "actionplanbase/getattender",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        actionplanlevel: type,
        actiontime: JSON.stringify(self.timeArr),
        ...opitions
      }).done(data => {
        if (data && data.errcode == 0) {
          if (type == "hospital") {
            self.studentlist = [];
            if (data.result.grouplist && data.result.grouplist.length > 0) {
              data.result.grouplist.map(value => {
                self.studentlist.push({
                  name: value.name,
                  id: value.id,
                  count: value.count,
                  type: 1
                });
              });
              self.selhospital.show = true;
            }
            if (self.student && self.student.length > 0) {
              self.student.map(k => {
                self.studentlist.map(v => {
                  if (k.id == v.id) {
                    k.count = v.count;
                  }
                });
              });
            }
          } else if (type == "base" && params == "base") {
            self.basechecklist[1].count = data.result.grouplist[0].count;
          } else if (type == "base" && params == "turn") {
            self.basechecklist[0].count = data.result.grouplist[0].count;
          }
        } else if (data.errdesc) {
          self.toast(data.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //获取参与人
    initstudentlist(param) {
      let self = this;
      // this.post('/actionplanbase/getattender', {
      //     command: 'actionplanbase/getattender',
      //     sessionid: $.cookie('sid'),
      //     loginid: $.cookie('uid'),
      //     actionplanlevel: 'office',
      //     officeattend: param,
      //     actiontime: JSON.stringify(self.timeArr),
      //     deptid: self.selectlevels.id
      // }).done((data) => {
      //     if (data && data.errcode == 0) {
      //         self.studentlist = [];
      //         self.selofficelist = [];
      //         self.selofficetraineelist = [];
      //         if (data.result.attendlist && data.result.attendlist.length > 0) {
      //             if (param == 'turndoctor') {
      //                 data.result.attendlist.map(value => {
      //                     self.selofficelist.push({
      //                         type: 2,
      //                         id: value.id,
      //                         name: value.name,
      //                         username: value.username
      //                     });
      //                 });
      //                 self.seloffice.show = true;
      //             } else if (param == 'trainee') {
      //                 data.result.attendlist.map(value => {
      //                     self.selofficetraineelist.push({
      //                         type: 3,
      //                         id: value.id,
      //                         name: value.name,
      //                         username: value.username
      //                     })
      //                 });
      //                 self.selofficetrainee.show = true;
      //             }
      //         }

      //     }
      // })
      if (self.surelevel.levelcode == "hospital") {
        if (param == "turndoctor") {
          this.post(
            "/base/turnplandetail/listTurnResident?pageSize=0&pageNum=0",
            {
              hospitalId: self.hosIdByDept,
              // deptId: self.selectlevels.id,
              actionDateList: [
                self.date
              ],
              userId: $.cookie("uid")
            }
          ).done(data => {
            if (data && data.resCode == 200) {
              self.studentlist = [];
              self.selofficelist = [];
              self.selofficetraineelist = [];
              if (data.rows) {
                if (param == "turndoctor") {
                  data.rows.map(value => {
                    self.selofficelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.selofficetrainee.show = true;
                }
              } else {
                self.toast("当前没有查询到该类型的学员。");
              }
            }
          });
        } else {
          this.post(
            "/base/traineeplandetail/listTurnTrainee?pageSize=0&pageNum=0",
            {
              hospitalId: self.hosIdByDept,
              // deptId: self.selectlevels.id,
              actionDateList: [
                self.date
              ],
              userId: $.cookie("uid")
            }
          ).done(data => {
            if (data && data.resCode == 200) {
              self.studentlist = [];
              self.selofficelist = [];
              self.selofficetraineelist = [];
              if (data.rows) {
                if (param == "turndoctor") {
                  data.rows.map(value => {
                    self.selofficelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.selofficetrainee.show = true;
                }
              } else {
                self.toast("当前没有查询到该类型的学员。");
              }
            }
          });
        }
      } else if (self.surelevel.levelcode == "office") {
          console.log(self.date)
        if (param == "turndoctor") {
          this.post(
            "/base/turnplandetail/listTurnResident?pageSize=0&pageNum=0",
            {
              hospitalId: self.hosIdByDept,
              deptId: self.selectlevels.id,
              actionDateList: [
                self.date
              ],
              userId: $.cookie("uid")
            }
          ).done(data => {
            console.log(data);
            console.log(param);
            if (data && data.resCode == 200) {
              self.studentlist = [];
              self.selofficelist = [];
              self.selofficetraineelist = [];
              if (data.rows) {
                if (param == "turndoctor") {
                  data.rows.map(value => {
                    self.selofficelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.selofficetrainee.show = true;
                }
              } else {
                self.toast("当前没有查询到该类型的学员。");
              }
            }
          });
        } else {
          this.post(
            "/base/traineeplandetail/listTurnTrainee?pageSize=0&pageNum=0",
            {
              hospitalId: self.hosIdByDept,
              deptId: self.selectlevels.id,
              actionDateList: [
                self.date
              ],
              userId: $.cookie("uid")
            }
          ).done(data => {
            if (data && data.resCode == 200) {
              self.studentlist = [];
              self.selofficelist = [];
              self.selofficetraineelist = [];
              if (data.rows) {
                if (param == "turndoctor") {
                  data.rows.map(value => {
                    self.selofficelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 0,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.selofficetrainee.show = true;
                }
              } else {
                self.toast("当前没有查询到该类型的学员。");
              }
            }
          });
        }
      }
    },
    //全选参与人
    choiceall(param) {
      let self = this;
      if (param == "turndoctor") {
        this.isCheckedAll_a = !this.isCheckedAll_a;
        if (this.isCheckedAll_a) {
          // 全选时
          self.student_turndoctor = self.selofficelist;
        } else {
          self.student_turndoctor = [];
        }
      } else if (param == "trainee") {
        this.isCheckedAll_b = !this.isCheckedAll_b;
        if (this.isCheckedAll_b) {
          // 全选时
          self.student_trainee = self.selofficetraineelist;
        } else {
          self.student_trainee = [];
        }
      }
    },
    //搜索参与人
    searchstudent() {
      let self = this;
      if (!self.studentname) {
        this.toast("请输入搜索内容");
        return;
      }
      this.post("/actionplanbase/getattenderforsearch", {
        command: "actionplanbase/getattenderforsearch",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        actionplanlevel: self.surelevel.levelcode,
        attendername: self.studentname
      }).done(data => {
        if (data && data.errcode == 0) {
          self.studentlist = [];
          self.searchlist = [];
          if (data.attendlist && data.attendlist.length > 0) {
            data.attendlist.map(value => {
              self.searchlist.push({
                type: 0,
                id: value.id,
                name: value.name,
                username: value.username
              });
            });
          }
          if (self.searchlist.length == 0) {
            self.toast("未搜索到哟~");
          } else {
            self.searchconfig.show = true;
          }
        }
      });
    },
    //删除参与人
    deletedoctor(param, params, type) {
      let self = this;
      if (params) {
        this.showConfirm({
          title: "温馨提示",
          msg: "您是否要删除当前参与人员？",
          theme: "modal-confirm modal-white",
          cancel: function() {},
          ok: function() {
            if (type == 0) {
              self.student.map((val, index) => {
                if (val.id == param) {
                  self.student.splice(index, 1);
                }
              });
            } else if (type == 2) {
              self.student_turndoctor.map((val, index) => {
                if (val.id == param) {
                  self.student_turndoctor.splice(index, 1);
                }
              });
            } else if (type == 3) {
              self.student_trainee.map((val, index) => {
                if (val.id == param) {
                  self.student_trainee.splice(index, 1);
                }
              });
            }
          }
        });
      } else {
        this.showConfirm({
          title: "温馨提示",
          msg: "您是否要删除当前选中主讲人？",
          theme: "modal-confirm modal-white",
          cancel: function() {},
          ok: function() {
            self.teacher.map((val, index) => {
              if (val.id == param) {
                self.teacher.splice(index, 1);
              }
            });
          }
        });
      }
    },
    //end 基地选择
    checkbase(param) {
      this.student.map((value, index) => {
        if (value.type == 1) {
          this.student.splice(index, 1);
        }
      });
      this.student.push(param);
      this.basechecklist.map(value => {
        if (value.attendbusinfo == param.attendbusinfo) {
          value.ischecked = true;
        } else {
          value.ischecked = false;
        }
      });
      let stemp = [];
      this.student.forEach(item => {
        let str = item.name + "-" + val.count + "人";
        stemp.push(str);
      });
      this.form.student = stemp.join("、");
      this.hospitalattend = param.attendbusinfo;
      this.newbasecount = param.name + "-" + param.count + "人";
    },
    // 提交
    submit() {
      let self = this;
      let { timeFlag, isempty } = this.checkTime();

      if (!self.selectlevels.id) {
        self.toast("请选择科室！");
        return;
      } else if (!self.typename) {
        self.toast("请选择活动类型！");
        return;
      } else if (!this.form.theme) {
        self.toast("请输入活动主题！");
        return;
      } else if (this.teacher.length <= 0) {
        self.toast("请选择主讲人！");
        return;
      } else if (!this.form.address) {
        self.toast("请选择活动地点！");
        return;
      } else if (!isempty) {
        this.toast("请选择日期或者时间!");
        reutrn;
      } else if (!timeFlag) {
        this.toast("请检查活动日期是否重复!");
        return;
      }
      let attendinfolist = [];
      let _student = [];
      if (self.surelevel.levelcode == "office") {
        _student = self.student
          .concat(self.student_turndoctor)
          .concat(self.student_trainee);
      } else if (self.surelevel.levelcode == "hospital") {
        // if (self.hossubmitlist.editflag) {
        //   _student = self.hossubmitlist.gradelist
        //     .concat(self.hossubmitlist.stutypelist)
        //     .concat(self.hossubmitlist.baselist);
        // } else {
        //   _student = self.editsubmitlist;
        // }
        _student = self.student
          .concat(self.student_turndoctor)
          .concat(self.student_trainee);
      } else {
        _student = self.student;
      }
      if (_student) {
        _student.map(val => {
          if (self.surelevel.levelcode == "hospital") {
            // attendinfolist.push({
            //   attendbusid: val.id,
            //   attendbusinfo: self.hosactivecount, 
            //   bustype: val.bustype,
            //   type: 1
            // });
            attendinfolist.push({
              attendbusid: val.id,
              attendbusinfo: val.name + "-" + val.username,
              bustype: "",
              type: val.type
            });
          } else if (self.surelevel.levelcode == "base") {
            if (val.type == 1) {
              attendinfolist.push({
                attendbusid: val.id,
                attendbusinfo: val.name + "-" + val.count,
                bustype: self.hospitalattend,
                type: val.type
              });
            } else {
              attendinfolist.push({
                attendbusid: val.id,
                attendbusinfo: val.name + "-" + val.username,
                bustype: self.hospitalattend,
                type: val.type
              });
            }
          } else {
            attendinfolist.push({
              attendbusid: val.id,
              attendbusinfo: val.name + "-" + val.username,
              bustype: "",
              type: val.type
            });
          }
        });
      }
      let _teacher = [];
      if (self.teacher) {
        self.teacher.map(val => {
          _teacher.push({ uid: val.id });
        });
      }

      let _filelist = [];
      if (self.filelist && self.filelist.length > 0) {
        self.filelist.map(value => {
          if (value.type == 1) {
            _filelist.push({
              uid: value.uid,
              fileurl: value.fileurl,
              filename: value.filename,
              type: value.type
            });
          }
        });
      }

      // 院级和基地级别的封装条件
      let opitions = {
        attendinfo: {
          gradebean: {
            bustype: "",
            gradelist: []
          },
          stdtypebean: {
            bustype: "",
            stdtypelist: []
          },
          basebean: {
            bustype: "",
            baselist: []
          }
        }
      };
      if (_student.length > 0) {
        opitions.attendinfo.actionplanlevel = self.surelevel.levelcode;
        opitions.attendinfo.deptid = self.selectlevels.id;
        opitions.attendinfo.actiontime = JSON.stringify(self.timeArr);

        if (self.surelevel.levelcode == "hospital") {
          //子组件来的封装
          if (
            self.hossubmitlist &&
            self.hossubmitlist.gradelist &&
            self.hossubmitlist.gradelist.length > 0
          ) {
            self.hossubmitlist.gradelist.map(item => {
              opitions.attendinfo.gradebean.gradelist.push(item.id);
            });
            self.hossubmitlist.stutypelist.map(item => {
              opitions.attendinfo.stdtypebean.stdtypelist.push(item.id);
            });
            self.hossubmitlist.baselist.map(item => {
              opitions.attendinfo.basebean.baselist.push(item.id);
            });
          } else {
            self.editsubmitlist.map(item => {
              if (item.bustype == "grade") {
                opitions.attendinfo.gradebean.gradelist.push(item.id);
              } else if (item.bustype == "type") {
                opitions.attendinfo.stdtypebean.stdtypelist.push(item.id);
              } else if (item.bustype == "base") {
                opitions.attendinfo.basebean.baselist.push(item.id);
              }
            });
          }
          opitions.attendinfo.gradebean.bustype = "grade";
          opitions.attendinfo.stdtypebean.bustype = "stdtype";
          opitions.attendinfo.basebean.bustype = "baselist";
          if (self.student && self.student.length > 0) {
            opitions.attendinfo.hospitalbusidlist = [];
            self.student.map(value => {
              if (value.type == 1) {
                opitions.attendinfo.hospitalbusidlist.push(value.id);
              }
            });
          }
        } else if (self.surelevel.levelcode == "base") {
          for (let i = 0; i < self.basechecklist.length; i++) {
            if (self.basechecklist[i].ischecked == true) {
              opitions.attendinfo.baseattend =
                self.basechecklist[i].attendbusinfo;
              break;
            }
          }
        }
      }
      this.showConfirm({
        title: "温馨提示",
        msg: "您是否确认提交？",
        theme: "modal-confirm modal-white",
        cancel: function() {},
        ok: function() {
          self
            .post("/actionplan/updateactionplan", {
              command: "actionplan/updateactionplan",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              uid: $.cookie("uid"),
              id: self.detailid,
              actionplanlevel: self.surelevel.levelcode,
              theme: self.form.theme,
              type: self.typename.key,
              deptid: self.selectlevels.id,
              place: self.form.address,
              actiontime: JSON.stringify(self.timeArr),
              attendinfolist: attendinfolist,
              speakerlist: _teacher,
              remark: self.form.remark,
              filelist: _filelist,
              period: self.form.period ? Number(self.form.period) : null,
              ...opitions
            })
            .done(function(data) {
              if (data && data.errcode == 0) {
                self.toast("修改成功~");
                setTimeout(() => {
                  if (self.$route.query.isOverseer) {
                    self.$router.push({
                      name: "activity_detail",
                      query: {
                        id: self.$route.query.id,
                        ishistory: false,
                        isOverseer: true,
                        grade: self.$route.query.grade
                      }
                    });
                  } else {
                    self.$router.push({
                      name: "fdAction_detail",
                      query: {
                        id: self.detailid
                      }
                    });
                  }
                }, 500);
              } else if (data.errdesc) {
                self.toast(data.errdesc);
              } else {
                self.toast("服务器错误，请联系管理员。");
              }
            })
            .fail(function(error) {});
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
          if (self.$route.query.isOverseer) {
            self.$router.push({
              name: "activity_detail",
              query: {
                id: self.$route.query.id,
                ishistory: false,
                isOverseer: true,
                grade: self.$route.query.grade
              }
            });
          } else {
            self.$router.push({
              name: "fdAction_list"
            });
          }
        }
      });
    },
    getPeriodSetList() {
      let self = this
      self.get(`/base/commpara/getListByCode?code=teachingActionPlanPeriodSet_4`).done(res => {
        if(res.resCode == 0 || res.resCode == 200) {
          self.teachingActionPlanPeriodSetList = res.model
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.shade {
  height: 100%;
  width: 100%;
  min-width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}

.main {
  margin-top: 0.1rem;
  padding-bottom: 0.6rem;
  li:nth-child(3),
  li:nth-child(5),
  li:nth-child(8) {
    border-bottom: 1px solid #eee;
    margin-bottom: 0;
  }
  li:last-child {
    height: 1.6rem;
    display: flex;
    align-items: center;
  }
}

li {
  background: #fff;
  height: 0.65rem;
  line-height: 0.65rem;
  padding: 0 0.4rem;
  position: relative;
  color: #666;
  font-size: 0.26rem;
  font-family: "Microsoft YaHei";
  margin-bottom: 0.1rem;
  display: flex;
  label {
    flex: 1;
    line-height: 0.65rem;
    text-align: justify;
    text-align-last: justify;
    margin-right: 0.3rem;
    vertical-align: top;
  }
  > textarea {
    display: flex;
    flex: 3;
  }
  > div,
  > span,
  > input {
    display: flex;
    flex: 3;
    height: 0.62rem;
    line-height: 0.62rem;
    overflow: hidden;
    span {
      flex: 1;
      width: 0;
      line-height: 0.62rem;
    }
  }
  > p {
    flex: 3;
    height: 0.62rem;
    padding-right: 0.2rem;
    overflow: hidden;
    i {
      overflow: hidden;
    }
  }
}

.choice:after {
  content: "";
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0.3rem;
  top: 0.15rem;
}

.radio-box:before {
  content: "";
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  margin-right: 0.05rem;
  border-radius: 50%;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  background-image: url("../../assets/images/gouxuan.png");
  background-size: cover;
}

.radio-active:before {
  background-image: url("../../assets/images/gouxuan_on.png");
  background-size: cover;
}

.radio-disabled {
  pointer-events: none;
  color: #aaa;
}

.checkbase:after {
  position: absolute;
  right: 0.2rem;
  top: 0.15rem;
  content: "";
  display: inline-block;
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.05rem;
  border-radius: 50%;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  background-image: url("../../assets/images/gouxuan.png");
  background-size: cover;
}

.checkbase-active:after {
  background-image: url("../../assets/images/gouxuan_on.png");
  background-size: cover;
}

p {
  margin: 0;
}

i {
  font-style: normal;
  line-height: 0.65rem;
  padding-right: 0.1rem;
}

textarea {
  display: inline-block;
  width: calc(100% - 2rem);
  height: 1.4rem;
  margin-top: 0.1rem;
  align-self: flex-start;
}

.department {
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;
  position: absolute;
  top: 0;
  z-index: 999;
}

.type {
  background: #fff;
  width: 100%;
  /*z-index: 10000;*/
  text-align: center;
}

.search {
  position: relative;
  margin: 0.1rem 0.2rem;
  border: 1px solid #eee;
  border-radius: 0.3rem;
  height: 0.6rem;
  input {
    margin: 0.1rem 0 0.1rem 0.2rem;
    height: 0.4rem;
    width: calc(100% - 1rem);
    background: transparent;
    display: inline-block;
  }
  i {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    margin: 0.1rem;
    background: url("../../assets/images/icon-search.png") 0 0 no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    vertical-align: middle;
    z-index: 99;
  }
}

s {
  text-decoration: none;
}

.students,
.remark {
  height: auto;
  p {
    height: auto;
    min-width: 100%;
  }
  span {
    line-height: 0.35rem;
  }
}

li.add {
  height: auto;
  input {
    opacity: 0;
    position: absolute;
    left: 2rem;
    width: calc(100% - 5.4rem);
    height: 100%;
  }
  p {
    height: auto;
  }
  s {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    background: url("../../assets/images/attachment.png") 0 0 no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  i {
    font-style: normal;
    color: #3499db;
    padding-left: 0.2rem;
  }
}

.result {
  display: inline-block;
  width: 100%;
  height: 0.6rem;
  background: #fff;
  position: absolute;
  bottom: 0;
  padding: 0 0.4rem;
  color: #666;
  z-index: 999;
  border-top: 1px solid #eee;
  p {
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.25rem;
  }
  p:after {
    content: "";
    display: inline-block;
    width: 0.3rem;
    height: 0.3rem;
    background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0.3rem;
    top: 0.15rem;
  }
}

.doctorupdata {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

i.deleteitem {
  display: inline-block;
  height: 0.5rem;
  line-height: 0.5rem;
  font-style: normal;
  color: #fff;
  padding: 0 0.1rem;
  text-align: center;
  background: #f56c6c;
  border-radius: 5px;
}

.selectRdaio {
  background-color: #fff;
  margin-left: 14px;
  padding-right: 14px;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #333333;
  border-bottom: 1px solid #ebedf0;
}

.selfRdaio {
  width: calc(100% - 100px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #111;
}

.margin-gap {
  background-color: #fff;
  margin-top: 8px;
}

.margin-gap img {
  width: 18px;
  height: 18px;
}

.addTime {
  height: 36px;
  padding: 9px 0;
  margin-left: 14px;
  padding-right: 14px;
  border-top: 1px solid #ebedf0;
  box-sizing: content-box;
  background-color: #fff;
}

.addTime div {
  height: 100%;
  text-align: center;
  background: #f8fbff;
  border: 0.8px solid rgba(204, 220, 237, 1);
  border-radius: 6px;
  line-height: 39px;
  font-size: 17px;
  color: #7b96b1;
}

.otherInfo {
  background-color: #fff;
  height: 46px;
  line-height: 46px;
  margin-left: 14px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #ebedf0;
}

/* .otherInfo span {
        margin-left: 14px;
    } */

.bottom-gap {
  margin-bottom: 75px;
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 46px;
  padding: 8px 14px;
  box-sizing: content-box;
  background: #fff;
}

.submitBtn {
  font-size: 17px;
  height: 100%;
  line-height: 46px;
  text-align: center;
  color: #fff;
  background: #2685d2;
  border-radius: 4px;
}

.whiteCol {
  background-color: #fff;
}
</style>
<style>
.new-edit-active #picker-main header span:nth-child(1) {
  text-align: left;
  font-size: 14px;
}

.new-edit-active #picker-main header span:nth-child(2) {
  text-align: right;
  font-size: 14px;
}
</style>

<style lang="scss">
.afhakfa .van-cell__value span{
  color: #c8c9cc !important;
}
i.van-icon {
  line-height: 24px
}
.van-cell__value {
  line-height: 24px
}
</style>