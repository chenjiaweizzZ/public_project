<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            教学巡查
            <div slot="headerRight" @click="submit()" style="font-size: 0.3rem"  v-if="!disabled">
                提交
            </div>
            <div slot="headerRight" @click="edit()" style="font-size: 0.3rem"  v-if="disabled">
                提交
            </div>
        </c-header>
        <ul class="dept">
            <li class="score" :class="{'intop':istop}">
                <span>总分：100分</span>
                <span >得分：<b  style="font-weight: normal">{{scoreresult}}分</b></span>
            </li>
        </ul>
        <div class="g-main">
            <ul class="dept">
                <!-- <li @click="choicedepartment = true"> -->
                <li @click="popShow = true">
                    <!-- <p class="choice"><label>科室</label>{{technical.name}}</p> -->
                    <p class="choice"><label>科室</label>{{deptname}}</p>
                </li>
                <li class="liil">
                    <span>护培秘书&emsp;</span><span v-for="(val,index) in list2">{{val.name}}&nbsp;&nbsp;</span>
                </li>
            </ul>

            <div class="evaluate_wrap">
                <template v-if="disabled">
                    <c-rate v-for="(item,index) in list" :stem="item.title" :maxscore="Number(item.itemlist[0].evascore)" :title="item.itemlist[0].content"  :isdisabled="disabled" :key="item.id" :actualscore="item.itemlist[0].actualscore" @getresult="getresult" :id="item.itemlist[0].id">
                    </c-rate>
                </template>
                <template v-else>
                    <c-rate v-for="(item,index) in list" :stem="item.title" :maxscore="item.evaluationitems[0].maxscore" :title="item.evaluationitems[0].content" :id="item.evaluationitems[0].id" :steplength="item.evaluationitems[0].steplength" :scoreway="item.evaluationitems[0].scoreway" @getresult="getresult"  :key="item.id">
                    </c-rate>
                </template>
            </div>

            <div class="remark">
                <p>问题建议</p>
                <textarea cols="30" rows="20" v-model="advise" placeholder="请输入问题建议" @focus='textareaFocus' @blur='textareaBlur'></textarea>
            </div>

        </div>
        <!--科室搜索-->
        <search-partment :showDetails="choicedepartment" @getDetails="getDetails"></search-partment>
        <div class="rotationc">
      <van-popup
        v-model="popShow"
        :lazy-render="false"
        :close-on-click-overlay="false"
        position="bottom"
      >
        <van-nav-bar
          title="请选择"
          left-text="取消"
          right-text="确定"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
        />
        <van-toast></van-toast>
        <div class="popCK">
          <div class="popCBox">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item v-for="(item,index) in columns" :title="item.name" :key="index" />
            </van-sidebar>
          </div>
          <div class="popKBox">
            <el-tree
              show-checkbox
              :check-strictly="true"
              :data="deptList"
              :props="defaultProps"
              @check-change="checkClick"
              node-key="id"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </van-popup>
    </div>
    </div>
</template>

