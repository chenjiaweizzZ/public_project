<template>
    <div class="g-wrapper">
      <c-header>
          <div slot="headerLeft">
              <a @click="back()" class="header-back-btn">
                  <img src="../../assets/images/icon_fanhui.png"/>
              </a>
          </div>
          第一年个人综合考评表
          <div slot='headerRight' style="font-size: 0.3rem;" :class="{noclick:issubmit}"  @click.stop="submit">编辑</div>
        </c-header>
        <!--文字内容-->
        <div class="performance_Evaluation_Wrap">
            <h3 class="base">个人基本信息</h3>
            <div class="baseContent">
                <ul class="Ul">
                    <li><label for="">姓 名：</label><span v-html="stuData.turndoctorinfobean.name"></span></li>
                    <li><label for="">学号：</label><span v-html="stuData.turndoctorinfobean.username"></span></li>
                    <li><label for="">专业基地：</label><span v-html="stuData.turndoctorinfobean.basename"></span></li>
                    <li><label for="">学员类型：</label><span v-html="stuData.turndoctorinfobean.typename"></span></li>
                    <li><label for="">导师：</label><span v-html="stuData.turndoctorinfobean.tutorname"></span></li>
                    <li><label for="">学位性质：</label><span>{{stuData.turndoctorinfobean.degreetypename}}</span></li>
                    <li><label for="">最高学历：</label><span v-html="stuData.turndoctorinfobean.educationalname"></span></li>
                    <li><label for="">最高学位：</label><span v-html="stuData.turndoctorinfobean.degreename"></span></li>
                    <li><label for="">本科毕业时间：</label><span v-html="stuData.turndoctorinfobean.bachelorgraduate"></span></li>
                    <li></li>
                    <li><label for="">硕士毕业时间：</label><span v-html="stuData.turndoctorinfobean.mastergraduate"></span></li>
                    <li><label for="">博士毕业时间：</label><span v-html="stuData.turndoctorinfobean.doctorgraduate"></span></li>


                </ul>
            </div>
            <div class="bgLIne"></div>
            <div class="training_Situation">
                  <h3 class="base">培训情况</h3>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">1：</label></div>
                    <div class="num">
                        <p>参加教学查房（次数）</p>
                        <p>{{stuData.turndoctortraininfobean.teachingrounds}}</p>
                    </div>
                </div>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">2：</label></div>
                    <div class="num">
                        <p>参加病例讨论（次数）</p>
                        <p>{{stuData.turndoctortraininfobean.lecturecasediscussioncount}}</p>
                    </div>
                </div>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">3：</label></div>
                    <div class="num">
                        <p>参加小讲课（次数）</p>
                        <p>{{stuData.turndoctortraininfobean.lecturecount}}</p>
                    </div>
                </div>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">4：</label></div>
                    <div class="num">
                        <p>主讲病例讨论（次数）</p>
                        <p>{{stuData.turndoctortraininfobean.lecturecasediscussioncount}}</p>
                    </div>
                </div>
                 <div class="trainingItem">
                    <div class="trainingName"><label for="">5：</label></div>
                    <div class="num">
                        <p>综合评价（科主任、护士长、带教老师、轮科医师、实习生等反馈，分为优、良、中、差）</p>
                        <p>{{stuData.turndoctortraininfobean.comprehensiveevaluate ? stuData.turndoctortraininfobean.comprehensiveevaluate:"未评论"}}</p>
                    </div>
                </div>
                 <div class="trainingItem">
                    <div class="trainingName"><label for="">6：</label></div>
                    <div class="num">
                        <p>护培生师培训专设讲座出勤率是否合格（要求100%）</p>
                        <div class="fillWrap">
                            <p class="yes"><input type="radio" class="radio" v-model="speciallectureflag" :value=1 ><label
                                for="">是</label>
                            </p>
                            <p class="none"><input type="radio" class="radio" v-model="speciallectureflag" :value=0 ><label
                                for="">否</label>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="inspect_Situation training_Situation">
                <h3 class="base">考核情况</h3>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">7：</label></div>
                    <div class="num">
                        <p>病历书写专项考核成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.basewritescore}}</p>
                    </div>
                </div>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">8：</label></div>
                    <div class="num">
                        <p>第一年中期考核成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.theoryscore}}</p>
                    </div>
                </div>
            </div>
            <!--以下是学员填写的内容-->
            <div class="submissions training_Situation">
                <h3 class="base">以下内容需要学员填写</h3>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">9：</label></div>
                    <div class="num">
                        <p>矿工天数</p>
                        <p><input type="number" class="commonText minersText" v-model="absenteeismdays"></p>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">10：</label></div>
                    <div class="num">
                        <p>医疗事故（要求“无”）</p>
                        <div class="fillWrap">
                            <p class="yes"> <input type="radio" class="radio" v-model="malpracticeflag" :value=1><label for="">是</label></p>
                            <p class="none"> <input type="radio" class="radio" v-model="malpracticeflag" :value=0><label for="">否</label></p>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">11：</label></div>
                    <div class="num">
                        <p>医疗纠纷和投诉（次数）</p>
                        <p><input type="number" class="minersText" v-model="medicaldisputescounts"></p>
                    </div>
                </div>
                 <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">12：</label></div>
                    <div class="num">
                        <p>管理病人数、病种数、临床操作是否达到要求？</p>
                        <div class="fillWrap">
                            <p class="yes"> <input type="radio" class="radio" v-model="clinicaloperationflag" :value=1><label for="">是</label></p>
                            <p class="none"> <input type="radio" class="radio"  v-model="clinicaloperationflag" :value=0><label for="">否</label></p>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish">
                        <div class="num statistical">
                            <p><label for="">13：</label>发表相关论文数：全年统计源期刊篇， SCI篇（限第一作者，上传杂志封面、目录及全文照片。）</p>
                            <div><span>SCI：</span><input type="number" class="sciText" detailtype="1"></div>
                            <div><span>统计源核心：</span><input type="number" class="sciText" name="source_Core" detailtype="2"></div>
                            <div><span>其他（学术/非学术均可）：</span><input type="number" class="sciText" name="other_Academic" detailtype="3"></div>
                            <div class="info">
                                <textarea class="academic_Text" name="academic_Text"></textarea>
                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture1" class="add_picture"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName  publish statistical">
                        <div class="num statistical">
                            <p><label for="">14：</label>主持相关课题数量（前3者）：上传课题批准文件照片</p>
                            <div><span>国家级：</span><input type="number" class="sciText"></div>
                            <div><span>省级：</span><input type="number" class="sciText"></div>
                            <div><span>校级：</span><input type="number" class="sciText"></div>
                            <div><span>院级：</span><input type="number" class="sciText"></div>
                            <div class="info">
                                <textarea></textarea>
                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture2" class="add_picture"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish statistical">
                        <p><label for="">15：参与相关课题数量（前3者）：上传课题批准文件照片</label></p>
                        <div class="num publish statistical">
                            <p></p>
                            <div><span>国家级：</span><input type="number" class="sciText"></div>
                            <div><span>省级：</span><input type="number" class="sciText"></div>
                            <div><span>校级：</span><input type="number" class="sciText"></div>
                            <div><span>院级：</span><input type="number" class="sciText"></div>
                            <div class="info">
                                <textarea></textarea>
                            </div>
                            <div>
                                 <p>
                                    <vue-uploader ref="add_picture3" class="add_picture"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                 <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish statistical">
                        <p><label for="">16：所获奖励</label></p>
                        <div class="num publish statistical">
                            <p></p>
                            <div><span>国家级：</span><input type="number" class="sciText"></div>
                            <div><span>省级：</span><input type="number" class="sciText"></div>
                            <div><span>校级：</span><input type="number" class="sciText"></div>
                            <div><span>院级：</span><input type="number" class="sciText"></div>
                            <div class="info">
                                <textarea></textarea>
                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture4" class="add_picture"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName">
                        <div class="num publish ">
                            <p> <label for="">17：</label>:惩罚情况</p>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture5" class="add_picture"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <!--16、执业医师通过情况-->
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">17：</label></div>
                    <div class="num">
                        <p>执业医师通过情况</p>
                        <div class="fillWrap">
                            <p class="yes"> <input type="radio" class="radio" v-model="practitionerflag"  :value=1><label for="" >是</label></p>
                            <p class="none"> <input type="radio" class="radio" v-model="practitionerflag" :value=0  >
                                <label for="">否</label></p>
                        </div>
                        <div class="certificateNumber" :class="{ngActive:practitionerflag===1 ? true:false}">
                            <label for="">医师资格证书号:</label><input type="text" class="certificateNumberText" v-model="practitionercode">
                        </div>
                    </div>
                </div>
                <div class="identification ">
                    <h3 class="base">自我鉴定</h3>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <p>请填写关于政治思想、遵纪守法、医德医风、工作成绩：</p>
                            <div class="info">
                                <textarea maxlength="500" name="" id="" cols="30" rows="10" v-model="stdcontent" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <!--基地鉴定-->
                <div class="identification ">
                    <div class="base">
                        <span>专业基地鉴定  </span>
                          <div class="fillWrap">
                            <p class="yes"> <input type="radio" class="radio" name="radio"><label for="">是</label></p>
                            <p class="none"> <input type="radio" class="radio" name="radio"><label for="">否</label></p>
                        </div>
                    </div>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <div class="info">
                                <textarea maxlength="500" name="" id="" cols="30" rows="10" placeholder="可填写相关鉴定说明"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <!--教办-->
                 <div class="identification ">
                    <div class="base">
                        <span> 教学办公室/护培办公室  </span>
                          <div class="fillWrap">
                            <p class="yes"> <input type="radio" class="radio" name="radio"><label for="">是</label></p>
                            <p class="none"> <input type="radio" class="radio" name="radio"><label for="">否</label></p>
                        </div>
                    </div>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <div class="info">
                                <textarea maxlength="500" name="" id="" cols="30" rows="10" placeholder="可填写相关鉴定说明"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import $ from 'jquery'
    import methods from '@/methods';
    import cHeader from '../header';
    import {mapState,mapActions} from 'vuex';
    import vueUploader from '@/components/vue-uploader';
    export default {
        name: '',
        components: {
            cHeader,
            vueUploader
        },
        data(){
            return{
                title:'',
                filelist:[],
                isupload:true,
                speciallectureflag:'',
                absenteeismdays:'',
                malpracticeflag:'',
                medicaldisputescounts:'',
                clinicaloperationflag:'',
                stdcontent:'',
                practitionercode:null,
                practitionerflag:'',
                id:'',
                issubmit:false,
                uploadlist:[],
                uploaddescplist:[],
                stuData:{
                    turndoctorinfobean:{},
                    turndoctortraininfobean:{},
                    turndoctorassessmentbean:{}
                }
            }
        },
        filters:{
            sexFilter: function (value) {
                if(value==0){
                    return "男"
                }else if(value==1){
                    return "女";
                }
            },
            stdstatusFilter(value){
                if (value == 0) {
                    return "未完成"
                } else if (value ==5) {
                    return "已提交";
                }
            },
            basestatusFilter(value){
                if(value==0){
                    return '未完成';
                }
                else if(value==5){
                    return '不通过 ';
                }else if(value==10){
                    return '通过';
                }

            }
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),

            //获取证书等数据相关数据
            setStatistical(data){
                let statistical = document.getElementsByClassName("statistical");
                this.uploaddescplist = [];
                for (let i = 0; i < statistical.length; i++) {
                    let statisticalItem = statistical[i].getElementsByTagName("input");
                    for (let j = 0; j < statisticalItem.length; j++) {
                        statisticalItem[j].setAttribute('type',i+1);
                        statisticalItem[j].setAttribute('detailtype',j+1);
                        statisticalItem[j].setAttribute('value','');
                        let type=statisticalItem[j].getAttribute('type');
                        let detailtype= statisticalItem[j].getAttribute('detailtype');
                        for(let k=0;k<data.length;k++){
                            if(type==data[k]['type']&&detailtype==data[k]['detailtype']){
                                statisticalItem[j].setAttribute('value',data[k].content)
                            }
                        }
                    }
                }

            },
            //获取证书等数据相关数据
             getStatistical() {
                let statistical = document.getElementsByClassName("statistical");
                this.uploaddescplist=[];
                for (let i=0;i<statistical.length;i++) {
                    let statisticalItem=statistical[i].getElementsByTagName("input");
                    for(let j=0;j<statisticalItem.length;j++) {
                        this.uploaddescplist.push({
                            tpeuid: this.id,
                            type: i + 1,
                            detailtype: j + 1,
                            content: statisticalItem[j].value
                        });

                    }
                }
                //删除每个统计对象的空值的属性;
               this.uploaddescplist=this.uploaddescplist.filter((obj,index,arr)=>{
                        return obj.content!==''
                });

            },
            //获取证书相关数据的图片
            getPictureUrl(){
                this.uploadlist=[];
                let uploaderDom=document.getElementsByClassName("add_picture");
                for(let i=0;i<uploaderDom.length;i++){
                    let uploaderDomItem=this.$refs['add_picture'+(i+1)].filelist;
                    for(let j=0;j<uploaderDomItem.length;j++){
                        this.uploadlist.push({
                            tpeuid: this.id,
                            type: i,
                            fileurl:uploaderDomItem[j]
                        });
                    }

                }
               //删除每个统计对象的空值的属性;
               this.uploadlist=this.uploadlist.filter((obj,index,arr)=>{
                        return obj.fileurl!='';
                });

            },

            //数据提交
            submit() {
                    this.getStatistical();
                    // this.getPictureUrl();
                    // return false;
                    let self = this;
                    if(self.speciallectureflag===''){
                         self.toast('请选择护培生师培训专设讲座出勤率');
                    }else if(self.absenteeismdays===''){
                         self.toast('请填写旷工天数');
                    }else if(self.malpracticeflag===''){
                         self.toast('请选择是否有医疗事故');
                    }else if(self.medicaldisputescounts===''){
                         self.toast('请填写医疗纠纷和投诉次数');
                    }else if(self.clinicaloperationflag===''){
                         self.toast('请选择管理病人数、病种数、临床操作是否达到要求');
                    }
                    else if(self.practitionerflag===''){
                         self.toast('请选择职业医师通过情况');
                    }
                    else if(self.practitionerflag===1&&self.practitionercode===''){
                         self.toast('请填写职业医师资格证号');
                    }
                    else if(self.stdcontent===''){
                         self.toast('请填写自我鉴定');
                    }
                    else{
                        self.issubmit = true;
                        self.post('/turnedoctormain/stdpersonalevaluatesub', {
                            command: 'turnedoctormain/stdpersonalevaluatesub',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            absenteeismdays: self.absenteeismdays,
                            id: self.id,
                            speciallectureflag:self.speciallectureflag,
                            absenteeismdays:self.absenteeismdays,
                            malpracticeflag:self.malpracticeflag,
                            medicaldisputescounts:self.medicaldisputescounts,
                            clinicaloperationflag:self.clinicaloperationflag,
                            practitionerflag:self.practitionerflag,
                            uploaddescplist:this.uploaddescplist.length>0 ? this.uploaddescplist:null,
                            practitionercode:self.practitionercode,
                            stdcontent:self.stdcontent
                        }).done(function (data) {
                            self.issubmit = false;
                            if (data.errcode == '0') {
                                if (self.$route.query.message) {
                                    // self.changestatu();
                                } else {
                                    // self.$router.push({
                                    //     name: "fdRotation_teacher_date",
                                    //     query: {
                                    //         date: self.$route.query.date
                                    //     }
                                    // })
                                }

                            } else {
                                self.toast(data.errdesc)
                            }
                        }).fail(function (error) {
                            self.issubmit = false;
                            self.noContent = true
                        });
                    }
            },
            init(){
                let self = this;
                this.post('/turnedoctormain/getuserpersonalevaluateinfo', {
                    command:'turnedoctormain/getuserpersonalevaluateinfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    stdid: $.cookie('uid'),
                    yearflag:this.$route.query.yearflag
                }).done(res => {
                    self.id=res.result.turndoctorassessmentbean.id;
                    console.log(self.id);
                    self.stuData.turndoctorinfobean = res.result.turndoctorinfobean;
                    self.stuData.turndoctortraininfobean = res.result.turndoctortraininfobean;
                    self.stuData.turndoctorassessmentbean = res.result.turndoctorassessmentbean;
                });
            },
            // 返回按钮
            back() {
                let self = this;
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
            }
        },
        mounted(){
           this.init();
           let getUploaoList=JSON.parse(localStorage.getItem("uploadList"));
           this.setStatistical(getUploaoList);
        }

    }

