<template>
  <div class="homeTeacherChart">
    <div class="userInfoDepartment" v-if="deptList">
      <img src="../../../../assets/images/index-bg3.png" class="bgImg" />
      <div class="info">
        <div class="infoTop">
          <div class="infoTopLeft">
            <div class="infoDepartment" @click="showPicker">
              <span class="dename">{{ deptname }}</span>
              <van-icon name="arrow-down" />
            </div>
            <div class="infoMonth">{{ teacherCircleList.month }}月轮转数据</div>
          </div>
          <div class="infoTopRight">
            <div class="rightContent">
              <div class="titleR">轮转总人数</div>
              <div class="numberR">
                <span class="nnumber">{{ teacherCircleList.turnNum }}</span>
                <span class="dw">人</span>
              </div>
            </div>
            <div class="rightContent">
              <div class="titleR">教学活动</div>
              <div class="numberR">
                <span class="nnumber">{{ teacherCircleList.actNum }}</span>
                <span class="dw">次</span>
              </div>
            </div>
          </div>
        </div>
        <div class="infoBottom">
          <div class="infoBottomLeft">
            <div class="infoBottomLeftContent">轮转进度</div>
          </div>
          <div class="infoBottomRight">
            <div class="infoBottomRightLineX">
              <div class="infoBottomRightLineY">
                <div class="LineYTop">
                  待入科{{ teacherCircleList.inWaiting.item1 }}人
                </div>
                <div class="LineProgress">
                  <div class="pregress-box">
                    <van-progress
                      :percentage="teacherCircleList.inWaiting.item2"
                      color=" linear-gradient(-54deg, #0076F5 1%, #67B1FF 100%)"
                      :show-pivot="false"
                    />
                  </div>
                  <span class="percentText"
                    >{{ teacherCircleList.inWaiting.item2 }}%</span
                  >
                </div>
                <div class="LineYBottom">
                  应入科: {{ teacherCircleList.inWaiting.item3 }}人
                </div>
              </div>
              <div class="infoBottomRightLineY">
                <div class="LineYTop">
                  待分配{{ teacherCircleList.disWaiting.item1 }}人
                </div>
                <div class="LineProgress">
                  <div class="pregress-box">
                    <van-progress
                      :percentage="teacherCircleList.disWaiting.item2"
                      color=" linear-gradient(271deg, #2BBD57 10%, #7ED87D 99%)"
                      :show-pivot="false"
                    />
                  </div>
                  <span class="percentText"
                    >{{ teacherCircleList.disWaiting.item2 }}%</span
                  >
                </div>
                <div class="LineYBottom">
                  应分配: {{ teacherCircleList.disWaiting.item3 }}人
                </div>
              </div>
            </div>
            <div class="infoBottomRightLineX">
              <div class="infoBottomRightLineY">
                <div class="LineYTop">
                  待出科{{ teacherCircleList.outWaiting.item1 }}人
                </div>
                <div class="LineProgress">
                  <div class="pregress-box">
                    <van-progress
                      :percentage="teacherCircleList.outWaiting.item2"
                      color="linear-gradient(275deg, #00B4C5 10%, #2DD3C4 99%)"
                      :show-pivot="false"
                    />
                  </div>
                  <span class="percentText"
                    >{{ teacherCircleList.outWaiting.item2 }}%</span
                  >
                </div>
                <div class="LineYBottom">
                  应出科: {{ teacherCircleList.outWaiting.item3 }}人
                </div>
              </div>
              <div class="infoBottomRightLineY">
                <div class="LineYTop">
                  出科待考核{{ teacherCircleList.checkWaiting.item1 }}人
                </div>
                <div class="LineProgress">
                  <div class="pregress-box">
                    <van-progress
                      :percentage="teacherCircleList.checkWaiting.item2"
                      color="linear-gradient(92deg, #A8A1FF 0%, #6F66EF 96%)"
                      :show-pivot="false"
                    />
                  </div>
                  <span class="percentText"
                    >{{ teacherCircleList.checkWaiting.item2 }}%</span
                  >
                </div>
                <div class="LineYBottom">
                  出科应考核: {{ teacherCircleList.checkWaiting.item3 }}人
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="userInfoStudent" v-show="noUserInfo">
      <img src="../../../../assets/images/index-bg4.png" class="bgImg" />
    </div>
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
</template>


