<!--麻醉术后访视记录-->
<template>
  <div class="case-history-hcj case-history-card">
    <h3 class="title">麻醉术后访视记录</h3>
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
    <!-- content -->
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">体重</div>
          <div class="value">{{ formData.tz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">ABO血型</div>
          <div class="value">{{ formData.aboxx }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">Rh血型</div>
          <div class="value">{{ formData.rhxx }}</div>
        </el-row>
      </el-col>
      <el-col :span="6"> </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术前诊断</div>
          <div class="value">{{ formData.sqzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术后诊断</div>
          <div class="value">{{ formData.shzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">一般状态检查结果</div>
          <div class="value">{{ formData.ybztjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术及操作</div>
          <div class="value">{{ formData.ssjcz }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉方法</div>
          <div class="value">{{ formData.mzff }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉恢复情况</div>
          <div class="value">{{ formData.mzhfqk }}</div>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">清醒时间</div>
          <div class="value">{{ formData.qxsj }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">拔除气管插管标志</div>
          <div class="value">{{ formData.bcqgcgbz }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">特殊情况</div>
          <div class="value">{{ formData.tsqk }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉适应症</div>
          <div class="value">{{ formData.mzsyz }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="footer">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{ formData.qmsj }}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">麻醉医师签名</span>
          <span class="footer-value">{{ formData.mzysqm }}</span>
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
