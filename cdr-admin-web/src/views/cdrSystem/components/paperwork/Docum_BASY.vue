<!--病案首页-->
<template>
  <div class="case-history-hcj ">
    <h3 class="title">病案首页</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">医疗机构名称</div>
          <div class="value">{{ formData.yljgmc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院号</div>
          <div class="value">{{ formData.zyh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">医疗付费方式</div>
          <div class="value">{{ formData.ylfffs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病案号</div>
          <div class="value">{{ formData.bah }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">居民健康卡号</div>
          <div class="value">{{ formData.jmjkkh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit"> </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院次数</div>
          <div class="value">{{ formData.zycs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit"> </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <!-- content -->
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{ formData.xm }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{ formData.xb }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出生日期</div>
          <div class="value">{{ formData.csrq }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">年龄</div>
          <div class="value">{{ formData.nl }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">国籍</div>
          <div class="value">{{ formData.gj }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">新生儿出生体重</div>
          <div class="value">{{ formData.xsecstz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">新生儿入院体重</div>
          <div class="value">{{ formData.xserytz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit"> </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出生地</div>
          <div class="value">{{ formData.csd }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">籍贯</div>
          <div class="value">{{ formData.jg }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">婚姻</div>
          <div class="value">{{ formData.hy }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">民族</div>
          <div class="value">{{ formData.mz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">身份证号</div>
          <div class="value">{{ formData.sfzh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit"> </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">职业</div>
          <div class="value">{{ formData.zy }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">现住址</div>
          <div class="value">{{ formData.xzz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">现住址电话</div>
          <div class="value">{{ formData.xzzdh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">现住址邮编</div>
          <div class="value">{{ formData.xzzyb }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">户口地址</div>
          <div class="value">{{ formData.hkdz }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">户口地址邮编</div>
          <div class="value">{{ formData.hkdzyb }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">工作单位地址</div>
          <div class="value">{{ formData.gzdwdz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">单位电话</div>
          <div class="value">{{ formData.dwdh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">工作单位邮编</div>
          <div class="value">{{ formData.gzdwyb }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">联系人姓名</div>
          <div class="value">{{ formData.lxrxm }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">关系</div>
          <div class="value">{{ formData.gx }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">地址</div>
          <div class="value">{{ formData.dz }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">电话</div>
          <div class="value">{{ formData.lxrdh }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院途径</div>
          <div class="value">{{ formData.rytj }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院时间</div>
          <div class="value">{{ formData.rysj }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院科别</div>
          <div class="value">{{ formData.rykb }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院病房</div>
          <div class="value">{{ formData.rybf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院时间</div>
          <div class="value">{{ formData.cysj }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院科别</div>
          <div class="value">{{ formData.cykb }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">出院病房</div>
          <div class="value">{{ formData.cybf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">实际住院天数</div>
          <div class="value">{{ formData.sjzyts }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转科科别</div>
          <div class="value">{{ formData.zkkb }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">门诊急诊诊断</div>
          <div class="value">{{ formData.mjzzd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="formData.zdjl" border style="width: 100%">
      <el-table-column prop="zdmc" label="出院诊断">
        <template slot-scope="scope">
          <span> {{ scope.row.sfzzd === '是' ? '主要诊断：' : '其他诊断：' }}</span>
          <span> {{ scope.row.zdmc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jbbm" label="疾病编码"> </el-table-column>
      <el-table-column prop="rybq" label="入院病情"> </el-table-column>
    </el-table>
    <el-row style="margin-top:10px">
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">损伤中毒的外部原因</div>
          <div class="value">{{ formData.sszddwbyy }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">疾病编码</div>
          <div class="value">{{ formData.sszdjbbm }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病理诊断</div>
          <div class="value">{{ formData.blzd }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">疾病编码</div>
          <div class="value">{{ formData.blzdjbbm }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病理号</div>
          <div class="value">{{ formData.blh }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">药物过敏</div>
          <div class="value">{{ formData.ywgm }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">过敏药物</div>
          <div class="value">{{ formData.gmyw }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">死亡患者尸检</div>
          <div class="value">{{ formData.swhzsj }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">ABO血型</div>
          <div class="value">{{ formData.aboxx }}</div>
        </el-row>
      </el-col>
      <el-col :span="18">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">Rh血型</div>
          <div class="value">{{ formData.rhxx }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">科主任</div>
          <div class="value">{{ formData.kzr }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主任（副主任）医师</div>
          <div class="value">{{ formData.zrfzrys }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主治医师</div>
          <div class="value">{{ formData.zzys }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院医师</div>
          <div class="value">{{ formData.zyys }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">责任护士</div>
          <div class="value">{{ formData.zrhs }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">进修医师</div>
          <div class="value">{{ formData.jxys }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">实习医师</div>
          <div class="value">{{ formData.sxys }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">编码员</div>
          <div class="value">{{ formData.bmy }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病案质量</div>
          <div class="value">{{ formData.bazl }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">质控医师</div>
          <div class="value">{{ formData.zkys }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">质控护士</div>
          <div class="value">{{ formData.zkhs }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">质控日期</div>
          <div class="value">{{ formData.zkrq }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="formData.ssjl" border style="width: 100%">
      <el-table-column prop="czbm" label="手术及操作编码"> </el-table-column>
      <el-table-column prop="kssj" label="手术及操作日期"> </el-table-column>
      <el-table-column prop="ssjb" label="手术级别"> </el-table-column>
      <el-table-column prop="ssmc" label="手术及操作名称"> </el-table-column>
      <el-table-column label="手术及操作医师">
        <el-table-column prop="ssz" label="手术者"> </el-table-column>
        <el-table-column prop="dyzs" label="Ⅰ助"> </el-table-column>
        <el-table-column prop="dezs" label="Ⅱ助"> </el-table-column>
      </el-table-column>
      <el-table-column prop="qkyhdj" label="切口愈合等级"> </el-table-column>
      <el-table-column prop="mzfs" label="麻醉方式"> </el-table-column>
    </el-table>
    <el-row style="margin-top:10px">
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">离院方式</div>
          <div class="value">{{ formData.lyfs }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">拟接收医疗机构名称</div>
          <div class="value">{{ formData.njsyljgmc }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">是否有出院31天内再住院计划</div>
          <div class="value">{{ formData.sfycy31tnzzyjh }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">目的</div>
          <div class="value">{{ formData.zzymd }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">颅脑损伤患者入院前昏迷时间</div>
          <div class="value">{{ formData.lnsshzryqhmsj }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院总费用</div>
          <div class="value">{{ formData.zyzfy }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">自付金额</div>
          <div class="value">{{ formData.zfje }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <h3 class="title sub">综合医疗服务类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">一般医疗护理费</div>
          <div class="value">{{ formData.ybylhlf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">一般医疗操作费</div>
          <div class="value">{{ formData.ybzlczf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">护理费</div>
          <div class="value">{{ formData.hlf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">其他费用</div>
          <div class="value">{{ formData.qtfy }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <h3 class="title sub">诊断类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病理诊断费</div>
          <div class="value">{{ formData.blzdf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">实验室诊断费</div>
          <div class="value">{{ formData.syszdf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">影像学诊断费</div>
          <div class="value">{{ formData.yxxzdf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">临床诊断项目费</div>
          <div class="value">{{ formData.lczdxmf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">治疗类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">非手术治疗项目费</div>
          <div class="value">{{ formData.fsszlxmf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">临床物理治疗费</div>
          <div class="value">{{ formData.lcwlzlf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术治疗费</div>
          <div class="value">{{ formData.sszlf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉费</div>
          <div class="value">{{ formData.mzf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术费</div>
          <div class="value">{{ formData.ssf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <h3 class="title sub">康复类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">康复费</div>
          <div class="value">{{ formData.kff }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">中医类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">中医治疗费</div>
          <div class="value">{{ formData.zyzlf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">西药类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">西药费</div>
          <div class="value">{{ formData.xyf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">抗菌药物费</div>
          <div class="value">{{ formData.kjywf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">中药类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">中药费</div>
          <div class="value">{{ formData.zyf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">中草药费</div>
          <div class="value">{{ formData.zcyf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">血液和血液制品类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">血费</div>
          <div class="value">{{ formData.xf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">白蛋白类制品费</div>
          <div class="value">{{ formData.bdblzpf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">球蛋白类制品费</div>
          <div class="value">{{ formData.qdblzpf }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">凝血因子类制品费</div>
          <div class="value">{{ formData.nxyzlzpl }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">细胞因子类制品费</div>
          <div class="value">{{ formData.xbyzlzpf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">耗材类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">检查用一次性医用材料费</div>
          <div class="value">{{ formData.jcyycxyyclf }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">治疗用一次性医用材料费</div>
          <div class="value">{{ formData.zlyycxyyclf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术用一次性医用材料费</div>
          <div class="value">{{ formData.ssyycxyyclf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">其他类</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">其他费</div>
          <div class="value">{{ formData.qtf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院方式</div>
          <div class="value">{{ formData.ryfs }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">日常生活能力评定量表入院得分</div>
          <div class="value">{{ formData.rcshnlpdlbrydf }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">临床路径</div>
          <div class="value">{{ formData.lclj }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">日常生活能力评定量表出院得分</div>
          <div class="value">{{ formData.rcshnlpdlbcydf }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">抗生素使用情况</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">使用</div>
          <div class="value">{{ formData.sy }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">目的</div>
          <div class="value">{{ formData.kssmd }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">方案</div>
          <div class="value">{{ formData.fa }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">使用天数</div>
          <div class="value">{{ formData.syts }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">传染病报告</div>
          <div class="value">{{ formData.crbbg }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">特级护理天数</div>
          <div class="value">{{ formData.tjhlts }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">护理等级</div>
          <div class="value">{{ formData.hldj }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit"> </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院期间是否出现病危病重</div>
          <div class="value">{{ formData.zyqjsfcxbwbz }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">是否有非计划二次手术</div>
          <div class="value">{{ formData.sfyfjhecss }}</div>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院过程中有无进入重症监护室</div>
          <div class="value">{{ formData.zygczywjrzzjhs }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">重症监护室名称</div>
          <div class="value">{{ formData.zzjhsmc }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">进入时间</div>
          <div class="value">{{ formData.jrsj }}</div>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转出时间</div>
          <div class="value">{{ formData.zcsj }}</div>
        </el-row>
      </el-col>
    </el-row>

    <div class="divider"></div>
    <h3 class="title sub">诊断符合情况</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院与出院</div>
          <div class="value">{{ formData.ryycy }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术前与术后</div>
          <div class="value">{{ formData.sqysh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">临床病理</div>
          <div class="value">{{ formData.lcbl }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主要诊断出院情况</div>
          <div class="value">{{ formData.zyzdcyqk }}</div>
        </el-row>
      </el-col>
    </el-row>
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

<style lang="scss"  scoped>
 ::v-deep .el-table__row{
height:32px ;
  }
</style>
