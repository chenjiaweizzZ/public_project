<template>
  <div class="g-wrapper new-add-active">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>新增教学活动计划
      <!-- <div slot="headerRight" @click="submit" style="font-size: 0.3rem">
                提交
      </div>-->
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
                <li @click="getstarttime.show = true;">
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
                        <i v-if="surelevel.levelcode == 'hospital' ">{{hospitalcount}}</i>
                        <i v-if="surelevel.levelcode == 'base' " v-for='(val,index) in student'>
                            {{val.name}} - {{val.count}}人
                        </i>
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
            <!-- <van-radio-group v-model="levelcode" class="selfRdaio">
              <van-radio
                :name="item.levelcode"
                @click="selectlevel(item)"
                :disabled="item.levelvalue == 0"
                v-for="(item,index) in levellist"
              >{{item.levelname}}</van-radio>
            </van-radio-group>-->
            <el-radio-group v-model="levelcode" class="selfRdaio">
              <el-radio
                :label="item.levelcode"
                :name="item.levelcode"
                @click.native="selectlevel(item,$event)"
                :disabled="item.levelvalue == 0"
                v-for="(item,index) in levellist"
                :key="index"
              >{{item.levelname}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <van-cell
          :title="levelname"
          :value="form.dept"
          is-link
          size="large"
          @click="sellevel"
          :class="form.dept=='请选择' ? '' : 'weightCol'"
        />

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
        <div class="whiteCol">
          <div class="addTime" @click="addTime">
            <div>添加活动时间</div>
          </div>
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
          <van-cell
            title="主讲人/主持人"
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
          <van-field v-model="form.remark" type="textarea" placeholder="请输入" :autosize="autosize" maxlength="100">
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
                >删&emsp;除</i>
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
                  >删&emsp;除</i>
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
          <div class="g-main">
            <div class="search">
              <input type="text" v-model="searchname" placeholder="搜索" />
              <i @click="searchteacher()"></i>
            </div>
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
          <div class="g-main">
            <!-- <div class="search" v-if="surelevel.levelcode != 'hospital'">
              <input type="text" v-model="studentname" placeholder="搜索" />
              <i @click="searchstudent()"></i>
            </div> -->
            <!-- <template v-if="surelevel.levelcode == 'hospital'">
              <ul>
                <li class="choice" @click="initstudentlist('turndoctor')">住院医</li>
                <li class="choice" @click="initstudentlist('trainee')">实习生</li>
              </ul> -->
              <!--<ul>-->
              <!--<li class="choice"  @click = 'getgradelist(gradelist,"grade","hospital")'>根据年级选择</li>-->
              <!--<li class="choice" @click = 'getgradelist(stutypelist,"type","hospital")'>根据学员类型选择</li>-->
              <!--</ul>-->
              <!-- <div class="cascade">
                <div class="cascade_item_content">
                  <div class="cascade_item_wrap">
                    <p>年级</p>
                    <div class="cascade_item gread">
                      <ul class="grade">
                        <li @click="selectAllGrade">
                          <i class="mk"></i>全部
                        </li>
                        <li
                          @click="selectGrade(index,item)"
                          v-for="(item,index) in hos_grade_list"
                          :class="{'active':oneGrade[index]}"
                          :gradeItem="JSON.stringify(item)"
                        >
                          <i class="mk"></i>
                          {{item.name}}
                        </li>
                      </ul>
                    </div>
              </div>-->
              <!-- <div class="cascade_item_wrap">
                    <p>学员类型</p>
                    <div class="cascade_item stutype">
                      <ul class="stutype">
                        <li @click="selectAllstudenttype">
                          <i class="mk"></i>全部
                        </li>
                        <li
                          @click="selectStutype(index,item)"
                          v-for="(item,index) in hos_stutype_list"
                          :class="{'active':oneStutype[index]}"
                          :gradeItem="JSON.stringify(item)"
                        >
                          <i class="mk"></i>
                          {{item.name}}
                        </li>
                      </ul>
                    </div>
              </div>-->
              <!-- <div class="cascade_item_wrap">
                    <p>基地</p>
                    <div class="cascade_item base">
                      <ul class="base">
                        <li @click="selectAllBase">
                          <i class="mk"></i>全部
                        </li>
                        <li
                          @click="selectBase(index,item)"
                          v-for="(item,index) in hos_base_list"
                          :class="{'active':oneBase[index]}"
                          :gradeItem="JSON.stringify(item)"
                        >
                          <i class="mk"></i>
                          {{item.deptname}}
                        </li>
                      </ul>
                    </div>
              </div>-->
              <!-- <div class="cascade_item_wrap">
                    <p>院区</p>
                    <div class="cascade_item base">
                      <ul class="base">
                        <li @click="selectAllBase">
                          <i class="mk"></i>全部
                        </li>
                        <li
                          @click="selectBase(index,item)"
                          v-for="(item,index) in hos_list"
                          :class="{'active':oneBase[index]}"
                          :gradeItem="JSON.stringify(item)"
                        >
                          <i class="mk"></i>
                          {{item.name}}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="operation">
                  <div>
                    <button @click="hospitalresult">重置</button>
                    <button @click="hospitalsubmit">确定</button>
                  </div>
                </div>
              </div>-->
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
          >
            <p>
              已选参与人
              <template v-if="surelevel.levelcode == 'office' || surelevel.levelcode == 'hospital'">
                ({{ Number(student.length) + Number(student_turndoctor.length)
                + Number(student_trainee.length)}})
              </template>
              <template v-else>({{newbasecount}})</template>
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
    <div class="rotationh">
      <van-popup
        v-model="hospitalconfig.show"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-picker
          ref="hospital"
          show-toolbar
          title="请选择"
          :columns="hospitalList"
          value-key="name"
          @confirm="hospitalonConfirm"
          @cancel="hospitalonCancel"
          :default-index="0"
        />
      </van-popup>
    </div>
    <div class="rotationh">
      <van-popup
        v-model="popShow"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-picker
          ref="pick"
          show-toolbar
          title="请选择"
          :columns="columnsc"
          value-key="name"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
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
              :data="treeList"
              :props="defaultProps"
              @check-change="checkClick"
              @check="changetree"
              node-key="id"
              :default-checked-keys="deptnameidList"
              :default-expanded-keys="deptnameidList"
              ref="tree"
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
import cPicker from "../../components/default-picker";
import { mapState, mapActions } from "vuex";
import { Radio } from "element-ui";
let bus = new Vue();
export default {
  components: {
    cHeader,
    cModal,
    cTab,
    cTabs,
    cTimepicker,
    cPicker
  },
  data() {
    return {
      searchFlag: true,
      searchArr: [],
      levelcode: "",
      bus: bus,
      searchConfig: {
        id: 0,
        pid: 0
      },
      data: "",
      hosIdByDeptSave: 0,
      hosIdByDept: 0,
      levellist: [], //活动级别
      levelname: "科室", //显示当前在选择什么
      surelevel: "", //选择的活动级别
      hospitallist: "", //医院列表
      selectlevels: "", //选中的科室
      baselist: "", //基地列表
      officelist: "", //科室列表
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
        // {
        //   name: "正在该基地轮转的学员",
        //   id: "",
        //   attendbusinfo: "turn",
        //   type: 1,
        //   count: "",
        //   ischecked: false
        // },
        {
          name: "专业在该基地的学员",
          id: "",
          attendbusinfo: "base",
          type: 1,
          count: "",
          ischecked: false
        }
      ],
      isCheckedAll_a: false,
      isCheckedAll_b: false,
      searchconfig: {
        show: false,
        title: "选择搜索的参与人员"
      },
      searchlist: [],
      hospitalbusidlist: "",
      hospitalattend: "",
      //2018-11-20
      hos_grade_list: [],
      hos_stutype_list: [],
      hos_base_list: [],
      hos_list: [],
      allGrade: false,
      allStutype: false,
      allBase: false,
      oneGrade: [], //年级选项
      oneStutype: [], //学生类型选项
      oneBase: [], //基地选项
      //院级活动选中的
      gradesubmitlist: [],
      stutypesubmitlist: [],
      basesubmitlist: [],
      hospitalcount: "", //院级活动参与人数
      hossubmitlist: {}, //提交的院级活动参与人(内含三个类型的数组)
      //18-11-29
      newbasecount: "",
      //18-12-06
      inittranieelist: "",
      date: "",
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
      hospitalconfig: {
        show: false
        // label: "hospitalname",
        // fixedvalue: "1.52rem",
        // textposition: "center",
        // hospitalselect: 0
      },
      baseconfig: {
        show: false
        // label: "deptname",
        // fixedvalue: "1.52rem",
        // textposition: "center"
      },
      deptconfig: {
        show: false
        // label: "deptname",
        // fixedvalue: "1.52rem",
        // textposition: "center"
      },
      indexList: [0, 0, 0],
      columnsc: [],
      popShow: false,
      popShow2: false,
      columns: [],
      oriactiveKey: "",
      activeKey: "",
      treeList: [],
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
      orideptnameidList: [],
      deptnameidList: [],
      hospitalList: [],
      teachingActionPlanPeriodSetList: []
    };
  },
  computed: {},
  watch: {
    surelevel: function(val) {
      if (val) {
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
    },
    "selectlevels.id": function(val, oldval) {
      if (val != oldval) {
        if (this.surelevel.levelcode == "office") {
          this.checkalltrainee();
        }
      }
    },
    "typename.name": function(val, oldval) {
      if (val != oldval) {
        this.checkalltrainee();
      }
    }
  },
  created() {},
  mounted() {
    var self = this;
    this.initgrade();
    this.initstutype();
    this.initalldept();
    this.inittypelist();
    this.inithospitalgradelist();
    this.inithospitalstudentlist();
    this.inithospitalbaselist();
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.hospitalresult();
    this.initisgettrainee();
    this.getTree();
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
    // 18-12-06  科室级活动自带实习生
    cancelTime() {
      this.showTime = false;
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
      if (type == 1) {
        this.searchconfig.show = false;
      } else {
        this.form.student = stemp.length == 0 ? "请选择" : stemp.join("、");
        this.choicestudent = false;
      }
    },
    confirmselofficetrainee(type) {
      let stemp = [];
      console.log(this.surelevel.levelcode)
      // if (this.surelevel.levelcode == "office" && this.surelevel.levelcode == "hospital") {
        
      // }  
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
      this.form.student = stemp.length == 0 ? "请选择" : stemp.join("、");
      if (type == 0) {
        this.seloffice.show = false;
      } else {
        this.selofficetrainee.show = false;
      }
      // this.selofficetrainee.show = false;
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
        // let temp = moment(current.date).format('YYYY-M/M-DD')
        let temp = current.date.replace(/-/g, "/");
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
          // let temp = moment(current.date).format('YYYY-MM-DD')
          current.start = new Date(temp + " " + current.startTime).getTime();
        }
        if (current.endTime != "" && current.endTime != "请选择") {
          // let temp = moment(current.date).format('YYYY-MM-DD')
          current.end = new Date(temp + " " + current.endTime).getTime();
        }
      }
      console.log(current, "current");
      this.timeArr.splice(this.currentIndex, 1, current);
    },
    selectDate(index) {
      this.showDate = true;
      this.currentIndex = index;
    },
    deleteTime(index) {
      if (this.timeArr.length == 1) {
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
    initisgettrainee() {
      this.post("/actionplanbase/getautocheckteachtype", {
        command: "actionplanbase/getautocheckteachtype",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid")
      }).done(res => {
        if (res && res.errcode == 0) {
          this.inittranieelist = res.beanlist;
        } else if (res.errdesc) {
          this.toast(res.errdesc);
        } else {
          this.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //自动带上所有实习生
    checkalltrainee() {
      let { timeFlag, isempty } = this.checkTime();
      let self = this;
      if (self.surelevel.levelcode !== "office") {
        return;
      } else if (!self.selectlevels.id || self.selectlevels.id == "") {
        return;
      } else if (!self.typename.id || self.typename.id == "") {
        return;
      } else if (!isempty) {
        this.toast("请选择日期或者时间!");
        return;
      } else if (!timeFlag) {
        this.toast("请检查活动日期是否重复!");
        return;
      } else {
        self.inittranieelist.map(item => {
          if (self.typename.id == item.id) {
            this.post("/actionplanbase/getattender", {
              command: "actionplanbase/getattender",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              actionplanlevel: self.surelevel.levelcode, //活动类别,
              actiontime: JSON.stringify(self.timeArr),
              officeattend: "trainee",
              deptid: self.selectlevels.id
            }).done(res => {
              if (res && res.errcode == 0) {
                //student_trainee
                res.result.attendlist.map(value => {
                  self.student_trainee.push({
                    type: 0,
                    id: value.id,
                    name: value.name,
                    username: value.username
                  });
                });
              } else if (res.errdesc) {
                this.toast(res.errdesc);
              } else {
                this.toast("服务器错误，请联系管理员。");
              }
            });
            return;
          } else {
            self.student_trainee = [];
          }
        });
        // }
      }
    },

    //18-11-20 院级参与人选择业务修改
    // 院级年级列表
    inithospitalgradelist() {
      let self = this;
      this.post("/traineestudent/queryDictionaryList", {
        command: "traineestudent/queryDictionaryList",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        code: "turngrade"
      }).done(res => {
        if (res && res.errcode == 0) {
          self.hos_grade_list = res.dic_list;
          self.initGrade();
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    // 学员类型
    inithospitalstudentlist() {
      let self = this;
      this.post("/traineestudent/queryDictionaryList", {
        command: "traineestudent/queryDictionaryList",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        code: "stud_type"
      }).done(res => {
        if (res && res.errcode == 0) {
          self.hos_stutype_list = res.dic_list;
          self.initStutype();
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },
    //院级基地选择
    inithospitalbaselist() {
      let self = this;
      this.post("/deptinfo/getdeptlist", {
        command: "deptinfo/getdeptlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid"),
        deptcode: "base"
      }).done(res => {
        if (res && res.errcode == 0) {
          self.hos_base_list = res.beanlist;
          self.initBase();
        } else if (res.errdesc) {
          self.toast(res.errdesc);
        } else {
          self.toast("服务器错误，请联系管理员。");
        }
      });
    },

    //年级选择全部
    selectAllGrade() {
      this.allGrade = this.allGrade ? false : true;
      this.initGrade();
    },
    initGrade() {
      let _list = [];
      let _checklist = [];
      this.hos_grade_list.map((item, index) => {
        if (this.allGrade) {
          _list.push(true);
          //    _checklist.push(item)
        } else {
          _list.push(false);
          this.gradesubmitlist = [];
        }
      });
      this.oneGrade = _list;
      //    this.gradesubmitlist = _checklist
    },
    //选择单个的年级
    selectGrade(index, item) {
      if (this.allGrade) {
        this.allGrade = false;
        this.gradesubmitlist = [];
      }

      for (let i = 0; i < this.oneGrade.length; i++) {
        if (i === index) {
          this.oneGrade[index]
            ? this.oneGrade.splice(index, 1, false)
            : this.oneGrade.splice(index, 1, true);
        }
      }
    },

    // 学生类型选择全部
    selectAllstudenttype() {
      this.allStutype = this.allStutype ? false : true;
      this.initStutype();
    },
    initStutype() {
      let _list = [];
      let _checklist = [];
      this.hos_stutype_list.map(item => {
        if (this.allStutype) {
          _list.push(true);
          _checklist.push(item);
        } else {
          _list.push(false);
          this.stutypesubmitlist = [];
        }
      }),
        (this.oneStutype = _list);
      //    this.stutypesubmitlist = _checklist
    },
    selectStutype(index, item) {
      if (this.allStutype) {
        this.allStutype = false;
        this.stutypesubmitlist = [];
      }
      for (let i = 0; i < this.oneStutype.length; i++) {
        if (i === index) {
          this.oneStutype[index]
            ? this.oneStutype.splice(index, 1, false)
            : this.oneStutype.splice(index, 1, true);
        }
      }
    },

    //基地类型
    selectAllBase() {
      this.allBase = this.allBase ? false : true;
      this.initBase();
    },
    initBase() {
      let _list = [];
      let _checklist = [];
      this.hos_base_list.map(item => {
        if (this.allBase) {
          _list.push(true);
          _checklist.push(item);
        } else {
          _list.push(false);
          this.basesubmitlist = [];
        }
      }),
        //    this.basesubmitlist = _checklist;
        (this.oneBase = _list);
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

    //重置
    hospitalresult() {
      let self = this;
      self.allGrade = false;
      self.allStutype = false;
      self.allBase = false;
      self.initGrade();
      self.initStutype();
      self.initBase();
    },
    //保存
    hospitalsubmit() {
      let self = this;
      let _gradelist = [];
      let _stutylist = [];
      let _baselist = [];
      let _submitgradelist = [];
      let _submitstutypelist = [];
      let _submitbaselist = [];
      $(".grade li.active").each((index, val) => {
        _submitgradelist.push(JSON.parse($(val).attr("gradeItem")));
      });
      self.gradesubmitlist = _submitgradelist;
      $(".stutype li.active").each((index, val) => {
        _submitstutypelist.push(JSON.parse($(val).attr("gradeItem")));
      });
      self.stutypesubmitlist = _submitstutypelist;
      $(".base li.active").each((index, val) => {
        _submitbaselist.push(JSON.parse($(val).attr("gradeItem")));
      });
      self.basesubmitlist = _submitbaselist;
      //赋值给提交列表
      //gradesubmitlist:[],
      //stutypesubmitlist:[],
      //basesubmitlist:[],
      //  student
      if (
        this.gradesubmitlist.length == 0 &&
        this.stutypesubmitlist.length == 0 &&
        this.basesubmitlist.length == 0
      ) {
        self.hospitalcount = "";
        self.choicestudent = false;
        return;
      } else {
        //赋值给查看列表 （list）
        if (self.gradesubmitlist.length > 0) {
          self.gradesubmitlist.map(item => {
            item.bustype = "grade";
            _gradelist.push(item.id);
          });
        }
        if (self.stutypesubmitlist.length > 0) {
          self.stutypesubmitlist.map(item2 => {
            item2.bustype = "type";
            _stutylist.push(item2.id);
          });
        }
        if (self.basesubmitlist.length > 0) {
          self.basesubmitlist.map(item3 => {
            item3.bustype = "base";
            _baselist.push(item3.id);
          });
        }
        //self.student = _submitlist;
        self.hossubmitlist = {
          gradelist: self.gradesubmitlist,
          stutypelist: self.stutypesubmitlist,
          baselist: self.basesubmitlist
        };
        self
          .post("/actionplanbase/getattender", {
            command: "actionplanbase/getattender",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            actionplanlevel: "hospital",
            actiontime: JSON.stringify(self.timeArr),
            gradebean: {
              bustype: "grade",
              gradelist: _gradelist
            },
            stdtypebean: {
              bustype: "stdtype",
              stdtypelist: _stutylist
            },
            // basebean: {
            //   bustype: "base",
            //   baselist: _baselist
            // },
            basebean: {
              bustype: "hospital",
              hospitallist: _baselist
            }
          })
          .done(res => {
            if (res && res.errcode == 0) {
              if (
                res.result.grouplist.length > 0 &&
                res.result.grouplist[0].count
              ) {
                self.hospitalcount = res.result.grouplist[0].count + "人";
              } else {
                self.hospitalcount = 0 + "人";
              }
              self.choicestudent = false;
            } else if (res.errdesc) {
              self.toast(res.errdesc);
            } else {
              self.toast("服务器错误，请联系管理员。");
            }
            // console.log("人人", self.hospitalcount);
            let stemp = [];
            if (this.surelevel.levelcode == "hospital") {
              stemp.push(this.hospitalcount);
            }
            this.form.student = stemp.length == 0 ? "请选择" : stemp.join("、");
          });
      }
    },
    // end .......

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
          // if (hospital.levelvalue == 0 && base.levelvalue == 0) {
          //   self.selectlevels = self.officelist[0];
          //   self.seldept.mainlist = self.officelist;
          //   self.initteacherlist(self.selectlevels.id);
          //   _levellist.map(value => {
          //     if (value.levelcode == "office") {
          //       value.checkflag = true;
          //       self.surelevel = value;
          //     }
          //   });
          // }
          self.levellist = _levellist;
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
        // this.seldept.show = true;
        if (this.levelcode == "hospital") {
          this.hospitalconfig.show = true;
        } else if (this.levelcode == "base") {
          this.popShow = true;
        } else if (this.levelcode == "office") {
          this.popShow2 = true;
        }
      }
    },
    //end 选择科室
    selectdept(data) {
      if (!this.levelcode) {
        this.toast("请先选择活动级别");
        return false;
      }
      this.selectlevels = data;
      this.teacherlist = [];
      this.teacher = [];
      this.studentlist = [];
      this.student = [];
      this.student_turndoctor = [];
      this.student_trainee = [];
      // if (this.surelevel.levelcode == 'office' || param.levelcode == 'hospital') {
      this.initteacherlist(this.selectlevels.id);
      // } else
      //   if (this.surelevel.levelcode == "base") {
      //     this.basechecklist.map(value => {
      //       value.id = this.selectlevels.id;
      //     });
      //   }
      this.seldept.show = false;
      this.form.dept = this.selectlevels.deptname || this.selectlevels.name;
    },
    //选择活动级别
    selectlevel(param, e) {
      console.log(e.target.tagName === "INPUT", param.levelvalue == 0);
      if (e.target.tagName === "INPUT" || param.levelvalue == 0) return;
      console.log(param);
      let self = this;
      if (param == this.surelevel) {
        return;
      }
      this.teacherlist = [];
      this.teacher = [];
      this.studentlist = [];
      this.student = [];
      this.selectlevels = "";
      //11-29
      this.hospitalcount = "";
      this.student_turndoctor = [];
      this.student_trainee = [];
      this.studentname = "";
      let _list = [];
      let _list2 = [];
      let _list3 = [];
      this.hos_grade_list.map(item => {
        _list.push(false);
      });
      this.hos_stutype_list.map(item => {
        _list2.push(false);
      });
      this.hos_base_list.map(item => {
        _list3.push(false);
      });
      this.oneGrade = _list;
      this.oneStutype = _list2;
      this.oneBase = _list3;
      this.basechecklist.map(val => {
        val.ischecked = false;
      });
      //end
      this.surelevel = param;
      this.levellist.map(value => {
        if (value.levelcode == param.levelcode) {
          value.checkflag = true;
        } else {
          value.checkflag = false;
        }
      });
      this.form.dept = "请选择";
      this.form.speakers = "请选择";
      // this.teacher = []
      self.selectlevels = {};
      this.form.student = "请选择";
      this.levelcode = param.levelcode;
      if (param.levelcode == "hospital") {
        this.levelname = "院校";
        self.seldept.mainlist = self.hospitallist;
        // self.selectlevels = {};
        self.student_trainee = [];
        self.orideptnameidList = [];
        self.deptnameidList = [];
        self.indexList = [0, 0, 0];
        self.activeKey = 0;
        self.$refs.pick.setColumnIndex(0, 0);
        self.$refs.pick.setColumnIndex(1, 0);
        self.$refs.pick.setColumnIndex(2, 0);
        this.$refs.tree.setCheckedKeys([]);
      } else if (param.levelcode == "base") {
        this.levelname = "基地";
        self.seldept.mainlist = self.baselist;
        // self.selectlevels = {};
        self.student_trainee = [];
        self.orideptnameidList = [];
        self.deptnameidList = [];
        self.indexList = [0, 0, 0];
        self.activeKey = 0;
        self.$refs.hospital.setColumnIndex(0);
        this.$refs.tree.setCheckedKeys([]);
      } else {
        this.levelname = "科室";
        self.seldept.mainlist = self.officelist;
        self.$refs.hospital.setColumnIndex(0);
        self.$refs.pick.setColumnIndex(0, 0);
        self.$refs.pick.setColumnIndex(1, 0);
        self.$refs.pick.setColumnIndex(2, 0);
        // self.initteacherlist(self.selectlevels.id);
      }
      console.log(self.levelcode);
    },
    //选择活动类型
    selecttype(data) {
      console.log(data)
      console.log(this.teachingActionPlanPeriodSetList)
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
        this.searchname = ""
        this.choiceteacher = true;
      }
    },
    //end 选择主讲人
    closeteacher() {
      if (this.teacher.length <= 0) {
        this.toast("请选择主讲人");
      } else {
        this.choiceteacher = false;
        let temp = [];
        this.teacher.forEach(item => {
          temp.push(item.name);
        });
        this.form.speakers = temp.length == 0 ? "请选择" : temp.join("、");
      }
    },
    //获取主讲人
    initteacherlist(param) {
      console.log(this.levelcode)
      if (!this.levelcode) {
        return false;
      }
      let self = this;
      // this.post("/actionplanbase/getspeaker", {
      //   command: "actionplanbase/getspeaker",
      //   sessionid: $.cookie("sid"),
      //   loginid: $.cookie("uid"),
      //   actionplanlevel: this.levelcode,
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
          hospitalId: param,
        }
        self.searchConfig.id = param
      }else if(this.levelcode == "base") {
        params = {
          hospitalId: self.hosIdByDept,
          baseId: param
        }
        self.searchConfig.pid = self.hosIdByDept
        self.searchConfig.id = param
      }else if(this.levelcode == "office") {
        params = {
          hospitalId: self.hosIdByDept,
          deptId: param
        }
        self.searchConfig.pid = self.hosIdByDept
        self.searchConfig.id = param
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
      if (self.searchname == "" && self.surelevel.levelcode == "office") {
        self.initteacherlist(self.selectlevels.id);
      } else if (!self.searchname) {
        this.toast("请输入您要搜索的内容");
        return;
      } else {
        let params;
      if(this.levelcode == "hospital") {
        params = {
          hospitalId: self.searchConfig.id,
          keyword: self.searchname
        }
      }else if(this.levelcode == "base") {
        params = {
          hospitalId: self.searchConfig.pid,
          baseId: self.searchConfig.id,
          keyword: self.searchname
        }
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
        // this.post("/actionplanbase/getspeakerforsearch", {
        //   command: "actionplanbase/getspeakerforsearch",
        //   sessionid: $.cookie("sid"),
        //   loginid: $.cookie("uid"),
        //   actionplanlevel: self.surelevel.levelcode,
        //   speakername: self.searchname
        // }).done(data => {
        //   if (data && data.errcode == 0) {
        //     self.teacherlist = [];
        //     data.attendlist.map(value => {
        //       self.teacherlist.push({
        //         name: value.name,
        //         id: value.id,
        //         username: value.username
        //       });
        //     });
        //     if (self.teacherlist.length == 0) {
        //       self.toast("未搜索到哟~");
        //     }
        //   } else if (data.errdesc) {
        //     self.toast(data.errdesc);
        //   } else {
        //     self.toast("服务器错误，请联系管理员。");
        //   }
        // });
      }
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
    //start 选择参与人
    initstudent() {
      var { timeFlag, isempty } = this.checkTime();
      if (!this.selectlevels.id) {
        this.toast("请先选择院区基地或者科室");
        return;
      } else if (!isempty) {
        this.toast("请选择日期或者时间!");
      } else if (!timeFlag) {
        this.toast("请检查活动日期是否重复!");
      } else {
        this.searchArr = [];
        if (this.surelevel.levelcode == "base") {
          this.getgradelist(this.selectlevels.id, "base", "base");
        }else {
          this.getgradelist(this.selectlevels.id, "turn", "base");
        }
        console.log(this.selectlevels);
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
      if (self.surelevel.levelcode == "hospital" && self.isstutype !== params) {
        self.isstutype = params;
        if (self.student && self.student.length > 0) {
          for (let i = self.student.length - 1; i >= 0; i--) {
            if (self.student[i].type == 1) {
              self.student.splice(i, 1);
            }
          }
        }
      }
      let opitions = {};
      if (type == "hospital") {
        opitions.hospitalbusidlist = param;
        opitions.hospitalattend = params;
      } else if (type == "base") {
        opitions.deptid = param;
        opitions.baseattend = params;
      }
      this.post("/actionplanbase/getattender", {
        command: "actionplanbase/getattender",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        actionplanlevel: type,
        actiontime: JSON.stringify(this.timeArr),
        ...opitions
      }).done(data => {
        if (data && data.errcode == 0) {
          if (type == "hospital") {
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
          } else if (type == "base" && params == "base") {
            self.basechecklist[0].count = data.result.grouplist[0].count;
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
      // this.post("/actionplanbase/getattender", {
      //   command: "actionplanbase/getattender",
      //   sessionid: $.cookie("sid"),
      //   loginid: $.cookie("uid"),
      //   actionplanlevel: "office",
      //   officeattend: param,
      //   actiontime: JSON.stringify(this.timeArr),
      //   deptid: self.selectlevels.id
      // }).done(data => {
      //   if (data && data.errcode == 0) {
      //     self.studentlist = [];
      //     self.selofficelist = [];
      //     self.selofficetraineelist = [];
      //     if (data.result.attendlist && data.result.attendlist.length > 0) {
      //       if (param == "turndoctor") {
      //         data.result.attendlist.map(value => {
      //           self.selofficelist.push({
      //             type: 2,
      //             id: value.id,
      //             name: value.name,
      //             username: value.username
      //           });
      //         });
      //         self.seloffice.show = true;
      //       } else if (param == "trainee") {
      //         data.result.attendlist.map(value => {
      //           self.selofficetraineelist.push({
      //             type: 3,
      //             id: value.id,
      //             name: value.name,
      //             username: value.username
      //           });
      //         });
      //         self.selofficetrainee.show = true;
      //       }
      //     } else {
      //       self.toast("当前没有查询到该类型的学员。");
      //     }
      //   }
      // });
      // console.log("date",moment(self.date.getTime()).format("YYYY-MM-DD"))
      // console.log(self.levelcode)
      if (self.levelcode == "hospital") {
        if (param == "turndoctor") {
          this.post(
            "/base/turnplandetail/listTurnResident?pageSize=0&pageNum=0",
            {
              hospitalId: this.selectlevels.id,
              // deptId: self.selectlevels.id,
              actionDateList: [
                moment(self.date.getTime()).format("YYYY-MM-DD")
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
                      type: 3,
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
              hospitalId: this.selectlevels.id,
              // deptId: self.selectlevels.id,
              actionDateList: [
                moment(self.date.getTime()).format("YYYY-MM-DD")
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
                      type: 2,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 3,
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
      } else if (self.levelcode == "office") {
        if (param == "turndoctor") {
          this.post(
            "/base/turnplandetail/listTurnResident?pageSize=0&pageNum=0",
            {
              hospitalId: self.hosIdByDept,
              deptId: self.selectlevels.id,
              actionDateList: [
                moment(self.date.getTime()).format("YYYY-MM-DD")
              ],
              userId: $.cookie("uid")
            }
          ).done(data => {
            console.log(data)
            console.log(param)
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
                      type: 3,
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
                moment(self.date.getTime()).format("YYYY-MM-DD")
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
                      type: 2,
                      id: value.id,
                      name: value.name,
                      username: value.username
                    });
                  });
                  self.seloffice.show = true;
                } else if (param == "trainee") {
                  data.rows.map(value => {
                    self.selofficetraineelist.push({
                      type: 3,
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
      }).done(res => {
        if (res && res.errcode == 0) {
          self.searchlist = [];
          if (res.attendlist && res.attendlist.length > 0) {
            res.attendlist.map(value => {
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
      console.log(param, params, type)
      console.log(self.student)
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
              self.student_turndoctor.map((val, index) => {
                if (val.id == param) {
                  self.student_turndoctor.splice(index, 1);
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
      this.hospitalattend = param.attendbusinfo;
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
        let str = item.name + "-" + item.count + "人";
        stemp.push(str);
      });
      this.form.student = stemp.join("、");
      this.newbasecount = param.count;
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
      } else if (!timeFlag) {
        this.toast("请检查活动日期是否重复!");
      }
      // if (moment(self.endtime).format('X') <= moment(self.starttime).format('X')) {
      //     self.toast('结束时间必须大于开始时间！');
      //     return
      // }

      let attendinfolist = [];
      let _student = [];
      console.log(self.hossubmitlist);
      if (self.surelevel.levelcode == "office") {
        _student = self.student
          .concat(self.student_turndoctor)
          .concat(self.student_trainee);
      } else if (self.surelevel.levelcode == "hospital") {
        if (!self.hossubmitlist.gradelist) {
          self.hossubmitlist.gradelist = [];
        }
        if (!self.hossubmitlist.stutypelist) {
          self.hossubmitlist.stutypelist = [];
        }
        if (!self.hossubmitlist.baselist) {
          self.hossubmitlist.baselist = [];
        }
        // _student = self.hossubmitlist.gradelist
        //   .concat(self.hossubmitlist.stutypelist)
        //   .concat(self.hossubmitlist.baselist);
        _student = self.student
          .concat(self.student_turndoctor)
          .concat(self.student_trainee);
      } else {
        _student = self.student;
      }
      console.log("student",_student);
      //具体学生，或学生条件类型集合
      if (_student) {
        _student.map(val => {
          if (self.surelevel.levelcode == "hospital") {
            //    if(val.type == 1){
            //        attendinfolist.push({
            //            attendbusid: val.id,
            //            attendbusinfo: val.name + '-' + val.count ,
            //            bustype:self.hospitalattend ,
            //            type: val.type
            //        })
            //    }
            // attendinfolist.push({
            //   attendbusid: val.id,
            //   attendbusinfo: self.hospitalcount, 
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
                attendbusid: self.selectlevels.id, //val.id,
                attendbusinfo: val.name + "-" + val.count,
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
        opitions.attendinfo.actionplanlevel = self.surelevel.levelcode; //活动类型 院级，基地级，科室级
        opitions.attendinfo.deptid = self.selectlevels.id;
        // opitions.attendinfo.starttime = self.starttime;
        opitions.attendinfo.actiontime = JSON.stringify(self.timeArr);

        if (self.surelevel.levelcode == "hospital") {
          //    opitions.attendinfo.hospitalattend = self.hospitalattend;     //原来的类型（原年级和基地互斥）
          if (
            self.hossubmitlist &&
            self.hossubmitlist.gradelist &&
            self.hossubmitlist.gradelist.length > 0
          ) {
            self.hossubmitlist.gradelist.map(item => {
              opitions.attendinfo.gradebean.gradelist.push(item.id);
            });
            opitions.attendinfo.gradebean.bustype = "grade";

            self.hossubmitlist.stutypelist.map(item => {
              opitions.attendinfo.stdtypebean.stdtypelist.push(item.key);
            });
            opitions.attendinfo.stdtypebean.bustype = "stdtype";

            self.hossubmitlist.baselist.map(item => {
              opitions.attendinfo.basebean.baselist.push(item.id);
            });
            opitions.attendinfo.basebean.bustype = "baselist";
          }

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
              opitions.attendinfo.actiontime = JSON.stringify(self.timeArr);
              break;
            }
          }
        }
      }
      console.log("selectlevels",self.selectlevels)
      this.showConfirm({
        title: "温馨提示",
        msg: "您是否确认提交？",
        theme: "modal-confirm modal-white",
        cancel: function() {},
        ok: function() {
          self
            .post("/actionplan/addactionplan", {
              command: "actionplan/addactionplan",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              uid: $.cookie("uid"),
              actionplanlevel: self.surelevel.levelcode,
              theme: self.form.theme,
              type: self.typename.key,
              deptid: self.selectlevels.id,
              place: self.form.address,
              actiontime: JSON.stringify(self.timeArr),
              attendinfolist: attendinfolist,
              speakerlist: _teacher,
              remark: self.form.remark,
              period: self.form.period ? Number(self.form.period) : null,
              ...opitions
            })
            .done(function(data) {
              if (data && data.errcode == 0) {
                self.toast("新增成功~");
                setTimeout(() => {
                  self.$router.push({
                    name: "fdAction_list"
                  });
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
          self.$router.push({
            name: "fdAction_list"
          });
        }
      });
    },
    getTree() {
      let self = this;
      self
        .post("/base/dept/listMyHospital", {
          keywords: "",
          type: 3
        })
        .done(res => {
          self.hospitalList = res.model;
          // self.hos_list = res.rows;
        });
      self
        .post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 1
        })
        .done(res => {
          self.columns = res.model;
          self.treeList = res.model[0].childrens;
          self.hosIdByDept = res.model[0].id;
          self.hosIdByDeptSave = res.model[0].id;
        });
      self
        .post("/base/dept/getHosBaseTree", {
          showHospital: 1,
          showNoDeptHospital: 0
        })
        .done(res => {
          res.model.forEach(i => {
            if (i.childrens == null) {
              i.childrens = [];
            }
            if (i.childrens) {
              i.childrens.forEach(j => {
                // if (j.childrens == null) {
                j.childrens = null;
                // }
                // if (j.havePermission) {
                //   j.childrens.unshift({
                //   id: j.id,
                //   name: j.name,
                //   baseId: j.baseId,
                //   deptlevel: j.deptlevel,
                //   havePermission: j.havePermission,
                //   type: j.type,
                //   pid: j.pid
                // });
                // }
              });
            }
          });
          let arr = res.model;
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].childrens.length; j++) {
              if (arr[i].childrens[j].havePermission == 0) {
                arr[i].childrens.splice(j, 1);
                j--;
              }
            }
          }
          for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i])
            if (arr[i].childrens.length == 0) {
              arr.splice(i, 1);
              i--;
            }
          }
          self.columnsc = JSON.parse(
            JSON.stringify(arr).replace(/childrens/g, "children")
          );
          console.log(111, self.columnsc);
        });
    },
    hospitalonConfirm(node, index) {
      let self = this;
      console.log(node, index);
      self.hospitalconfig.show = false;
      self.hospitalconfig.hospitalselect = index;
      self.deptid = node.id;
      self.selectdept(node);
      //   self.init();
    },
    hospitalonCancel() {
      let self = this;
      self.$refs.hospital.setColumnIndex(0, self.hospitalconfig.hospitalselect);
      self.hospitalconfig.show = false;
    },
    onConfirm(list, index) {
      let self = this;
      console.log(2592,self.columnsc);
      console.log(2593,index);
      self.indexList = index;
      console.log(2595,self.columnsc[index[0]].children[index[1]]);
      self.hosIdByDept = self.columnsc[index[0]].children[index[1]].pid
      self.deptname = self.columnsc[index[0]].children[index[1]].name;
      self.deptid = self.columnsc[index[0]].children[index[1]].id;
      this.popShow = false;
      self.selectdept({
        id: self.deptid,
        deptname: self.deptname
      });
      // this.setSingindept(self.deptid);
      //   this.init();
      // this.getstulist();
      // self.getTeachList();
    },
    onCancel() {
      let self = this;
      self.popShow = false;
      console.log(this.indexList);
      self.$refs.pick.setColumnIndex(0, this.indexList[0]);
      self.$refs.pick.setColumnIndex(1, this.indexList[1]);
      self.$refs.pick.setColumnIndex(2, this.indexList[2]);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.treeList = self.columns[index].childrens;
      console.log(self.hosIdByDeptSave);
    },
    onClickLeft() {
      let self = this;
      self.popShow2 = false;
      self.activeKey = self.oriactiveKey;
      self.deptnameidList = self.orideptnameidList;
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
      // self.treeList = self.
    },
    onClickRight() {
      let self = this;
      self.hosIdByDept = self.hosIdByDeptSave;
      console.log(2438, self.hosIdByDept);
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        console.log("22222222222", this.$refs.tree.getCheckedNodes()[0]);
        self.deptid = this.$refs.tree.getCheckedKeys()[0];
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptnameid = this.$refs.tree.getCheckedKeys()[0];
        self.deptnameidList = this.$refs.tree.getCheckedKeys();
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        // self.selectdept(this.$refs.tree.getCheckedNodes()[0]);
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.popShow2 = false;
        self.selectdept(this.$refs.tree.getCheckedNodes()[0]);
        // console.log(self.deptid);
        // console.log(self.deptname);
        // this.setSingindept(self.deptid);
        // this.init();
        // this.getstulist();
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
      // self.popShow = false;
      // self.deptnameid = this.$refs.tree.getCheckedKeys()[0];
      // self.deptnameidList = this.$refs.tree.getCheckedKeys();
      // self.selectdept(this.$refs.tree.getCheckedNodes()[0]);
    },
    checkClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    changetree(data, lst) {
      if (lst.checkedKeys.length == 0) {
        //这里的treeForm是你el-tree命名的ref的值
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    clickbase() {
      let self = this;
      self.popShow = true;
    },
    clickdept() {
      let self = this;
      self.popShow2 = true;
      self.oriactiveKey = self.activeKey;
      self.orideptnameidList = self.deptnameidList;
      console.log(self.orideptnameidList);
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
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
@import "../../scss/mixin.scss";
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
  position: fixed;
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

.cascade {
  min-height: 100%;
  background: #fff;
  & > .cascade_item_content {
    overflow: auto;
    height: 5rem;
  }
  & > .operation {
    & > div {
      @include sexy-flex;
      flex-flow: row nowrap;
      border-top: 1px solid $borderDashColor;
      border-bottom: 1px solid $borderDashColor;
      button {
        @include flex1(1);
        text-align: center;
        height: 0.8rem;
      }
      & > button:nth-child(2) {
        background: $activeColor;
        color: #fff;
      }
    }
    margin-top: 0.5rem;
  }
  .cascade_item_wrap {
    padding: $paddingL;
    background: #fff;
    .cascade_item {
      @include sexy-flex;
      flex-flow: row nowrap;
      & > ul {
        @include sexy-flex;
        flex-flow: row wrap;
        @include flex1;
        li {
          width: 33.3%;
          color: $wordColor;
          margin-bottom: 0;
          padding: 0 0.1rem;
          height: 0.55rem;
          line-height: 0.55rem;
          font-size: 0.22rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
          .mk {
            display: none;
          }
        }
        li.active {
          position: relative;
          .mk {
            left: 0;
            display: block;
            position: absolute;
            margin-right: 0.1rem;
            width: 3px;
            height: 0.2rem;
            top: 0.19rem;
            background: $activeColor;
            padding: 0;
          }
          color: $activeColor;
        }
      }
    }
  }
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
<style lang="scss">
.new-add-active #picker-main header span:nth-child(1) {
  text-align: left;
  font-size: 14px;
}

.new-add-active #picker-main header span:nth-child(2) {
  text-align: right;
  font-size: 14px;
}

.self-form-add .van-picker__cancel,
.self-form-add .van-picker__confirm {
  line-height: 44px;
}

.self-form-add .van-popup--bottom {
  /* left: 49.8%; */
}

.self-form-add .van-cell__title {
  font-size: 16px;
  color: #333;
  line-height: 24px;
}

.self-form-add .van-cell__value {
  font-size: 16px;
  color: #b2b2b2;
  line-height: 24px;
}

.self-form-add .van-cell__right-icon {
  line-height: 24px;
}

.self-form-add .van-field__control--right {
  height: 24px;
  font-size: 16px;
}

.self-form-add .van-cell--large {
  padding-top: 15px;
  padding-bottom: 15px;
}

.self-form-add .gap-time .van-cell:first-child .van-cell__title {
  font-weight: bold;
}

.self-form-add input::-webkit-input-placeholder {
  color: #b2b2b2;
}

.self-form-add .bottom-gap .van-field {
  padding-bottom: 22px;
}

.self-form-add .bottom-gap .van-field__label {
  position: absolute;
  bottom: 0;
  right: 14px;
  font-size: 12px;
  color: #b2b2b2;
}

.self-form-add .weightCol .van-cell__value {
  color: #111 !important;
}
.rotationc {
  .popCBox {
  width: 40%;
  height: 350px;
  overflow: scroll;
}
.popKBox {
  width: 60%;
  height: 350px;
  overflow: scroll;
  padding-bottom: 80px;
}
  .van-popup {
    height: 350px;
    transform: translate3d(0%, 0%, 0);
    overflow: hidden;
  }

  .popCK {
    display: flex;
    height: 350px;
  }

  .van-sidebar {
    width: 100%;
    height: 350px;
    padding-bottom: 48px;
  }

  .van-sidebar-item--select:before {
    background-color: #0079fd;
  }
}
</style>