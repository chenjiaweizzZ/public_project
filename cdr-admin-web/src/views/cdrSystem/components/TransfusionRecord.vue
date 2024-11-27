<!--输血记录-->
<template>
  <div class="case-history-hcj">
    <h3 class="title">输血记录</h3>
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
    <div>
      <el-row>
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
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血史</div>
            <div class="value">{{ formData.sxs }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血性质</div>
            <div class="value">{{ formData.sxxz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">诊断</div>
            <div class="value">{{ formData.zd }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">申请ABO血型</div>
            <div class="value">{{ formData.sqaboxx }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">申请Rh血型</div>
            <div class="value">{{ formData.sqrhxx }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血指征</div>
            <div class="value">{{ formData.sxzz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血过程</div>
            <div class="value">{{ formData.sxgc }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血品种</div>
            <div class="value">{{ formData.sxpz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">血袋</div>
            <div class="value">{{ formData.xd }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血量</div>
            <div class="value">{{ formData.sxl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血次数</div>
            <div class="value">{{ formData.sxcs }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">是否有输血反应</div>
            <div class="value">{{ formData.sfysxfy }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血反应类型</div>
            <div class="value">{{ formData.sxfylx }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血日期</div>
            <div class="value">{{ formData.sxrq }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血原因</div>
            <div class="value">{{ formData.sxyy }}</div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="footer" style="margin-top:">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{ formData.qmrq }}</span>
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
      default: () => ({}),
    },
    mode: {
      default: '1',
    },
  },
};
</script>