<script>
import methods from "@/methods";
export default {
  name: "homeTeacherChart",
  data() {
    return {
        columns: [],
        deptname: "",
        popShow: false,
        noUserInfo: false,
        orideptnameidList: [],
        deptList: [],
        deptid: "",
        preId: "",
        activeKey: 0,
        oriactiveKey: 0,
        teacherCircleList: {
        month: 0,
        turnNum: 0,
        actNum: 0,
        inWaiting: {
          item1: 0,
          item2: 0,
          item3: 0
        },
        outWaiting: {
          item1: 0,
          item2: 0,
          item3: 0
        },
        disWaiting: {
          item1: 0,
          item2: 0,
          item3: 0
        },
        checkWaiting: {
          item1: 0,
          item2: 0,
          item3: 0
        }
      },
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
    };
  },
  created() {
    this.rememberDeptId()
    this.getTree();
  },
  methods: {
    ...methods,
    rememberDeptId() {
      let self = this
      self.preId = self.getPreId(this.$route.name)
    },
    getTree() {
      let self = this;
      self
        .post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 1,
          hospitalId: "",
          showBase: true,
          deptFirst: true
        })
        .done(res => {
          if (res && res.resCode == 200) {
            if (Array.isArray(res.model) && res.model.length > 0) {
              self.columns = res.model;
              if (self.preId) {
                let preObj = self.findObjectAndIndex(
                  res.model,
                  Number(self.preId)
                );
                console.log(preObj);
                if (preObj) {
                  self.deptList = res.model[preObj.index].childrens;
                  self.deptid = preObj.object.id;
                  self.deptname = preObj.object.name;
                  self.orideptnameidList = [preObj.object.id];
                  self.activeKey = preObj.index;
                  self.oriactiveKey = preObj.index;
                } else {
                  let obj = self.findObjectWithDeptLevel3(res.model);
                  if(obj) {
                    console.log(obj)
                    self.deptList = res.model[obj.parentIndex].childrens;
                    self.deptid = obj.object.id;
                    self.deptname = obj.object.name;
                    self.oriactiveKey = obj.parentIndex;
                    self.activeKey = obj.parentIndex;
                    self.orideptnameidList = [obj.object.id];
                  }else {
                    self.columns = res.model;
                    self.deptList = res.model[0].childrens;
                    self.deptname = res.model[0].childrens[0].name;
                    self.orideptnameidList = [res.model[0].childrens[0].id];
                    self.deptid = res.model[0].childrens[0].id;
                  }
                }
              } else {
                let obj = self.findObjectWithDeptLevel3(res.model);
                if(obj) {
                  self.deptList = res.model[obj.parentIndex].childrens;
                   self.deptid = obj.object.id;
                  self.deptname = obj.object.name;
                  self.oriactiveKey = obj.parentIndex;
                  self.activeKey = obj.parentIndex;
                  self.orideptnameidList = [obj.object.id];
                }else {
                  self.columns = res.model;
                    self.deptList = res.model[0].childrens;
                    self.deptname = res.model[0].childrens[0].name;
                    self.orideptnameidList = [res.model[0].childrens[0].id];
                    self.deptid = res.model[0].childrens[0].id;
                }
              }
              this.$refs.tree.setCheckedKeys([self.deptid]);
              self.getTeachList();
            } else {
              self.noUserInfo = true
            }
          }
        });
    },
    showPicker() {
      let self = this;
      self.popShow = true;
    },
    getTeachList() {
      let self = this;
      self
        .post("/menus/queryTurnManage", {
          command: "menus/queryTurnManage",
          loginid: $.cookie("uid"),
          deptid: self.deptid
        })
        .done(res => {
          self.show = false;
          self.teacherCircleList = self.turnTeach(res);
        });
    },
    turnTeach(obj) {
      let newobj = {};
      newobj.month = obj.month;
      newobj.turnNum = obj.turnPeopleNumber;
      newobj.actNum = obj.teachActivityNumber;
      if (obj.inOfficeResult.length > 0) {
        newobj.inWaiting = {
          item1: obj.inOfficeResult[0].NotRKreportCount,
          item2: Number(
            obj.inOfficeResult[0].percent.substr(
              0,
              obj.inOfficeResult[0].percent.length - 1
            )
          ),
          item3: obj.inOfficeResult[0].RKCount
        };
      } else {
        newobj.inWaiting = {
          item1: 0,
          item2: 0,
          item3: 0
        };
      }
      if (obj.outOfficeResult.length > 0) {
        newobj.outWaiting = {
          item1: obj.outOfficeResult[0].NotCKreportCount,
          item2: Number(
            obj.outOfficeResult[0].percent.substr(
              0,
              obj.outOfficeResult[0].percent.length - 1
            )
          ),
          item3: obj.outOfficeResult[0].CKCount
        };
      } else {
        newobj.outWaiting = {
          item1: 0,
          item2: 0,
          item3: 0
        };
      }
      if (obj.officeTeacherResult.length > 0) {
        newobj.disWaiting = {
          item1: obj.officeTeacherResult[0].NotTeacherCount,
          item2: Number(
            obj.officeTeacherResult[0].percent.substr(
              0,
              obj.officeTeacherResult[0].percent.length - 1
            )
          ),
          item3: obj.officeTeacherResult[0].TeacherCount
        };
      } else {
        newobj.disWaiting = {
          item1: 0,
          item2: 0,
          item3: 0
        };
      }
      if (obj.queryTurnOutExamReportList.list.length > 0) {
        newobj.checkWaiting = {
          item1: obj.queryTurnOutExamReportList.list[0].unfinishedExamCount,
          item2: Number(
            obj.queryTurnOutExamReportList.list[0].percent.substr(
              0,
              obj.queryTurnOutExamReportList.list[0].percent.length - 1
            )
          ),
          item3: obj.queryTurnOutExamReportList.list[0].shouldExamCount
        };
      } else {
        newobj.checkWaiting = {
          item1: 0,
          item2: 0,
          item3: 0
        };
      }
      return newobj;
    },
    onCancel() {
      this.popShow = false;
      this.$refs.pick.setColumnIndex(0, this.indexList[0]);
      this.$refs.pick.setColumnIndex(1, this.indexList[1]);
      this.$refs.pick.setColumnIndex(2, this.indexList[2]);
    },
    
    onConfirm(list, index) {
      let self = this;
      self.indexList = index;
      self.oriSelected2 =
        self.columnsc[index[0]].children[index[1]].children[index[2]];
      self.oriSelected2.deptname = self.oriSelected2.name;
      this.popShow = false;
      self.getTeachList();
    },
    columnSelect(item) {
      let self = this;
      self.selected = item;
      self.columns2 = item.childlist;
    },
    columnSelect2(item) {
      let self = this;
      self.selected2 = item;
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
        self.oriactiveKey = self.activeKey;
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        self.getTeachList();
        self.savePreId();
        // self.init()
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },
    savePreId() {
      if ($.cookie("preIdList")) {
        let arr = JSON.parse($.cookie("preIdList"));
        let item = arr.find(item => item.route == this.$route.name);
        if (item) {
          item.id = this.$refs.tree.getCheckedKeys();
        } else {
          arr.push({
            route: this.$route.name,
            id: this.$refs.tree.getCheckedKeys()
          });
        }
        $.cookie("preIdList", JSON.stringify(arr), { expires: 30, path: "/" });
      } else {
        let preIdList = [
          {
            route: this.$route.name,
            id: this.$refs.tree.getCheckedKeys()
          }
        ];
        let preIdListString = JSON.stringify(preIdList);
        $.cookie("preIdList", preIdListString, { expires: 30, path: "/" });
      }
    },
    getPreId(name) {
        if($.cookie("preIdList")) {
            let arr =  JSON.parse($.cookie("preIdList"))
            console.log(arr)
            console.log(name)
            let item = arr.find(item => item.route == name)
            if(item) {
              let preId = item.id;
              return preId
            }else {
             return null
            }
         }else {
             return null
         }
      },
  },
};
</script>

