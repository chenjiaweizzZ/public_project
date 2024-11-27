<template>
  <div class="chat-history">
    <div class="headers">
      <div class="search">
        <section>
          <span class="title">订单时间</span>
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getOrderList(true)">
          </el-date-picker>
        </section>
        <section>
          <span class="title">出售机构</span>
          <el-select v-model="sourceId" filterable clearable placeholder="请选择" @change="getOrderList(true)">
            <el-option v-for="item in hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name" :disabled="item.disabled">
            </el-option>
          </el-select>
        </section>
        <section>
          <span class="title">科室</span>
          <el-select v-model="packageDeptId" filterable clearable placeholder="请选择" @change="getOrderList(true)">
            <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo">
            </el-option>
          </el-select>
        </section>
        <section>
          <span class="title">健康管理组</span>
          <el-select v-model="groupId" filterable clearable placeholder="请选择" @change="getOrderList(true)">
            <el-option v-for="item in flupGroupList" :key="item.serialNo" :label="item.groupName" :value="item.serialNo">
            </el-option>
          </el-select>
        </section>
        <section>
          <span class="title">患者姓名</span>
          <el-input v-model="patientName" clearable placeholder="请输入"></el-input>
        </section>
        <section>
          <span class="title">联系方式</span>
          <el-input v-model="patientPhone" clearable placeholder="请输入"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="getOrderList(true)">搜索</el-button>
        </section>
      </div>
    </div>
    <div class="main">
      <div class="d-table">
        <el-table :data="mainList" border stripe height="100%">
          <el-table-column type="index" width="80" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip label="患者姓名" prop="patientName"></el-table-column>
          <el-table-column show-overflow-tooltip label="联系方式" prop="patientPhone"></el-table-column>
          <el-table-column show-overflow-tooltip label="科室" prop="packageDeptName"></el-table-column>
          <el-table-column show-overflow-tooltip label="健康管理组" prop="groupName"></el-table-column>
          <el-table-column show-overflow-tooltip label="服务内容" prop="packageName"></el-table-column>
          <el-table-column show-overflow-tooltip label="规格" prop="specName"></el-table-column>
          <el-table-column show-overflow-tooltip label="订单时间" prop="createTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="开始时间" prop="serviceStartTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="结束时间" prop="serviceEndTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="See(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination class="pagination" :page-sizes="[10, 20, 30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="pageNo" :page-size="pageSize" layout="total,sizes,prev, pager, next" :total="total"></el-pagination>
    </div>
    <el-drawer :visible.sync="drawer" :direction="direction" :with-header="false" :before-close="handleClose" :destroy-on-close="true" class="drawer" size="774px">
      <div class="order-header">
        <div class="order-title">
          <span>聊天记录</span>
          <img @click="handleClose" src="../../assets/images/icon/close.png" alt="" />
        </div>
        <div class="order-info">
          <span class="title-name">{{ this.orderInfo.patientName }}</span>
          <span>订单时间：{{ this.orderInfo.createTime }}</span>
        </div>
      </div>
      <div class="message-list" ref="chatWindow" @scroll="handleScroll">
        <div v-if="isEnd" class="nomore">没有更多了</div>
        <div class="t-message" v-for="(message, index) in messageList" :key="index" :ref="message.ID">
          <satisfaction v-if="
              message.type == 'TIMCustomElem' && message.content.data.type == 11
            " :message="message" @seeSatisfactionDetail="$seeSatisfactionDetail"></satisfaction>
          <!-- 自定义系统消息 -->
          <div class="custom-message" v-if="
              !message.isRevoked &&
                message.type == 'TIMCustomElem' &&
                message.content &&
                message.content.data &&
                message.content.data.type == 4 &&
                message.content.desc !== '健康档案'
            ">
            {{ message.content.data.text }}
          </div>
          <div class="custom-message" v-if="message.isRevoked">
            {{ message.name }}撤回了一条消息
          </div>
          <graphic-message v-if="
                    message.type == 'TIMCustomElem' &&
                    message.content.desc == '健康档案'" :message="message">
          </graphic-message>
          <!-- 左边消息 -->
          <div class="message-left" v-if="!message.isSend &&
                !message.isRevoked &&
                (message.type == 'TIMTextElem' ||
                  message.type == 'TIMImageElem' ||
                  message.type == 'TIMVideoFileElem' ||
                  message.type == 'TIMCustomElem' ||
                  message.type === 'TIMSoundElem' ||
                  (message.type === 'TIMVideoFileElem' &&
                    message.content.data.type == 3))
              
            ">
            <div style="display: flex;flex-direction: column;">
              <div class="name">
                {{ message.name }} {{ timestampToDate(message.time) }}
              </div>
              <div style="display: flex; flex-direction: row;">
                <!-- 头像 -->
                <img v-if="
                    message.type != 'TIMCustomElem' ||
                      (message.type == 'TIMCustomElem' &&
                        (message.content.data.type == 12 ||
                          message.content.data.type == 13))
                  " class="doctor-info-image-left" src="../../assets/images/avatar-left.png" />
                <!-- 文字，自定义表情消息 -->
                <expressionMessage :isMine="message.isSend" v-if="message.type == 'TIMTextElem'" :message="message.content">
                </expressionMessage>
                <!-- 图片消息 -->
                <ImageMessage v-if="message.type == 'TIMImageElem'" class="image" :ImgUrl="message.bigImage" :messageList="messageList"></ImageMessage>
                <!-- 视频消息 -->
                <VideoMessage v-if="message.type == 'TIMVideoFileElem'" :message="message">
                </VideoMessage>
                <fileMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 12
                  " :message="message" :isMine="message.isSend"></fileMessage>
                <callMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 13
                  " :message="message" :isMine="message.isSend">
                </callMessage>
              </div>
            </div>
          </div>
          <!-- 右边消息 -->
          <div class="message-right" v-if="
              (message.isSend &&
                !message.isRevoked &&
                (message.type == 'TIMTextElem' ||
                  message.type == 'TIMImageElem' ||
                  message.type == 'TIMVideoFileElem' ||
                  message.type === 'TIMSoundElem')) ||
                (message.type == 'TIMCustomElem' &&
                  message.isSend &&
                  !message.isRevoked &&
                  message.content &&
                  message.content.data &&
                  (message.content.data.type == 12 ||
                    message.content.data.type == 3 ||
                    message.content.data.type == 2 ||
                    message.content.data.type == 6 ||
                    message.content.data.type == 7 ||
                    message.content.data.type == 13))
            ">
            <div style="display: flex;flex-direction: column;">
              <div class="my-name">
                {{ message.name || "小雅" }} {{ timestampToDate(message.time) }}
              </div>
              <div style="display: flex; flex-direction: row-reverse;">
                <!-- 头像 -->
                <img v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 7
                  " class="doctor-info-image-right" src="../../assets/images/xiaoya.png" />
                <img v-else class="doctor-info-image-right" src="../../assets/images/avatar-right.png" />

                <!-- 文字，自定义表情消息 -->
                <expressionMessage :isMine="message.isSend" v-if="message.type == 'TIMTextElem'" :message="message.content">
                </expressionMessage>
                <!-- 图片消息 -->
                <ImageMessage v-if="message.type == 'TIMImageElem'" class="image" :ImgUrl="message.bigImage" :messageList="messageList"></ImageMessage>
                <!-- 视频消息 -->
                <VideoMessage v-if="message.type == 'TIMVideoFileElem'" :message="message">
                </VideoMessage>
                <!-- 问卷消息 -->
                <questionnaireMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 3
                  " :message="message" @seeDetail="seeDetail"></questionnaireMessage>
                <!-- 健康计划消息 -->
                <planMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 2
                  " @seeDetail="seeDetail" :message="message"></planMessage>
                <!-- 套餐推荐消息 -->
                <PackageRecommendations v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 6
                  " :message="message"></PackageRecommendations>
                <!-- 机器人消息 -->
                <robotMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 7
                  " :message="message"></robotMessage>
                <fileMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 12
                  " :message="message" :isMine="message.isSend"></fileMessage>
                <callMessage v-if="
                    message.type == 'TIMCustomElem' &&
                      message.content.data.type == 13
                  " :message="message" :isMine="message.isSend">
                </callMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="satisfaction-content" v-if="showSatisfaction">
        <div class="close" @click="showSatisfaction = false">
          <img src="../../assets/images/icon/close.png" mode="" />
        </div>
        <div class="header">满意度调查问卷</div>
        <div class="divider-line"></div>
        <div class="list">
          <div class="item">
            <div class="key">总体满意度</div>
            <div>
              <img v-for="item in satisfactionData.sumValue" :key="item" src="../../assets/images/select-star.png" mode="" />
              <img v-for="item in 5 - satisfactionData.sumValue" :key="item" src="../../assets/images/star.png" mode="" />
            </div>
          </div>
          <div class="item">
            <div class="key">流程满意度</div>
            <div>
              <img v-for="item in satisfactionData.procedureValue" :key="item" src="../../assets/images/select-star.png" mode="" />
              <img v-for="item in 5 - satisfactionData.procedureValue" :key="item" src="../../assets/images/star.png" mode="" />
            </div>
          </div>
          <div class="item">
            <div class="key">服务满意度</div>
            <div>
              <img v-for="item in satisfactionData.serviceValue" :key="item" src="../../assets/images/select-star.png" mode="" />
              <img v-for="item in 5 - satisfactionData.serviceValue" :key="item" src="../../assets/images/star.png" mode="" />
            </div>
          </div>
        </div>
        <div class="proposal">{{ satisfactionData.advice }}</div>
      </div>
    </el-drawer>
    <el-dialog title="提示" v-if="dialogVisible" :visible.sync="dialogVisible" width="30%">
      <iframe width="100%" height="400" v-if="url" :src="url" frameborder="0"></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TimeMessage from "./components/TimeMessage";
import expressionMessage from "./components/expressionMessage";
import ImageMessage from "./components/ImageMessage";
import questionnaireMessage from "./components/questionnaireMessage";
import planMessage from "./components/planMessage";
import robotMessage from "./components/robotMessage";
import PackageRecommendations from "./components/PackageRecommendations";
import VideoMessage from "./components/VideoMessage";
import satisfaction from "./components/satisfaction";
import fileMessage from "./components/fileMessage";
import callMessage from "./components/callMessage";
import graphicMessage from "./components/graphicMessage";
export default {
  components: {
    TimeMessage,
    expressionMessage,
    ImageMessage,
    questionnaireMessage,
    planMessage,
    robotMessage,
    PackageRecommendations,
    VideoMessage,
    satisfaction,
    fileMessage,
    callMessage,
    graphicMessage,
  },
  data() {
    return {
      dialogVisible: false,
      showSatisfaction: false,
      satisfactionData: {
        sumValue: 0,
        procedureValue: 0,
        serviceValue: 0,
        advice: "",
      },
      time: this.getLastMonth(1),
      pageSize: 10,
      pageNo: 1,
      total: 0,
      hospitalList: [],
      deptList: [],
      flupGroupList: [],
      mainList: [],
      sourceId: "",
      packageDeptId: "",
      drawer: false,
      direction: "rtl",
      patientName: "",
      patientPhone: "",
      groupId: "",
      pageNo2: 1,
      isEnd: false,
      arr: [],
      messageList: [],
      ceshi: false,
      memberList: [],
      roomId: "",
      patientId: "",
      orderInfo: {},
      url: "",
    };
  },
  created() {
    this.getAllHospitalList();
    this.getDeptList();
    this.getFlupGroupList();
    this.getOrderList();
  },
  methods: {
    timestampToDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    seeDetail(e) {
      this.url = e.url;
      this.dialogVisible = true;
    },
    getLastMonth(i) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let dateArr = new Array(2);
      dateArr[1] = year + "-" + month + "-" + day;
      let nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
      if (i == 12) {
        //如果是12月，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + month + "-" + day;
      } else if (month - i <= 0) {
        // 如果前推i月小于0，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + 12 + "-" + day;
      } else {
        let endTimeMonthDay = new Date(year, parseInt(month) - i, 0).getDate();
        if (endTimeMonthDay < day) {
          // i个月前所在月的总天数小于现在的天日期
          if (day < nowMonthDay) {
            // 当前天日期小于当前月总天数
            dateArr[0] =
              year +
              "-" +
              (month - i) +
              "-" +
              (endTimeMonthDay - (nowMonthDay - day));
          } else {
            dateArr[0] = year + "-" + (month - i) + "-" + endTimeMonthDay;
          }
        } else {
          dateArr[0] = year + "-" + (month - i) + "-" + day;
        }
      }
      return dateArr;
    },
    $seeSatisfactionDetail(e) {
      this.$apis.satisfaction(e).then((res) => {
        if (res && res.procedureValue != null) {
          this.showSatisfaction = true;
          this.satisfactionData = res;
        } else {
          this.$message({
            message: "患者未填写",
            type: "warning",
          });
        }
      });
    },
    /**
     * 获取群成员列表
     */
    getGroupUserInfoList() {
      this.$apis
        .selectGroupUserInfoList({
          roomId: this.roomId,
        })
        .then((res) => {
          this.memberList = res;
          this.getChatHistory();
          this.drawer = true;
        });
    },
    /**
     * 获取图文咨询群成员列表
     */
    selectGraphicGroupUserInfoList() {
      this.$apis
        .selectGraphicGroupUserInfoList({
          roomId: this.roomId,
        })
        .then((res) => {
          this.memberList = res;
          this.getChatHistory();
          this.drawer = true;
        });
    },
    /**
     * 健康管理组查询
     */
    getFlupGroupList() {
      this.$apis
        .groupgetFlupGroupList({
          hospitalId: this.$global.hospital_id,
          pageNo: 1,
          pageSize: 999,
        })
        .then((res) => {
          this.flupGroupList = res.list;
        });
    },
    /**
     * 获取医院列表
     */
    getAllHospitalList() {
      this.$apis.getAllHospitalList().then((res) => {
        this.hospitalList = res;
        this.hospitalList.forEach((item) => {
          if (item.serial_no !== this.$global.hospital_id) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      });
    },
    /**
     * 获取科室列表
     */
    getDeptList() {
      this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.deptList = res || [];
        });
    },
    /**
     * 订单查询
     */
    getOrderList(refresh) {
      if (refresh) {
        this.pageNo = 1;
      }
      this.$apis
        .listOrderForChat({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          patientName: this.patientName,
          patientPhone: this.patientPhone,
          groupId: this.groupId,
          sourceId: this.sourceId,
          packageDeptId: this.packageDeptId,
          startTime: this.time && this.time.length > 0 ? this.time[0] : null,
          endTime: this.time && this.time.length > 0 ? this.time[1] : null,
        })
        .then((res) => {
          this.mainList = res.list;
          this.total = res.total;
        });
    },
    /**
     * 获取消息列表
     */
    getChatHistory() {
      this.$apis
        .getHistoryQuery({
          enddate: this.getCurrentDateWithHyphens(),
          pagesize: 30,
          currentpage: this.pageNo2,
          roomId: this.roomId,
        })
        .then(async (res) => {
          let resObj = JSON.parse(res);
          if (resObj.ErrorCode == 0) {
            let serviceMessageList = JSON.parse(resObj.Data);
            if (serviceMessageList.length < 30) {
              this.isEnd = true;
            }
            let messageList = this.formatHistoryMessageList(serviceMessageList);

            this.arr = [...messageList.reverse(), ...this.arr];
            if (this.arr.length >= 30 || this.isEnd) {
              this.messageList = [...this.arr, ...this.messageList];
              let arr = JSON.parse(JSON.stringify(this.arr));
              if (!this.ceshi) {
                this.$nextTick(() => {
                  this.$refs.chatWindow.scrollTop =
                    this.$refs.chatWindow.scrollHeight;
                  this.arr = [];
                });
              } else {
                this.$nextTick(() => {
                  let ID = arr[arr.length - 1].ID;
                  const container = this.$refs.chatWindow;
                  const element = this.$refs[ID][0];
                  const rect = element.getBoundingClientRect();
                  const top = rect.top - container.getBoundingClientRect().top;
                  this.$refs.chatWindow.scrollTop = top;
                  this.arr = [];
                });
              }
            } else {
              this.pageNo2 += 1;
              this.getChatHistory();
            }
          }
        });
    },
    getCurrentDateWithHyphens() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    /**
     * 格式化数据
     */
    formatHistoryMessageList(list) {
      console.log("list", list);
      let messageList = [];
      list.forEach((item) => {
        // console.log(item);
        let localMsg = {
          fromAccount: item.from_account,
          fromAccountNick: "",
          random: 0,
          seq: item.msg_seq,
          time: new Date(item.msg_timestamp).getTime() / 1000,
          subType: 0,
          sessId: item.group_id,
          sessType: "Group",
          ID: `ID-${item.from_account}-${
            new Date(item.msg_timestamp).getTime() / 1000
          }`,
          isRevoked: item.c_id,
        };
        item.chats_detail.forEach((elem) => {
          switch (elem.msg_type) {
            case "TIMTextElem":
              localMsg["type"] = "TIMTextElem";
              localMsg["content"] = elem.chat_text;
              break;
            case "TIMImageElem":
              localMsg["type"] = "TIMImageElem";
              elem.image_list.forEach((imageItem) => {
                if (imageItem.image_type == 3) {
                  localMsg["smallImage"] = imageItem.image_url;
                } else if (imageItem.image_type == 2) {
                  localMsg["bigImage"] = imageItem.image_url;
                } else {
                  localMsg["oriImage"] = imageItem.image_url; //原图
                }
              });
              break;
            case "TIMCustomElem":
              if (elem.location_desc == "TIMImageElem") {
                localMsg["type"] = "TIMImageElem";
                localMsg["bigImage"] = JSON.parse(elem.look_data).imageUrl;
              } else if (elem.location_desc == "TIMVideoFileElem") {
                localMsg["type"] = "TIMVideoFileElem";
                localMsg["videoUrl"] = JSON.parse(elem.look_data).videoUrl;
              } else {
                localMsg["type"] = "TIMCustomElem";
                var contentobj = {};
                contentobj.desc = elem.location_desc;
                contentobj.ext = elem.define_ext;
                if (typeof elem.look_data == "string") {
                  try {
                    contentobj.data = JSON.parse(elem.look_data);
                    contentobj.data.text = JSON.parse(contentobj.data.text);
                  } catch (e) {}
                } else {
                  contentobj.data = elem.look_data;
                }
                localMsg["content"] = contentobj;
              }
              break;
            case "TIMSoundElem":
              localMsg["type"] = "TIMTextElem";
              let content1 = "语音消息请在手机上查看";
              localMsg["content"] = content1;
              break;
            default:
              localMsg["type"] = "TIMTextElem";
              let content2 = "消息已过期";
              localMsg["content"] = content2;
              break;
          }
        });
        messageList.push(localMsg);
      });
      // 过滤出需要展示的数据
      messageList = messageList.filter((item) => {
        let bool1 = true;
        if (item.type == "TIMCustomElem" && item.content.data.type == 4) {
          if (typeof item.content.data.text == "string") {
            let j = item.content.data.text.indexOf("订单剩余");
            if (j > -1) bool1 = false;
          }
        }
        if (bool1) return true;
        return false;
      });
      // 姓名显示
      messageList.forEach((item) => {
        let newArr = this.memberList.filter((items) => {
          return item.fromAccount == items.extendUserId;
        });
        if (newArr.length > 0) {
          item.name = newArr[0].userName;
        }
      });
      // 患者的消息显示在左边，其它人发的消息显示在右边
      messageList.forEach((item) => {
        if (item.fromAccount == this.patientId) {
          item.isSend = false;
          return;
        }
        item.isSend = true;
      });
      return messageList;
    },
    /**
     * 分页查询
     */
    handleSizeChange(v) {
      this.pageNo = 1;
      this.pageSize = v;
      this.getOrderList();
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getOrderList();
    },
    handleClose() {
      this.pageNo2 = 1;
      this.isEnd = false;
      this.ceshi = false;
      this.drawer = false;
      this.arr = [];
      this.messageList = [];
    },
    See(row) {
      if (!row.roomId) {
        this.$message({
          type: "warning",
          message: "该订单没有聊天记录",
        });
        return;
      }
      this.showSatisfaction = false;
      this.orderInfo = row;
      this.patientId = row.patientId;
      this.roomId = row.roomId;
      if (row.packageType == 1) {
        this.selectGraphicGroupUserInfoList();
      } else {
        this.getGroupUserInfoList();
      }
    },
    /**
     * 加载更多数据
     */
    handleScroll(event) {
      this.ceshi = true;
      const { scrollTop } = event.target;
      // 检查是否滚动到顶部
      if (scrollTop === 0) {
        if (!this.isEnd) {
          this.pageNo2 += 1;
          this.getChatHistory();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chat-history {
  height: 100%;
  margin: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .headers {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f2f2;
    padding-right: 20px;
    margin-bottom: 10px;
    .search {
      display: flex;
      flex-wrap: wrap;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        flex-shrink: 0;
        margin-right: 14px;
      }
    }
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .d-table {
      flex: 1;
      overflow: hidden;
    }
    .pagination {
      margin-bottom: 20px;
    }
  }

  .drawer {
    .order-header {
      .order-title {
        color: #333333;
        font-size: 18px;
        margin: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .order-info {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fbfbfb;
        padding: 18px;
        .title-name {
          color: #111111;
          font-weight: 700;
          font-size: 14px;
        }
      }
    }

    .message-list {
      border: 1px solid #e6e6e6;
      flex: 1;
      overflow-y: auto;
      margin: 20px 0;
      padding: 10px 0;
    }
    .enter {
      transform: translate3d(0, 0, 0);
      transform-origin: right;
      animation: pageEnter 0.3s ease-in-out;
    }

    .t-message {
      margin-top: 20px;
      position: relative;
    }

    .time {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999;
      text-align: center;
      line-height: 14px;
      padding-top: 10px;
      padding-bottom: 5px;
    }

    .content-left {
      max-width: 250px;
      background-color: white;
      border-bottom-color: white;
      /*为了给after伪元素自动继承*/
      padding: 10px 12px 10px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      position: relative;
      align-self: flex-start;
      color: white;
      margin-left: 10px;
      margin-top: 5px !important;
    }

    .text {
      /* font-family: PingFangSC-Regular; */
      font-size: 16px;
      font-family: Arial;
      line-height: 18px;
      word-break: break-word;
      min-height: 14px;
    }

    .textleft {
      color: #111;
    }

    .textright {
      border-radius: 10px 2px 10px 10px;
      border: 1px solid rgba(0, 110, 255, 0.3);
      background: rgba(0, 110, 255, 0.1);
      max-width: 60vw;
      line-height: 26px;
      padding: 6px 12px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      white-space: pre-wrap;
    }

    .content-left::before {
      content: "";
      position: absolute;
      width: 8px;
      height: 5px;
      right: 0px;
      left: -5px;
      top: 10px;
      border-width: 0 10px 10px 0px;
      border-style: solid;
      border-left-color: transparent;
      border-bottom-color: inherit;
      border-bottom-left-radius: 30px;
    }

    .content-right {
      max-width: 250px;
      background-color: #bbe7ff;
      border-bottom-color: #bbe7ff;
      /*为了给after伪元素自动继承*/
      padding: 10px 12px 10px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      position: relative;
      align-self: flex-end;
      margin: 8px;
    }

    .content-right::after {
      content: "";
      position: absolute;
      width: 8px;
      height: 5px;
      right: -5px;
      top: 2px;
      border-width: 0 0 10px 10px;
      border-style: solid;
      border-left-color: transparent;
      border-bottom-color: inherit;
      border-bottom-right-radius: 30px;
    }

    .message-left {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
    }

    .message-right {
      display: flex;
      flex-direction: column-reverse;
      margin: 10px 0;
    }

    .doctor-info {
      display: flex;
      flex-direction: column;
    }

    .doctor-info-image-left {
      margin-left: 10px;
      margin-right: 14px;
      border-radius: 5px;
      width: 40px;
      height: 40px;
      margin-top: 4px;
    }

    .doctor-info-image-right {
      margin-left: 14px;
      margin-right: 10px;
      border-radius: 5px;
      width: 40px;
      height: 40px;
      margin-top: 4px;
    }

    .doctor-info text {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #000000;
      letter-spacing: 0;
      line-height: 20px;
      font-size: 14px;
      line-break: anywhere;
    }

    .image {
      width: 150px;
      border-radius: 10px 10px 10px 10px;
    }

    .voice-left {
      max-width: 139px;
      height: 21px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 6px;
      justify-content: flex-start;
    }

    .voice-left .voice-text {
      padding-left: 10px;
      font-size: 14px;
      color: #111111;
    }

    .voice-right {
      max-width: 139px;
      height: 21px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 6px;
      justify-content: flex-end;
    }

    .voice-right .voice-text {
      padding-right: 10px;
      font-size: 14px;
      color: #111111;
    }

    .customer-msg-text {
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: 6px 12px 20px 12px;
    }

    .customer-msg-whitebg {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: left;
      margin: 8px 0;
      padding: 8px 12px;
    }

    .appraise-text {
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      align-self: flex-start;
      margin-top: 8px;
      word-break: break-all;
    }

    .link-info.content-left {
      border-bottom-color: #4185f3;
      color: #4185f3;
      padding: 12px 12px 17px;
    }

    .link-info {
      background: #4185f3;
    }

    .link-info .top {
      font-size: 14px;
      color: #fff;
      margin-bottom: 8px;
    }

    .link-info img {
      border-radius: 4px;
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }

    .doctorInfo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    }

    .doctorInfo .bottom-info view,
    .doctorInfo .bottom-info text {
      font-size: 14px;
      color: #fff;
    }

    .left10 {
      margin-right: 10px;
    }

    .doctorInfo .doctor-name {
      margin-bottom: 5px;
    }

    .revoke-message {
      text-align: center;
      font-size: 14px;
      color: #999;
    }

    /****************** 播放闪烁 ******************/
    .playing-voice {
      animation: fadeInOut 2s linear infinite;
    }

    @keyframes fadeInOut {
      0% {
        opacity: 0;
        /*初始状态 透明度为0*/
      }

      100% {
        opacity: 1;
        /*结尾状态 透明度为1*/
      }
    }

    .video-icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .message-body-span {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      outline: none;
      font-size: 14px;
      color: #333333;
      position: relative;
      max-width: 60vw;
    }

    .message-body-span-text {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #000000;
      letter-spacing: 0;
      line-height: 20px;
      font-size: 14px;
      line-break: anywhere;
    }

    .custom-message {
      display: flex;
      justify-content: center;
      font-size: 14px;
      padding: 7px 0;
      color: #428d58;
    }

    .my-name {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0.2px;
      color: #333333;
      margin-right: 60px;
      margin-bottom: 4px;
    }

    .name {
      display: flex;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0.2px;
      color: #333333;
      margin-left: 60px;
      margin-bottom: 4px;
    }
    .nomore {
      text-align: center;
    }
  }
  .satisfaction-content {
    z-index: 100;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 319px;
    border-radius: 8px;
    background: #ffffff;
  }

  .satisfaction-content .header {
    color: #111111;
    font-size: 18px;
    font-weight: 700;
    margin-top: 28px;
    margin-bottom: 24px;
    text-align: center;
  }

  .divider-line {
    border: 1px dashed #e2e2e2;
    margin: 0 20px;
  }

  .satisfaction-content .list {
    margin: 34px 20px 0;
    text-align: left;
    color: #111111;
    font-size: 16px;
    font-weight: 700;
  }

  .list .item {
    margin-bottom: 30px;
    display: flex;
  }

  .list .item .key {
    margin-right: 27px;
    flex-shrink: 0;
  }

  .item img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }

  .close {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .close img {
    width: 22px;
    height: 22px;
  }

  .proposal {
    border: 1px solid #cdcdcd;
    padding: 12px;
    margin: 20px;
    word-wrap: break-word;
    max-height: 100px;
    overflow-y: auto;
  }
}
</style>
<style lang="scss">
.chat-history {
  .el-drawer__body {
    background-color: #ffffff !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .message-list {
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>
