<template >
  <div class="ipccBox" v-drag="{setCoordinates:'ipcc'}">
    <div class="max">
      <div :style="isLogin?'':'border-radius: 8px'" class="loginBox">
        <img src="../assets/images/lx.png" />
        <el-select style="width:100px" v-model="extension" placeholder="请选择">
          <el-option v-for="(item,index) in extensionList" :key="index" :label="item.id" :value="item.id"></el-option>
        </el-select>
        <el-button v-if="isLogin" type="primary" @click="checkOut">签出</el-button>
        <el-button v-else type="primary" @click="checkIn">签入</el-button>
      </div>
      <div v-if="isLogin" class="phoneBox">
        <div class="panelBox">
          <div>
            <div>
              当前状态
              <el-radio-group v-model="statusid" @change="changeState">
                <el-radio label="1">空闲</el-radio>
                <el-radio label="2">忙碌</el-radio>
              </el-radio-group>
            </div>
            <p>
              通话时长
              <span style="margin-left: 5px;">{{callStatus}}</span>
              <span style="margin-left: 5px;"></span>
            </p>
            <el-input v-model="phoneNumber" placeholder="请输入电话号" clearable @input="setCallOutNumber"></el-input>
          </div>
          <!-- <div>
            <img src="../assets/images/dh.png" />
            <p style=" margin: 14px 0px 4px;text-align: center;">13566666666</p>
            <span>未知号码</span>
          </div>-->
        </div>
        <div class="butBox">
          <el-button v-if="callStatus == '00:00:00'&&!IncomingCall" type="primary" @click="originatedh">呼叫</el-button>
          <el-button v-if="callStatus != '00:00:00'|| IncomingCall" type="danger" @click="hangUp">挂断</el-button>
          <el-button v-if="!IncomingCall" :disabled="callStatus =='00:00:00'" type="primary">转接</el-button>
          <!-- <el-button type="primary">接听</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Cookies from 'vue-cookie';
