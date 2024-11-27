<template>
  <div class="g-main">
    <ul class="examlist">
      <li class="item" v-for="(item,index) in data">
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
        <p class="cancel-p" @click.stop="cancelSign(item.id)">取消报名</p>
      </li>
    </ul>
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
      txtdescription: "暂无审核中的报名记录~",
      data: []
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
    init() {
      let self = this;
      this.post("/turnexam/queryturnexaminationlist", {
        command: "turnexam/queryturnexaminationlist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        stuid: $.cookie("uid"),
        businessid: this.turninfo.businessid,
        statuslist: ["5"],
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
    }
  }
};
</script>
<style lang="scss" scoped>
li {
  background: #fff;
  color: #888;
  padding: 0.1rem 0.2rem;
  margin-top: 0.15rem;
}
.cancel-p {
  text-align: right;
  color: #3499db;
  font-size: 13px;
}
</style>