</script>
<style lang="scss" scoped>
     @import '../../scss/mixin.scss';
     $borderColor:#c3c3c3;
     $borderDashColor:#e0e0e0;
     $wordColor:rgb(100,100,100);
     $bgLineColor:rgb(242,242,242);
     .performance_Evaluation_Wrap{
         height: 100%;
         overflow-y:scroll;
         color:$wordColor;
        .base{
            @include sexy-flex;
            height:0.6rem;
            font-size:14px;
            font-weight:bold;
            padding-left:0.1rem;
            align-items:center;
            border-bottom:1px solid $borderColor;
        }
        .baseContent{
            font-size:0.2rem;
            padding:0.2rem 0.3rem 0 ;
            .Ul{
                @include sexy-flex;;
                flex-flow:row wrap;
                li {
                    width:50%;
                    margin-bottom: 0.25rem;
                }
            }
        }
       .bgLIne{
            background:$bgLineColor;
            height:0.1rem;
        }
         .training_Situation{
             font-size:0.22rem;
             .publish{
                 @include flex1(1);
             }
             .trainingItem{
                 padding-top:0.15rem;
                 padding:0.15rem 0.1rem 0;
                 border-bottom:1px solid $borderDashColor;
                 @include sexy-flex();
                 .trainingName{
                     label{
                         text-align: right;
                     }
                     padding-left:0.1rem;
                 }
                 .num{
                     @include flex1(1);
                     .radio{
                         width: .25rem;
                         height: .25rem;
                         position: relative;
                         box-shadow: #dfdfdf 0 0 0 0 inset;
                         @include sexy-radius(0.15rem);
                         background-clip: content-box;
                         display: inline-block;
                         -webkit-appearance: none;
                         user-select: none;
                         outline: none;
                         background-image: url('../../assets/images/gouxuan.png');
                         background-size: cover;
                         &:checked{
                             background-image: url('../../assets/images/gouxuan_on.png');
                         }
                     }
                     .fillWrap{
                         p{
                             display:inline-block;
                             margin-right:0.8rem;
                         }
                         input{
                             margin-right:0.1rem;
                             vertical-align: middle;
                         }
                         label{
                             vertical-align: middle;
                         }
                     }
                     input{
                         background:none;
                         border:none;
                         display:inline-block;
                         color:$wordColor;
                     }
                     &.publish{
                         p{
                             span{margin-right:0.2rem;font-size:14px;vertical-align: middle;}
                             input{vertical-align:middle;}
                         }
                     }
                     .info{
                         margin-bottom: 0.15rem;
                         padding-left: 0.1rem;
                         padding-right:0.2rem;
                         textarea{
                             width: 100%;
                             height: 2rem;
                             padding: .2rem;
                             box-sizing: border-box;
                             background: rgb(242, 242, 242);
                         }
                     }
                     .certificateNumber{
                         @include sexy-flex();
                         margin-bottom:0.2rem;
                         align-items: center;
                         display: none;
                         .certificateNumberText {
                             border-bottom: 1px solid $borderColor;
                             @include flex1(1);
                         }
                         &.ngActive{
                             @include sexy-flex();
                              display:block;
                         }
                     }

                 }
                 &.identificationText{
                     padding-left:0.2rem;
                     padding-right:0.2rem;
                     .base{
                         padding-left:0.2rem;
                     }
                     .num .info{
                         padding:0;
                     }
                 }

             }

             border-bottom:1px solid #e0e0e0;
             .identification{
                 .base{
                     justify-content: space-between;
                     padding-right:0.2rem;
                     .fillWrap{
                         width:2.5rem;
                         @include sexy-flex();
                         justify-content: flex-end;
                         p{
                             label,input{
                                 vertical-align: middle;
                                 margin-left:0.1rem;
                             }
                         }
                         .none{
                             margin-left:0.5rem;
                         }

                     }
                     padding-left:0.2rem;
                     .radio {
                         width: .25rem;
                         height: .25rem;
                         position: relative;
                         box-shadow: #dfdfdf 0 0 0 0 inset;
                         @include sexy-radius(0.15rem);
                         background-clip: content-box;
                         display: inline-block;
                         -webkit-appearance: none;
                         user-select: none;
                         outline: none;
                         background-image: url('../../assets/images/gouxuan.png');
                         background-size: cover;
                         &:checked {
                             background-image: url('../../assets/images/gouxuan_on.png');
                         }
                     }
                 }
             }
         }
    }
</style>


