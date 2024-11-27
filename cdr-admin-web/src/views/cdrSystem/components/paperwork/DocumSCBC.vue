<!--首次病程-->
<template>
  <div class="case-history-hcj case-history-card">
    <h3 class="title">首次病程</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{ formData.xm }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">科室</div>
          <div class="value">{{ formData.ks }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{ formData.xb }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病区</div>
          <div class="value">{{ formData.bq }}</div>
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
    <h3 class="title sub">病例特点</h3>
    <div class="divider"></div>
    <!-- content -->
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病史</div>
          <div class="value">{{ formData.bs }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">查体</div>
          <div class="value">{{ formData.ct }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">辅助检查</div>
          <div class="value">{{ formData.fzjc }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <h3 class="title sub">拟诊讨论</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">中医辨病辩证依据及鉴别诊断</div>
          <div class="value">{{ formData.zybbbzyjjjbzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">西医辨病辩证依据及鉴别诊断</div>
          <div class="value">{{ formData.xyzdyjjjbzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">初步诊断</div>
          <div class="value">{{ formData.cbzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">中医诊断</div>
          <div class="value">{{ formData.zyzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">西医诊断</div>
          <div class="value">{{ formData.xyzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">诊疗计划</div>
          <div class="value">{{ formData.zljh }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="footer">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{formData.qmsj  }}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">医师签名</span>
          <span class="footer-value">{{ formData.ysqm }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
