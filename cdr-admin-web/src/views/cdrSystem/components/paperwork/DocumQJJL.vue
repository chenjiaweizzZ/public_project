<!-- 抢救记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">抢救记录</h3>
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
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">疾病诊断</div>
              <div class="value">{{ formData.jbzd }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">病情变化</div>
              <div class="value">{{ formData.bqbh }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救措施</div>
              <div class="value">{{ formData.qjcs }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术及操作名称</div>
              <div class="value">{{ formData.ssjczmc }}</div>
            </el-row>
            <!-- <el-row type="flex" justify="start" class="unit">
              <div class="label">介入物</div>
              <div class="value">{{ formData.jrw }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救开始时间</div>
              <div class="value">{{ formData.qjkssj }}</div>
            </el-row>-->
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术及操作目标部位名称</div>
              <div class="value">{{ formData.ssjczbwmc }}</div>
            </el-row>
            <!-- <el-row type="flex" justify="start" class="unit">
              <div class="label">操作方法</div>
              <div class="value">{{ formData.czff }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救结束时间</div>
              <div class="value">{{ formData.qjjssj }}</div>
            </el-row>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">介入物</div>
              <div class="value">{{ formData.jrw }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">操作方法</div>
              <div class="value">{{ formData.czff }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">操作次数</div>
              <div class="value">{{ formData.czcs}}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救开始时间</div>
              <div class="value">{{ formData.qjkssj }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救结束时间</div>
              <div class="value">{{ formData.qjjssj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">抢救经过</div>
              <div class="value">{{ formData.qjjg }}</div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- <div style="padding-bottom: 8px">
        <el-table :data="formData.tableData" border style="width: 100%">
          <el-table-column prop="xmmc" label="检查/检验项目名称" width="280"></el-table-column>
          <el-table-column prop="jcjg" label="检查/检验结果"></el-table-column>
        </el-table>
      </div>-->
      <div>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">注意事项</div>
          <div class="value">{{ formData.zysx }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">参加抢救人员名单</div>
              <div class="value">{{ formData.cjqjrymd }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">专业技术职务类别</div>
              <div class="value">{{ formData.zyjszwlb }}</div>
            </el-row>
          </el-col>
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
            <span class="footer-lable">医师签名</span>
            <span class="footer-value">{{ formData.ysqm }}</span>
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
        tableData: [
          {
            xmmc: '体格检查',
            jcjg: '神清，气平，反应尚好，全身皮肤、粘膜无黄染、皮疹、出血点及瘀斑',
          },
          {
            xmmc: '体格检查',
            jcjg: '神清，气平，反应尚好，全身皮肤、粘膜无黄染、皮疹、出血点及瘀斑',
          },
          {
            xmmc: '体格检查',
            jcjg: '神清，气平，反应尚好，全身皮肤、粘膜无黄染、皮疹、出血点及瘀斑',
          },
          {
            xmmc: '体格检查',
            jcjg: '神清，气平，反应尚好，全身皮肤、粘膜无黄染、皮疹、出血点及瘀斑',
          },
        ],
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