import '@/assets/js/ipcc/Math.uuid.js';
import '@/assets/js/ipcc/socket.io.js';
export default {
  name: 'ipcc',
  props: ['ipccPhone'],
  data() {
    return {
      extensionList: [],
      value: '',
      phoneNumber: null,
      // radio: 1,
      WEB_SERVER: this.$parent.$baseURL.WEBSERVER,
      CTI_SERVER: this.$parent.$baseURL.CTISERVER,
      TOKEN_URL: this.$parent.$baseURL.WEBSERVER + '/tccrm2_saas_ws2/admin/user/token',
      wsUri: '',
      CALLIN_URL: '/admin/custom/custom_callin_pop',
      StatusId2Content: new Array('离线', '示闲', '话后处理/外呼', '小休', '就餐', '会议', '培训'), // 座席状态ID和状态对应数组(数组ID为状态ID，数组值为状态)
      StatusId2Icon: new Array('icon_offline', 'icon_online', 'icon_leave', 'icon_free', 'icon_eat', 'icon_meeting', 'icon_peixun'), // 座席状态ID和icon对应数组(数组ID为状态ID，数组值为icon)
      Queue2Skill: new Array(),
      socket: null,
      statusid: '1',
      SESSION_NO: '',
      SESSION_EXTENSION: 'NOEXT',
      SESSION_GROUPS: '',
      SESSION_TOKEN: '',
      SESSION_NAME: '',
      SESSION_TENANT: '',
      tenantId: null, //租户编号
      agentid: null, //坐席工号
      password: null, //密码
      extension: null, //坐席分机
      phoneyz: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      groups: null, //列队
      callStatus: '00:00:00',
      callTimeSetInterval: null, //通话计时器
      IncomingCall: false, //是否在通话
      isLogin: false, //登录状态
      loading: false,
      currentServeCode: 0,
    };
  },
  computed: {
    callOutNumber: function () {
      // return this.$store.state.ipcc.callOutNumber
      return this.$store.getters['ipcc/getCallOutNumber'];
    },
    // isLogin: function () {
    //   return this.$store.getters['ipcc/getIsLogin']
    // },
  },
  watch: {
    callOutNumber: function (newValue) {
      if (newValue) {
        this.setPromptMessage(newValue);
      }
    },
  },
  mounted() {
    this.$apis.getDevicesList().then((res) => {
      this.extensionList = res;
    });
    this.$apis.getAgentByUser().then((res) => {
      this.tenantId = res.nodehost;
      this.agentid = res.id;
      this.password = res.password;
      this.setSynchronization();
    });
    this.getServeList();
  },
  methods: {
    //电话随访联动呼叫
    callOut() {
      if (this.ipccPhone) {
        if (!this.isLogin) {
          this.$message({
            message: '请先签入座机',
            type: 'warning',
          });
        } else {
          if (this.callStatus != '00:00:00') {
            this.$message({
              message: '当前已有其它通话请稍后!',
              type: 'warning',
            });
          } else {
            this.phoneNumber = this.ipccPhone;
            this.originatedh();
          }
        }
      } else {
      }
    },
    //面板号码更改清空vuex
    setCallOutNumber() {
      if (this.callOutNumber) {
        this.$store.commit('ipcc/changeCallOutNumber', null);
      }
    },
    //多界面面板同步
    setSynchronization() {
      console.log(JSON.parse(sessionStorage.getItem('isLogin')));
      this.$nextTick(() => {
        this.isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
        // this.$store.commit(
        //   'ipcc/changeIsLogin',
        //   JSON.parse(sessionStorage.getItem('isLogin'))
        // )
        if (this.isLogin) {
          Cookies.set('ipcc', this.callOutNumber);
          if (sessionStorage.getItem('callOutNumber')) {
            this.$store.commit('ipcc/changeCallOutNumber', JSON.parse(sessionStorage.getItem('callOutNumber')));
          }
          if (sessionStorage.getItem('extension')) {
            this.extension = sessionStorage.getItem('extension');
            this.checkIn();
          }
        }
        this.key++;
      });
    },
    setPromptMessage(newValue) {
      if (this.isLogin) {
        this.phoneNumber = newValue;
      } else {
        this.$message({
          message: '请先签入座机',
          type: 'warning',
        });
        this.$store.commit('ipcc/changeCallOutNumber', null);
      }
    },
    //当前服务商
    getServeList() {
      this.$apis
        .getAllIpccConfig({
          pageNo: 1,
          pageSize: 1000,
          value: '',
        })
        .then((res) => {
          this.mainList = res.list;
          let item = res.list.find((i) => {
            return i.isEnable == 1;
          });
          this.currentServeCode = item.ipcc;
          // console.log(this.currentServeCode, 'getServeListgetServeListgetServeList');
        });
    },
    //签入
    checkIn() {
      // this.getgetAllDevices()
      if (this.currentServeCode == 2) {
        this.$apis.cloudCallLogin(this.extension).then((res) => {
          console.log(res, 'resres');
          // 调用成功后才可以开始执行TCCC的注入
          this.injectTCCC(
            {
              token: res.token,
              sdkAppId: res.sdkAppId,
              userId: res.requestId,
              sdkUrl: res.sdkURL,
            }
            // {
            //   token: '2e77ea4954134a1db759be44be301068',
            //   sdkUrl: 'https://tccc.qcloud.com/sdk/tcccSdk.js?sdkAppId=1400763834&token=2e77ea4954134a1db759be44be301068&userid=chenjian%40zhuojianchina.com',
            //   sdkAppId: 1400763834,
            //   userId: 'chenjian@zhuojianchina.com',
            // }
          );
          this.isLogin = true;
          console.log(window, 'window');
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        });
      } else if (this.extension) {
        sessionStorage.setItem('extension', this.extension);
        axios
          .get(this.TOKEN_URL, {
            params: {
              tenantId: this.tenantId,
              agentid: this.agentid,
              password: this.password,
              extension: this.extension,
            },
          })
          .then((response) => {
            if (response.data.success) {
              Cookies.set('agent_tenantId', this.tenantId, {
                expires: 10,
                path: '/',
              });
              Cookies.set('agent_id', this.agentid, {
                expires: 10,
                path: '/',
              });
              Cookies.set('agent_exten', this.extension, {
                expires: 10,
                path: '/',
              });
              Cookies.set('agent_groups', response.data.groups, {
                expires: 10,
                path: '/',
              });
              Cookies.set('exten_dial', 'SIP/' + this.extension, {
                expires: 10,
                path: '/',
              });
              // Cookies.set('token', response.token, { expires: 10, path: '/' })
              Cookies.set('agent_name', response.data.name, {
                expires: 10,
                path: '/',
              });
              Cookies.set('agent_statusid', '1', { expires: 10, path: '/' });
              // this.checkInWhether = true
              // this.checkInResult = true
              this.isLogin = true;
              sessionStorage.setItem('isLogin', this.isLogin);
              // this.$store.commit('ipcc/changeIsLogin', true)
              this.groups = response.data.groups;
              this.Manager_Connect(this.CTI_SERVER, this.agentid, response.data.token, this.extension, response.data.groups, this.tenantId);
            } else {
              this.$message({
                message: response.data.message,
                type: 'warning',
              });
            }
          });
      } else {
        this.$message({
          message: '请选择坐席接听分机',
          type: 'warning',
        });
      }
    },
    injectTCCC({ token, sdkAppId, userId, sdkUrl }) {
      const scriptDom = document.createElement('script');
      scriptDom.setAttribute('crossorigin', 'anonymous');
      scriptDom.dataset.token = token;
      scriptDom.dataset.sdkAppId = sdkAppId;
      scriptDom.dataset.userid = userId;
      scriptDom.src = sdkUrl;
      document.body.appendChild(scriptDom);
      scriptDom.addEventListener('load', () => {
        // ready事件必须监听，否则容易发生tccc不存在的错误，所有呼入呼出的逻辑必须在ready事件触发后才可以调用
        window.tccc.on('ready', () => {
          // 以下为Demo逻辑，非业务必须。业务代码主要实现都在这个部分
          const statusVal = window.tccc.Agent.getStatus();
          // status.value = statusVal;
          // seat.value = userId;
        });
        // 以下为Demo逻辑，非接入必须
        setInterval(() => {
          const statusVal = window.tccc.Agent.getStatus();
          // status.value = statusVal;
        }, 200);
      });
    },
    handleCallout() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      // 调用呼出方法的核心代码
      try {
        window.tccc.Call.startOutboundCall({ phoneNumber: this.phoneNumber });
      } catch (error) {
        console.error(`呼出失败：${error.message}`);
      } finally {
        this.loading = false;
      }
    },
    //签出
    checkOut() {
      // this.$store.commit('ipcc/changeIsLogin', false)
      this.isLogin = false;
      sessionStorage.setItem('isLogin', this.isLogin);
      this.phoneNumber = null;
      this.$store.commit('ipcc/changeCallOutNumber', null);
      this.socket.disconnect();
    },
    //状态切换
    changeState() {
      if (this.statusid == 1) {
        if (this.extension != 'NOEXT') {
          //如果有多个队列，分别加入队列，并示闲
          let uuid = Math.uuid();
          let groups = this.groups.split(',');
          for (let i = 0; i < groups.length; i++) {
            if (i == 0) {
              this.Manager_QueuePause(this.extension, groups[i], uuid, this.agentid, this.statusid, false);
            } else {
              this.Manager_QueuePause(this.extension, groups[i], 'uuid', this.agentid, this.statusid, false);
            }
          }
        }
      } else {
        if (this.extension != 'NOEXT') {
          //如果有多个队列，分别加入队列，并示忙
          let uuid = Math.uuid();
          let groups = this.groups.split(',');
          for (let i = 0; i < groups.length; i++) {
            if (i == 0) {
              this.Manager_QueuePause(this.extension, groups[i], uuid, this.agentid, this.statusid, true);
            } else {
              this.Manager_QueuePause(this.extension, groups[i], 'uuid', this.agentid, this.statusid, true);
            }
          }
        }
      }
    },
    //呼叫
    originatedh() {
      this.callStatus = '呼叫中...';
      // let uuid = Math.uuid();
      // this.Manager_MakeCall(this.extension, this.phoneNumber, 'from-internal', this.extension, uuid);
      this.handleCallout();
    },
    //发起呼叫
    Manager_MakeCall(AgentExtension, DialedNumber, Context, CallerIDName, Sessionid) {
      let msg_obj = {
        actiontype: 'MakeCall',
        agentextension: AgentExtension,
        dialednumber: DialedNumber,
        context: '',
        calleridname: AgentExtension,
        sessionid: Sessionid,
      };
      let message = JSON.stringify(msg_obj);
      //appendMessage('发送发起呼叫请求消息-Sent message: ' + message)
      this.CTI_SendActionMsg(message);
    },
    // 初始化连接
    Manager_Connect(ServerIP, AgentID, Token, AgentExtension, QueuesID, TenantID) {
      this.wsUri = ServerIP + '/ipcc/agent' + '?agentid=' + AgentID + '&ext=' + AgentExtension + '&tenantid=' + TenantID + '&token=' + Token + '&queues=' + QueuesID;

      // console.log('Connecting to ' + this.wsUri)
      this.socket = io.connect(this.wsUri);
      sessionStorage.setItem('wsUri', JSON.stringify([ServerIP, AgentID, Token, AgentExtension, QueuesID, TenantID]));
      let ID = null;
      this.socket.on('connect', () => {
        // console.log('Connected !')
        this.socket.emit('new', { actiontype: 'Login' });
      });

      this.socket.on('loginok', (data, ackServerCallback) => {
        // console.log('Loginok !' + data)

        this.Manager_QueueAdd(AgentExtension, QueuesID, ID, AgentID, 0);

        //CTI_OnEvents(data);
        this.CTI_OnConnected();
        if (ackServerCallback) {
          ackServerCallback('Client Ack: ' + data);
        }
      });

      this.socket.on('message', (data) => {
        // console.log('Received message: ' + data)
        this.CTI_OnEvents(data);
      });

      this.socket.on('reconnecting', () => {
        // console.log('ReConnecting')
      });

      this.socket.on('reconnect', () => {
        // console.log('重新连接到服务器')
      });

      //this.socket.emit('messageevent', jsonObject);
      this.socket.on('disconnect', () => {
        this.Manager_QueueRemove(AgentExtension, QueuesID, ID, AgentID);
        // console.log('DisConnected !')
      });
    },
    // 接收事件消息
    CTI_OnEvents(evt) {
      try {
        // console.log('接收----------------' + evt)
        let jso = JSON.parse(evt); // 将JSON字符串解析为JSO对象
        let type = jso.eventtype;

        switch (type) {
          case 'OnAgentLogin':
            console.log('接收座席登录事件-OnAgentLogin:' + evt);
            break;
          case 'OnAgentLogout':
            console.log('接收座席登出事件-OnAgentLogout:' + evt);
            break;
          case 'OnAgentKick':
            console.log('接收座席踢出事件-OnAgentKick:' + evt);
            // alert(JSON.parse(evt).message)
            this.$message({
              message: JSON.parse(evt).message,
              type: 'warning',
            });
            // this.checkOut()
            this.CTI_AgentKick(jso.message);
            break;
          case 'OnNewState':
            // console.log('接收坐席通话状态事件-OnNewState:' + evt)
            if (jso.extension == this.extension) {
              if (jso.inuse == 2) {
                if (jso.inuse_state == 'RINGING') {
                  this.callStatus = '呼叫中...';

                  // console.log(
                  //   '接收坐席通话状态事件(去电振铃中)-OnNewState:' + evt
                  // )
                  this.showState('icon_status icon_ring', '去电振铃中', 2);
                } else if (jso.inuse_state == 'UP') {
                  this.callTimeFu();
                  // console.log(
                  //   '接收坐席通话状态事件(去电通话中)-OnNewState:' + evt
                  // )
                  this.showState('icon_status icon_conn', '去电通话中', 2);
                } else if (jso.inuse_state == 'HUNGUP') {
                  this.statusid = Cookies.get('agent_statusid');
                  if (this.statusid == '1') {
                    // 空闲
                    clearInterval(this.callTimeSetInterval);
                    this.callStatus = '00:00:00';
                    // console.log(
                    //   '接收坐席通话状态事件(去电通话结束)-OnNewState:' + evt
                    // )
                    this.showState('icon_status icon_online', '空闲', 1);
                  } else {
                    // console.log(
                    //   '接收坐席通话状态事件(去电通话结束)-OnNewState:' + evt
                    // )
                    this.showState('icon_status ' + this.StatusId2Icon[this.statusid], this.StatusId2Content[this.statusid], this.statusid);
                  }
                } else if (jso.inuse_state == 'CHANSPY') {
                }
              } else if (jso.inuse == 1) {
                if (jso.inuse_state == 'RINGING') {
                  let uniqueid = jso.uniqueId;
                  let tabid = uniqueid.split('.')[0];
                  let queueid = jso.queueid === undefined ? '' : jso.queueid;
                  this.linkedNumber = jso.linked_number;
                  // console.log(
                  //   '接收坐席通话状态事件(来电振铃中)-OnNewState:' + evt
                  // )
                  this.IncomingCall = true;
                  let vdn = jso.vdn === undefined ? '' : jso.vdn;
                  let sessionid = jso.sessionid === undefined ? '' : jso.sessionid;
                  this.showState('icon_status icon_ring', '来电振铃中', 2);
                  //来电弹屏页面
                  // if (jso.module5) {
                  //   var newurl =
                  //     this.CALLIN_URL +
                  //     '?phone=' +
                  //     jso.linked_number +
                  //     '&uniqueid=' +
                  //     uniqueid +
                  //     '&entrance=callin' +
                  //     '&tabid=' +
                  //     tabid +
                  //     '&queueid=' +
                  //     queueid +
                  //     '&vdn=' +
                  //     vdn +
                  //     '&sessionid=' +
                  //     sessionid +
                  //     '&t=' +
                  //     new Date().getTime() +
                  //     '&phone_encry=' +
                  //     jso.linked_number_encry

                  //   // this.TabControlAppend(
                  //   //   tabid + '',
                  //   //   '来电:' + jso.linked_number,
                  //   //   newurl
                  //   // )
                  // } else {
                  //   var newurl =
                  //     this.CALLIN_URL +
                  //     '?phone=' +
                  //     jso.linked_number +
                  //     '&uniqueid=' +
                  //     uniqueid +
                  //     '&entrance=callin' +
                  //     '&tabid=' +
                  //     tabid +
                  //     '&queueid=' +
                  //     queueid +
                  //     '&vdn=' +
                  //     vdn +
                  //     '&sessionid=' +
                  //     sessionid +
                  //     '&t=' +
                  //     new Date().getTime()
                  //   // this.TabControlAppend(
                  //   //   tabid + '',
                  //   //   '来电:' + jso.linked_number,
                  //   //   newurl
                  //   // )
                  // }
                } else if (jso.inuse_state == 'UP') {
                  console.log('接收坐席通话状态事件(来电通话中)-OnNewState:' + evt);
                  this.$emit('IncomingCallAddTab', jso.linked_number);
                  this.IncomingCall = false;
                  this.callTimeFu();
                  this.showState('icon_status icon_conn', '来电通话中', 2);
                } else if (jso.inuse_state == 'HUNGUP') {
                  this.statusid = Cookies.get('agent_statusid');
                  if (this.statusid == '1') {
                    // 空闲
                    console.log('接收坐席通话状态事件(来电通话结束)-OnNewState:' + evt);
                    clearInterval(this.callTimeSetInterval);
                    this.callStatus = '00:00:00';
                    this.showState('icon_status icon_online', '空闲', 1);
                  } else {
                    console.log('接收坐席通话状态事件(来电通话结束)-OnNewState:' + evt);
                    this.showState('icon_status ' + this.StatusId2Icon[this.statusid], this.StatusId2Content[this.statusid], this.statusid);
                  }
                }
              }
            }
            break;
          case 'onHoldCall':
            console.log('接收坐席呼叫保持事件-onHoldCall:' + evt);
            this.showState('icon_status icon_hold', '呼叫保持中', 2);
            break;
          case 'onRetreiveCall':
            console.log('接收坐席保持恢复事件-onRetreiveCall:' + evt);
            this.showState('icon_status icon_conn', '通话中', 2);
            break;
          case 'OnPaused':
            console.log('接收设置坐席状态事件-OnPaused:' + evt);
            if (jso.agentid == this.SESSION_NO) {
              this.statusid = jso.statusid;
              if (jso.paused) {
                this.showState('icon_status ' + StatusId2Icon[this.statusid], StatusId2Content[this.statusid], this.statusid);
                Cookies.set('agent_statusid', this.statusid, {
                  expires: 10,
                  path: '/',
                });
              } else {
                this.showState('icon_status icon_online', '空闲', 1);
                Cookies.set('agent_statusid', '1', { expires: 10, path: '/' });
              }
            }
            break;
          case 'OnQueueMbrStatus':
            console.log('接收坐席成员状态事件-OnQueueMbrStatus:' + evt);
            break;
          case 'OnQueueStatus':
            console.log('接收队列状态事件-OnQueueStatus:' + evt);
            $('#remind_1_' + jso.queueid).html(jso.count);
            $('#remind_2_' + jso.queueid).html(jso.handlein);

            var itotal = 0;
            $('.queueRemind1').each(function () {
              var s = $(this).html();
              var n = new Number(s);
              itotal += n;
            });
            $('#remind4').html(itotal == 0 ? '' : itotal);

            break;
        }
      } catch (e) {
        console.log('evt不是json字符串');
      }
    },
    // 发送请求
    CTI_SendActionMsg(message) {
      // console.log(JSON.parse(message))
      this.socket.emit('message', JSON.parse(message), function (arg1, arg2) {
        // console.log('Server Ack: ' + arg1)
      });
      // console.log('Sent message: ' + message)
    },
    // 重复登录下线
    async CTI_AgentKick(message) {
      await this.socket.disconnect();
      console.log('下线---------------------------------');
    },
    // 显示状态
    showState(iconClass, title, status_id) {
      // console.log(
      //   '显示状态============================' + iconClass,
      //   title,
      //   status_id
      // )
    },
    // // 来电去电 弹屏
    // TabControlAppend(
    //   i /* String index */,
    //   t /* String tab */,
    //   h /* String href */,
    //   r /* String reload */
    // ) {
    //   parent.$(parent.document).data('multitabs').create(
    //     {
    //       index: i,
    //       iframe: true, //指定为iframe模式，当值为false的时候，为智能模式，自动判断（内网用ajax，外网用iframe）。缺省为false。
    //       title: t, //标题（可选），没有则显示网址
    //       url: h, //链接（必须），如为外链，强制为info页
    //     },
    //     true
    //   )
    // },
    // 示闲示忙
    Manager_QueuePause(AgentExtension, QueueID, ID, AgentID, StatusID, Pause) {
      var msg_obj = {
        actiontype: 'QueuePause',
        agentextension: AgentExtension,
        queueid: QueueID,
        id: ID,
        agentid: AgentID,
        statusid: StatusID,
        pause: Pause,
      };
      var message = JSON.stringify(msg_obj);
      //appendMessage('发送设置坐席状态请求消息-Sent message: ' + message)
      this.CTI_SendActionMsg(message);
    },
    //加入队列
    Manager_QueueAdd(AgentExtension, QueueID, ID, AgentID, Penalty) {
      var msg_obj = {
        actiontype: 'QueueAdd',
        agentextension: AgentExtension,
        queueid: QueueID,
        id: ID,
        agentid: AgentID,
        penalty: Penalty,
      };
      var message = JSON.stringify(msg_obj);
      console.log('发送队列签入请求消息-Sent message: ' + message);
      this.CTI_SendActionMsg(message);
      this.changeState();
    },
    // 退出队列
    Manager_QueueRemove(AgentExtension, QueueID, ID, AgentID) {
      var msg_obj = {
        actiontype: 'QueueRemove',
        agentextension: AgentExtension,
        queueid: QueueID,
        id: ID,
        agentid: AgentID,
      };
      var message = JSON.stringify(msg_obj);
      console.log('发送队列签出请求消息-Sent message: ' + message);
      this.CTI_SendActionMsg(message);
    },
    //转接事件
    curFastTransfer(phone) {
      if (this.extension != 'NOEXT') {
        this.Manager_FastTransferCurCall(this.extension, phone, 'from-internal');
      } else {
        this.$message({
          message: '坐席离席，无法外呼！',
          type: 'warning',
        });
      }
    },
    //转接
    Manager_FastTransferCurCall(AgentExtension, DialedNumber, Context) {
      let msg_obj = {
        actiontype: 'FastTransferCurCall',
        agentextension: AgentExtension,
        dialednumber: DialedNumber,
        context: '',
      };
      let message = JSON.stringify(msg_obj);
      // appendMessage("发送通话转接请求消息-Sent message: " + message);
      this.CTI_SendActionMsg(message);
    },
    // 建立连接成功
    CTI_OnConnected(evt) {
      // let agentid = this.SESSION_NO
      // let extension = this.SESSION_EXTENSION
      // let queues = this.SESSION_GROUPS
      this.statusid = Cookies.get('agent_statusid');
      let paused;

      if (this.statusid == '1') {
        // 空闲
        paused = false;
      } else {
        // 忙
        paused = true;
      }

      if (this.extension != 'NOEXT') {
        //如果有多个队列，分别加入队列，并示闲
        let groups = this.groups.split(',');
        for (let i = 0; i < groups.length; i++) {
          //签入
          let uuid = Math.uuid();
          if (i > 0) uuid = 'uuid';
          if (this.Queue2Skill[groups[i]]) {
            this.Manager_QueueAdd(this.extension, groups[i], uuid, this.agentid, this.Queue2Skill[groups[i]]);
          } else {
            this.Manager_QueueAdd(this.extension, groups[i], uuid, this.agentid, 0);
          }
          //示闲
          this.Manager_QueuePause(this.extension, groups[i], uuid, this.agentid, this.statusid, paused);
        }
      } else {
      }
    },
    //通话时间计时器
    callTimeFu() {
      let second;
      let minute;
      let hour;
      hour = minute = second = 0;
      this.callTimeSetInterval = setInterval(() => {
        second = second + 1;
        if (second >= 60) {
          second = 0;
          minute = minute + 1;
        }
        if (minute >= 60) {
          minute = 0;
          hour = hour + 1;
        }
        this.callStatus = toDub(hour) + ':' + toDub(minute) + ':' + toDub(second);
      }, 1000);
      function toDub(i) {
        if (i < 10) {
          i = '0' + i;
        } else {
          i = i;
        }
        return i;
      }
    },
    //挂断
    hangUp() {
      if (this.extension != 'NOEXT') {
        let msg_obj = {
          actiontype: 'ClearCurCall',
          agentextension: this.extension,
        };
        let message = JSON.stringify(msg_obj);
        //appendMessage('发送挂断呼叫请求消息-Sent message: ' + message)
        this.CTI_SendActionMsg(message);
      } else {
        layer.msg('坐席离席！');
      }
      this.IncomingCall = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.ipccBox {
  position: fixed;
  top: 0px;
  left: calc(100% - 250px);
  z-index: 99;
  cursor: move;
  user-select: none;
  color: #111111;
  font-size: 14px;
  img {
    -webkit-user-drag: none;
  }
  .max {
  }
  .loginBox {
    width: 230px;
    height: 56px;
    padding: 10px 14px;
    background: #55677a;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 18px;
      height: 18px;
    }
  }
  .phoneBox {
    padding: 10px 10px 14px;
    background: #ffffff;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 12px 0 rgba(21, 24, 28, 0.24);
    .panelBox {
      width: 210px;
      padding: 10px;
      background: #f0f0f0;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 40;
          height: 40px;
          margin-top: 10px;
        }
        p {
          width: 100%;
          margin: 16px 0;
        }
      }
      /deep/ .el-radio {
        margin-left: 5px;
        margin-right: 5px;
        .el-radio__label {
          padding-left: 5px;
        }
      }
    }
    .butBox {
      margin-top: 14px;
      display: flex;
      justify-content: space-around;
    }
  }
  .el-button {
    min-width: 64px;
  }
}
</style>