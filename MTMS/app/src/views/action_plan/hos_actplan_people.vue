<template>
  <div class="g-wrapper">
    <div class="g-main">
      <!--选择参与人员 -->
      <template>
        <div class="cascade">
          <div class="cascade_item_content">
            <div class="cascade_item_wrap">
                            <p>年级</p>
                            <div class="cascade_item gread">
                                <ul class="grade">
                                    <li @click="selectAllGrade" ><i class="mk"></i>全部</li>
                                    <li @click="selectGrade(index,item)" v-for="(item,index) in hos_grade_list" :class="{'active':oneGrade[index]}" :gradeItem="JSON.stringify(item)">
                                        <i class="mk"></i>{{item.name}}
                                    </li>
                                </ul>
                            </div>
            </div>
            <!-- <div class="cascade_item_wrap">
                            <p>学员类型</p>
                            <div class="cascade_item stutype">
                                <ul class="stutype">
                                    <li @click="selectAllstudenttype"><i class="mk"></i>全部</li>
                                    <li @click="selectStutype(index,item)" v-for="(item,index) in hos_stutype_list" :class="{'active':oneStutype[index]}" :gradeItem="JSON.stringify(item)">
                                        <i class="mk"></i>{{item.name}}
                                    </li>
                                </ul>
                            </div>
            </div>-->
            <div class="cascade_item_wrap">
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
            </div> -->
          </div>

          <div class="operation">
            <div>
              <button @click="hospitalresult">重置</button>
              <button @click="hospitalsubmit(true)">确定</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import methods from "../../methods";