<script>

    import methods from '../../methods';
    import cHeader from '../header';
    import cModal from '../../components/modal';
    import cRate from '../../components/rate';
    import { mapState, mapActions } from 'vuex';
    import searchPartment from './data_department';

    export default {
        data() {
            return {
                selectBase: {
                    show: false,
                    title: '选择基地'
                },
                selectTechnical: {
                    show: false,
                    title: '选择科室'
                },
                choicedepartment:false,//选择科室
                list:[],
                list2:[],
                resultlist:[],
                base:'',//基地
                technical:{},//科室
                technicalid:'',//科室id
                baselist:'',//基地列表
                technicallist:'',//科室列表
                advise:'',
                disabled:false,
                totalscore:'',//总分
                scoreresult:100,//得分
                istop:false,
                scoretop:'',
                detaillist:[],
                secretaryuids:[],
                secretary:'',
                popShow: false,
                columns: [],
                deptList: [],
                hosIdByDeptSave: 0,
                oriactiveKey: 0,
                activeKey: 0,
                deptnameidList: [],
                orideptnameidList: [],
                defaultProps: {
                    children: "childrens",
                    label: "name",
                    disabled: function(data, node) {
                    // 禁用回收站选项
                    if (data.havePermission == 1) {
                        return false;
                    } else {
                        return true;
                    }
                    }
                },
            }
        },
        components: {
            cHeader,
            cRate,
            cModal,
            searchPartment
        },
        created() {
            if(this.$route.query.id){
                this.disabled = true;
            }
        },
        mounted () {
            this.init();
            this.getTree();
        },
        watch: {
            base:function(val){
                if(val){
                    this.technical = ''
                }
            }
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showLoading',
                'hideLoading',
                'toast',
                'showConfirm'
            ]),
            ...methods,
            //获取科室信息
            getTree() {
      let self = this;
      self.post("/base/dept/getMyDeptTree", {
        showHospital: 1,
        showNoDeptHospital: 0,
        needBaseDept: 0,
        hospitalId: "",
      }).done(res => {
        if(res && res.resCode == 200) {
          if(Array.isArray(res.model) && res.model.length > 0) {
              self.columns = res.model
              self.deptList = res.model[0].childrens
          }
        }
      })
    },
    onChange(index) {
      let self = this;
      self.hosIdByDeptSave = self.columns[index].id;
      self.deptList = self.columns[index].childrens;
    },
    checkClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    onClickLeft() {
      let self = this;
      self.popShow = false;
      self.activeKey = self.oriactiveKey;
      self.deptnameidList = self.orideptnameidList;
      this.$refs.tree.setCheckedKeys(self.orideptnameidList);
    },
    onClickRight() {
      let self = this;
      if (
        this.$refs.tree.getCheckedKeys()[0] &&
        this.$refs.tree.getCheckedNodes()[0]
      ) {
        self.hosIdByDept = self.hosIdByDeptSave;
        self.oriactiveKey = self.activeKey
        self.deptname = this.$refs.tree.getCheckedNodes()[0].name;
        self.deptid = this.$refs.tree.getCheckedNodes()[0].id;
        self.orideptnameidList = this.$refs.tree.getCheckedKeys();
        self.popShow = false;
        // self.init()
        this.post('/turnevaluate/queryTurnPatrolSecretary',{
                        command:'turnevaluate/queryTurnPatrolSecretary',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        deptId:self.deptid,
                    }).done(function(data){
                        self.list2 = data.secretarylist
                    })
      } else {
        Toast({
          message: "请选择科室",
          position: "bottom"
        });
      }
    },
            getDetails(val){
                if(val){
                     this.choicedepartment=val.boolean;
                }
                if(val&&val.query){
                    this.technical={name:val.query.deptname};
                    this.technicalid=val.query.deptid;
                }
                this.closedepartment();

            },
            //编辑
            edit(){
                let self=this;
                self.post('/turnevaluate/updateturnpatrol', {
                    command: 'turnevaluate/updateturnpatrol',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    businessid:self.$route.query.id,
                    type: 7,
                    uid: $.cookie('uid'),
                    evaluateid: self.deptid,
                    detaillist: self.detaillist,
                    secretaryuids: self.secretaryuids,
                    advise: self.advise
                }).done(function (data) {
                    if (data.errcode == '0') {
                        self.toast('提交成功！')
                        self.$router.push({
                            // path: 'inspection_List'
                            name: "fdinspectionList",
                        })
                    } else {
                        self.toast(data.errdesc)
                    }
                })
            },
            getScrollTop(elements) {
                let top = elements.offsetTop
                let parent = elements.offsetParent
                while (parent != null) {
                    top += parent.offsetTop
                    parent = parent.offsetParent
                }
                return top
            },
            getPostionList(dom) {
                this.postionList = [];
                let cLength = $('.rate').length;
                let self = this;
                $(dom+' input').each(function (index, element) {
                    if ($(this).val() == '') {
                        self.postionList.push(index);
                    }
                });
                if (this.postionList.length > 0) {
                    let firstDom = $(dom+' input').eq(this.postionList[0]).get(0)
                    $(dom+' input').eq(this.postionList[0]).focus()
                    let scrollTop = this.getScrollTop(firstDom) - 200//获取第一个空值的offsetTop;
                    $('.g-main').animate({scrollTop: scrollTop}, 100)
                    this.toast('请填写' + $(dom+' input').eq(this.postionList[0]).attr('title') + '评分')
                    return false
                } else {
                    return true
                }
            },
            getresult(data){
                let self = this;
                this.detaillist=[];
                //详情更改得分
                if(this.$route.query.id){
                    for (let item of self.list) {
                        if (item.itemlist[0].id == data.id) {
                            item.itemlist[0].actualscore = Number(data.score);

                        }
                    }
                //新增改变得分
                }else{
                     for (let item of self.list) {
                        if (item.evaluationitems[0].id == data.id) {
                            item.evaluationitems[0].score = Number(data.score);
                        }
                    }
                }
                this.getresultscore();
            },
            init() {
                let self = this;
                if(this.disabled){
                    this.post('/turnevaluate/queryturnpatroldetail',{
                        command:'turnevaluate/queryturnpatroldetail',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        turnpatrolid:self.$route.query.id,
                    }).done(function(data){
                        let secretarylist=[];
                        self.advise = data.turnevaluateresult.advise;
                        self.list = data.turnevaluateresult.beanlist;
                        // self.technical={name:data.deptname};
                        self.deptname=data.deptname;
                        self.scoreresult =data.turnevaluateresult.totalscore;
                        self.deptid = data.deptid;
                        for(let item of data.secretarylist){
                            secretarylist.push(item.name);
                            self.secretaryuids.push(item.id);
                            self.list2.push({name:item.name});
                        }
                        self.secretary=secretarylist.join(',');
                        //获取初始总分
                        self.getresultscore();
                    });
                }else {
                    self.post('/turn/queryevaluationitems', {
                        command: 'turn/queryevaluationitems',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        type: 7
                    }).done(function (data) {
                        self.list = data.evaluationList;
                        //获取初始总分
                        self.getresultscore()
                    })
                }
            },
            //总得分(detaillist)
            getresultscore(){
                let self = this;
                self.detaillist=[];
                var score = 0;
                //详情初始化
                if(this.$route.query.id){
                    self.list.map(val => {
                        score = score + val.itemlist[0].actualscore;
                        self.detaillist.push({
                            submitsourceflag: 0,
                            evaluationitemid: val.itemlist[0].id,
                            evascore: val.itemlist[0].actualscore,
                            evacontent: val.itemlist[0].actualscore + '分',
                            weightratio: 1
                        })
                    });
                    //增加数据初始化得分
                }else{
                    self.list.map(val => {
                        score = score + val.evaluationitems[0].score
                        self.detaillist.push({
                            submitsourceflag: 0,
                            evaluationitemid: val.evaluationitems[0].id,
                            evascore: val.evaluationitems[0].score,
                            evacontent: val.evaluationitems[0].score + '分',
                            weightratio: 1
                        })
                    })
                }

                self.scoreresult = score;
            },
            submit(){
                let self = this;
                if(!self.deptid){
                    self.toast('请选择科室！');
                    return
                }
                if(!self.getPostionList(".evaluate_wrap")){
                    return;
                }
                else {
                    let arr = self.list2.map(obj => obj.id)
                    self.post('/turnevaluate/submitevaluate', {
                        command: 'turnevaluate/submitevaluate',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        type: 7,
                        uid: $.cookie('uid'),
                        evaluateid: self.deptid,
                        detaillist: self.detaillist,
                        secretaryuids:arr,
                        advise:self.advise,
                    }).done(function (data) {
                        if(data.errcode == '0'){
                            self.toast('提交成功！');
                            self.$router.push({
                                // path: "inspection_List",
                                name: "fdinspectionList",
                            })
                        }else{
                            self.toast(data.errdesc)
                        }
                    })
                }
            },
            closedepartment(){
                let self = this;
                if (!this.technical) {
                    this.toast('请选择科室！')
                } else {
                    this.post('/turnbaseinfo/getuserbyroleanddept', {
                        command: 'turnbaseinfo/getuserbyroleanddept',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        // deptid: self.technicalid,
                         deptid: self.deptid,
                        roleid: 6
                    }).done((data) => {
                        if (data && data.errcode == 0) {
                            self.secretaryuids = [];
                            self.list2 = data.userlist;
                            for (let item of self.list2) {
                                self.secretaryuids.push(item.id);
                            }
                            self.choicedepartment = false;
                        }
                    })
                }
            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'6rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            back: function () {
                let self = this
                if (this.$route.query.id === undefined) {
                    self.showConfirm({
                        title: '提醒',
                        msg: '你当前评价尚未提交保存，是否确认返回？',
                        theme: 'modal-confirm modal-white',
                        ok: function () {
                            window.history.back()
                        },
                        cancel: function () {

                        }
                    })
                } else {
                    window.history.back();
                }
            }
        }
    }

