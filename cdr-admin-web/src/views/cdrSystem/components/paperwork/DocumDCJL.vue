<!-- 出院记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">待产记录</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ listData.xm }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">科室</div>
            <div class="value">{{ listData.ks }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">性别</div>
            <div class="value">{{ listData.xb }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病区</div>
            <div class="value">{{ listData.bq }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">年龄</div>
            <div class="value">{{ listData.nl }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病床号</div>
            <div class="value">{{ listData.bch }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院号</div>
            <div class="value">{{ listData.zyh }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病房号</div>
            <div class="value">{{ listData.bfh }}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <div>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">待产时间</div>
              <div class="value">{{ listData.dcsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">孕次</div>
              <div class="value">{{ listData.yc }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产次</div>
              <div class="value">{{ listData.cc }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">末次月经日期</div>
              <div class="value">{{listData.mcyjrq}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">受孕形式</div>
              <div class="value">{{listData.syxs}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">预产期</div>
              <div class="value">{{listData.ycq}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产前检查标志</div>
              <div class="value">{{listData.cqjcbz}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">产前检查异常情况</div>
          <div class="value">{{listData.cqjcycqk}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">孕前体重</div>
              <div class="value">{{listData.yqtz}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">身高</div>
              <div class="value">{{listData.sg}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">分娩前体重</div>
              <div class="value">{{listData.fmqtz}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">此次妊娠特殊情况</div>
          <div class="value">{{listData.ccrstsqk}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">既往史</div>
          <div class="value">{{listData.jws}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术史</div>
          <div class="value">{{listData.sss}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">既往孕产史</div>
          <div class="value">{{listData.jwycs}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">收缩压</div>
              <div class="value">{{listData.ssy}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">舒张压</div>
              <div class="value">{{listData.szy}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">体温</div>
              <div class="value">{{listData.tw}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">脉搏</div>
              <div class="value">{{listData.mb}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">呼吸频率</div>
              <div class="value">{{listData.hxpl}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">宫底高度</div>
              <div class="value">{{listData.gdgd}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">腹围</div>
              <div class="value">{{listData.fw}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">胎心率</div>
              <div class="value">{{listData.txl}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">胎方位</div>
              <div class="value">{{listData.tfw}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">估计胎儿体重</div>
              <div class="value">{{listData.gjtetz}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">头位难产情况评估</div>
          <div class="value">{{listData.twncqkpg}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">骶耻外径</div>
              <div class="value">{{listData.dcwj}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">坐骨结节间径</div>
              <div class="value">{{listData.zgjjjj}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">宫缩情况</div>
          <div class="value">{{listData.gsqk}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">宫颈情况</div>
          <div class="value">{{listData.gjqk}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">宫口情况</div>
          <div class="value">{{listData.gkqk}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">胎膜情况</div>
              <div class="value">{{listData.tmqk}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">破膜方式</div>
              <div class="value">{{listData.pmfs}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">先露位置</div>
          <div class="value">{{listData.xlwz}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">羊水情况</div>
          <div class="value">{{listData.ysqk}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">膀胱充盈标志</div>
              <div class="value">{{listData.pgcybz}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">肠胀气标志</div>
              <div class="value">{{listData.czqbz}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">检查方式</div>
              <div class="value">{{listData.jcfs}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">处置计划</div>
          <div class="value">{{listData.czjh}}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">计划选取的分娩方式</div>
              <div class="value">{{listData.jhxqdfmfs}}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产程记录时间</div>
              <div class="value">{{listData.ccjlsj}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">产程经过</div>
          <div class="value">{{listData.ccjg}}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">记录人签名</span>
            <span class="footer-value">{{ listData.jlrqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">产程检查者签名</span>
            <span class="footer-value">{{ listData.ccjczqm }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    listData: {
      type: Object,
      default: () => ({
        hzxm: "欧阳张三",
        xb: "男",
        ks: "门诊内科",
        nl: "39岁",
        bch: "3-102",
        bfh: "3-101",
        zyh: "3781603785",
        bq: "内科",
        ysqm: "胡诗音",
        qmsj: "2022-01-30",
      }),
    },
  },
  data() {
    return {
    }
  },
  created() {
    console.log(listData,"listData");
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped></style>
