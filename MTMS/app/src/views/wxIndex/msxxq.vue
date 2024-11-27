<template>
  <div class="msxxq">
    <div id="container" class="container" v-cloak>
      <div class="header">
        <div class="headerLeft" @click="back">
          <img src="../../assets/images/icon_fanhui.png" class="pageLeft" />
        </div>
        <div>消息详情</div>
        <div class="headerRight"></div>
      </div>
      <div class="zhuti">
        <h4 class="title">{{title}}</h4>
        <p class="zhongbu">
          <span class="autor">{{autor}}</span>
          <span class="time">{{time}}</span>
        </p>
        <!--<p class="neirong">{{content}}</p>-->
        <p class="neirong" v-html="content"></p>
        <p class="url" @click="tourl()" v-show="url">
          <span v-if="urllabel">{{ urllabel }}</span>
          <span v-else>查看详情</span>
        </p>
        <p class="neirong underline" v-if="attachmentlist && attachmentlist.length > 0">
          <a style="color:#00A0E9">点击下载：</a>
          <span
            class="download-item"
            v-for="it in attachmentlist"
            @click="downloadfile(it)"
          >{{ it.file_name }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import cHeader from "@/views/header";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "msxxq",
  data() {
    return {
      headerTitle: "消息详情",
      title: "",
      autor: "",
      time: "",
      content: "",
      url: "",
      type: "",
      urlparam: "",
      urllabel: "",
      urltype: "",
      filename: "",
      fileurl: "",
      attachmentlist: []
    };
  },
  created() {
    let self = this;
    self.urllabel = self.$route.query.url_label;
    console.log(self.urllabel, "urllabel");
    self.urltype = self.urlparam.url_type;
    console.log(self.urltype, "urltype");
    self.show_gg();
  },
  methods: {
    ...methods,
    back() {
      this.$router.push({
        name: "wxIndex",
        query: {
          view: "message"
        }
      });
    },
    show_gg: function() {
      var self = this;
      var data = {
        command: "announce/queryannouncedetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        announcementid: self.$route.query.id,
        uid: $.cookie("uid")
      };
      self.post("/announce/queryannouncedetail", data).done(function(res) {
        self.title = res.announcelist[0].title;
        self.autor = res.announcelist[0].author;
        self.time = res.announcelist[0].departtime;
        self.content = res.announcelist[0].content;
        self.url = res.announcelist[0].url;
        self.fileurl = res.attachmentlist[0] ? res.attachmentlist[0].url : "";
        self.filename = res.attachmentlist[0]
          ? res.attachmentlist[0].file_name
          : "";
        self.attachmentlist = res.attachmentlist;
        // var reg=/(http:\/\/|https?:\/\/|ftps?:\/\/)?((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:[0-9]+)?|(localhost)(:[0-9]+)?|([\w]+\.)(\S+)(\w{2,4})(:[0-9]+)?)(\/?([\w#!:.?+=&%@!\-\/]+))?/ig;
        //							self.content=self.content.replace(reg, "<a href='$1$2'>$1$2</a>");
        var areg = /<a[^>]+?href=["']?([^"']+)["']?[^>]*>([^<]+)<\/a>/gi;
        self.content = self.content.replace(
          areg,
          "<a href='./msxxq_newurl.html?$1'>$2</a>"
        );
      });
    },
    tourl: function() {
      if (this.urltype == 1) {
        //1表示目标页有返回按钮
        window.location.href = this.url;
      } else {
        $.cookie("link", this.url);
        // window.location.href = "xqurl2.html";
        this.$router.push({
          name: "xqurl2"
        });
      }
    },
    downloadfile: function(item) {
      // var self = this;
      console.log(item);
      if (item.url) {
        this.invokeNative("OpenDocument", {
          url: item.url,
          filename: item.file_name
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.msxxq {
  .header {
    box-sizing: border-box;
    text-align: center;
    font-size: 20px;
    color: #fff;
    padding-left: 20px;
    padding-right: 20px;
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
    display: flex;
    justify-content: space-between;
  }
  .headerLeft {
    width: 10px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .pageLeft {
    height: 18px;
    width: 10px;
  }
  .headerRight {
    width: 10px;
  }
  .tp {
    position: relative;
    top: -1px;
    height: 18px;
  }

  .container {
    padding-left: 0px;
    padding-right: 0px;
  }

  .title {
    padding-left: 15px;
  }

  .autor {
    float: left;
    margin-left: 15px;
    color: #ccc;
  }

  .zhongbu {
    overflow: hidden;
  }

  .time {
    float: left;
    margin-left: 10px;
    color: #ccc;
  }

  .neirong {
    width: 90%;
    margin-left: 15px;
  }

  .url {
    width: 90%;
    margin-left: 15px;
    color: #00a0ea;
  }

  .url > span {
    border-bottom: 1px solid #00a0ea;
  }

  #header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .zhuti {
    margin-top: 60px;
  }

  .download-item {
    text-decoration: underline;
    display: block;
  }
}
</style>