</script>
<style lang="scss" scoped>
    .liil {
        height: auto;
        padding-top: 10px;
    }
    .title {
        background: #fff;
        font-size: 0.25rem;
        border-bottom: 1px solid #eee;
        padding: 0.1rem 0;
        span {
            width: 100%;
            padding: 0 1rem;
            line-height: 0.35rem;
            text-align: center;
        }
    }
    .dept {
        margin-bottom: 0.1rem;
    }
    li {
        background:#fff;
        height: .6rem;
        line-height:.6rem;
        padding:0 0.4rem;
        position: relative;
        color: #666;
        font-size: 0.26rem;
        font-family: "Microsoft YaHei";
        border-bottom: 1px solid #eee;
        input {
            padding-top:0;
            display:inline-block;
            height:0.5rem;
            width: calc(100% - 2rem);
        }
        span {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            height:0.6rem;
            line-height:0.6rem;
        }
        p {
            height: .6rem;
            line-height:.6rem;
            label {
                width:1.2rem;
                height:0.6rem;
                line-height:0.6rem;
                text-align:justify;
                text-align-last:justify;
                margin-right:0.3rem;
                vertical-align: top;
            }
        }
        p.choice:after {
            content:'';
            display:inline-block;
            width:0.3rem;
            height:0.3rem;
            background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
            background-size:100% 100%;
            position: absolute;
            right: 0.3rem;
            top: 0.15rem;
        }
    }
    .department {
        width:100vw;
        height:100vh;
        background:#F8F8F8;
        position:absolute;
        top:0;
        z-index: 999;
    }
    .remark {
        background: #fff;
        display: flex;
        padding: 0 0.1rem 0.2rem;
        flex-direction: column;
        p {
            margin: 0;
            line-height: 0.5rem;
        }
    }
    textarea {
        display:inline-block;
        width: 100%;
        height:1.4rem;
        align-self:flex-start;
        border: 1px solid #eee;
        padding: 0.1rem;
    }
    .disabled {
        pointer-events: none;
    }
    .score {
        display: flex;
        justify-content: space-between;
    }
    .intop {
        position: fixed;
        width: 100%;
        top: .76rem;
    }
</style>
