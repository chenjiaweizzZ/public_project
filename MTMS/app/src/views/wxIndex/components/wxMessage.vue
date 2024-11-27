<template>
  <div class="wxMessage">
    <div style="height:calc(100% - 50px);overflow-y:scroll" v-load-more="getMoreAnnounce">
      <!-- <div class="header">
        <div>消息</div>
      </div> -->
      <div class="zhuti">
        <div
          v-for="(value,index) in announcelist"
          class="ggneirong"
          @click="ggnrtz(value)"
          :key="index"
        >
          <div class="shangbu">
            <b class="redTab" v-show="value.status!=1"></b>
            <img src="../../../assets/images/icon_msg.png" class="fbtx" />
            <div class="shangbu" style="flex-direction: column">
              <div class="fbbt">{{value.title | limitlength1}}</div>
              <div
                class="fbz"
                v-if="value.systemtype ==2 || value.systemtype ==3 "
                v-html="strinnerhtml(value.brief)"
              >{{value.brief}}</div>
              <div class="fbz" v-else>{{value.author | limitlength}}</div>
              <div class="fbsj">{{value.departtime | chmonthandday}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "wxMessage",
  data() {
    return {
      headerTitle: "消息",
      todonum: 0,
      msgnum: 0,
      titlenum: 0,
      showback: false,
      isactive: [false, true, false, false],
      announcelist: [],
      page: 0,
      preventRepeatRequest: false
    };
  },
  created() {
    this.getMessageList();
  },
  filters: {
        chmonthandday: function (str) {
            var result = "";
            var arr1 = str.slice(0, 11).split("-");
            var str2 = str.slice(11, 16);
            var month = arr1[1];
            var day = arr1[2];
            result = month + "月" + day + "日" + " " + str2;
            return result;
        },
        limitlength: function (str) {
            var shortstr = "";
            if (str.length >= 10) {
                shortstr = str.slice(0, 9) + "...";
                return shortstr;
            } else {
                return str;
            }
        },
        limitlength1: function (str) {
            var shortstr = "";
            if (str.length >= 20) {
                shortstr = str.slice(0, 19) + "...";
                return shortstr;
            } else {
                return str;
            }
        },
    },
  methods: {
    ...methods,
    strinnerhtml: function(str) {
      var inhtml = "";
      var onstr = str.split("<br/>");
      for (let i = 0; i < onstr.length; i++) {
        inhtml += "<div>" + onstr[i] + "</div>";
      }
      return inhtml;
    },
    getMoreAnnounce: function() {
      let self = this;
      if (this.preventRepeatRequest) {
        return;
      }
      this.preventRepeatRequest = true;
      this.page = this.page + 1;
      var data = {
        command: "announce/queryannouncelist",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        page: this.page,
        reqnum: 20,
        uid: $.cookie("uid")
      };
      self.post("/announce/queryannouncelist", data).done(function(res) {
        self.loadMoreSuccess(res);
      });
    },
    loadMoreSuccess: function(res) {
      let self = this;
      if (res.announcelist.length > 0) {
        self.preventRepeatRequest = false;
        self.announcelist = self.announcelist.concat(res.announcelist);
      } else {
        self.preventRepeatRequest = true;
      }
      // this.preventRepeatRequest = false;
      // this.announcelist = this.announcelist.concat(res.announcelist);
    },
    getMessageList() {
      let self = this;
      if (self.preventRepeatRequest) {
        return;
      }
      self.preventRepeatRequest = true;
      self.page = this.page + 1;
      self
        .post("/announce/queryannouncelist", {
          command: "announce/queryannouncelist",
          sessionid: $.cookie("sid"),
          loginid: $.cookie("uid"),
          page: self.page,
          reqnum: 20,
          uid: $.cookie("uid")
        })
        .done(function(res) {
          if (res.announcelist.length > 0) {
            self.preventRepeatRequest = false;
            self.announcelist = self.announcelist.concat(res.announcelist);
            self.$emit("getUnread", res.unreadcount);
          } else {
            self.preventRepeatRequest = true;
          }
        });
    },
    ggnrtz: function(value) {
      // window.location.href =
      //   "msxxq.html?param=" + encodeURIComponent(JSON.stringify(value));
      // console.log(value);
      this.$router.push({
        name: "msxxq",
        query: {
          url_label: value.url_label,
          url_type: value.url_type,
          id: value.id
        }
      });
    },
    getStyle: function(element, attr, NumberMode) {
      var target;
      // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
      if (attr === "scrollTop") {
        target = element.scrollTop;
      } else if (element.currentStyle) {
        target = element.currentStyle[attr];
      } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
      }
      //在获取 opactiy 时需要获取小数 parseFloat
      return NumberMode == "float" ? parseFloat(target) : parseInt(target);
    }
  },
  directives: {
    "load-more": {
      bind: function(el, binding) {
        var windowHeight = window.screen.height;
        var height;
        var setTop;
        var paddingBottom;
        var marginBottom;
        var requestFram;
        var oldScrollTop;
        var scrollEl;
        var heightEl;
        var scrollType = el.attributes.type && el.attributes.type.value;
        var scrollReduce = 2;
        function getStyle(element, attr, NumberMode) {
          var target;
          // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
          if (attr === "scrollTop") {
            target = element.scrollTop;
          } else if (element.currentStyle) {
            target = element.currentStyle[attr];
          } else {
            target = document.defaultView.getComputedStyle(element, null)[attr];
          }
          //在获取 opactiy 时需要获取小数 parseFloat
          return NumberMode == "float" ? parseFloat(target) : parseInt(target);
        }

        scrollEl = el;
        if (el.children[0]) {
          heightEl = el.children[0];
        } else {
          heightEl = el;
        }

        el.addEventListener(
          "touchstart",
          function() {
            height = heightEl.clientHeight;
            setTop = el.offsetTop;
            paddingBottom = getStyle(el, "paddingBottom");
            marginBottom = getStyle(el, "marginBottom");
          },
          false
        );

        el.addEventListener(
          "touchmove",
          function() {
            loadMore();
          },
          false
        );

        el.addEventListener(
          "touchend",
          function() {
            oldScrollTop = scrollEl.scrollTop;
            moveEnd();
          },
          false
        );

        var moveEnd = function() {
          requestFram = requestAnimationFrame(function() {
            if (scrollEl.scrollTop != oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop;
              moveEnd();
            } else {
              cancelAnimationFrame(requestFram);
              height = heightEl.clientHeight;

              loadMore();
            }
          });
        };

        var loadMore = function() {
          if (
            scrollEl.scrollTop + windowHeight + 50 >=
            height + setTop + paddingBottom + marginBottom - scrollReduce
          ) {
            binding.value();
          }
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wxMessage {
  .header {
    box-sizing: border-box;
    text-align: center;
    font-size: 20px;
    color: #fff;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 50px;
    position: relative;
    background: #3499db;
    -ms-flex-flow: row;
    flex-flow: row;
    display: flex;
    -ms-flex-align: center;
    -moz-align-items: center;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }
  .container {
    padding: 0;
    background-color: #f2f2f2;
  }

  .ggqf {
    height: 42px;
    width: 100%;
    background: #ffffff;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #e8e8e8;
  }

  .weidu {
    float: left;
    width: 50%;
    text-align: center;
    margin-top: 11px;
    border-width: 0 1px 0 0;
    border-style: solid;
    border-color: #e8e8e8;
  }

  .yidu {
    float: right;
    width: 50%;
    text-align: center;
    margin-top: 11px;
  }

  .ggneirong {
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #e8e8e8;
    background-color: #ffffff;
    overflow: hidden;
    padding: 10px;
  }

  .fbtx {
    width: 25px;
    height: 25px;
  }

  .fbz {
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    color: #999;
  }

  .fbsj {
    font-size: 12px;
    color: #999;
    flex-grow: 1;

    margin-left: 10px;
  }

  .fbbt {
    float: left;
    margin-left: 10px;
    margin-right: 10px;
    color: #333;
    font-size: 16px;
  }

  .shangbu {
    overflow: hidden;
    position: relative;
    display: flex;
  }

  .zhuti {
    /* padding-top: 50px; */
    padding-bottom: 50px;
  }

  #header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  .redTab {
    position: absolute;
    top: 0;
    left: 25px;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
  }
}
</style>