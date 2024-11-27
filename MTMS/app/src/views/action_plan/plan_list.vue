<template>
  <div class="g-wrapper active-slef-list">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>教学活动计划
      <template>
        <div class="btn-group" slot="headerRight">
          <img @click="showsearch = true" src="../../assets/images/search-white.png" />
          <img @click="addconfig.show = true" src="../../assets/images/icon_zengjia.png" />
        </div>
      </template>
    </c-header>
    <!--搜索框-->
    <div class="search-input" v-show="showsearch">
      <input type="text" v-model="searchcontent" placeholder="输入主讲人姓名搜索教学活动" />
      <i class="tosearch" @click="search"></i>
      <span @click="closesearch">取消</span>
    </div>
    <!--add content-->
    <add-group :config="addconfig" :data-list="addlist" @confirm="addselect" :showAdd="roleAuthority['baseplat:app:addTeachActive']"></add-group>
    <ul class="filter" v-show="!showsearch">
      <li :class="{'active':levelconfig.show}" @click="clicklevel()">活动级别</li>
      <li v-if="levelconfig.levelselect == 0" :class="{'active':baseconfig.show}" @click="clickhospital()">院区</li>
      <li v-if="levelconfig.levelselect == 1" :class="{'active':baseconfig.show}" @click="clickbase()">基地</li>
      <li v-if="levelconfig.levelselect == 2" :class="{'active':baseconfig.show}" @click="clickdept()">科室</li>
      <li :class="{'active':typeconfig.show}" @click="typeconfig.show = typeconfig.show ? false : true">类型</li>
      <li :class="{'active':otherconfig.show}" @click="clickother">其他</li>
      <!-- <li
        :class="{'active':timeconfig.show}"
        @click="timeconfig.show = timeconfig.show ? false : true"
      >日期</li>
      <li
        :class="{'active':normalconfig.show}"
        @click="normalconfig.show = normalconfig.show ? false : true"
      >默认</li>-->
    </ul>
    <!--选择科室-->
    <select-group :config="baseconfig" :data-list="basetree" @confirm="baseselect"></select-group>
    <!--选择类型-->
    <select-list :config="typeconfig" :data-list="typelist" @confirm="typeselect"></select-list>
    <!--选择日期-->
    <select-list :config="timeconfig" :data-list="timelist" @confirm="timeselect"></select-list>
    <!--选择默认-->
    <select-list :config="normalconfig" :data-list="normallist" @confirm="normalselect"></select-list>
    <div :class="!iscontent ? 'g-main' : 'g-main noneContent'">
      <!--列表-->
      <load-more :loading-text="loadingText" :infinite-loading="isgetmore" :to-top="istotop" @getmore="init()">
        <!-- <actionplan :data-list="data" :ishistory="ishistory" @confirm="init()">

        </actionplan>-->
        <actionplanSteps :dataList="data" :ishistory="ishistory"></actionplanSteps>
      </load-more>
    </div>
    <div class="noContent" v-if="iscontent">
      <img src="../../assets/images/noactiveplan.png" />
      <p>暂无教学活动</p>
    </div>
    <div class="rotationh">
      <van-popup v-model="levelconfig.show" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-picker ref="level" show-toolbar title="请选择" :columns="levelcolumn" value-key="name" @confirm="levelonConfirm" @cancel="levelonCancel"
          :default-index="2" />
      </van-popup>
    </div>
    <div class="rotationh">
      <van-popup v-model="otherconfig.show" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-picker ref="other" show-toolbar title="请选择" :columns="othercolumn" value-key="txt" @confirm="otheronConfirm" @cancel="otheronCancel"
        />
      </van-popup>
    </div>
    <div class="rotationh">
      <van-popup v-model="hospitalconfig.show" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-picker ref="hospital" show-toolbar title="请选择" :columns="hospitalList" value-key="name" @confirm="hospitalonConfirm"
          @cancel="hospitalonCancel" :default-index="0" />
      </van-popup>
    </div>
    <div class="rotationh">
      <van-popup v-model="popShow" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-picker ref="pick" show-toolbar title="请选择" :columns="columnsc" value-key="name" @confirm="onConfirm" @cancel="onCancel"
        />
      </van-popup>
    </div>
    <div class="rotationc">
      <van-popup v-model="popShow2" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
        <van-nav-bar title="请选择" left-text="取消" right-text="确定" left-arrow @click-left="onClickLeft" @click-right="onClickRight"
        />
        <van-toast></van-toast>
        <div class="popCK">
          <div class="popCBox">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item v-for="(item,index) in columns" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox">
            <el-tree show-checkbox :check-strictly="true" :data="treeList" :props="defaultProps" @check-change="checkClick" @check="changetree"
              node-key="id"   ref="tree"></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
    <!-- <no-content v-show="iscontent"></no-content> -->
  </div>
