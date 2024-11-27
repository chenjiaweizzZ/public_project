<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            报名详情
            <div slot="headerRight" @click="submit" style="font-size: 0.3rem">
                提交
            </div>
        </c-header>
        <div class="g-main">
            <ul class="main">
                <li>
                    <p><label>科室</label>{{dept.name}}</p>
                </li>
                <li>
                    <p><label>出科日期</label>{{signtime}}</p>
                </li>
                <li>
                    <p><label>备注</label></p>
                    <textarea cols="30" rows="20" v-model="remark" placeholder="请输入备注" maxLength="100"></textarea>
                </li>
            </ul>
            <div class="careful">
                <label>说明:</label>
                <span>
                    出科科室请填写当月出科科室或者需要补考的出科科室，出科时间填写当月出科的时间或者需要补考的时间。当月如有两场考试，提交两份申请即可。补考的申请需加上备注“补考”。
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import cHeader from '../../header';
    import noContent from '../../no_content.vue';
    import { mapState, mapActions } from 'vuex'
    export default {
        components:{
            cHeader,
            noContent,
        },
        data(){
            return{
                txtdescription:'很抱歉~您当前暂无可选科室',
                remark:'',
                dept:'',
                signtime:'',
                flag:0,
            }
        },
        computed: {
            ...mapState([
                'turninfo',
            ]),
        },
        watch:{

        },
        created(){

        },
        mounted(){
            let self = this;
            let _signtime = this.turninfo.planendtime;
            if(_signtime.indexOf(".") > 0 ){
                let arr=_signtime.split(".");
                self.signtime = arr.join('-')
            }else {
                self.signtime = _signtime
            }
            this.dept = {
                name:this.turninfo.deptname,
                id:this.turninfo.deptid,
            };
            this.registerToNative('goBack', function (data) {
                self.back()
            })
        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            back(){//返回上一级
                let self = this;
                if(self.flag == 0){
                    self.showConfirm({
                        title: '温馨提示',
                        msg: '您当前报名信息尚未提交保存，是否确认返回？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () {},
                        ok: function () {
                            self.$router.push({
                                name: 'fdDoctorRegistration',
                                query:{
                                    type:self.$route.query.type,
                                    id:self.$route.query.id,
                                }
                            })
                        },
                    })
                }else {
                    self.$router.push({
                        name: 'fdDoctorRegistration',
                        query:{
                            type:self.$route.query.type,
                            id:self.$route.query.id,
                        }
                    })
                }
            },
            submit(){
                let self=this;
                let opition ={};
                if(this.turninfo.status == 3){
                    opition.enlisttype = 2;
                    opition.isresouce = 1
                }else {
                    opition.enlisttype = 1;
                    opition.isresouce = 1
                }
                this.post('/turnexam/addtrunexaminition',{
                    command: 'turnexam/addtrunexaminition',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stuid:$.cookie('uid'),
                    businessid: this.turninfo.businessid,
                    deptid:self.dept.id,
                    examdate:self.signtime,
                    remark:self.remark,
                    enlisttype:1,//补考or正常考试
                    theorystatus:1,//理论考试是否报考
                    skillstatus:1,//技能考试是否报考
                    comprestatus:1,//综合是否报考
                    ...opition

                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.toast('报名成功，请等待审核~');
                        self.flag = 1;
                        setTimeout(() => {
                            self.back();
                        },500)
                    }else if(data&&data.errcode == 400100){
                        self.toast('所选科室在当前月已报名！');
                        return
                    }else {
                        self.toast(data.errdesc);
                        return
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .main {
        margin-top: 0.15rem;
    }
    li {
        background:#fff;
        height: .7rem;
        line-height:.7rem;
        padding:0 0.4rem;
        position: relative;
        color: #666;
        font-size: 0.26rem;
        font-family: "Microsoft YaHei";
        span {
            width:calc(100% - 2rem);
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            height:0.7rem;
            line-height:0.7rem;
        }
        p {
            height: .7rem;
            line-height:.7rem;
            label {
                width:1.4rem;
                height:0.7rem;
                line-height:0.7rem;
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
            background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
            background-size:100% 100%;
            position: absolute;
            right: 0.3rem;
            top: 0.15rem;
        }
    }
    li:first-child {
        border-bottom: 1px solid #eee;
    }
    li:nth-child(3) {
        margin-top: 0.15rem;
        height:1.6rem;
        display:flex;
        align-items:center;
    }
    .department {
        width:100vw;
        height:100vh;
        background:#F8F8F8;
        position:absolute;
        top:0;
        z-index: 999;
    }
    textarea {
        display:inline-block;
        width: calc(100% - 2rem);
        height:1.4rem;
        margin-top:0.1rem;
        align-self:flex-start;
    }
    p {
        margin :0
    }
    .search {
        position:relative;
        margin: .1rem .2rem;
        border: 1px solid #aaa;
        border-radius: 0.3rem;
        height: 0.6rem;
        input {
            margin: 0.1rem 0 0.1rem 0.2rem;
            height: 0.4rem;
            width: calc(100% - 1rem);
            background: transparent;
            display:inline-block;
        }
        i {
            display:inline-block;
            width:0.4rem;
            height:0.4rem;
            margin:0.1rem;
            background:url('../../../assets/images/icon-search.png') 0 0 no-repeat;
            background-size:100% 100%;
            cursor:pointer;
            vertical-align: middle;
            z-index:99;
        }
    }
    .careful {
        display: flex;
        padding: 0 0.4rem;
        color: #999;
        font-size: 0.2rem;
        margin-top: 0.2rem;
        label {
            width: 1.6rem;
        }
    }
</style>
