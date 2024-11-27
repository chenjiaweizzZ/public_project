<template>
  <div class="extranceExamCreate">
    <div class="extranceNavbar">
      <van-nav-bar
        :title="Navtitle"
        left-arrow
        @click-left="back()"
        @click-right="examSubmit()"
        right-text="提交"
      />
    </div>

    <div class="createContent">
      <van-form>
        <van-field name="checkboxGroup" label="考核级别" :disabled="examing">
          <template #input>
            <van-radio-group v-model="surelevel" direction="horizontal">
              <van-radio
                v-for="(item,index) in levelList"
                :key="index"
                :name="item.levelcode"
                :disabled="examing"
              >{{ item.levelname }}</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <transition name="plus-icon">
          <van-field
            v-show="surelevel"
            :disabled="examing"
            clickable
            readonly
            right-icon="arrow"
            name="picker"
            v-model="selectlevels.name"
            :label="(surelevel == 'base') ? '基地' : (surelevel == 'office') ? '科室' : '选择基地/科室'"
            placeholder
            @click="selLevel()"
          />
        </transition>
        <div style="height:8px"></div>
        <van-field
          :disabled="examing"
          readonly
          clickable
          right-icon="arrow"
          name="picker"
          v-model="typename.name"
          label="考核类型"
          placeholder
          @click="seltypeFn()"
        />
        <transition name="plus-icon">
          <van-field
            :disabled="examing"
            v-show="typename.name"
            readonly
            clickable
            right-icon="arrow"
            name="picker"
            v-model="selectexamitemsnames"
            label="考核项目"
            placeholder
            @click="initexamitems()"
          />
        </transition>
        <div style="height:8px"></div>
        <van-field
          :disabled="examing"
          readonly
          clickable
          right-icon="arrow"
          name="picker"
          v-model="starttime"
          label="考核开始时间"
          placeholder
          @click="showstarttime"
        />
        <van-field
          readonly
          clickable
          right-icon="arrow"
          name="picker"
          v-model="endtime"
          label="考核结束时间"
          placeholder
          @click="getendtime.show = true"
        />
        <div style="height:8px"></div>
        <!-- <van-field v-model="address" name="考核地点" label="考核地点" placeholder /> -->
        <van-field
          v-model="address"
          autosize
          label="考核地点"
          type="textarea"
          maxlength="50"
          rows="1"
          placeholder
          show-word-limit
        />
        <div style="height:8px"></div>
        <van-field
          :disabled="examing"
          readonly
          clickable
          right-icon="arrow"
          name="picker"
          v-model="teachernames"
          label="考官"
          placeholder
          @click="initteacher()"
        />
        <van-field
          readonly
          clickable
          right-icon="arrow"
          name="picker"
          v-model="studentnames"
          label="考核学员"
          placeholder
          @click="initstudent()"
        />
        <div style="height:8px"></div>
        <van-field
          v-model="remark"
          autosize
          label="备注"
          type="textarea"
          maxlength="100"
          placeholder
          show-word-limit
        />
      </van-form>
    </div>
    <van-action-sheet
      v-model="seltype.show"
      :actions="seltype.mainlist"
      @select="selecttype"
      cancel-text="取消"
      close-on-click-action
      @cancel="seltype.show = false"
    />
    <!--选择考核项 -->
    <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
      <div v-show="choicetype" class="department g-wrapper">
        <div class="transContent">
          <van-nav-bar title="选择考核项" left-arrow @click-left="choicetype = false" />
          <div class="transContentSearch">
            <van-search
              v-model="searchitemsname"
              placeholder="请输入搜索关键词"
              @keyup="searchtypeitems()"
            />
          </div>
          <!-- <van-tabs  @click="examitemsSwitch">
            <van-tab title="我的考核项">
            </van-tab>

            <van-tab title="全部考核项">
            </van-tab>
          </van-tabs>-->
          <div class="transContentTab">
            <van-tabs v-model="index" ref="tabs" @click="examitemsSwitch">
              <van-tab title="我的考核项">
                <div class="myList">
                  <van-row class="myListItem" v-for="(item,index) in mytypeitemslist" :key="index">
                    <van-col span="1"></van-col>
                    <van-col span="19" class="myListItemLeft">
                      <input
                        type="checkbox"
                        class="checkbox"
                        v-model="myitemsselect"
                        :value="{examitemid:item.examitemid,examitemname:item.examitemname}"
                        :disabled="item.status == 0"
                      />
                      <span
                        :class="{'myListItemName':true,'myListItemNameDisabled':!item.status}"
                      >{{item.examitemname}}</span>
                    </van-col>
                    <van-col span="2">
                      <van-icon
                        name="eye"
                        v-if="item.status"
                        @click="scoresheetPreview(item.examitemid,item.examitemname)"
                      />
                    </van-col>
                    <van-col span="2">
                      <van-icon
                        name="star"
                        @click="scFn(item)"
                        :color="item.active ? '#3499db' : ''"
                      />
                    </van-col>
                  </van-row>
                </div>
              </van-tab>
              <van-tab title="全部考核项">
                <div class="myList">
                  <van-row class="myListItem" v-for="(item,index) in alltypeitemslist" :key="index">
                    <van-col span="1"></van-col>
                    <van-col span="19" class="myListItemLeft">
                      <input
                        type="checkbox"
                        class="checkbox"
                        v-model="myitemsselect"
                        :value="{examitemid:item.examitemid,examitemname:item.examitemname}"
                        :key="item.examitemid"
                        :disabled="item.status == 0"
                      />
                      <span
                        :class="{'myListItemName':true,'myListItemNameDisabled':!item.status}"
                      >{{item.examitemname}}</span>
                    </van-col>
                    <van-col span="2">
                      <van-icon
                        v-if="item.status"
                        name="eye"
                        @click="scoresheetPreview(item.examitemid,item.examitemname)"
                      />
                    </van-col>
                    <van-col span="2">
                      <van-icon
                        v-if="item.status"
                        name="star"
                        @click="scFn(item)"
                        :color="item.active ? '#3499db' : ''"
                      />
                    </van-col>
                  </van-row>
                </div>
              </van-tab>
            </van-tabs>
          </div>
          <div class="countBottom">
            <transition name="plus-icon">
              <div class="countBottomList" v-if="selectExamitem.show">
                <div class="countBottomListTop">已选考核项目</div>
                <div class="countBottomListContent">
                  <div
                    class="countBottomListItem"
                    v-for="(val,index) in myitemsselect"
                    :key="index"
                  >
                    <span>{{val.examitemname}}</span>
                    <van-icon @click="deletedoctor('examitem',index)" name="delete-o" />
                  </div>
                </div>
              </div>
            </transition>
            <div class="countBottomFoot">
              <span class="countInput"></span>
              <span class="countNumber">
                <span>
                  <span class="countNq">已选考核项</span>
                  <span
                    :class="{'countNw':true,'countNe':selectexamitems.length > 0}"
                  >{{myitemsselect.length}}</span>
                  <span class="countNq">个</span>
                </span>
                <span @click="selectExamitem.show = !selectExamitem.show" class="countNr">
                  查看列表
                  <van-icon name="arrow-up" color="#999999" v-if="selectExamitem.show" />
                  <van-icon name="arrow-down" color="#999999" v-else />
                </span>
              </span>
              <!-- <span class="countButton">
                <van-button type="info" @click="examitemFn">确定</van-button>
              </span>-->
              <span style="width: 10px"></span>
            </div>
          </div>
          <van-overlay :show="selectExamitem.show" @click="selectExamitem.show = false" />
        </div>
      </div>
    </transition>
    <!-- 选择考官 -->
    <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
      <div v-show="choiceteacher" class="department g-wrapper">
        <div class="transContent">
          <van-nav-bar title="选择考官" left-arrow @click-left="choiceteacher = false" />
          <div class="transContentSearch">
            <van-search v-model="searchname" placeholder="请输入考官姓名" @keyup="searchteacher()" />
          </div>
          <div class="transContentTeacherList">
            <div class="flex-item class-sel-list" style="padding-bottom: 0.6rem;">
              <div class="list info-list list-inner">
                <div class="item" v-for="(item,index) in teacherlist" :key="index">
                  <label class="flex flex-start flex-row">
                    <div class="fitem">{{item.name}}-{{item.username}}</div>
                    <input class="checkbox" type="checkbox" :value="item" v-model="teacher" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="countBottom">
            <transition name="plus-icon">
              <div class="countBottomList" v-if="selectTeacher.show">
                <div class="countBottomListTop">已选考官</div>
                <div class="countBottomListContent">
                  <div class="countBottomListItem" v-for="(val,index) in teacher" :key="index">
                    <span>
                      {{val.name}}
                      <span v-if="val.username">-{{val.username}}</span>
                    </span>

                    <van-icon @click="deletedoctor('examiner',index)" name="delete-o" />
                  </div>
                </div>
              </div>
            </transition>
            <div class="countBottomFoot">
              <span class="countInput"></span>
              <span class="countNumber">
                <span>
                  <span class="countNq">已选考官</span>
                  <span :class="{'countNw':true,'countNe':teacher.length > 0}">{{teacher.length}}</span>
                  <span class="countNq">位</span>
                </span>
                <span @click="selectTeacher.show = !selectTeacher.show" class="countNr">
                  查看列表
                  <van-icon name="arrow-up" color="#999999" v-if="selectTeacher.show" />
                  <van-icon name="arrow-down" color="#999999" v-else />
                </span>
              </span>
              <!-- <span class="countButton">
                <van-button type="info" @click="choiceteacher = false,selectTeacher.show = false">确定</van-button>
              </span>-->
              <span style="width: 10px"></span>
            </div>
          </div>
          <van-overlay :show="selectTeacher.show" @click="selectTeacher.show = false" />
        </div>
      </div>
    </transition>
    <!--选择考核学员 -->
    <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
      <div v-show="choicestudent" class="department g-wrapper">
        <div class="transContent">
          <van-nav-bar
            title="选择考核学员"
            left-arrow
            @click-left="choicestudent = false,selectStudent.deptchecked=[],selectStudent.show = false,selectStudent.turndeptshow = false"
          />
          <div class="transContentSearch">
            <div class="timeAndDept" v-if="surelevel == 'office'">
              <span class="timeAndDeptLeft">
                <span
                  @click="startTimeShow()"
                >{{ searchStudentstarttimeShow ? searchStudentstarttimeShow : '轮转开始时间' }}</span>
                <span>至</span>
                <span
                  @click="endTimeShow()"
                >{{ searchStudentendtimeShow ? searchStudentendtimeShow : '轮转结束时间'}}</span>
              </span>
              <span class="timeAndDeptMiddle"></span>
              <span class="ttime" @click="getDefaultTime()">默认时间</span>
            </div>
            <div class="searchAndDept" v-if="surelevel == 'office'">
              <div class="timeAndDeptLeft">
                <van-search
                  v-model="searchStudent"
                  placeholder="请输入学员姓名"
                  @keyup="initstudentlist(selectlevels.id)"
                />
              </div>
              <span class="timeAndDeptMiddle">|</span>
              <span
                class="timeAndDeptRight"
                @click="selectStudent.turndeptshow = true,selectStudent.show = false"
              >
                <span>{{ searchStudentturndept ? searchStudentturndept : '轮转科室' }}</span>
                <van-icon name="play" :class="{active: show2}" />
              </span>
            </div>
            <div class="searchAndDept2" v-if="surelevel == 'base'">
              <van-search
                v-model="searchStudent"
                placeholder="请输入学员姓名"
                @keyup="initstudentlist(selectlevels.id)"
              />
            </div>
          </div>
          <div class="transContentTeacherList" :class="{active: surelevel == 'office'}">
            <!-- <li v-for="(item,index) of studentlist">
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
            </li>-->
            <div class="transContentStudentItem" v-for="(item,index) in studentlist" :key="index">
              <div class="studentName">
                <span class="studentCheck">
                  <input type="checkbox" :value="item" v-model="student" class="checkbox2" />
                </span>
                <span>{{item.name}}-{{item.username}}</span>
              </div>
              <div class="studentDept" v-if="surelevel == 'office'">轮转科室:{{item.deptName}}</div>
              <div
                class="studentTurn"
                v-if="surelevel == 'office'"
              >计划轮转周期: {{item.planBeginTime}}至{{item.planEndTime}}</div>
              <div class="studentBase">专业基地:{{item.basename}}</div>
              <div class="x-line"></div>
            </div>
          </div>
          <div class="countBottom">
            <transition name="plus-icon">
              <div class="countBottomList" v-if="selectStudent.show">
                <div class="countBottomListTop">已选学员</div>
                <div class="countBottomListContent">
                  <div class="countBottomListItem" v-for="(val,index) in student" :key="index">
                    <div class="hfiayu">
                      <span>
                      {{val.name}}
                      <span v-if="val.username">-{{val.username}}</span>
                    </span>
                    <!-- <van-icon
                      v-if="val.showDel"
                      @click="deletedoctor('student',index)"
                      name="delete-o"
                    /> -->
                    <img src="../../assets/images/del-icon.png" v-if="val.showDel" @click="deletedoctor('student',index)"/>
                    </div>
                    <div class="x-line"></div>
                  </div>
                </div>
              </div>
              <div class="countBottomList" v-if="selectStudent.turndeptshow">
                <div class="countBottomListTop">轮转科室</div>
                <div class="countBottomListContent">
                  <div
                    class="countBottomListItem"
                    v-for="(val,index) in selectlevels.tree"
                    :key="index"
                  >
                    <span>{{val.name}}</span>
                    <input
                      type="checkbox"
                      :value="val"
                      v-model="selectStudent.deptchecked"
                      class="checkbox"
                    />
                  </div>
                </div>
              </div>
            </transition>
            <div class="countBottomFoot">
              <span class="countInput">
                <van-checkbox v-model="studentCheckedAll" shape="square" @click="studentCheck">全选</van-checkbox>
              </span>
              <span class="countNumber">
                <span>
                  <span class="countNq">已选学员</span>
                  <span :class="{'countNw':true,'countNe':student.length > 0}">{{student.length}}</span>
                  <span class="countNq">位</span>
                </span>
                <span
                  @click="selectStudent.turndeptshow = false,selectStudent.show = !selectStudent.show"
                  class="countNr"
                >
                  查看列表
                  <van-icon name="arrow-up" color="#999999" v-if="selectStudent.show" />
                  <van-icon name="arrow-down" color="#999999" v-else />
                </span>
              </span>
              <!-- <span class="countButton">
                <van-button
                  type="info"
                  @click="choicestudent = false,selectStudent.show = false,selectStudent.turndeptshow = false,selectStudent.deptchecked=[]"
                >确定</van-button>
              </span>-->
              <span style="width: 10px"></span>
            </div>
          </div>
          <van-overlay
            :show="selectStudent.show || selectStudent.turndeptshow"
            @click="selectStudent.show = false,selectStudent.turndeptshow = false"
          />
        </div>
      </div>
    </transition>
    <scoresheet-preview
      :examitemid="examitemidpreview"
      v-if="examitempreviewvisible"
      :examitemname="examitempreviewname"
      @setPreviewVisible="setPreviewVisible"
    ></scoresheet-preview>
    <!-- ////////////////////////////////////////////////////////////////////////////// -->

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
              :data="baseList"
              :props="defaultProps"
              @check-change="checkClick2"
              node-key="id"
              ref="tree2"
            ></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
    <van-dialog
      v-model="choicedeptOut"
      :title="surelevel == 'base' ? '基地列表' : '科室列表'"
      confirmButtonColor="#3499db"
    >
      <div class="choicetypeOutList">
        <div v-for="(val,index) in selectlevels.tree" :key="index" class="choicetypeOutItem">
          <span>{{val.name}}</span>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="choicetypeOut" title="考核项目" confirmButtonColor="#3499db">
      <div class="choicetypeOutList">
        <div v-for="(val,index) in selectexamitems" :key="index" class="choicetypeOutItem">
          <span>{{val.examitemname}}</span>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="choiceteacherOut" title="考官列表" confirmButtonColor="#3499db">
      <div class="choicetypeOutList">
        <div v-for="(val,index) in teacher" :key="index" class="choicetypeOutItem">
          <span>{{val.name}}</span>
        </div>
      </div>
    </van-dialog>
    <van-popup position="bottom" v-model="getstarttime.show">
      <van-datetime-picker
        v-model="starttime2"
        type="datetime"
        title="考核开始时间"
        :min-date="minDate"
        :max-date="maxDate"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="selectstarttime"
        @cancel="cancelstarttime"
      />
    </van-popup>
    <van-popup position="bottom" v-model="getendtime.show">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="考核结束时间"
        :min-date="minDate"
        :max-date="maxDate"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="selectendtime"
        @cancel="cancelendtime"
      />
    </van-popup>
    <van-popup position="bottom" v-model="startTimeShown">
      <van-datetime-picker
        v-model="searchStudentstarttime2"
        type="date"
        title="计划轮转周期开始时间"
        :min-date="minDate2"
        :max-date="maxDate2"
        :formatter="formatter"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="selectstarttime2"
        @cancel="startTimeShown = false"
      />
    </van-popup>
    <van-popup position="bottom" v-model="endTimeShown">
      <van-datetime-picker
        v-model="searchStudentendtime2"
        type="date"
        title="计划轮转周期结束时间"
        :min-date="minDate2"
        :max-date="maxDate2"
        :formatter="formatter"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="selectendtime2"
        @cancel="endTimeShown = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast, NavBar, Field, Search, Icon, Button, Dialog } from "vant";
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
import scoresheetPreview from "./scoresheetPreview";
import moment from "moment";
export default {
  components: {
    scoresheetPreview
  },
  data() {
    return {
      choiceteacherOut: false,
      choicedeptOut: false,
      selectexamitemsnamesSave: [],
      index: 0,
      listLength: 0,
      jl: true,
      // Navtitle: "创建出科考核",
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
      data: "",
      levelList: [], //考核级别
      levelname: "科室", //显示当前在选择什么
      surelevel: "", //选择的考核级别
      selectlevels: { name: "", id: "", tree: [] }, //选中的科室/基地

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
      starttime2: "", //选择的开始时间
      endtime2: "", //选择的结束时间
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
        turndeptshow: false,
        deptchecked: [],
        selectStudent: [],
        show: false,
        title: "考核人员"
      },
      timer: "",
      examitemidpreview: "",
      examitempreviewvisible: false,
      examitempreviewname: "",
      choicetypeOut: false,
      searchStudent: "",
      searchStudentstarttime: "",
      searchStudentendtime: "",
      searchStudentstarttimeShow: "",
      searchStudentendtimeShow: "",
      searchStudentturndept: "",
      startTimeShown: false,
      endTimeShown: false,
      turnDeptShown: false,
      //////////////////////////////////////////////////////////////////
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
      minDate: "",
      maxDate: ""
    };
  },
  computed: {
    Navtitle() {
      if (this.$route.query.id) {
        return "编辑出科考核";
      } else {
        return "创建出科考核";
      }
    },
    studentCheckedAll() {
      let self = this;
      let uidsSet = new Set(self.student.map(obj => obj.uid));
      for (let i = 0; i < self.studentlist.length; i++) {
        if (!uidsSet.has(self.studentlist[i].uid)) {
          return false;
        }
      }
      return true;
    },
    selectexamitemsnames() {
      return this.selectexamitems.map(item => item.examitemname).join("、");
    },
    teachernames() {
      return this.teacher.map(item => item.name).join("、");
    },
    studentnames() {
      return this.student.map(item => item.name).join("、");
    },
    maxDate() {
      let currentDate = new Date();
      let futureYear = currentDate.getFullYear() + 10;

      let futureDate = new Date(
        futureYear,
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );

      return futureDate;
    },
    minDate() {
      return new Date();
    },
    maxDate2() {
      let currentDate = new Date();
      let futureYear = currentDate.getFullYear() + 3;

      let futureDate = new Date(
        futureYear,
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );

      return futureDate;
    },
    minDate2() {
      let currentDate = new Date();
      let futureYear = currentDate.getFullYear() - 3;

      let futureDate = new Date(
        futureYear,
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );

      return futureDate;
    }
  },
  watch: {
    surelevel: function(val) {
      if (val == "base") {
        this.levelname = "基地";
      }
      if (val == "office") {
        this.levelname = "科室";
      }
      this.selectlevels = { name: "", id: "", tree: [] };
      this.student = [];
      this.teacher = [];
      this.selectexamitems = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree2.setCheckedKeys([]);
    },
    myitemsselect(val) {
      this.unique();
    },
    selectStudent: {
      handler(val) {
        if (this.selectStudent.deptchecked.length > 0) {
          this.initstudentlist(this.selectlevels.id);
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.getMinMaxTime();
    this.initLevel();
    this.getTree();
    this.inittypelist();
    this.getExamStatus();
    if (this.$route.query.id) {
      this.getturndetail(); //获取考核详情;
    }
  },
  methods: {
    ...methods,
    examSubmit() {
      if (this.iscreate) {
        this.submit();
      } else if (this.beforeexam) {
        this.modifyFn();
      } else if (this.examing) {
        this.examingModify();
      }
    },
    studengDeptCheck(item) {},
    startTimeShow() {
      let self = this;
      self.startTimeShown = true;
    },
    endTimeShow() {
      let self = this;
      self.endTimeShown = true;
    },
    turnDeptShow() {
      let self = this;
      self.turnDeptShown = false;
    },
    studentCheck() {
      let self = this;
      if (self.studentCheckedAll) {
        let uidsSet = new Set(self.studentlist.map(obj => obj.uid));
        let filteredArray1 = self.student.filter(obj => !uidsSet.has(obj.uid));
        self.student = filteredArray1;
      } else {
        if (self.student.length) {
          let uidsSet = new Set(self.student.map(obj => obj.uid));
          for (let obj of self.studentlist) {
            if (!uidsSet.has(obj.uid)) {
              self.student.push(obj);
            }
          }
        } else {
          self.student = self.studentlist;
        }
      }
    },
    getExamStatus() {
      if (this.$route.query.editflag == 0) {
        // this.isoverdue = true;
        // this.beforeexam = false;
        // this.examing = false;
        this.isoverdue = false;
        this.examing = true;
        this.beforeexam = false;
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
    },
    getMinMaxTime() {
      let currentDate = new Date();
      let futureYear = currentDate.getFullYear() + 10;
      let futureDate = new Date(
        futureYear,
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );
      this.maxDate = futureDate;
      this.minDate = new Date();
    },
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
    getTree() {
      let self = this;
      self
        .post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 0,
          hospitalId: ""
        })
        .done(res => {
          if (res && res.resCode == 200) {
            if (Array.isArray(res.model) && res.model.length > 0) {
              self.columns = res.model;
              self.deptList = res.model[0].childrens;
              // self.init()
            }
          }
        });
      self.post("/base/dept/getHosBaseTree").done(res => {
        if (res && res.resCode == 200) {
          if (Array.isArray(res.model) && res.model.length > 0) {
            self.columns2 = res.model;
            self.baseList = res.model[0].childrens;
            // self.init()
          }
        }
      });
    },
    selLevel() {
      let self = this;
      if (this.examing) {
        this.choicedeptOut = true;
        console.log(self.selectlevels);
        return;
      }
      if (this.surelevel == "office") {
        self.popShow = true;
        self.listLength = this.selectlevels.tree.length;
      } else if (this.surelevel == "base") {
        self.popShow2 = true;
        self.listLength = this.selectlevels.tree.length;
      } else {
        self.$toast("请先选择考核级别");
      }
    },
    initselectlevels() {
      this.selectlevels = { name: "", id: "", tree: [] };
    },
    seltypeFn() {
      if (this.examing) {
        return;
      }
      this.seltype.show = true;
    },
    back() {
      let self = this;
      Dialog.confirm({
        title: "温馨提示",
        message: "你当前操作尚未提交保存，是否确认返回？",
        confirmButtonColor: "#3499db"
      })
        .then(() => {
          window.history.back();
        })
        .catch(() => {});
    },
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
    getDefaultTime() {
      let self = this;
      self.searchStudentendtimeShow = '';
      self.searchStudentstarttimeShow = '';
      this.initstudentlist(this.selectlevels.id);
      console.log(this.studentlist)
      console.log(this.student)
    },
    selecttype(val) {
      console.log(val);
      this.typename = val;
      this.seltype.show = false;
      if (val !== this.examtype) {
        this.student = [];
      }
      if (val.key == "2") {
        this.examtype = 2;
      }
      if (val.key == "1") {
        this.examtype = 1;
      }
      this.selectexamitems = [];
      this.allitemsselect = [];
      this.myitemsselect = [];
    },
    showstarttime() {
      if (this.examing) {
        return;
      }
      this.getstarttime.show = true;
    },
    //显示考核项目页面
    initexamitems() {
      //   if (this.isoverdue || this.examing) {
      //     this.selectExamitem.show = true;
      //   } else {
      if (this.examing) {
        this.choicetypeOut = true;
        return;
      }
      this.choicetype = true;
      this.$nextTick(() => {
        this.$refs.tabs.resize();
      });
      this.gettypeitemslist(this.searchitemsname);
      //初始化我的考核项
      this.examitemsfn(0);
      //   }
    },
    gettypeitemslist(name) {
      let param = {
        command: "turnannualresult/queryexamitemlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        examitemname: name,
        // deptIdList: this.selectlevels.id,
        examitemtype: this.examtype,
        sysType: 1
      };
      if (this.surelevel == "base") {
        param.deptList = this.selectlevels.id;
      } else {
        param.deptList = this.selectlevels.id;
      }
      this.post("/turnannualresult/queryexamitemlist", param).done(data => {
        if (data && data.errcode == 0) {
          this.alltypeitemslist = data.examitemlist;
        } else {
          this.$toast("请选择基地或者科室");
        }
        this.setscActive();
      });
      // .fail(() => {
      //   this.$toast("服务器错误，请联系管理员。");
      // });
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
      console.log(this.mytypeitemslist);
    },
    examitemFn() {
      this.unique();
      this.choicetype = false;
      this.selectExamitem.show = false;
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
      if (this.typename) {
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
      // if (
      //   moment(this.endtime).format("X") <= moment(this.starttime).format("X")
      // ) {
      //   this.$toast("结束时间必须大于开始时间！");
      //   return;
      // }
      let $student = []; //考核学员可以为空
      if (this.student.length > 0) {
        this.student.map(item => {
          $student.push({ stdid: item.uid, seiid: item.seiid,turnDeptId: item. deptid});
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
      Dialog.confirm({
        title: "温馨提示",
        message: "您是否确认提交？",
        confirmButtonColor: "#3499db"
      })
        .then(() => {
          let params = {
            command: "turnExamInfo/addturnexam",
            sessionid: $.cookie("sid"),
            loginid: $.cookie("uid"),
            examLevel: self.surelevel == "base" ? 1 : 0,
            // deptList: self.selectlevels.id,
            startTime: self.starttime,
            endTime: self.endtime,
            examTypeId: parseInt(self.typename.key),
            examType: parseInt(self.typename.key),
            place: self.address,
            remark: self.remark,
            teclist: $teacher,
            stdlist: $student,
            examitemlist: $examitemlist
          };
          if (self.surelevel == "base") {
            params.deptIdList = self.selectlevels.id;
          } else {
            params.deptIdList = self.selectlevels.id;
          }
          self
            .post("/turnExamInfo/addturnexam", params)
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
        })
        .catch(() => {});
      // this.showConfirm({
      //   title: "温馨提示",
      //   msg: "您是否确认提交？",
      //   theme: "modal-confirm modal-white",
      //   cancel: function() {
      //     self.issubmit = false;
      //   },
      //   ok: function() {

      //   }
      // });
    },
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
      let $student = []; //考核学员
      this.student.map(item => {
        $student.push({ stdid: item.uid, seiid: item.seiid,turnDeptId: item. deptid });
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
      Dialog.confirm({
        title: "温馨提示",
        message: "您是否确认提交？",
        confirmButtonColor: "#3499db"
      })
        .then(() => {
          self
            .post("/turnExamInfo/modifyturnexam", {
              command: "turnExamInfo/modifyturnexam",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              id: self.$route.query.id,
              examLevel: self.surelevel == "base" ? 1 : 0,
              deptIdList: self.selectlevels.id,
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
        })
        .catch(() => {});
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      } 
      return val;
    },
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
    setPreviewVisible() {
      this.examitempreviewvisible = false;
    },
    initstudent() {
      if (!this.isoverdue) {
        if (!this.selectlevels.tree) {
          this.$toast("请先选择科室/基地");
        } else {
          this.initstudentlist(this.selectlevels.id, "");
          console.log(this.selectlevels.id);
        }
      } else {
        this.selectStudent.show = true;
      }
    },
    //获取考核人员
    initstudentlist(param) {
      let self = this;
      let options = {};
      console.log(this.selectStudent.deptchecked);
      if (this.selectStudent.deptchecked.length > 0) {
        if (this.surelevel == "base") {
          options = {
            baseIdList: this.selectStudent.deptchecked.map(item => {
              return item.id;
            })
            // deptIdList: ""
          };
        } else {
          options = {
            deptIdList: this.selectStudent.deptchecked.map(item => {
              return item.id;
            })
          };
        }
      } else {
        if (this.surelevel == "base") {
          options = {
            baseIdList: param
          };
        } else {
          options = {
            deptIdList: param
          };
        }
      }

      this.post("/turnExamInfo/queryexamineelist", {
        command: "turnExamInfo/queryexamineelist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        keyword: this.searchStudent,
        planBeginTime: this.searchStudentstarttimeShow,
        planEndTime: this.searchStudentendtimeShow,
        turnExamId: self.beforeexam ? self.$route.query.id : "",
        examtype: this.examtype,
        ...options
      })
        .done(data => {
          if (data && data.errcode == 0) {
            this.studentlist = data.dept_stu_list;
            this.studentlist.forEach(i => {
              i.showDel = true;
            });
            setTimeout(() => {
              this.studentSup();
            }, 500);
          } else {
            this.$toast("当前没有查询到该类型的学员。");
          }
        })
        .fail(() => {
          // this.$toast("请联系管理人员");
        });
    },
    studentSup() {
      setTimeout(() => {
        console.log("student", this.student);
        console.log("studentlist", this.studentlist);
        this.choicestudent = true;
      });
      for (let i = 0; i < this.student.length; i++) {
        for (let j = 0; j < this.studentlist.length; j++) {
          if (
            this.student[i].uid == this.studentlist[j].uid &&
            this.student[i].showDel == true && this.student[i].deptId == this.studentlist[j].deptid
          ) {
            let obj = {};
            obj = this.studentlist[j];
            this.student[i] = obj;
          }
        }
      }
    },
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
          examitemtype: this.examtype,
          deptList: this.selectlevels.id
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
        if (type == "student") {
          self.student.splice(index, 1);
        }
        if (type == "examiner") {
          self.teacher.splice(index, 1);
        }
        if (type == "examitem") {
          console.log(deleteData);
          console.log(self.allitemsselect);
          console.log(self.myitemsselect);
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
    },
    initteacher() {
      if (this.examing) {
        this.choiceteacherOut = true;
        return;
      }
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
      let params;
      if (self.surelevel == "base") {
        params = {
          keyword: search_info,
          // deptId: "",
          teachingType: localStorage.getItem("system") == 'escort' ? 4 : "",
          baseList: param
        };
      } else {
        params = {
          keyword: search_info,
          deptIdList: param,
          teachingType: localStorage.getItem("system") == 'escort' ? 4 : ""
          // baseId: ""
        };
      }
      self.post("/base/teachers/listExaminer", params).done(data => {
        this.teacherlist = data.model; //考官人员
      });
    },
    //搜索考官
    searchteacher() {
      console.log(this.selectlevels);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.initteacherlist(this.selectlevels.id, this.searchname);
      }, 250);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date
        .getDate()
        .toString()
        .padStart(2, "0");
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return formattedDate;
    },
    formatDate2(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date
        .getDate()
        .toString()
        .padStart(2, "0");
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate;
    },
    formatDateString(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short"
      });
      return formattedDate;
    },
    //获取开始时间
    selectstarttime(data) {
      if (this.endtime2) {
        if (moment(this.endtime2) < moment(data)) {
          this.$toast("选择开始时间小于结束时间");
          return;
        } else {
          this.starttime = this.formatDate(data);
          this.starttime2 = data;
        }
      } else {
        this.starttime = this.formatDate(data);
        this.starttime2 = data;
      }
      this.getstarttime.show = false;
    },
    selectstarttime2(data) {
      if (this.searchStudentendtime) {
        if (moment(this.searchStudentendtime) < moment(data)) {
          this.$toast("选择开始时间小于结束时间");
          return;
        } else {
          this.searchStudentstarttimeShow = this.formatDate2(data);
          this.searchStudentstarttime = data;
          this.initstudentlist(this.selectlevels.id);
        }
      } else {
        this.searchStudentstarttimeShow = this.formatDate2(data);
        this.searchStudentstarttime = data;
      }
      this.startTimeShown = false;
    },
    selectendtime2(data) {
      if (this.searchStudentstarttime) {
        if (moment(this.searchStudentstarttime) > moment(data)) {
          this.$toast("选择开始时间小于结束时间");
          return;
        } else {
          this.searchStudentendtimeShow = this.formatDate2(data);
          this.searchStudentendtime = data;
          this.initstudentlist(this.selectlevels.id);
        }
      } else {
        this.searchStudentendtimeShow = this.formatDate2(data);
        this.searchStudentendtime = data;
      }
      this.endTimeShown = false;
    },
    //获取结束时间
    selectendtime(data) {
      console.log(this.starttime2, data);
      if (this.starttime2) {
        if (moment(this.starttime2) > moment(data)) {
          this.$toast("选择结束时间大于开始时间");
          return;
        } else {
          this.endtime = this.formatDate(data);
          this.endtime2 = data;
        }
      } else {
        this.endtime = this.formatDate(data);
        this.endtime2 = data;
      }
      this.getendtime.show = false;
    },
    cancelstarttime() {
      this.getstarttime.show = false;
    },
    cancelendtime() {
      this.getendtime.show = false;
    },
    getturndetail() {
      this.post("/turnExamInfo/turnexamdetail", {
        command: "turnExamInfo/turnexamdetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        id: this.$route.query.id
      }).done(res => {
        if (res.errcode == 0) {
          this.jl = false;
          this.surelevel = res.examlevel ? "base" : "office";
          this.$set(this.typename, "name", this.filterType(res.exam_typeid));
          this.examtype = Number(res.examtype);
          this.starttime = res.starttime;
          this.endtime = res.endtime;
          this.address = res.place;
          this.remark = res.remark;
          this.getselectexamitems = res.examitemlist;
          this.allitemsselect = this.getselectexamitems;
          this.myitemsselect = this.getselectexamitems;
          this.selectexamitems = this.getselectexamitems;
          this.starttime2 = res.starttime;
          setTimeout(() => {
            this.selectlevels.tree = res.deptIdNameVoList;
            this.selectlevels.tree.forEach(i => {
              i.name = i.deptName;
              i.id = i.deptId
            });
            this.selectlevels.name = res.deptIdNameVoList
              .map(item => item.deptName)
              .join("、");
            if (res.examlevel) {
              this.selectlevels.id = res.deptIdNameVoList.map(
                item => item.deptId
              );
            } else {
              this.selectlevels.id = res.deptIdNameVoList.map(
                item => item.deptId
              );
            }
            this.$refs.tree.setCheckedKeys(this.selectlevels.id);
            this.typename.id = res.exam_typeid;
            this.typename.key = res.examtype;
            this.teacher = res.teacherlist;
            this.teacher.map(item => {
              this.$set(item, "name", item.teachername);
              this.$set(item, "id", String(item.teacherid));
              delete item["teachername"];
              delete item["teacherid"];
            });
            this.getteacher = JSON.parse(JSON.stringify(this.teacher));
            this.delteacher = JSON.parse(JSON.stringify(this.teacher));
            this.student = res.studentlist;
            this.student.map(item => {
              this.$set(item, "name", item.studentname);
              this.$set(item, "uid", item.studentid);
              this.$set(item, "seiid", item.seiid);
              this.$set(item, "deptId", item.deptId);
              delete item["studentname"];
              delete item["studentid"];
              this.$set(item, "showDel", this.beforeexam ? true : false);
              // delete item['username']
            });
            console.log(this.student);
            console.log(this.selectlevels)
            this.getstudent = JSON.parse(JSON.stringify(this.student));
            this.delstudent = JSON.parse(JSON.stringify(this.student));
            setTimeout(() => {
              this.jl = true;
            }, 100);
          }, 1000);
        }
      });
    },
    filterType(id) {
      for (let item of this.seltype.mainlist) {
        if (item.key == id) {
          return item.name;
        }
      }
    },
    examingModify() {
      let self = this;
      console.log(this.typename,this.selectexamitems)
      if (!this.selectlevels.id) {
        this.$toast("考核考核级别！");
        return;
      }
      if (!this.typename) {
        this.$toast("请选择考核类型！");
        return;
      }
      if (this.typename) {
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
      // if (this.student.length <= 0) {
      //   this.$toast("请选择考核学员！");
      //   return;
      // }
      if (
        moment(this.endtime).format("X") <= moment(this.starttime).format("X")
      ) {
        this.$toast("结束时间必须大于开始时间！");
        return;
      }
      this.exammingStd();
      this.examingTec(); //获取添加或者删除的考官;
      this.issubmit = true;
      Dialog.confirm({
        title: "温馨提示",
        message: "您是否确认提交？",
        confirmButtonColor: "#3499db"
      })
        .then(() => {
            self.addstdlist.forEach(i => {
              i.turnDeptId = i.deptid
            })
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
        })
        .catch(() => {});
      // this.showConfirm({
      //   title: "温馨提示",
      //   msg: "您是否确认提交？",
      //   theme: "modal-confirm modal-white",
      //   cancel: function() {},
      //   ok: function() {

      //   }
      // });
    },
    exammingStd() {
      this.addstdlist = [];
      this.delstdlist = [];
      //新增加的值;
      console.log(this.student,this.getstudent)
      this.student.forEach(i => {
        if(i.deptid) {
          i.deptId = i.deptid
        } 
      })
      for (let std of this.student) {
        let isExist = false;
        for (let gstd of this.getstudent) {
          if (std.uid == gstd.uid && std.deptId == gstd.deptId) {
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
      console.log(this.teacher, this.getteacher);
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
      console.log(this.delteacher);
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
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //选择科室
    selectdept(param) {
      // console.log(param)
      // this.selectlevels.name = param.map(item => item.name).join("、");
      // this.selectlevels.id = param.map(item => item.id);
      // this.selectlevels.tree = param
    },
    //选择基地
    selectbase(param) {
      console.log("selectbase");
      this.selectlevels.name = param.deptname;
      this.selectlevels.id = param.id;
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptList = self.columns[index].childrens;
      this.$refs.tree.setCheckedKeys(self.selectlevels.id);
    },
    checkClick(data, checked, node) {
      let self = this;
      if (self.jl) {
        console.log("click");
        if (checked) {
          console.log(data)
          console.log(this.selectlevels)
          self.selectlevels.tree.push(data);
          this.selectlevels.name = self.selectlevels.tree
            .map(item => item.name)
            .join("、");
          this.selectlevels.id = self.selectlevels.tree.map(item => item.id);
          console.log(this.selectlevels)
        } else {
          let arr = self.selectlevels.tree;
          console.log(self.selectlevels.tree);
          this.selectexamitems = [];
          this.myitemsselect = [];
          for (var i = arr.length - 1; i >= 0; i--) {
            if (
              arr[i].id === data.id ||
              arr[i].baseId === data.id ||
              arr[i].deptId === data.id
            ) {
              arr.splice(i, 1);
            }
            self.selectlevels.tree = arr;
            this.selectlevels.name = self.selectlevels.tree
              .map(item => item.name)
              .join("、");
            this.selectlevels.id = self.selectlevels.tree.map(item => item.id);
            console.log(this.selectlevels);
          }
          if (this.selectlevels.tree.length < this.listLength) {
            this.selectexamitems = [];
            this.myitemsselect = [];
            this.teacher = [];
            this.student = [];
          }
        }
      } else {
        return;
      }
    },
    onClickLeft() {
      let self = this;
      self.popShow = false;
      // self.activeKey = self.oriactiveKey;
      // self.deptnameidList = self.orideptnameidList;
      // this.$refs.tree.setCheckedKeys(self.orideptnameidList);
    },
    onClickRight() {
      let self = this;
      // if (
      //   this.$refs.tree.getCheckedKeys()[0] &&
      //   this.$refs.tree.getCheckedNodes()[0]
      // ) {
      //   self.hosIdByDept = self.hosIdByDeptSave;
      //   self.oriactiveKey = self.activeKey;
      //   self.orideptnameidList = this.$refs.tree.getCheckedKeys();
      //   self.popShow = false;
      //   self.selectdept(
      //     this.$refs.tree.getCheckedNodes(),
      //   );
      //   // self.init()
      // } else {
      //   Toast({
      //     message: "请选择科室",
      //     position: "bottom"
      //   });
      // }
      self.popShow = false;
    },
    onChange2(index) {
      let self = this;
      self.hosIdByDeptSave2 = self.columns2[index].id;
      self.baseList = self.columns2[index].childrens;
      this.$refs.tree2.setCheckedKeys(self.selectlevels.id);
    },
    checkClick2(data, checked, node) {
      // if (checked) {
      //   this.$refs.tree2.setCheckedKeys([data.id]);
      // }
      console.log("click2");
      let self = this;
      if (self.jl) {
        if (checked) {
          self.selectlevels.tree.push(data);
          this.selectlevels.name = self.selectlevels.tree
            .map(item => item.name)
            .join("、");
          this.selectlevels.id = self.selectlevels.tree.map(item => item.id);
          console.log(this.selectlevels);
        } else {
          let arr = self.selectlevels.tree;
          this.myitemsselect = [];
          for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i].id === data.id) {
              arr.splice(i, 1);
            }
            self.selectlevels.tree = arr;
            this.selectlevels.name = self.selectlevels.tree
              .map(item => item.name)
              .join("、");
            this.selectlevels.id = self.selectlevels.tree.map(item => item.id);
            console.log(this.selectlevels);
          }
          if (this.selectlevels.tree.length < this.listLength) {
            this.selectexamitems = [];
            this.myitemsselect = [];
            this.teacher = [];
            this.student = [];
          }
        }
      } else {
        return;
      }
    },
    onClickLeft2() {
      let self = this;
      self.popShow2 = false;
      // self.activeKey2 = self.oriactiveKey2;
      // self.deptnameidList2 = self.orideptnameidList2;
      // this.$refs.tree2.setCheckedKeys(self.orideptnameidList);
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
    onClickRight2() {
      let self = this;
      // if (
      //   this.$refs.tree2.getCheckedKeys()[0] &&
      //   this.$refs.tree2.getCheckedNodes()[0]
      // ) {
      //   self.hosIdByDept2 = self.hosIdByDeptSave;
      //   self.oriactiveKey2 = self.activeKey;
      //   self.orideptnameidList2 = this.$refs.tree2.getCheckedKeys();
      //   self.popShow2 = false;
      //   self.selectbase({
      //     deptname: this.$refs.tree2.getCheckedNodes()[0].name,
      //     id: this.$refs.tree2.getCheckedNodes()[0].id
      //   });
      //   // self.init()
      // } else {
      //   Toast({
      //     message: "请选择科室",
      //     position: "bottom"
      //   });
      // }
      self.popShow2 = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.extranceExamCreate {
  .x-line {
      margin-top: 12px;
      height: 1px;
      background: rgba(255, 255, 255, 0.01);
      box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    }
  .checkbox2 {
    width: .3rem;
    height: .3rem;
    position: relative;
    box-shadow: #dfdfdf 0 0 0 0 inset;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;

    background-image: url('../../assets/images/cjw_weixuanzhong.png');
    background-size: cover;
}
.checkbox2:checked {
    background-image: url('../../assets/images/cjw_xuanzhong.png');
    background-size: cover;
}
  background: #f8f8f8;
  height: 100%;
  .choicetypeOutList {
    margin: 10px 20px;
    .choicetypeOutItem {
      margin-bottom: 10px;
    }
  }
  .plus-icon-enter-active {
    transition: opacity 0.5s;
  }
  .plus-icon-enter {
    opacity: 0;
  }
  .plus-icon-leave-active {
    transition: opacity 0.5s;
  }
  .plus-icon-leave-to {
    opacity: 0;
  }
  .plus-icon-enter-to {
    opacity: 1;
  }
  .createContent {
    // padding-top: 54px;
    // padding: 8px 8px 8px 8px;
    position: absolute;
    top: 54px;
    right: 0;
    left: 0;
  }
  .transContent {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    height: 100%;
    background: #fff;
    .timeAndDept {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 8px 14px;
      .timeAndDeptLeft {
        flex: 9;
        box-sizing: border-box;
        border: 0.5px solid #cdcdcd;
        height: 100%;
        font-size: 15px;
        font-weight: normal;
        line-height: 18px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #111111;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .timeAndDeptMiddle {
        flex: 1;
        display: flex;
        justify-content: center;
        color: #E2E2E2;
      }
      .timeAndDeptRight {
        flex: 4;
        display: flex;
      }
      .ttime {
        color: #969799
      }
    }
    .searchAndDept {
      display: flex;
      align-items: center;
      .timeAndDeptLeft {
        flex: 9;
        // box-sizing: border-box;
        // border: 0.5px solid #cdcdcd;
        // height: 100%;
        // font-size: 15px;
        // font-weight: normal;
        // line-height: 18px;
        // text-align: center;
        // letter-spacing: 0.2px;
        // color: #111111;
        // padding-left: 10px;
        // padding-right: 10px;
      }
      .timeAndDeptMiddle {
        flex: 1;
        justify-content: center;
        color: #E2E2E2;
        display: flex;
      }
      .timeAndDeptRight {
        flex: 3;
        display: flex;
        justify-content: flex-end;
        padding-right: 14px;
      }
    }
    .transContentSearch {
      position: fixed;
      top: 46px;
      left: 0;
      right: 0;
    }

    .transContentTab {
      position: fixed;
      top: 96px;
      left: 0;
      right: 0;
      .myList {
        overflow: scroll;
        height: 100vh;
        padding-bottom: 200px;
        .myListItem {
          display: flex;
          align-items: center;
          .myListItemLeft {
            display: flex;
            align-items: center;
            height: 36px;
          }
          .myListItemName {
            margin-left: 10px;
          }
          .myListItemNameDisabled {
            color: #c8c9cc;
          }
        }
      }
    }
    .transContentTeacherList {
      position: fixed;
      top: 100px;
      left: 0;
      right: 0;
      bottom: 62px;
      overflow: scroll;
      &.active {
        position: fixed;
        top: 150px;
        left: 0;
        right: 0;
        bottom: 62px;
        overflow: scroll;
      }
      .transContentTeacherList {
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 62px;
        overflow: scroll;
      }
      .transContentStudentItem {
        // margin-bottom: 20px;
        margin: 0px 14px 20px 14px;
        padding-bottom: 20px;
        // border-bottom: 1px solid #E2E2E2;
        .studentName {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 700;
          line-height: 19px;
          letter-spacing: 0.19px;
          color: #111111;
          .studentCheck {
            width: auto;
            padding-right: 10px;
            display: flex;
            justify-content: center;
          }
        }
        .studentDept {
          margin-left: 28px;
          margin-bottom: 2px;
          font-size: 12px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: 0.15px;

          color: #999999;
        }
        .studentTurn {
          margin-left: 28px;
          margin-bottom: 2px;
          font-size: 12px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: 0.15px;

          color: #999999;
        }
        .studentBase {
          margin-left: 28px;
          margin-bottom: 2px;
          font-size: 12px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: 0.15px;

          color: #999999;
        }
      }
    }
    .countBottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      z-index: 2;
      .countBottomList {
        height: 240px;
        background-color: #fff;
        .countBottomListTop {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          line-height: 22px;
          letter-spacing: 0.2px;
          height: 40px;
        }
        .countBottomListContent {
          height: 200px;
          overflow: scroll;
          margin: 0px 14px;
          .countBottomListItem {
            // border-bottom: 1px solid #E2E2E2;
            // display: flex;
            // align-content: center;
            height: 50px;
            font-size: 16px;
            font-weight: normal;
            line-height: 19px;
            letter-spacing: 0.2px;
            color: #333333;
            .hfiayu {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 12px;
            }
            img {
              height: 18px;
              width: 18px
            }
            
          }
        }
      }
      .countBottomFoot {
        height: 62px;
        display: flex;
        align-items: center;
        .countInput {
          flex: 5;
          margin-left: 10px;
        }
        .countNumber {
          flex: 5;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-right: 10px;
          .countNq {
            font-size: 16px;
            font-weight: normal;
            line-height: 19px;
            letter-spacing: 0.2px;
            color: #666666
          }
          .countNw {
            font-size: 24px;
            font-weight: 500;
            line-height: 29px;
            letter-spacing: 0.2px;

            color: #666666;
          }
          .countNe {
            font-size: 24px;
            font-weight: 500;
            line-height: 29px;
            letter-spacing: 0.2px;

            color: #ec5926;
          }
          .countNr {
            font-size: 12px;
            font-weight: normal;
            line-height: 14px;
            text-align: right;
            letter-spacing: 0.15px;

            color: #999999;
          }
        }
        .countButton {
          flex: 4;
        }
      }
    }
  }
}
</style>

<style lang="scss">
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
.rotationc {
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
.extranceExamCreate {
  // .van-button__content {
  //   font-size: 17px
  // }
  .van-search {
    padding: 10px 14px;
  }
  .countInput {
    .van-checkbox__label {
      color: #999999;
    }
    .van-checkbox__icon  {
      .van-icon {
        border-radius: 2px;
        border: 1px solid #CDCDCD
      }
    }
  }
  .van-dialog__header {
    padding-top: 16px;
  }
  .timeAndDeptRight {
    .van-icon {
      transform: rotate(90deg);
      &.active {
        color: #2f7dcd;
        transform: rotate(-90deg);
      }
    }
  }
  .extranceNavbar {
    .van-nav-bar {
      display: flex;
      align-items: center;
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      .van-nav-bar__left {
        bottom: auto;
        .van-icon {
          color: #111111;
          font-size: 24px;
        }
      }
      .van-nav-bar__title {
        font-size: 18px;
        font-weight: 550;
      }

      .van-nav-bar__right {
        bottom: auto;
        height: 46px;
        .van-nav-bar__text {
          color: #111111;
          font-size: 18px;
        }
      }
    }
  }
  .transContent {
    .van-nav-bar {
      display: flex;
      align-items: center;
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      .van-nav-bar__left {
        bottom: auto;
        .van-icon {
          color: #111111;
          font-size: 24px;
        }
      }
      .van-nav-bar__title {
        font-size: 18px;
        font-weight: 550;
      }

      .van-nav-bar__right {
        bottom: auto;
        height: 46px;
        .van-nav-bar__text {
          color: #111111;
          font-size: 18px;
        }
      }
    }
  }
  .van-field__label {
    display: flex;
    align-items: center;
  }
  .van-field__left-icon {
    line-height: 31px;
  }
  .transContentTab {
    .van-tab--active {
      color: #3499db;
    }
    .van-tabs__line {
      background-color: #3499db;
    }
  }
  .countButton {
    .van-button {
      width: 100%;
    }
  }
  .van-field__control {
    text-overflow: ellipsis;
  }
}
</style>