<style lang="scss" scoped>
.userInfoDepartment {
    position: relative;
    height: 288px;
    background-color: #ffffff;
    .bgImg {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .info {
      background: #ffffff;
      border-radius: 12px;
      position: absolute;
      top: 34px;
      left: 14px;
      right: 14px;
      bottom: 26px;
      .infoTop {
        display: flex;
        align-items: center;
        margin: 16px 20px 30px 20px;
        height: 62px;
        .infoTopLeft {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-around;
          .infoDepartment {
            display: flex;
            .dename {
              font-size: 16px;
              color: #111111;
              letter-spacing: 0.18px;
              font-weight: 600;
            }
            .arrow-right {
              height: 20px;
              width: 10px;
              display: inline-block;
              position: relative;
            }
            .arrow-right::after {
              content: "";
              height: 7px;
              width: 7px;
              top: 6px;
              border-width: 1px 1px 0 0;
              border-color: #7b95b1;
              border-style: solid;
              transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              position: absolute;
            }
          }
          .infoMonth {
            font-size: 10px;
            color: #666666;
            font-weight: 400;
          }
        }
        .infoTopRight {
          flex: 1;
          display: flex;
          justify-content: space-around;
          .rightContent {
            .titleR {
              font-size: 10px;
              color: #3d5166;
              font-weight: 400;
            }
            .numberR {
              display: flex;
              justify-content: center;
              .nnumber {
                font-size: 30px;
                color: #2e445b;
                font-weight: 700;
              }
              .dw {
                font-size: 12px;
                color: #2e445b;
                text-align: center;
                font-weight: 600;
                padding-top: 18px;
                padding-left: 4px;
              }
            }
          }
        }
      }
      .infoBottom {
        height: 120px;
        display: flex;
        .infoBottomLeft {
          width: 25px;
          height: 100px;
          background-image: url(../../../../assets/images/wx-index-left4.png);
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          .infoBottomLeftContent {
            font-size: 12px;
            color: #ffffff;
            letter-spacing: 5px;
            text-align: center;
            line-height: 16px;
            text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
            font-weight: 500;
            writing-mode: tb-rl;
            width: 18px;
          }
        }
        .infoBottomRight {
          display: flex;
          width: 100%;
          margin: 0px 12px;
          .infoBottomRightLineX {
            margin-right: 20px;
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            .infoBottomRightLineY {
              flex: 1;
              .LineYTop {
                font-size: 14px;
                color: #111111;
                font-weight: 500;
              }
              .LineProgress {
                display: flex;
                width: 100%;
                height: 16px;
                .pregress-box {
                  width: 100%;
                  height: 20px;
                  padding-right: 5px;
                }
                .percentText {
                  font-size: 8px;
                  color: #999999;
                  font-weight: 400;
                  width: 31px;
                }
              }
              .LineYBottom {
                font-size: 10px;
                color: #666666;
                line-height: 14px;
                font-weight: 400;
              }
            }
          }
        }
      }
    }
  }
  .userInfoStudent {
      position: relative;
      height: 151px;
      background-color: #ffffff;
      .bgImg {
        position: absolute;
        height: 100%;
        width: 100%;
      }
    }
</style>