import cModal from "../../components/modal";
import cTimepicker from "../../components/timepicker";
import { mapState, mapActions } from "vuex";
let bus = new Vue();
export default {
  props: {
    hosdata: {
      default() {
        return {};
      }
    }
  },
  components: {
    cModal,
    cTimepicker
  },
  data() {
    return {
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
      resultdatalist: []
    };
  },
  computed: {},
  watch: {
    teacher: function(val) {
      if (val.length == 0) {
        this.selectTeacher.show = false;
      }
    }
  },
  created() {
    let self = this;
    self.inithospitalgradelist();
    self.inithospitalstudentlist();
    self.inithospitalbaselist();
  },

  mounted() {
    let self = this;
    self.resultdatalist = self.hosdata.resultdatalist;
    setTimeout(function() {
      self.inithospitalresult();
    }, 500);
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
      self
        .post("/base/dept/listHospital", {
          keywords: "",
          type: 3
        })
        .done(res => {
        //   self.hospitalList = res.model;
          self.hos_list = res.model;
        });
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
      this.hos_grade_list.map((item, index) => {
        if (this.allGrade) {
          _list.push(true);
        } else {
          _list.push(false);
        }
      });
      this.oneGrade = _list;
    },
    selectGrade(index, item) {
      //选择单个的年级
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
      this.hos_stutype_list.map(item => {
        if (this.allStutype) {
          _list.push(true);
        } else {
          _list.push(false);
        }
      }),
        (this.oneStutype = _list);
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
      this.hos_list.map(item => {
        if (this.allBase) {
          _list.push(true);
        } else {
          _list.push(false);
        }
      }),
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

    //初始化
    inithospitalresult() {
      let self = this;
      self.initGrade();
      self.initStutype();
      self.initBase();

      //编辑的重置为 恢复到初始化的数据
      let _greadchecklist = [];
      let _stutyppelist = [];
      let _baselist = [];
      self.hos_grade_list.map((item, index) => {
        self.hosdata.attendinfolist.map((value, select) => {
          if (value.bustype == "grade") {
            if (value.id == item.id) {
              self.oneGrade[index] = true;
            }
          }
        });
      });
      self.hos_stutype_list.map((item, index) => {
        self.hosdata.attendinfolist.map((value, select) => {
          if (value.bustype == "type") {
            if (value.id == item.id) {
              self.oneStutype[index] = true;
            }
          }
        });
      });
      self.hos_list.map((item, index) => {
        self.hosdata.attendinfolist.map((value, select) => {
          if (value.bustype == "base" || value.bustype == "grade") {
            if (value.id == item.id) {
              self.oneBase[index] = true;
            }
          }
        });
      });
    },

    //重置
    hospitalresult() {
      let self = this;
      self.allGrade = false;
      self.allStutype = false;
      self.allBase = false;
      //    self.initGrade();
      //    self.initStutype();
      //    self.initBase();
      let _glist = [];
      let _stulist = [];
      let _blist = [];
      //编辑的重置为 恢复到初始化的数据
      let _greadchecklist = [];
      let _stutyppelist = [];
      let _baselist = [];
      let _resultlist = [];
      this.hos_grade_list.map((item, index) => {
        _glist.push(false);
      });
      this.hos_stutype_list.map((item, index) => {
        _stulist.push(false);
      });
      this.hos_base_list.map((item, index) => {
        _blist.push(false);
      });
      self.oneGrade = _glist;
      self.oneStutype = _stulist;
      self.oneBase = _blist;
      _resultlist = self.resultdatalist;
      //    console.log('重置数据',_resultlist)
      //    console.log(self.oneGrade)
      self.hos_grade_list.map((item, index) => {
        _resultlist.map((value, select) => {
          if (value.bustype == "grade") {
            if (value.id == item.id) {
              self.oneGrade[index] = true;
            }
          }
        });
      });
      self.hos_stutype_list.map((item, index) => {
        _resultlist.map((value, select) => {
          if (value.bustype == "type") {
            if (value.id == item.id) {
              self.oneStutype[index] = true;
            }
          }
        });
      });
      self.hos_base_list.map((item, index) => {
        _resultlist.map((value, select) => {
          if (value.bustype == "base") {
            if (value.id == item.id) {
              self.oneBase[index] = true;
            }
          }
        });
      });
      //    console.log(self.oneGrade)
      setTimeout(function() {
        self.hospitalsubmit(false);
      }, 800);
    },

    //保存
    hospitalsubmit(flag) {
      let self = this;
      let _gradelist = [];
      let _stutylist = [];
      let _baselist = [];
      let _submitgradelist = [];
      let _submitstutypelist = [];
      let _submitbaselist = [];
      let _submitdata = {};
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
      if (
        this.gradesubmitlist.length == 0 &&
        this.stutypesubmitlist.length == 0 &&
        this.basesubmitlist.length == 0
      ) {
        _submitdata = {
          gradelist: [],
          stutypelist: [],
          baselist: [],
          count: "",
          close: false,
          editflag: true
        };
        this.$emit("hospitalsubmitdata", _submitdata);
        this.$emit("close", false);
        return;
      } else {
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
            starttime: self.hosdata.starttimestr,
            endtime: self.hosdata.endtimestr,
            deptid: self.hosdata.deptid,
            gradebean: {
              bustype: "grade",
              gradelist: _gradelist
            },
            stdtypebean: {
              bustype: "stdtype",
              stdtypelist: _stutylist
            },
            basebean: {
              bustype: "base",
              baselist: _baselist
            }
          })
          .done(res => {
            if (res && res.errcode == 0) {
              let _hospitalcount = "";
              if (
                res.result.grouplist.length > 0 &&
                res.result.grouplist[0].count
              ) {
                _hospitalcount = res.result.grouplist[0].count + "人";
              } else {
                _hospitalcount = 0 + "人";
              }
              _submitdata = {
                gradelist: self.gradesubmitlist,
                stutypelist: self.stutypesubmitlist,
                baselist: self.basesubmitlist,
                count: _hospitalcount,
                close: false,
                editflag: true
              };
              if (flag) {
                this.$emit("hospitalsubmitdata", _submitdata);
                this.$emit("close", false);
              } else {
                this.$emit("hospitalsubmitdata", _submitdata);
              }
            } else if (res.errdesc) {
              self.toast(res.errdesc);
            } else {
              self.toast("服务器错误，请联系管理员。");
            }
          });
      }
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
</style>
