<!-- 转诊（院）记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">转诊（院）记录</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ formData.hzxm }}</div>
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
      <div>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">过敏史</div>
          <div class="value">{{ formData.gms }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">疾病史</div>
          <div class="value">{{ formData.jbs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术史</div>
          <div class="value">{{ formData.sss }}</div>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转诊（院）日期</div>
              <div class="value">{{ formData.zzyrq }}</div>
              <!-- TODO -->
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转诊医师姓名</div>
              <div class="value">{{ formData.zzysqm }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转诊原因</div>
          <div class="value">{{ formData.zzyy }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转诊记录</div>
          <div class="value">{{ formData.zzjl }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">疾病诊断</div>
          <div class="value">{{ formData.jbzd }}</div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">诊断日期</div>
              <div class="value">{{ formData.zdrq }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">诊断机构名称</div>
              <div class="value">{{ formData.zdjgmc }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">相关症状</div>
          <div class="value">{{ formData.xgzz }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主要诊疗措施</div>
          <div class="value">{{ formData.zyzlcs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">辅助检查结果</div>
          <div class="value">{{ formData.fzjcjg }}</div>
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
              <div class="label">手术及操作开始时间</div>
              <div class="value">{{ formData.ssjczkssj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">治疗方案</div>
          <div class="value">{{ formData.zlfa }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">处置计划</div>
          <div class="value">{{ formData.czjh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">健康问题评估</div>
          <div class="value">{{ formData.jkwtpg }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">康复措施指导</div>
          <div class="value">{{ formData.kfcszd }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转出医疗机构</div>
              <div class="value">{{ formData.zcyljg }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转出医疗机构科室</div>
              <div class="value">{{ formData.zcyljgks }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转入医疗机构</div>
              <div class="value">{{ formData.zryljg }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转入医疗机构科室</div>
              <div class="value">{{ formData.zyyljgks }}</div>
            </el-row>
          </el-col>
        </el-row>
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
        qmsj: '2022-01-30'
      })
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped></style>
