import PersonDetail from "../components/PatientHeader.vue";
import * as echarts from "echarts";
import { selectDataList } from "@/service/patientView";
import upPicture from "@svg/up.png";
import downPicture from "@svg/down.png";
import addPicture from "@svg/add.png";
const dateNumDifference = (date1, date2) => {
  return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
};

const getTodayStr = () => {
  let now = new Date();
  let mounth = now.getMonth() + 1;
  mounth < 10 ? (mounth = "0" + mounth) : null;
  let day = now.getDate();
  day < 10 ? (day = "0" + day) : null;
  let todayStr = `${now.getFullYear()}-${mounth}-${day} 00:00:00`;
  return todayStr;
};
const getTimeByDifference = (dayNum) => {
  let timestamp = new Date(getTodayStr()).getTime() - dayNum * 1000 * 60 * 60 * 24;
  return new Date(timestamp);
};
const get_yyyy_MM_dd = (date) => {
  let mounth = date.getMonth() + 1;
  mounth < 10 ? (mounth = "0" + mounth) : null;
  let day = date.getDate();
  day < 10 ? (day = "0" + day) : null;
  return `${date.getFullYear()}-${mounth}-${day}`;
};
function groupByType(arr, param) {
  var map = {},
    dest = [];
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i];
    if (ai[param] && !map[ai[param]]) {
      dest.push({
        name: ai[param],
        data: [ai],
      });
      map[ai[param]] = ai;
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j];
        if (dj.name == ai[param]) {
          dj.data.push(ai);
          break;
        }
      }
    }
  }
  return dest;
}
// import './timelineMode.scss'
export default {
  name: "TimelineMode",
  data() {
    return {
      jiazaiSwiper: 0,// 用于做key值绑定
      flags: false,
      hasMainData: false, // 是否有main的数据
      swiperList: [],
      acriveCircleIndex: 0,
      swiperIndex: 0,
      swiperItemActiveId: 0,
      dragData: {
        x: 0,
        y: 0,
      },
      // 门诊数据
      menZhengData: {},
      bingliData: {},
      dialog: {
        show: false,
        type: "", // 弹窗类型
        title: "title",
        index: 0,
        index2: 0,
      },
      searchData: {
        type: 1,
        timeRange: [],
        pickerTime: 12, //type:Number
      },
      ryjlData: {}, // 入院记录data
      cyxjData: {},
      isInHospital: false, // 显示门诊还是住院
      inhospitalData: [], // 住院data
      allTableData: [], // 所有的tabledata
      allChartData: [],
      tableData: {
        maxIndex: 0,
        index: 0, // 当前第几页
        total: 0, //总的数量
      }, // 控制tabel的类似分页
      yyjlLabelData: [
        { label: "药品名称", prop: "ypmc" },
        { label: "药品类型", prop: "yplx" },
        { label: "用法", prop: "yyff" },
        { label: "剂数", prop: "js" },
        { label: "规格", prop: "gg" },
        { label: "每次剂量", prop: "mcjl" },
        { label: "频率", prop: "yypc" },
        { label: "天数", prop: "ts" },
      ],
      yyjlData: [],
      zlLabelData: [
        { label: "操作名称", prop: "czmc" },
        { label: "部位", prop: "czmbbwmc" },
        { label: "介入物", prop: "jrwmc" },
        { label: "操作时间", prop: "czrqsj" },
      ],
      zdLabelData: [
        { label: "诊断名称", prop: "zdmc" },
        { label: "主诊断", prop: "sfzzd" },
        { label: "诊断时间", prop: "zdsj" },
      ],
      zhuyuanZdLabelData: [
        { label: "诊断名称", prop: "zdmc" },
        { label: "主诊断", prop: "sfzzd" },
        // 诊断类型
        { label: "诊断类型", prop: "zdlx" },
        { label: "诊断时间", prop: "zdsj" },
      ],
      zhuyuanZdTableData: [],
      jybgLabelData: [
        { label: "项目名称", prop: "xmmc" },
        { label: "检验结果", prop: "jyjg" },
        {
          label: "标记",
          prop: "bj",
          render(h, scope) {
            if (scope.row.bj == "H") {
              return <div class="pic-style"><img src={upPicture}></img></div>;
              // return <img src="@svg/up.svg"></img>
            } else if (scope.row.bj == "L") {
              return <div class="pic-style"><img src={downPicture}></img></div>;
            } else if (scope.row.bj == "0") {
              // 阴性
              return "";
            } else if (scope.row.bj == "1") {
              return <div class="pic-style"><img src={addPicture}></img></div>;
            } else {
              return "";
            }
          },
        },
        { label: "单位", prop: "dw" },
        { label: "参考值", prop: "ckz" },
      ],
      yztableColumns: [
        {
          label: "长/临",
          prop: "clbs",
          render(h, scope) {
            console.log(scope);
            if (scope.row.clbs == "0") {
              return <span>临时</span>;
            } else if (scope.row.clbs == "1") {
              return <span>长期</span>;
            }
          },
        },
        {
          label: "项目内容",
          prop: "ypmc",
        },
        {
          label: "类型",
          prop: "yplx",
        },
        {
          label: "开始时间",
          prop: "kssj",
        },
        {
          label: "停止时间",
          prop: "tzsj",
        },
        {
          label: "用法",
          prop: "yyff",
          width: "90px",
        },
        {
          label: "频率",
          prop: "yypc",
          width: "90px",
        },
        {
          label: "每次剂量",
          prop: "mcjl",
          width: "90px",
        },
        {
          label: "剂数",
          prop: "js",
          width: "90px",
        },
      ],
      getTableKey: 0, // 用于做key
      yzlx: "2",
      yzTableData: [],
      yzAlltableData: [],
      zyh: "", // 用于请求接口
      sxjlData: {}, //输血记录弹窗
      zyssjlData: {},
      paperData: {},
      operationData: []
    };
  },
  components: {
    PersonDetail,
    medicationOrder: () => import("../commonMode/components/hospitalizationComponent/medicationOrder"),
    TransfusionRecord: () => {
      return import("../components/TransfusionRecord.vue");
    },
    // Navigation: () => { return import('../components/navigation.vue') },
    DischargeAbstract: () => import("../components/DischargeAbstract.vue"),
    InhospitalAbstract: () => import("../components/InhospitalAbstract.vue"),
    CaseHistoryTable: () => import("../components/CaseHistoryTable.vue"),
    PatientMedicalRecords: () => import("../components/PatientMedicalRecords.vue"),
    InspectionReport: () => import("../components/InspectionReport.vue"),
    OperationRecord: () => import("../components/OperationRecord.vue"),
    DocumQJJL: () => import("../components/paperwork/DocumQJJL.vue"),
    DocumHZJL: () => import("../components/paperwork/DocumHZJL.vue"),
    DocumSQXJ: () => import("../components/paperwork/DocumSQXJ.vue"),
    DocumSQTL: () => import("../components/paperwork/DocumSQTL.vue"),
    DocumSWBLTLJL: () => import("../components/paperwork/DocumSWBLTLJL.vue"),
    DocumSWJL: () => import("../components/paperwork/DocumSWJL.vue"),
    DocumCYJL: () => import("../components/paperwork/DocumCYJL.vue"),
    DocumZZJL: () => import("../components/paperwork/DocumZZJL.vue"),
    DocumPGCSSJL: () => import("../components/paperwork/DocumPGCSSJL.vue"),
    DocumCYJL: () => import("../components/paperwork/DocumCYJL.vue"),
    DocumMZJL: () => import("../components/paperwork/DocumMZJL.vue"),
    DocumDCJL: () => import("../components/paperwork/DocumDCJL.vue"),
    DocumRCYJL: () => import("../components/paperwork/DocumRCYJL.vue"),
    DocumRYSWJL: () => import("../components/paperwork/DocumRYSWJL.vue"),
    DocumSJYSCFJL: () => import("../components/paperwork/DocumSJYSCFJL.vue"),
    DocumYNBLTLJL: () => import("../components/paperwork/DocumYNBLTLJL.vue"),
    DocumJJBJL: () => import("../components/paperwork/DocumJJBJL.vue"),
    DocumZKJL: () => import("../components/paperwork/DocumZKJL.vue"),
    DocumJDXJ: () => import("../components/paperwork/DocumJDXJ.vue"),
    DocumMZSHFGJL: () => import("../components/paperwork/Docum_MZSHFGJL.vue"),
    DocumMZSQFGJL: () => import("../components/paperwork/Docum_MZSQFGJL.vue"),
    DocumRCBCJL: () => import("../components/paperwork/Docum_RCBCJL.vue"),
    DocumSHSCBC: () => import("../components/paperwork/Docum_SHSCBC.vue"),
    DocumSCBC: () => import("../components/paperwork/DocumSCBC.vue"),
    DocumYDFMJL: () => import("../components/paperwork/DocumYDFMJL.vue"),

    DocumDCJL: () => import("../components/paperwork/DocumDCJL.vue"),
    DocumRCYJL: () => import("../components/paperwork/DocumRCYJL.vue"),
    DocumRYSWJL: () => import("../components/paperwork/DocumRYSWJL.vue"),
    DocumSJYSCFJL: () => import("../components/paperwork/DocumSJYSCFJL.vue"),
    DocumYNBLTLJL: () => import("../components/paperwork/DocumYNBLTLJL.vue"),
    DocumJJBJL: () => import("../components/paperwork/DocumJJBJL.vue"),
    DocumZKJL: () => import("../components/paperwork/DocumZKJL.vue"),
    DocumJDXJ: () => import("../components/paperwork/DocumJDXJ.vue"),
  },
  methods: {
    getYzTable() { },
    goTo360view() {
      // localStorage.setItem()
      this.$router.push({
        name: "panoramicVIew",
        query: { ...this.$route.query },
      });
    },
    choicePatient(userRow) {
      console.log(userRow);
      this.$router.push({
        name: "timelineMode",
        query: {
          ...userRow,
        },
      });
      this.$refs.userInfoRef.getUserInfo();
      this.searchData.pickerTime = 12;
      this.changePickerTime(12);
    },
    changeSwiper(val) {
      this.swiperIndex = val;
    },
    choiceSearchType(type) {
      this.searchData.type = type;
      this.initPage();
    },
    changeShortRoLong(val) {
      console.log(val);
      if (val === "2") {
        this.yzTableData = this.yzAlltableData;
        return;
      }
      this.yzTableData = this.yzAlltableData.filter((item) => {
        return item.clbs == val;
      });
    },
    async openDialog({ type, title, index, zyh, index2, jlid, listData }) {
      console.log("执行到了");
      if (!type) return;
      this.dialog.index = index;
      this.dialog.index2 = index2;
      this.dialog.type = type;
      this.dialog.title = title;
      this.dialog.show = true;
      if (type == 0) {
        // 出院
        let res = await selectDataList({
          apiCode: "JK1002",
          apiVersion: "1.0",
          pageNo: 0,
          pageSize: 0,
          parameters: { zyh: zyh },
        });
        this.cyxjData = res.data[0];
      } else if (type == 1) {
        // 入院
        let res = await selectDataList({
          apiCode: "JK1003",
          apiVersion: "1.0",
          pageNo: 0,
          pageSize: 0,
          parameters: { zyh: zyh },
        });
        this.ryjlData = res.data[0];
      } else if (type == "yz") {
        let res = await selectDataList({
          apiCode: "JK1004",
          apiVersion: "1.0",
          pageNo: 0,
          pageSize: 0,
          parameters: { zyh: this.zyh, hzid: this.$route.query.hzid },
        });

        this.yzAlltableData = res.data.map((item) => {
          return {
            ...item,
            longShortTerm: item.clbs === "1" ? "长期" : item.clbs === "2" ? "临时" : "",
          };
        });
        this.yzTableData = this.yzAlltableData;
        console.log(this.yzTableData, "55555555");
      } else if (type == "zyzd") {
        // 住院诊断
        let res = await selectDataList({
          apiCode: "JK1008",
          apiVersion: "1.0",
          pageNo: 0,
          pageSize: 0,
          parameters: { zyh: this.zyh, hzid: this.$route.query.hzid },
        });
        this.zhuyuanZdTableData = res.data;
      } else if (type == "zyssjl" || type == "mzjl" || type == "pgcjl" || type == "ssjl") {
        //手术记录（包含手术记录，剖宫产手术记录（门诊无），麻醉手术记录）
        console.log(listData)
        this.paperData = listData;
      } else {

        let res = await selectDataList({
          apiCode: type,
          apiVersion: "1.0",
          pageNo: 0,
          pageSize: 0,
          parameters: { id: jlid },
        });
        // console.log(res.data[0]);
        this.paperData = res.data[0];
      }

      // else if (type == "sxjl") {
      //   let res = await selectDataList({
      //     apiCode: "JK1007",
      //     apiVersion: "1.0",
      //     pageNo: 0,
      //     pageSize: 0,
      //     parameters: { zyh: this.zyh, hzid: this.$route.query.hzid },
      //   });
      //   this.sxjlData = res.data[0];
      // }

      // else if (type == "zyssjl") {
      //   let res = await selectDataList({
      //     apiCode: "JK1006",
      //     apiVersion: "1.0",
      //     pageNo: 0,
      //     pageSize: 0,
      //     parameters: { zyh: this.zyh, hzid: this.$route.query.hzid },
      //   });
      //   this.sxjlData = res.data[0];
      // }
    },

    // 点击swiperItem获取对应的数据以及ui变化
    async choicedCard(item, index) {
      this.acriveCircleIndex = index;
      this.swiperItemActiveId = item.id;
      if (item.jzfs == "门诊") {
        this.isInHospital = false;
        await this.$nextTick();
        this.getMenZheng(item.mjzh);
      } else if (item.jzfs == "住院") {
        this.isInHospital = true;
        await this.$nextTick();
        // TODO
        // item.zyh=1
        this.zyh = item.zyh;
        this.getTable(item.ryrqsj.slice(0, 10), item.cyrqsj.slice(0, 10), item.zyh);
        this.getChart(item.ryrqsj.slice(0, 10), item.cyrqsj.slice(0, 10), item.zyh);
      }
    },
    async handleSwiper(type) {
      type == "next" ? this.$refs.swiper.next() : this.$refs.swiper.prev();
      await this.$nextTick();
      console.log(this.swiperIndex, this.swiperList[this.swiperIndex][0]);
      this.choicedCard(this.swiperList[this.swiperIndex][0], 0);
      // this.acriveCircleIndex = 0
    },
    changeSection(index) { },
    initChart({ huxiArr, maiboArr, tiwenArr }) {
      // const category = ['02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22', '02', '06', '10', '14', '18', '22']
      let category = [];
      let bianli = huxiArr.length / 6;
      for (let i = 0; i < bianli; i++) {
        category.push("02", "06", "10", "14", "18", "22");
      }
      let color = ["#e6e6e6", "#e6e6e6", "#e6e6e6", "#e6e6e6", "#e6e6e6", "black"];
      let colors = ["#ddd", ...color, ...color, ...color, ...color, ...color, ...color];
      const gridConfig = {
        top: 50,
        left: 112,
        right: 0,
        show: false,
        bottom: 30,
      };
      // 基于准备好的dom，初始化echarts实例
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom, null, { renderer: "svg" });
      // var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          triggle: "axis",
        },
        title: {
          show: false,
        },
        grid: [
          {
            ...gridConfig,
            show: true,
          },
          {
            ...gridConfig,
          },
          {
            ...gridConfig,
          },
        ],
        legend: {
          data: ["脉搏", "体温", "呼吸"],
        },
        xAxis: [
          {
            position: "top",
            gridIndex: 0,
            type: "category",
            data: category,
            splitLine: {
              show: true,
              lineStyle: {
                color: colors,
              },
            },
          },
          {
            position: "top",
            gridIndex: 1,
            type: "category",
            data: category,
            show: false,
            splitLine: {
              show: false,
            },
          },
          {
            position: "top",
            gridIndex: 2,
            type: "category",
            data: category,
            show: false,
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          { gridIndex: 0, min: 40, max: 120, interval: 10, offset: 10, name: "脉搏", nameTextStyle: { padding: [0, 25, 0, 0] } }, //脉搏
          { gridIndex: 1, min: 34, max: 42, interval: 1, offset: 45, name: "体温", nameTextStyle: { padding: [0, 25, 0, 0] }, splitLine: { show: false } }, //体温
          { gridIndex: 2, min: 14, max: 22, interval: 1, offset: 80, name: "呼吸", nameTextStyle: { padding: [0, 25, 0, 0] }, splitLine: { show: false } }, //呼吸
        ],
        series: [
          {
            name: "脉搏",
            connectNulls: true,
            type: "line",
            lineStyle: {
              color: "#00982D",
            },
            itemStyle: {
              color: "#00982D",
            },
            symbol: "triangle",
            symbolSize: 8,
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: maiboArr,
            // markLine: markLineOpt
          },
          {
            name: "体温",
            connectNulls: true,

            type: "line",
            lineStyle: {
              color: "#0075FF",
            },
            itemStyle: {
              color: "#0075FF",
            },
            symbol: "circle",
            symbolSize: 8,
            xAxisIndex: 1,
            // xAxisIndex: 0,
            yAxisIndex: 1,
            data: tiwenArr,
          },
          {
            name: "呼吸",
            connectNulls: true,
            type: "line",
            lineStyle: {
              color: "#FC561F",
            },
            itemStyle: {
              color: "#FC561F",
            },
            xAxisIndex: 2,
            symbol: "emptyCircle",
            symbolSize: 8,
            // xAxisIndex: 0,
            yAxisIndex: 2,
            data: huxiArr,
          },
        ],
      };
      option && myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    async changeTimeRange(val) {
      this.searchData.pickerTime = "";
      if (val && val[0] && val[1] && dateNumDifference(val[1], new Date(getTodayStr())) == 0) {
        var dateNum = dateNumDifference(val[0], val[1]);
        dateNum++;
        switch (dateNum) {
          case 90:
            this.searchData.pickerTime = 3;
            break;
          case 180:
            this.searchData.pickerTime = 6;
            break;
          case 365:
            this.searchData.pickerTime = 12;
            break;
        }
      }
      this.initPage();
    },
    async changePickerTime(val) {
      let date;
      switch (val) {
        case 12:
          date = getTimeByDifference(365 - 1);
          break;
        case 6:
          date = getTimeByDifference(180 - 1);
          break;
        case 3:
          date = getTimeByDifference(90 - 1);
          break;
      }
      this.searchData.timeRange = [date, new Date(getTodayStr())];
      this.initPage();
    },
    dragstartImg(e) {
      this.dragData.x = e.screenX;
      console.log(e);
    },
    dragendImg(e) {
      console.log(e);
      if (e.screenX - this.dragData.x > 20) {
        e.target.style.right = "20px";
        e.target.style.left = "";
      } else if (e.screenX - this.dragData.x < -20) {
        e.target.style.left = "20px";
        e.target.style.right = "";
      }
    },
    async getTable(rysj, cysj, zyh) {
      this.getTableKey++;
      ////获取常规手术记录，麻醉记录和剖宫产手术记录
      let ssjlRes = await selectDataList({
        apiCode: "JK5029",
        apiVersion: "1.0",
        pageNo: 0,
        pageSize: 0,
        parameters: { zyh, rysj, cysj },
      });
      console.log(ssjlRes)
      let res = await selectDataList({
        apiCode: "JK32008",
        apiVersion: "1.0",
        pageNo: 0,
        pageSize: 0,
        parameters: { zyh, rysj, cysj },
        // parameters: { zyh: "1", rysj: "2022-03-01", cysj: "2022-03-09" },
      });
      res.data.forEach((item1) => {
        //对jybg根据jyxmid进行分类，把同一个检验报告分为一类
        // let s =groupByType(item1.jybgList, "jyxmid")
        item1.jybgList = groupByType(item1.jybgList, "jybgdbh");
      });
      // res.data[0].blList = [...res.data[0].blList, ...res.data[0].blList, ...res.data[0].blList];
      let total = res.data.length;
      this.tableData.index = 1;
      // this.getTableKey==1?res.data[0].date='2002122':null
      if (total <= 7) {
        this.inhospitalData = res.data;
        this.inhospitalData.forEach((i) => {
          ssjlRes.data.forEach((j) => {
            if (i.date == j.date) {
              i.ssjlList = j.ssjlList;
              i.mzjlList = j.mzjlList;
              i.pgcssjlList = j.pgcssjlList;
            }
          })
        })
        this.tableData.maxIndex = 1;
      } else {
        // this.getTableKey%2==0?res.data[0].blList = [...res.data[0].blList, ...res.data[0].blList]:null
        this.allTableData = res.data;
        /* sprint4 文书相关 */
        this.allTableData.forEach((i) => {
          ssjlRes.data.forEach((j) => {
            if (i.date == j.date) {
              i.ssjlList = j.ssjlList;
              i.mzjlList = j.mzjlList;
              i.pgcssjlList = j.pgcssjlList;
            }
          })
        })
        this.inhospitalData = res.data.slice(0, 7);
        this.tableData.maxIndex = Math.ceil(total / 7);
      }
      console.log(this.inhospitalData)
    },
    async getChart(startTime, endTime, zyh) {
      let res = await selectDataList({
        apiCode: "JK31001",
        apiVersion: "1.0.0",
        id: 23,
        pageNo: 0,
        pageSize: 0,

        parameters: {
          zyh,
          startTime,
          endTime,
        },
      });
      this.allChartData = res.data;
      let [huxiArr, maiboArr, tiwenArr] = [[], [], []];
      if (this.allChartData.length > 42) {
        res.data.slice(0, 42).forEach((item) => {
          huxiArr.push(item.huxi);
          maiboArr.push(item.maibo);
          tiwenArr.push(item.tiwen);
        });
      } else {
        res.data.forEach((item) => {
          huxiArr.push(item.huxi);
          maiboArr.push(item.maibo);
          tiwenArr.push(item.tiwen);
        });
      }
      this.initChart({ huxiArr, maiboArr, tiwenArr });
    },
    getTimeline() {//  获取swiper
      this.jiazaiSwiper++
      this.acriveCircleIndex = 0;
      let params = {
        apiCode: "JK31002",
        apiVersion: "1.0",
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.$route.query.hzid,
          kssj: get_yyyy_MM_dd(this.searchData.timeRange[0]),
          jssj: get_yyyy_MM_dd(this.searchData.timeRange[1]),
        },
        selectSon: 1,
      };
      if (this.searchData.type == 2) {
        params.parameters.jzfs = "门诊";
      } else if (this.searchData.type == 3) {
        params.parameters.jzfs = "住院";
      }
      // return request({
      //   url: 'http://192.168.22.220:8080/selectDataList',
      //   method: 'post',
      //   data: params
      // })

      return selectDataList(params).then(async (res) => {
        let arr = res.data;
        let tempArr = [];
        let yushu = arr.length % 6;
        let beishu = parseInt(arr.length / 6);
        for (let i = 0; i < beishu; i++) {
          tempArr.push(arr.slice(i * 6, i * 6 + 6));
        }
        if (yushu != 0) {
          tempArr.push(arr.slice(arr.length - yushu, arr.length));
        }
        // console.log(tempArr,'8888')
        this.swiperList = tempArr;
        await this.$nextTick();
        try {
          this.$refs.swiper.setActiveItem(0);
        } catch (e) { }
      });
    },
    getMenZheng(mjzh) {
      return selectDataList({
        apiCode: "JK31003",
        apiVersion: "1.0",
        pageNo: 0,
        pageSize: 0,
        parameters: {
          //  "mjzh": "1"
          mjzh,
        },
        selectSon: 1,
      }).then((res) => {
        console.log(res)
        this.menZhengData = res.data;
        this.yyjlData = res.data.yyjl.map((item) => {
          return Object.assign(item, {
            ypmc: item.yplx == "中药" ? `${item.ypmc}${item.mx ? "(" + item.mx + ")" : ""}` : item.ypmc,
          });
        });
        this.bingliData = res.data.bingli[0] || {};
      });
    },
    changeTablePage(type) {
      if (type == "next") {
        this.tableData.index++;
      } else {
        this.tableData.index--;
      }

      let [huxiArr, maiboArr, tiwenArr] = [[], [], []];

      if (this.tableData.index == this.tableData.maxIndex) {
        this.inhospitalData = this.allTableData.slice(this.tableData.index * 7 - 7, this.allTableData.length);
        this.allChartData.slice(this.tableData.index * 42 - 42, this.allChartData.length).forEach((item) => {
          huxiArr.push(item.huxi);
          maiboArr.push(item.maibo);
          tiwenArr.push(item.tiwen);
        });
      } else {
        this.inhospitalData = this.allTableData.slice(this.tableData.index * 7 - 7, this.tableData.index * 7);
        this.allChartData.slice(this.tableData.index * 42 - 42, this.tableData.index * 42).forEach((item) => {
          huxiArr.push(item.huxi);
          maiboArr.push(item.maibo);
          tiwenArr.push(item.tiwen);
        });
      }
      this.initChart({ huxiArr, maiboArr, tiwenArr });
    },
    mouseDown() {
      console.log("mouse");
      // document.onmousemove = (e) => {
      //   console.log(e, "move");
      // };
    },
    move(e) {
      console.log(e, "modev");
    },
    mouseup() {
      console.log("end");

      // document.onmousemove = null;
    },
    formatStr(val, type) {
      if (type == "门诊") {
        return val.length <= 10 ? val : val.slice(0, 10);
      } else {
        return val.length <= 4 ? val : val.slice(0, 4) + "...";
      }
    },
    // 加载swiper后并加载第一条数据
    async initPage() {
      // 获取到swiper
      await this.getTimeline();
      if (this.swiperList[0] && Array.isArray(this.swiperList[0]) && this.swiperList[0][0]) {
        this.hasMainData = true;
        let firstItem = this.swiperList[0][0];
        this.choicedCard(firstItem, 0);
      } else {
        // 没有数据则不加载main里的数据
        this.hasMainData = false;
      }
    },
  },
  created() { },
  watch: {
    // ['dialog']['show'](val){

    // }
    "$route.query"(val) {
      // console.log('7777')
      this.searchData.type = 1;
      this.changePickerTime(12);
    },
    "dialog.show"(val) {
      if (!val) {
        this.yzlx = 2;
      }
    },
  },
  mounted() {
    this.changePickerTime(this.searchData.pickerTime);
  },
};