</template>
<script>
  import { Toast } from "vant";
  import methods from "../../methods";
  import { mapState, mapActions } from "vuex";
  import cHeader from "../header";
  import actionplan from "./main";
  import actionplanSteps from "../../components/actionplan-steps";
  import selectList from "../../components/select";
  import selectGroup from "../../components/select-group";
  import addGroup from "../../components/add-group";
  import loadMore from "../../components/load-more";
  import noContent from "../no_content.vue";
  export default {
    components: {
      cHeader,
      actionplan,
      noContent,
      selectList,
      selectGroup,
      addGroup,
      loadMore,
      actionplanSteps
    },
    data() {
      return {
        deptid: "",
        actionplanlevel: "",
        istotop: false,
        reqnum: 10,
        isgetmore: true,
        ishistory: false,
        iscontent: false,
        data: [],
        showsearch: false,
        isselect: false,
        loadingText: "加载中~",
        searchcontent: "", //筛选
        base: "", //筛选所在的基地
        hospitallist: [], //筛选所在的基地
        baselist: [], //筛选所在的基地
        officelist: [], //筛选所在的科室
        searchofficelist: [], //筛选所在的科室
        type: "", //需要查询的类型
        selecttime: '', //需要查询的时间
        isself: 0, //是否与登录者相关
        levelconfig: {
          show: false,
          label: "level",
          fixedvalue: "1.52rem",
          textposition: "center",
          levelselect: 2
        },
        hospitalconfig: {
          show: false,
          label: "hospitalname",
          fixedvalue: "1.52rem",
          textposition: "center",
          hospitalselect: 0
        },
        baseconfig: {
          show: false,
          label: "deptname",
          fixedvalue: "1.52rem",
          textposition: "center"
        },
        deptconfig: {
          show: false,
          label: "deptname",
          fixedvalue: "1.52rem",
          textposition: "center"
        },
        basetree: [],
        timeconfig: {
          show: false,
          label: "txt",
          fixedvalue: "1.5rem",
          textposition: "left"
        },
        otherconfig: {
          show: false,
          label: "other",
          fixedvalue: "1.5rem",
          textposition: "left",
          otherselect: [0, 0]
        },
        hospitalList: [],
        timelist: [
          {
            txt: "全部",
            value: ""
          },
          {
            txt: "近一个月",
            value: -1
          },
          {
            txt: "近三个月",
            value: -3
          },
          {
            txt: "近六个月",
            value: -6
          }
        ],
        othercolumn: [
          {
            values: [
              {
                txt: "全部",
                value: ""
              },
              {
                txt: "近一个月",
                value: -1
              },
              {
                txt: "近三个月",
                value: -3
              },
              {
                txt: "近六个月",
                value: -6
              }
            ],
            defaultIndex: 0
          },
          {
            values: [
              {
                txt: "默认",
                type: 0
              },
              {
                txt: "与我相关",
                type: 1
              }
            ],
            defaultIndex: 0
          }
        ],
        typeconfig: {
          show: false,
          label: "name",
          fixedvalue: "1.5rem",
          textposition: "left"
        },
        typelist: [],
        normalconfig: {
          show: false,
          label: "txt",
          fixedvalue: "1.5rem",
          textposition: "left"
        },
        normallist: [
          {
            txt: "默认",
            type: 0
          },
          {
            txt: "与我相关",
            type: 1
          }
        ],
        addconfig: {
          show: false,
          label: "name",
          fixedtop: ".8rem",
          fixedright: ".1rem"
        },
        addlist: [
          {
            name: "发起计划",
            router: "fdAction_add",
            isused: false
          },
          {
            name: "查看历史",
            router: "fdAction_history",
            isused: true
          }
        ],
        levelcolumn: [
          {
            name: "院级",
            id: 0
          },
          {
            name: "基地级",
            id: 1
          },
          {
            name: "科室级",
            id: 2
          }
        ],
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
          disabled: function (data, node) {
            // 禁用回收站选项
            if (data.havePermission == 1) {
              return false;
            } else {
              return true;
            }
          }
        },
        orideptnameidList: [],
        deptnameidList: []
      };
    },
    watch: {
      base: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "base", v: this.base });
        }
      },
      type: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "type", v: this.type });
        }
      },
      searchofficelist: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "technical", v: this.searchofficelist });
        }
      },
      selecttime: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "date", v: this.selecttime });
        }
      },
      isself: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "isself", v: this.isself });
        }
      },
      searchcontent: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "search", v: this.searchcontent });
        }
      },
      showsearch: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "showsearch", v: this.showsearch });
        }
      },
      reqnum: function (val, oldvalue) {
        if (val !== oldvalue) {
          this.setActions({ k: "reqnum", v: this.reqnum });
        }
      }
    },
    filters: {},
    computed: {
      ...mapState(["actionfilters", "roleAuthority"])
    },
    created() {
      this.reqnum = this.actionfilters.reqnum;
      this.base = this.actionfilters.base;
      this.searchofficelist = this.actionfilters.technical;
      this.type = this.actionfilters.type;
      this.selecttime = this.actionfilters.date || '';
      this.isself = "0";
      this.searchcontent = this.actionfilters.search;
      this.showsearch = this.actionfilters.showsearch;
    },
    mounted() {
      let self = this;
      this.getRoleAuthority(["baseplat:app:addTeachActive"])
      this.initself();
      this.inittypelist();
      this.initbaselist();
      this.registerToNative("goBack", function (data) {
        self.back();
      });
      this.getTree();

    },
    methods: {
      ...methods,
      ...mapActions([
        "showAlert",
        "showConfirm",
        "showLoading",
        "hideLoading",
        "toast",
        "setActions",
        "getRoleAuthority"
      ]),
      // initcodelist() {
      //   //获取权限
      //   let self = this;
      //   this.post("/actionplanbase/getjurisdictionbycoode", {
      //     command: "actionplanbase/getjurisdictionbycoode",
      //     sessionid: $.cookie("sid"),
      //     loginid: $.cookie("uid"),
      //     beanlist: [
      //       {
      //         uid: $.cookie("uid"),
      //         jurisdiccode: "add"
      //       }
      //     ]
      //   }).done(data => {
      //     if (data && data.errcode == 0) {
      //       self.addlist[0].isused = data.jurisdiclist[0].jurisdicvalue;
      //     } else if (data.errdesc) {
      //       self.toast(data.errdesc);
      //     } else {
      //       self.toast("服务器错误，请联系管理员。");
      //     }
      //   });
      // },
      initself() {
        let self = this;
        this.post("/actionplanbase/getusermanagerdept", {
          command: "actionplanbase/getusermanagerdept",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          paramcode: "actionplanaddroles" //只在教学计划中增加的参数
        }).done(data => {
          if (data && data.errcode == 0) {
            self.baselist = [];
            self.officelist = [];
            self.hospitallist = [];
            if (
              data.beanlist.hospitallist &&
              data.beanlist.hospitallist.length > 0
            ) {
              // data.beanlist.hospitallist.map(value => {
              //   self.hospitallist.push(value.id);
              // });
            }
            if (data.beanlist.baselist && data.beanlist.baselist.length > 0) {
              // data.beanlist.baselist.map(value => {
              //   self.baselist.push(value.id);
              // });
            }
            if (data.beanlist.officelist && data.beanlist.officelist.length > 0) {
              // data.beanlist.officelist.map(value => {
              //   self.officelist.push(value.id);
              // });
            }
            self.init();
          } else if (data.errdesc) {
            self.toast(data.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
        });
      },
      init() {
        let self = this;
        this.isgetmore = false;
        this.post("/actionplan/listactionplan", {
          command: "actionplan/listactionplan",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          uid: $.cookie("uid"),
          clientflag: 1, //PC or APP
          base: self.base,
          autohospitallist: self.hospitallist,
          autobaselist: self.baselist,
          autoofficelist: self.officelist,
          officelist: self.searchofficelist,
          type: self.type, //活动类型
          status: "", //单独搜索某个状态的教学计划
          statuslist: [0, 1], //默认页面需要显示未开始和进行中
          starttime: "", //计划的开始时间（APP暂未用到）
          endtime: "", //计划的结束时间（APP暂未用到）
          speakername: self.searchcontent, //主题或主讲人搜索
          yearmonth: "", //年月（APP暂未用到）
          beforemonthindex: self.selecttime, //APP筛选前几个月的
          isself: self.isself, //查询是否与我相关 true  or  false
          page: 1,
          reqnum: self.reqnum,
          deptid: self.deptid,
          actionplanlevel: self.actionplanlevel
        }).done(data => {
          if (data && data.errcode == 0) {
            self.isgetmore = true;
            if (data.result.beanlist.length > 0) {
              self.iscontent = false;
              self.data = data.result.beanlist;
              if (self.data.length < self.reqnum) {
                self.isgetmore = false;
                self.loadingText = "没有更多啦~";
              }
              self.reqnum += 10;
            } else {
              self.iscontent = true;
              self.data = [];
            }
          } else if (data.errdesc) {
            self.toast(data.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
          // console.log(self.data,"self.data")
        });
      },
      inittypelist() {
        //获取活动类型
        let self = this;
        this.post("/turnbaseinfo/turnbaseinfolevel", {
          command: "turnbaseinfo/turnbaseinfolevel",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          code: "teachtype"
        }).done(data => {
          if (data && data.errcode == 0) {
            let _typelist = JSON.parse(data.baseinfolevellist);
            _typelist.unshift({ name: "全部", id: "" });
            self.typelist = _typelist;
          } else if (data.errdesc) {
            self.toast(data.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
        });
      },
      initbaselist() {
        //获取活动类型
        let self = this;
        this.post("/actionplanbase/getalldeptastree", {
          command: "actionplanbase/getalldeptastree",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid")
        }).done(data => {
          if (data && data.errcode == 0) {
            self.basetree = data.depttree;
          } else if (data.errdesc) {
            self.toast(data.errdesc);
          } else {
            self.toast("服务器错误，请联系管理员。");
          }
        });
      },
      baseselect(data) {
        let self = this;
        this.istotop = !this.istotop;
        this.baseconfig.show = false;
        this.hospitallist = [];
        this.baselist = [];
        this.officelist = [];
        this.base = data.id;
        this.searchofficelist = [];
        if (data.childlist && data.childlist.length > 0) {
          data.childlist.map(value => {
            if (value.checkflag == true) {
              self.searchofficelist.push(value.id);
            }
          });
          this.reqnum = 10;
          this.init();
        }
      },
      timeselect(data) {
        this.timeconfig.show = false;
        this.istotop = !this.istotop;
        this.reqnum = 10;
        this.selecttime = data.value;
        this.init();
      },
      typeselect(data) {
        console.log(data);
        this.typeconfig.show = false;
        this.istotop = !this.istotop;
        this.reqnum = 10;
        this.type = data.key;
        this.init();
      },
      normalselect(data) {
        let self = this;
        this.istotop = !this.istotop;
        this.reqnum = 10;
        this.normalconfig.show = false;
        this.type = "";
        this.base = "";
        this.searchofficelist = [];
        if (data.type == 0) {
          self.isself = 0;
          self.initself();
        } else {
          this.baselist = [];
          this.officelist = [];
          self.isself = 1;
          this.init();
        }
      },
      search() {
        this.reqnum = 10;
        this.type = "";
        this.base = "";
        this.baselist = [];
        this.officelist = [];
        this.isself = 0;
        this.init();
      },
      closesearch() {
        this.showsearch = false;
        this.istotop = !this.istotop;
        this.reqnum = 10;
        this.type = "";
        this.base = "";
        this.baselist = [];
        this.officelist = [];
        this.isself = 0;
        this.searchcontent = "";
        this.init();
      },
      addselect(param) {
        if (param) {
          this.$router.push({
            name: param.router
          });
        }
      },

      back() {
        this.reqnum = 10;
        this.base = "";
        this.type = "";
        this.searchofficelist = [];
        this.selecttime = -1;
        this.isself = false;
        this.searchcontent = "";
        // window.location.href = '/pages/futuredoctorapp/todo.html?view=application';
        window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
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
          });
        self
          .post("/base/dept/getMyDeptTree", {
            showHospital: 1,
            showNoDeptHospital: 0,
            needBaseDept: 0,
            hospitalId: "",
          })
          .done(res => {
            for(let i = 0;i<res.model.length;i++) {
              if(res.model[i].childrens == null) {
                res.model.splice(i,1)
                i--
                // console.log("fafafafaf",res.model[i].childrens)
              }
            }
            self.columns = res.model;
            self.treeList = res.model[0].childrens;
            console.log(self.treeList)
          });
        self
          .post(`/base/dept/getHosBaseTree?sysType=${self.getSystemType()}`, {
            showHospital: 1,
            showNoDeptHospital: 0
          })
          .done(res => {
            res.model.forEach(i => {
              if(i.childrens) {
                i.childrens.forEach(j => {
                j.childrens = null;
                // j.childrens.unshift({
                //   id: j.id,
                //   name: j.name,
                //   baseId: j.baseId,
                //   deptlevel: j.deptlevel,
                //   havePermission: j.havePermission,
                //   type: j.type,
                //   pid: j.pid
                // });
              });
              }
              
            });
            self.columnsc = JSON.parse(
              JSON.stringify(res.model).replace(/childrens/g, "children")
            );
          });
      },
      clicklevel() {
        let self = this;
        self.levelconfig.show = true;
      },
      clickother() {
        let self = this;
        self.otherconfig.show = true;
      },
      clickhospital() {
        let self = this;
        self.hospitalconfig.show = true;
      },
      levelonConfirm(node, index) {
        console.log(node, index);
        let self = this;
        self.levelconfig.levelselect = index;
        self.levelconfig.show = false;
        if (node.id == 0) {
          self.baseid = "";
          self.hospitallist = [];
          self.baselist = [];
          self.officelist = [];
          self.searchofficelist = [];
          self.orideptnameidList = [];
          self.deptnameidList = [];
          self.deptid = "";
          self.actionplanlevel = "hospital";
          self.indexList = [0, 0, 0];
          self.activeKey = 0;
          self.$refs.pick.setColumnIndex(0, 0);
          self.$refs.pick.setColumnIndex(1, 0);
          self.$refs.pick.setColumnIndex(2, 0);
        } else if (node.id == 1) {
          self.baseid = "";
          self.hospitallist = [];
          self.baselist = [];
          self.officelist = [];
          self.searchofficelist = [];
          self.deptid = "";
          self.actionplanlevel = "base";
          // self.actionplanlevel = "hospital";
          self.orideptnameidList = [];
          self.deptnameidList = [];
          self.indexList = [0, 0, 0];
          self.activeKey = 0;
          self.$refs.hospital.setColumnIndex(0);
        } else if (node.id == 2) {
          self.baseid = "";
          self.hospitallist = [];
          self.baselist = [];
          self.officelist = [];
          self.searchofficelist = [];
          self.deptid = "";
          self.actionplanlevel = "office";
          self.$refs.hospital.setColumnIndex(0);
          self.$refs.pick.setColumnIndex(0, 0);
          self.$refs.pick.setColumnIndex(1, 0);
          self.$refs.pick.setColumnIndex(2, 0);
        }
        self.init();
      },
      levelonCancel() {
        let self = this;
        self.levelconfig.show = false;
        self.$refs.level.setColumnIndex(0, self.levelconfig.levelselect);
      },
      otheronConfirm(node, index) {
        let self = this;
        console.log(node, index);
        self.otherconfig.otherselect = index;
        self.otherconfig.show = false;
        self.istotop = !this.istotop;
        self.reqnum = 10;
        self.selecttime = node[0].value;
        self.isself = node[1].type;
        self.init();
      },
      otheronCancel() {
        let self = this;
        self.$refs.other.setColumnIndex(0, self.otherconfig.otherselect[0]);
        self.$refs.other.setColumnIndex(1, self.otherconfig.otherselect[1]);
        self.otherconfig.show = false;
      },
      hospitalonConfirm(node, index) {
        let self = this;
        console.log(node, index);
        self.hospitalconfig.show = false;
        self.hospitalconfig.hospitalselect = index;
        self.deptid = node.id;
        self.init();
      },
      hospitalonCancel() {
        let self = this;
        self.$refs.hospital.setColumnIndex(0, self.hospitalconfig.hospitalselect);
        self.hospitalconfig.show = false;
      },
      onConfirm(list, index) {
        let self = this;
        console.log(list, index);
        self.indexList = index;
        console.log(self.columnsc[index[0]].children[index[1]]);
        self.deptname = self.columnsc[index[0]].children[index[1]].name;
        self.deptid = self.columnsc[index[0]].children[index[1]].id;
        this.popShow = false;
        // this.setSingindept(self.deptid);
        this.init();
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
        self.treeList = self.columns[index].childrens;
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
        self.hospitallist = [];
        self.baselist = [];
        self.officelist = [];
        self.actionplanlevel = "office";
        if (
          this.$refs.tree.getCheckedKeys()[0] &&
          this.$refs.tree.getCheckedNodes()[0]
        ) {
          console.log("22222222222", this.$refs.tree.getCheckedNodes()[0]);
          self.deptid = this.$refs.tree.getCheckedKeys()[0];
          self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
          self.deptnameid = this.$refs.tree.getCheckedKeys()[0];
          self.deptnameidList = this.$refs.tree.getCheckedKeys();
          // self.selectdept(this.$refs.tree.getCheckedNodes()[0]);
          self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
          self.popShow2 = false;
          // console.log(self.deptid);
          // console.log(self.deptname);
          // this.setSingindept(self.deptid);
          this.init();
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
        console.log(data, checked, node)
        if (checked) {
          this.$refs.tree.setCheckedKeys([data.id]);
        }
      },
      changetree(data, lst) {
        console.log(data, lst)
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
      }
    }
  };
</script>
<style>
  .active-slef-list .scroll-loadmore,
  .active-slef-list .g-main {
    background: #fff;
  }

  .active-slef-list .g-main {
    margin-top: 8px;
  }
</style>

<style lang="scss" scoped>
  .noContent {
    margin-top: 100px;
    text-align: center;
    font-size: 17px;
    color: #868e97;
    img {
      width: 280px;
      height: 138px;
    }
  }

  .btn-group {
    height: 0.76rem;
    img {
      width: 0.4rem;
      height: 0.4rem;
      margin-top: 0.18rem;
      margin-left: 0.15rem;
    }
  }

  .tosearch {
    width: 0.5rem;
    height: 0.5rem;
    background: url("../../assets/images/search-white.png") 0 0 no-repeat;
    background-size: 100%;
    position: absolute;
    right: 22%;
    top: 0.1rem;
  }

  .search-input {
    position: absolute;
    display: flex;
    width: 100%;
    height: 0.76rem;
    color: #fff;
    background: #3499db;
    z-index: 100;
    padding: 0 0.2rem;
    input {
      background: transparent;
      color: #fff;
      width: 80%;
      height: 0.6rem;
      border-bottom: 1px solid #fff;
      margin-top: 0.06rem;
      padding-right: 0.5rem;
      padding-left: 0.2rem;
    }
    input::placeholder {
      color: #fff;
    }
    span {
      width: 20%;
      text-align: center;
      line-height: 0.76rem;
    }
  }

  .noneContent {
    display: none;
  }

  ul.filter {
    display: flex;
    height: 0.74rem;
    background: #fff;
    color: #666;
    /* border-bottom: 1px solid #aaa; */
    li {
      flex: 1;
      width: 0;
      text-align: center;
      line-height: 0.74rem;
    }
    li:after {
      content: "";
      display: inline-block;
      width: 0.2rem;
      height: 0.2rem;
      background: url("../../assets/images/xia-jiantou.png") 0 0 no-repeat;
      background-size: 100% 100%;
      margin-left: 0.1rem;
    }
    li.active {
      color: #3499db;
    }
    li.active:after {
      content: "";
      display: inline-block;
      width: 0.2rem;
      height: 0.2rem;
      background: url("../../assets/images/shang-jiantou.png") 0 0 no-repeat;
      background-size: 100% 100%;
      margin-left: 0.1rem;
    }
  }

  .addcontent {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>