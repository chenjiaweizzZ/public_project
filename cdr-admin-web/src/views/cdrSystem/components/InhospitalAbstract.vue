<!--入院记录-->
<template>
  <div class="case-history-hcj">
    <h3 class="title">入院记录</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{formData.xm}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">科室</div>
          <div class="value">{{formData.ks}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{formData.xb}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病区</div>
          <div class="value">{{formData.bq}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">年龄</div>
          <div class="value">{{formData.nl}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病床号</div>
          <div class="value">{{formData.bch}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院号</div>
          <div class="value">{{formData.zyh}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病房号</div>
          <div class="value">{{formData.bfh}}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <!-- content -->
    <div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">入院时间</div>
            <div class="value">{{formData.rysj}}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出院时间</div>
            <div class="value">{{formData.cysj}}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院天数</div>
            <div class="value">{{formData.zyts}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">民族</div>
            <div class="value">{{formData.mz}}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">婚姻状况</div>
            <div class="value">{{formData.hyzk}}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">职业</div>
            <div class="value">{{formData.zy}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病史陈述者</div>
            <div class="value">{{formData.bscsz}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">现病史</div>
            <div class="value">{{formData.xbs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">疾病史</div>
            <div class="value">{{formData.jbs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">传染病史</div>
            <div class="value">{{formData.crbs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">预防接种史</div>
            <div class="value">{{formData.yfjzs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术史</div>
            <div class="value">{{formData.sss}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血史</div>
            <div class="value">{{formData.sxs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">过敏史</div>
            <div class="value">{{formData.gms}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">个人史</div>
            <div class="value">{{formData.grs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">婚育史</div>
            <div class="value">{{formData.hys}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">月经史</div>
            <div class="value">{{formData.yjs}}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <h3 class="title sub">体格检查</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">体温</div>
            <div class="value">{{formData.tw}}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">脉搏</div>
            <div class="value">{{formData.mb}}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">呼吸频率</div>
            <div class="value">{{formData.hxpl}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">收缩压/舒张压</div>
            <div class="value">{{formData.ssyszy}}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">身高</div>
            <div class="value">{{formData.sg}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">一般状况</div>
            <div class="value">{{formData.ybzk}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">皮肤和黏膜</div>
            <div class="value">{{formData.pfhnm}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">淋巴结</div>
            <div class="value">{{formData.lbj}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">头部</div>
            <div class="value">{{formData.tb}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">颈部</div>
            <div class="value">{{formData.jb}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胸部</div>
            <div class="value">{{formData.xiongbu}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">腹部</div>
            <div class="value">{{formData.fb}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">肛门指正</div>
            <div class="value">{{formData.gmzz}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">外生殖器</div>
            <div class="value">{{formData.wszq}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">脊柱</div>
            <div class="value">{{formData.jz}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">四肢</div>
            <div class="value">{{formData.sz}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">神经系统</div>
            <div class="value">{{formData.sjxt}}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <h3 class="title sub">专科情况</h3>
      <div class="divider"></div>
      <div class="case-content">
        <!-- 放内容 -->{{formData.zkqk}}
      </div>
      <div class="divider"></div>
      <h3 class="title sub">辅助检查</h3>
      <div class="divider"></div>
      <div class="case-content">
        <!-- 放内容 -->
        {{formData.fzjc}}
      </div>
      <div class="divider"></div>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">初步诊断</div>
            <div class="value">{{formData.cbzd}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">修正诊断</div>
            <div class="value">{{formData.xzzd}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">确定诊断</div>
            <div class="value">{{formData.qdzd}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">补充诊断</div>
            <div class="value">{{formData.bczd}}</div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">接诊医师</div>
          <div class="value">{{formData.jzys}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院医师</div>
          <div class="value">{{formData.zyys}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主治医师</div>
          <div class="value">{{formData.zzys}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主任医师</div>
          <div class="value">{{formData.zrys}}</div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props:{
    formData:{
      type:Object,
      default:()=>({})
    }
  }
}
</script>


    <!-- <div class="patient-info"> -->
      <!-- <div class="patient-row">
        <div class="patient-item flex1">
          <span>姓名</span>
          <span>{{ medicalInfo.hzxm }}</span>
        </div>
        <div class="patient-item flex1">
          <span>性别</span>
          <span>{{ medicalInfo.xb }}</span>
        </div>
        <div class="patient-item flex1">
          <span>年龄</span>
          <span>{{ medicalInfo.nls }}岁</span>
        </div>
        <div class="patient-item flex1">
          <span>出生日期</span>
          <span>{{ medicalInfo.csrq }}</span>
        </div>
      </div>
      <div class="patient-row">
        <div class="patient-item flex1">
          <span>门诊号</span>
          <span>{{ medicalInfo.mjzh }}</span>
        </div>
        <div class="patient-item flex1">
          <span>科室</span>
          <span>{{ medicalInfo.ksmc }}</span>
        </div>
        <div class="patient-item flex1">
          <span>就诊日期</span>
          <span>{{ medicalInfo.jzrqsj ? medicalInfo.jzrqsj.split(' ')[0] : '' }}岁</span>
        </div>
        <div class="patient-item flex1"></div>
      </div>
    </div> -->
    <!-- <div class="patient-item patient-content">
      <span>主诉</span>
      <span>{{ medicalInfo.zs }}</span>
    </div>
    <div class="patient-item patient-content">
      <span>现病史</span>
      <span>{{ medicalInfo.xbs }}</span>
    </div> -->
    <!-- <div class="patient-item patient-content">
      <span>既往史</span>
      <span>{{ medicalInfo.jws }}</span>
    </div>
    <div class="patient-item patient-content">
      <span>体格检查</span>
      <div>{{ medicalInfo.tgjc }}</div>
    </div>
    <div class="patient-item patient-content">
      <span>辅助检查</span>
      <div>{{ medicalInfo.fzjcxm }}</div>
    </div> -->
    <!-- <div class="patient-item patient-content">
      <span>诊断</span>
      <div>{{ medicalInfo.cbzdxyzdmc || medicalInfo.cbzdzybmmc }}</div>
    </div>
    <div class="patient-item patient-content">
      <span>医嘱</span>
      <div>{{ medicalInfo.yzxmnr }}</div>
    </div> -->