<!-- 死亡记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">死亡记录</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ formData.hzxm }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">科室</div>
            <div class="value">{{ formData.ksmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">性别</div>
            <div class="value">{{ formData.xb }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病区</div>
            <div class="value">{{ formData.bqmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">年龄</div>
            <div class="value">{{ formData.nl }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病床号</div>
            <div class="value">{{ formData.bch }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院号</div>
            <div class="value">{{ formData.zyh }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病房号</div>
            <div class="value">{{ formData.bfh }}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <div>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">入院时间</div>
              <div class="value">{{ formData.ryrqsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">死亡时间</div>
              <div class="value">{{ formData.swrqsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">住院天数</div>
              <div class="value">{{ formData.zyts }}</div>
            </el-row>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院诊断</div>
          <div class="value">{{ formData.ryzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院情况</div>
          <div class="value">{{ formData.ryqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">抢救过程</div>
          <div class="value">{{ formData.qjgc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">最后诊断</div>
          <div class="value">{{ formData.zhzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">死亡原因</div>
          <div class="value">{{ formData.swyy }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">签名时间</span>
            <span class="footer-value">{{ formData.qmsj }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">主任医师签名</span>
            <span class="footer-value">{{ formData.zrysqm }}</span>
          </div>

          <div class="floatright footer-text">
            <span class="footer-lable">主治医师签名</span>
            <span class="footer-value">{{ formData.zzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">住院医师签名</span>
            <span class="footer-value">{{ formData.zyysqm }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => ({
        hzxm: '欧阳张三',
        xb: '男',
        ks: '门诊内科',
        nl: '39岁',
        bch: '3-102',
        bfh: '3-101',
        zyh: '3781603785',
        bq: '内科',
        ysqm: '胡诗音',
        qmsj: '2022-01-30',
      }),
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
