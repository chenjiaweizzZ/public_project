// pages/income/TeamIncomeLastMonth/TeamIncomeLastMonth.js
import { TUIChatService } from "@tencentcloud/chat-uikit-engine";
import {
  listLeaderGroupIncome,
  listGroupMemberIncome,
  saveIncomeDistribution
} from "../../../../utils/api.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    page: {
      type: Number,
      value: "",
      observer(newVal) {
        this.getGroupIncome(newVal)
      }
    },
    editLimit: {
      type: Boolean,
      value: true,
      observer(newValue) {
        this.setData({
          editLimit: newValue
        })
      }
    },
    timeLimit: {
      type: Boolean,
      value: true,
      observer(newValue) {
        this.setData({
          timeLimit: newValue
        })
      }
    }
  },

  lifetimes: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeName: '1',
    teamIncomeInfo: [],
    maxDate: "",
    feeSum: 0,
    year: "",
    month: "",
    date: "",
    member: [],
    it3m: {},
    dateShow: false,
    show: false,
    show2: false,
    editType: 1,
    expandIdx: null,
    extraMoney: 0,
    editLimit: true,
    timeLimit: true,
    actions: [{
        name: '按金额分配',
        idx: 1
      },
      {
        name: '按百分比分配',
        idx: 2
      },
    ],
    timer: null,
    beforeClose(action) {
      return new Promise(resolve => {
        if (action === 'confirm') {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      this.setData({
        activeName: event.detail,
      });
    },
    selecTime() {
      if(this.data.timeLimit) {
        return
      }else {
        this.setData({
          dateShow: true
        })
      }
    },
    dateOnConfirm(event) {
      this.timestampToDate(event.detail)
      this.setData({
        dateShow: false
      })
    },
    timestampToDate(timestamp) {
      if (typeof timestamp !== 'number' || isNaN(timestamp)) {  
        console.error('Invalid timestamp');  
        return;  
      }  
      const date = new Date(timestamp);  
      if (isNaN(date.getTime())) {  
        console.error('Failed to create date from timestamp');  
        return;  
      }  
      const year = date.getFullYear();  
      const month = date.getMonth() + 1;  
      // this.setData({  
      //   year: year,  
      //   month: String(month)
      // });  
      listLeaderGroupIncome({
        year: year,
        month: month,
      }).then(res => {
        let {
          retData
        } = res
        let teamIncomeInfo = []
        if (retData.length > 0) {
          teamIncomeInfo = retData.map(i => ({
            ...i,
            team: 0
          }))
        }
        this.setData({
          year: year,
          month: month,
          date: new Date(year, month - 1).getTime(),
          teamIncomeInfo: teamIncomeInfo || [],
          feeSum: retData.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) ? retData.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) : 0
        })
        this.onOpen({
          detail: this.data.expandIdx
        })
      })
    },
    dateOnCancel() {
      this.setData({
        dateShow: false,
      })
    },
    onOpen(event) {
      console.log(event)
      let {
        detail
      } = event
      let item = this.data.teamIncomeInfo[detail]
      if (item.team == 0) {
        listGroupMemberIncome({
          pageNo: 1,
          pageSize: 999,
          hospitalId: item.hospitalId,
          groupId: item.serialNo,
          year: this.data.year,
          month: this.data.month
        }).then(res => {
          let arr = this.data.teamIncomeInfo
          arr[detail].team = res.retData.list
          this.setData({
            teamIncomeInfo: arr,
            expandIdx: detail
          })
        })
      }
    },
    getGroupIncome(page) {
      let currentDate,currentYear,currentMonth,previousMonth,previousYear
      if(page == 1) {
        currentDate = new Date();
        currentYear = currentDate.getFullYear();
        currentMonth = currentDate.getMonth() + 1;
        previousMonth = (currentMonth - 1 + 12) % 12;
        previousYear = currentYear - Math.floor((currentMonth - 1 - previousMonth) / 12);
      }else if(page == 2) {
        currentDate = new Date();
        previousYear = currentDate.getFullYear();
        previousMonth = currentDate.getMonth() + 1;
      }
      listLeaderGroupIncome({
        year: previousYear,
        month: previousMonth,
      }).then(res => {
        let {
          retData
        } = res
        let teamIncomeInfo = []
        if (retData.length > 0) {
          teamIncomeInfo = retData.map(i => ({
            ...i,
            team: 0
          }))
        }
        this.setData({
          date: new Date(previousYear, previousMonth).getTime(),
          maxDate: new Date(previousYear, previousMonth - 1).getTime(),
          teamIncomeInfo: teamIncomeInfo || [],
          year: previousYear,
          month: previousMonth,
          feeSum: retData.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) ? retData.reduce((total, obj) => total + (obj.effectiveOrderFee || 0), 0) : 0
        })
      })
    },
    editIncome(e) {
      let item = e?.currentTarget?.dataset?.item
      item.team.forEach(i => {
        i.amount = i.amount/ 100
      })
      console.log(item.team)
      let member = this.calcPercent(item.team, item.effectiveOrderFee)
      let extraMoney = this.calcExtraMoney(item.team, item.effectiveOrderFee / 100)
      console.log(member)
      this.setData({
        member: member,
        it3m: item,
        show: true,
        extraMoney: extraMoney,
      })
    },

    calcExtraMoney(list, fee) {
      let newFee = fee
      list.forEach(i => {
        newFee -= i.amount
      })
      return newFee.toFixed(2)
    },

    calcAmount(list,fee) {
      list.forEach(i => {
        i.amount = fee * i.percent / 10000
      })
      return list
    },

    calcPercent(list, fee) {
      list.forEach(i => {
        i.percent = fee == 0 ? 0 : Math.round((i.amount / fee) * 10000)
      })
      return list
    },

    onClose() {
      this.setData({
        show: false
      });
    },

    onSelect(event) {
      console.log(event.detail);
      this.setData({
        editType: event.detail.idx,
        show2: true
      })
    },
    amountChange2(event) {
      console.log(event,this.data.member)
      clearTimeout(this.data.timer)
      this.timer = setTimeout(() => {
        let {
          index
        } = event.currentTarget.dataset
        let number = event.detail
        let member = this.data.member
        member[index].amount = number
        let newMember = this.calcPercent(member, this.data.it3m.effectiveOrderFee)
        let extraMoney = this.calcExtraMoney(member, this.data.it3m.effectiveOrderFee / 100)
        this.setData({
          member: newMember,
          extraMoney: extraMoney
        })
      }, 300)
    },
    amountChange(event) {
      let {index} = event.currentTarget.dataset
      let {value} = event.detail
      let member = this.data.member
      member[index].amount = 0
      value = this.setSpentValue(value,member,this.data.it3m.effectiveOrderFee / 100)
      member[index].amount = value
      let newMember = this.calcPercent(member, this.data.it3m.effectiveOrderFee)
      let extraMoney = this.calcExtraMoney(member, this.data.it3m.effectiveOrderFee / 100)
      this.setData({
        member: newMember,
        extraMoney: extraMoney
      })
    },
    setSpentValue(value,member,fee) {
      member.forEach(i => {
        fee -= i.amount
      })
      if(fee >= value) {
        return value
      }else {
        return fee
      }
    },
    setSpentValue2(value,member,fee) {
      if(fee == 0) {
        return 0
      }
      let hundred = 100
      member.forEach(i => {
        hundred -= i.percent
      })
      if(hundred >= value) {
        return value
      }else {
        return hundred
      }
    },
    percentChange2(event) {
      let {
        index
      } = event.currentTarget.dataset
      let number = event.detail
      let member = this.data.member
      member[index].percent = number
      let newMember = this.calcAmount(member, this.data.it3m.effectiveOrderFee)
      let extraMoney = this.calcExtraMoney(newMember, this.data.it3m.effectiveOrderFee / 100)
      this.setData({
        member: newMember,
        extraMoney: extraMoney
      })
    },
    percentChange(event) {
      let {index} = event.currentTarget.dataset
      let {value} = event.detail
      let member = this.data.member
      member[index].percent = 0
      value = this.setSpentValue2(value,member,this.data.it3m.effectiveOrderFee / 100)
      member[index].percent = value
      let newMember = this.calcAmount(member, this.data.it3m.effectiveOrderFee)
      let extraMoney = this.calcExtraMoney(newMember, this.data.it3m.effectiveOrderFee / 100)
      this.setData({
        member: newMember,
        extraMoney: extraMoney
      })
    },
    // confirm() {
    //   this.cancel()
    // },
    confirm() {
      if(this.data.extraMoney > 0) {
        wx.showToast({
          title: '金额未全部分配!',
          icon: 'error'
        })
        return
      }
      console.log(this.data.it3m)
      console.log(this.data.member)
      let groupId = this.data.it3m.serialNo
      let userIncomeList = []
      this.data.member.forEach(i => {
        userIncomeList.push({
          amount: i.amount * 100,
          userId: i.userId
        })
      })
      saveIncomeDistribution({
        groupId,userIncomeList
      }).then(res => {
        let item = this.data.teamIncomeInfo[this.data.expandIdx]
        listGroupMemberIncome({
          pageNo: 1,
          pageSize: 999,
          hospitalId: item.hospitalId,
          groupId: item.serialNo,
          year: this.data.year,
          month: this.data.month
        }).then(res => {
          let arr = this.data.teamIncomeInfo
          arr[this.data.expandIdx].team = res.retData.list
          this.setData({
            teamIncomeInfo: arr,
            show2: false,
          })
          this.cancel()
        })
      })
    },
    cancel() {
      setTimeout(() => {
        this.setData({
          show2: false
        });
      },100)
    }
  }
})