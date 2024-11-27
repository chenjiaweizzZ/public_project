<template>
  <div class="g-main">
    <ul class="examlist">
      <li
        class="item"
        :class="{ end: item.status == -1 ,  active: item.status == 10 }"
        v-for="(item,index) in data"
      >
        <i class="icon"></i>
        <p>
          <label>出科科室：</label>
          {{item.deptname}}
        </p>
        <p>
          <label>出科日期：</label>
          {{item.ckdate}}
        </p>
        <p>
          <label>报名时间：</label>
          {{item.createtimestr}}
        </p>
        <p v-if="item.status == -1" class="btn-detail" @click="showreason(index)">
          <span>查看原因</span>
        </p>
        <p class="cancel-p" @click.stop="cancelSign(item.id)">取消报名</p>
      </li>
    </ul>
    <i class="shade" v-show="reason" @click="reason = false"></i>
    <div class="content" v-show="reason">
      <div class="reason">
        <header>
          拒绝原因
          <i @click="reason = false"></i>
        </header>
        <section>{{content}}</section>
      </div>
    </div>
    <no-content v-if="data.length == 0" :txtdescription="txtdescription"></no-content>
  </div>
</template>
<script>
import methods from "../../../methods";
import noContent from "../../no_content.vue";
import { mapState, mapActions } from "vuex";
export default {
  props: ["active"],
  data() {
    return {
      txtdescription: "暂无已审核的报名记录~",
      data: "",
      reason: false,
      content: ""
    };
  },
  components: { noContent },
  computed: {
    ...mapState(["turninfo"])
  },
  watch: {
    active: function(val, oldVal) {
      if (val) {
        this.init();
      }
    }
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    ...methods,
    ...mapActions(["showConfirm", "toast"]),
    //取消报名
    cancelSign(examid) {
      let self = this;
      this.showConfirm({
        title: "提醒",
        msg: "你确定要取消此次补考？",
        theme: "modal-confirm modal-white",
        ok: function() {
          self
            .post("/turnexam/cancelexamination", {
              command: "turnexam/cancelexamination",
              sessionid: $.cookie("sid"),
              loginid: $.cookie("uid"),
              id: examid
            })
            .done(function(data) {
              if (data && data.errcode == 0 && data.flag == 0) {
                self.toast("报名取消成功");
                self.init();
              } else {
                self.toast(data.message);
              }
            });
        },
        cancel: function() {}
      });
    },
    init() {
      let self = this;
      this.post("/turnexam/queryturnexaminationlist", {
        command: "turnexam/queryturnexaminationlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        stuid: $.cookie("uid"),
        businessid: this.turninfo.businessid,
        statuslist: ["-1", "10"],
        type: 0,
        page: "",
        reqnum: "",
        ordertype: 1
      }).done(data => {
        if (data && data.errcode == 0) {
          self.data = data.beanlist;
        }
      });
    },
    showreason(param) {
      let self = this;
      self.reason = true;
      self.content = self.data[param].approvemsg;
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
li {
  background: #fff;
  color: #888;
  padding: 0.1rem 0.2rem;
  margin-top: 0.15rem;
  position: relative;
}
li.end:after {
  content: "";
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background: url("../../../assets/images/label_butonggou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 0;
}
li.active :after {
  content: "";
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  background: url("../../../assets/images/label_tonggou.png") 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 0;
}
.btn-detail {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #3499db;
  span {
    border: 1px solid #aaa;
    border-radius: 5px;
    padding: 0.05rem;
  }
}
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  text-align: center;
  header {
    font-size: 0.3rem;
    color: #000;
    margin-top: 0.3rem;
    position: relative;
    i {
      display: inline-block;
      position: absolute;
      width: 0.4rem;
      height: 0.4rem;
      background: url("../../../assets/images/关闭-灰.png") 0 0 no-repeat;
      background-size: 100% 100%;
      right: 0.2rem;
      top: 0;
    }
  }
  section {
    padding: 0.2rem;
  }
}
.reason {
  z-index: 100;
  background: #fff;
  width: 80vw;
  height: 25vh;
  border-radius: 10px;
  color: #999;
}
.cancel-p {
  text-align: right;
  color: #3499db;
  font-size: 13px;
}
</style>
