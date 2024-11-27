<!-- 出院记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">24h内入出院记录</h3>
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
              <div class="label">民族</div>
              <div class="value">{{ listData.mz }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">婚姻</div>
              <div class="value">{{ listData.hy }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">职业</div>
              <div class="value">{{ listData.zy }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">地址</div>
          <div class="value">{{ listData.dz }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">病史陈述者</div>
              <div class="value">{{ listData.bscsz }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">关系</div>
              <div class="value">{{ listData.gx }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">陈述内容可靠</div>
              <div class="value">{{ listData.csnrkk }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">入院时间</div>
              <div class="value">{{ listData.rysj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">出院时间</div>
              <div class="value">{{ listData.cysj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主诉</div>
          <div class="value">{{ listData.zs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">现病史</div>
          <div class="value">{{ listData.xbs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院情况</div>
          <div class="value">{{ listData.ryqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">症状名称</div>
          <div class="value">{{ listData.zzmc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">症状描述</div>
          <div class="value">{{ listData.zzms }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院诊断</div>
          <div class="value">{{ listData.ryzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">诊疗过程</div>
          <div class="value">{{ listData.zlgc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院情况</div>
          <div class="value">{{ listData.cyqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院诊断</div>
          <div class="value">{{ listData.cyzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院医嘱</div>
          <div class="value">{{ listData.cyyz }}</div>
        </el-row>
       
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">主任医师签名</span>
            <span class="footer-value">{{ listData.zrysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">主治医师签名</span>
            <span class="footer-value">{{ listData.zzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">住院医师签名</span>
            <span class="footer-value">{{ listData.zyysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">接诊医师签名</span>
            <span class="footer-value">{{ listData.jzysqm }}</span>
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
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped></style>
