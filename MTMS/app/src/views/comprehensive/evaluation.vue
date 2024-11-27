<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png"/>
                </a>
            </div>
            第{{$route.query.yearflag==1? '一': '二'}}年个人综合考评表
            <div slot='headerRight' style="font-size: 0.3rem;" :class="{noclick:issubmit}" @click.stop="submit"
                 v-if="$route.query.stdstatus!=5">提交
            </div>
        </c-header>
        <!--文字内容-->
               <div class="g-main performance_Evaluation_Wrap" >
            <h3 class="base">个人基本信息</h3>
            <div class="baseContent">
                <ul class="Ul">
                    <li><label for="">姓 名：</label><span v-html="stuData.turndoctorinfobean.name"></span></li>
                    <li><label for="">学号：</label><span v-html="stuData.turndoctorinfobean.username"></span></li>
                    <li><label for="">专业基地：</label><span v-html="stuData.turndoctorinfobean.basename"></span></li>
                    <li><label for="">学员类型：</label><span v-html="stuData.turndoctorinfobean.typename"></span></li>
                    <li><label for="">导师：</label><span v-html="stuData.turndoctorinfobean.tutorname"></span></li>
                    <li><label for="">学位性质：</label><span>{{stuData.turndoctorinfobean.degreetypename}}</span></li>
                    <li><label for="">最高学历：</label><span v-html="stuData.turndoctorinfobean.educationalname"></span>
                    </li>
                    <li><label for="">最高学位：</label><span v-html="stuData.turndoctorinfobean.degreename"></span></li>
                    <!--<li><label for="">本科毕业时间：</label><span v-html="stuData.turndoctorinfobean.bachelorgraduate"></span></li>-->
                    <!--<li></li>-->
                    <!--<li><label for="">硕士毕业时间：</label><span v-html="stuData.turndoctorinfobean.mastergraduate"></span></li>-->
                    <!--<li><label for="">博士毕业时间：</label><span v-html="stuData.turndoctorinfobean.doctorgraduate"></span></li>-->


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
                        <p>{{stuData.turndoctortraininfobean.casediscussioncount}}</p>
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
                        <p>{{stuData.turndoctortraininfobean.comprehensiveevaluate}}</p>
                    </div>
                </div>
            </div>
            <div class="inspect_Situation training_Situation">
                <h3 class="base">考核情况</h3>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">6：</label></div>
                    <div class="num" v-if="$route.query.yearflag==1">
                        <p>病历书写专项考核成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.basewritescore}}</p>
                    </div>
                    <div class="num" v-if="$route.query.yearflag==2">
                        <p>第二年年度考核理论成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.theoryscore}}</p>
                    </div>
                </div>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">7：</label></div>
                    <div class="num" v-if="$route.query.yearflag==1">
                        <p>第一年中期考核成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.examstatusname}}</p>
                    </div>
                    <div class="num" v-if="$route.query.yearflag==2">
                        <p>第二年中期考核成绩</p>
                        <p>{{stuData.turndoctorassessmentbean.examstatusname}}</p>
                    </div>
                </div>
            </div>
            <!--以下是学员填写的内容-->
            <div class="submissions training_Situation">
                <h3 class="base">以下内容需要学员填写</h3>
                <div class="trainingItem">
                    <div class="trainingName"><label for="">8：</label></div>
                    <div class="num">
                        <p>护培生师培训专设讲座出勤率是否合格（要求100%）</p>
                        <div class="fillWrap">
                            <p class="yes"><input type="radio" class="radio" :checked="speciallectureflag"
                                                  v-model="speciallectureflag" :value=1><label
                                for="">是</label>
                            </p>
                            <p class="none">
                                <input type="radio" class="radio" v-model="speciallectureflag" :value=0
                                       :checked="speciallectureflag"><label
                                for="">否</label>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">9：</label></div>
                    <div class="num">
                        <p>旷工天数（整数）</p>
                        <div><input type="number" class="commonText minersText" v-model="absenteeismdays"
                                                 max="3" name="absenteeismdays" ></div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">10：</label></div>
                    <div class="num">
                        <p>医疗事故（要求“无”）</p>
                        <div class="fillWrap">
                            <p class="yes"><input type="radio" class="radio" v-model="malpracticeflag" :value=1><label
                                for="">有</label></p>
                            <p class="none"><input type="radio" class="radio" v-model="malpracticeflag" :value=0><label
                                for="">无</label></p>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">11：</label></div>
                    <div class="num">
                        <p>医疗纠纷和投诉（次数 (输入整数)）</p>
                        <div><span></span><input type="number" class="minersText" v-model="medicaldisputescounts"
                                                oninput="if(value.length>3)value=value.slice(0,3)" name="medicaldisputescounts"></div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName"><label for="">12：</label></div>
                    <div class="num">
                        <p>管理病人数、病种数、临床操作是否达到要求？</p>
                        <div class="fillWrap">
                            <p class="yes"><input type="radio" class="radio" v-model="clinicaloperationflag" :value=1><label
                                for="">是</label></p>
                            <p class="none"><input type="radio" class="radio" v-model="clinicaloperationflag"
                                                   :value=0><label for="">否</label></p>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish">
                        <div class="num statistical statisticalSign">
                            <p><label for="">13：</label>发表相关论文数：全年统计源期刊篇， SCI篇（限第一作者，上传杂志封面、目录及全文照片。）（输入整数）</p>
                            <div><span>SCI：</span><input type="number"  class="sciText" detailtype="1" ></div>
                            <div><span>统计源核心：</span><input type="number" maxlength="3" class="sciText" name="source_Core"
                                                           detailtype="2"></div>
                            <div><span>其他（学术/非学术均可）：</span><input type="number"
                                                                  class="sciText" name="other_Academic" detailtype="3">
                            </div>
                            <div class="info">
                                <div>备注：</div>
                                <div class="textwrap">
                                     <textarea class="academic_Text descpdetail descpdetailSign" name="academic_Text"
                                          onkeyup="this.value = this.value.substring(0, 300)" placeholder="发表文章请以参考文献格式列出所发表文章。"></textarea>
                                </div>

                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture1" class="add_picture" :imgList='imgList[0]'
                                                  :isupload="$route.query.stdstatus==5 ? false : true" :fdfsurl="fdfsurl"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName  publish statistical statisticalSign">
                        <div class="num statistical">
                            <p><label for="">14：</label>主持相关课题数量（前3者）：上传课题批准文件照片(输入整数)</p>
                            <div><span>国家级：</span><input maxlength="3" type="number" class="sciText" oninput="if(value.length>3)value=value.slice(0,3)"></div>
                            <div><span>省级：</span><input maxlength="3" type="number" class="sciText" oninput="if(value.length>3)value=value.slice(0,3)"></div>
                            <div><span>校级：</span><input maxlength="3" type="number" class="sciText" oninput="if(value.length>3)value=value.slice(0,3)"></div>
                            <div><span>院级：</span><input maxlength="3" type="number" class="sciText" oninput="if(value.length>3)value=value.slice(0,3)"></div>
                            <div class="info">
                                 <div>备注：</div>
                                <div class="textwrap">
                                     <textarea placeholder="请列出课题名称 " class="descpdetail descpdetailSign" onkeyup="this.value = this.value.substring(0, 300)"></textarea>
                                </div>
                            </div>
                            <div>
                                <p>
                                    <vue-uploader :imgList='imgList[1]' ref="add_picture2" class="add_picture"
                                                  :isupload="$route.query.stdstatus==5 ? false : true" :fdfsurl="fdfsurl"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish statistical statisticalSign">
                        <p><label for="">15：参与相关课题数量（前3者）：上传课题批准文件照片（输入整数）</label></p>
                        <div class="num publish statistical">
                            <p></p>
                            <div><span>国家级：</span><input type="number" maxlength="3" class="sciText"></div>
                            <div><span>省级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div><span>校级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div><span>院级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div class="info">
                                 <div>备注：</div>
                                 <div class="textwrap">
                                     <textarea  placeholder=" 请列出课题名称" class="descpdetail descpdetailSign" onkeyup="this.value = this.value.substring(0, 300)" ></textarea>
                                 </div>

                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture3" class="add_picture" :imgList='imgList[2]'
                                                  :isupload="$route.query.stdstatus==5 ? false : true" :fdfsurl="fdfsurl"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish statistical statisticalSign">
                        <p><label for="">16：所获奖励（输入整数）</label></p>
                        <div class="num publish statistical">
                            <p></p>
                            <div><span>国家级：</span><input maxlength="3" type=number class="sciText"></div>
                            <div><span>省级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div><span>校级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div><span>院级：</span><input maxlength="3" type="number" class="sciText"></div>
                            <div class="info">
                                 <div>备注：</div>
                                <div class="textwrap">
                                       <textarea class="descpdetail descpdetailSign" placeholder=" 请列出所获奖项名称" onkeyup="this.value = this.value.substring(0, 300)"
                                         ></textarea>
                                </div>

                            </div>
                            <div>
                                <p>
                                    <vue-uploader :imgList='imgList[3]' ref="add_picture4" class="add_picture"
                                                  :isupload="$route.query.stdstatus==5 ? false : true" :fdfsurl="fdfsurl"></vue-uploader>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="trainingItem training_Situation_Item">
                    <div class="trainingName publish statistical statisticalSign">
                        <div class="num publish ">
                            <p><label for="">17：</label>:惩罚情况</p>
                            <div class="info">
                                 <div>备注：</div>
                                <div class="textwrap">
                                    <textarea class="descpdetail descpdetailSign" placeholder=" 请列出所获奖项名称"  onkeyup="this.value = this.value.substring(0, 300)"></textarea>
                                </div>

                            </div>
                            <div>
                                <p>
                                    <vue-uploader ref="add_picture5" :imgList='imgList[4]' class="add_picture"
                                                  :isupload="$route.query.stdstatus==5 ? false : true" :fdfsurl="fdfsurl"></vue-uploader>
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
                            <p class="yes"><input type="radio" class="radio" v-model="practitionerflag" :value=1><label
                                for="">是</label></p>
                            <p class="none"><input type="radio" class="radio" v-model="practitionerflag" :value=0>
                                <label for="">否</label></p>
                        </div>
                        <div class="certificateNumber" v-show="practitionerflag===1">
                            <label for="">医师资格证书号:</label><input type="text" @focus='textareaFocus' @blur='textareaBlur'
                                                                 class="certificateNumberText"
                                                                 v-model="practitionercode" name="certificate">
                        </div>
                    </div>
                </div>
                <div class="identification ">
                    <h3 class="base">自我鉴定</h3>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <p>请填写关于政治思想、遵纪守法、医德医风、工作成绩：</p>
                            <div class="info">
                                <div class="textwrap">
                                    <textarea maxlength="300" name="" id="" cols="30"  v-model="stdcontent"
                                              class="descpdetail jd_detail" @focus='textareaFocus' @blur='textareaBlur'>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--基地鉴定-->
                <div class="identification jd_wrap_sign" v-if="jd_status!==0">
                    <div class="base">
                        <span>专业基地鉴定 </span>
                        <div class="fillWrap jd_radio">
                            <p class="yes"><input type="radio" class="radio" name="jdradio" :value=10
                                                  v-model="jd_status" ><label for="">通过</label></p>
                            <p class="none"><input type="radio" v-model="jd_status" class="radio" name="jdradio"
                                                   :value=5><label for="">不通过</label></p>
                        </div>
                    </div>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <div class="info">
                                <textarea maxlength="300" name="" id="" cols="30" rows="10" placeholder="可填写相关鉴定说明"
                                          v-model="jd_content" class="jd_info jd_detail" @focus='textareaFocus'
                                          @blur='textareaBlur' ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <!--教办鉴定-->
                <div class="identification jd_wrap_sign" v-if="jb_status!==0">
                    <div class="base">
                        <span>教学办公室/护培办公室  </span>
                        <div class="fillWrap jd_radio">
                            <p class="yes"><input type="radio" class="radio" name="jbradio" :value=10
                                                  v-model="jb_status" ><label for="">通过</label></p>
                            <p class="none"><input type="radio" v-model="jb_status" class="radio" name="jbradio"
                                                   :value=5 ><label for="">不通过</label></p>
                        </div>
                    </div>
                    <div class="trainingItem identificationText">
                        <div class="num">
                            <div class="info">
                                <textarea maxlength="300" name="" id="" cols="30" rows="10" placeholder="可填写相关鉴定说明"
                                          v-model="jb_content" class="jd_info jd_detail" @focus='textareaFocus'
                                          @blur='textareaBlur' ></textarea>
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
    import methods from '@/methods'
    import cHeader from '../header'
    import {mapState, mapActions} from 'vuex'
    import vueUploader from '@/components/vue-uploader'

    export default {
        name: '',
        components: {
            cHeader,
            vueUploader
        },
        data () {
            return {
                ops: {
                    vuescroll: {
                        mode: 'slide'
                    },
                    zooming: false,
                    scrollPanel:{
                        scrollingX: false,
                        scrollingY: true
                    },
                    bar: {
                        background: 'rgba(24, 144, 255,0)'
                    }
                },
                title: '',
                imgList: [
                    [], [], [], [], []
                ],
                keyboard:'',
                numReg:/[^0-9]+$/,
                jd_status: '',
                jb_status: '',
                jd_content: '',
                jb_content: '',
                isupload: true,
                speciallectureflag: '',
                absenteeismdays: '',
                malpracticeflag: '',
                medicaldisputescounts: '',
                clinicaloperationflag: '',
                stdcontent: '',
                practitionercode: '',
                practitionerflag: '',
                id: '',
                issubmit: false,
                uploadlist: [],
                uploaddescplist: [],
                descpdetaillist: [],
                fdfsurl: '',
                stuData: {
                    turndoctorinfobean: {},
                    turndoctortraininfobean: {},
                    turndoctorassessmentbean: {}
                }
            }
        },
        filters: {
            sexFilter: function (value) {
                if (value == 0) {
                    return '男'
                } else if (value == 1) {
                    return '女'
                }
            },
            stdstatusFilter (value) {
                if (value == 0) {
                    return '未完成'
                } else if (value == 5) {
                    return '已提交'
                }
            },
            basestatusFilter (value) {
                if (value == 0) {
                    return '未完成'
                }
                else if (value == 5) {
                    return '不通过 '
                } else if (value == 10) {
                    return '通过'
                }

            }
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            //获取证书等数据相关数据
            getStatistical () {
                let statistical = document.getElementsByClassName('statisticalSign')
                this.uploaddescplist = []
                for (let i = 0; i < statistical.length; i++) {
                    let statisticalItem = statistical[i].getElementsByTagName('input')
                    for (let j = 0; j < statisticalItem.length; j++) {
                        this.uploaddescplist.push({
                            tpeuid: this.$route.query.id,
                            type: i + 1,
                            detailtype: j + 1,
                            content: statisticalItem[j].value
                        })

                    }
                }
                //删除每个统计对象的空值的属性;
                this.uploaddescplist = this.uploaddescplist.filter((obj, index, arr) => {
                    return obj.content !== ''

                })
                localStorage.setItem('uploadList', JSON.stringify(this.uploaddescplist))

            },
            setStatistical (data) {
                let statistical = document.getElementsByClassName('statisticalSign')
                for (let i = 0; i < statistical.length; i++) {
                    let statisticalItem = statistical[i].getElementsByTagName('input')
                    for (let j = 0; j < statisticalItem.length; j++) {
                        if (this.$route.query.stdstatus == 5) {
                            statisticalItem[j].setAttribute('disabled', true)
                        }
                        statisticalItem[j].setAttribute('dtype', i + 1)
                        statisticalItem[j].setAttribute('detailtype', j + 1)
                        statisticalItem[j].setAttribute('value', '')
                        let type = statisticalItem[j].getAttribute('dtype')
                        let detailtype = statisticalItem[j].getAttribute('detailtype')
                        for (let k = 0; k < data.length; k++) {
                            if (type == data[k]['type'] && detailtype == data[k]['detailtype']) {
                                statisticalItem[j].setAttribute('value', data[k].content)
                            }
                        }
                    }
                }

            },
            textareaFocus () {
                    $('.g-main').css('padding-bottom', '6rem')

            },
            textareaBlur () {
                    $('.g-main').css('padding-bottom', '0')
            },
            //获取证书相关数据的图片
            getPictureUrl () {
                this.uploadlist = []
                let uploaderDom = document.getElementsByClassName('add_picture')
                for (let i = 0; i < uploaderDom.length; i++) {
                    let uploaderDomItem = this.$refs['add_picture' + (i + 1)].filelist
                    for (let j = 0; j < uploaderDomItem.length; j++) {
                        this.uploadlist.push({
                            tpeuid: this.$route.query.id,
                            type: i + 1,
                            fileurl: uploaderDomItem[j].fileurl
                        })
                    }
                }
                //删除每个统计对象的空值的属性;
                this.uploadlist = this.uploadlist.filter((obj, index, arr) => {
                    return obj.fileurl != ''
                })

            },
            //设置证书相关数据图片
            setPictureUrl (data) {
                let uploaderDom = document.getElementsByClassName('add_picture')
                for (let i = 0; i < uploaderDom.length; i++) {
                    uploaderDom[i].setAttribute('type', i + 1)
                    let type = uploaderDom[i].getAttribute('type')
                    for (let k = 0; k < data.length; k++) {
                        if (type == data[k]['type']) {
                            //不能写太深,否则监听不到 this.imgList[i][k]={fileurl:data[k]['fileurl']}
                            this.imgList[i].push({fileurl: data[k]['fileurl']})
                        }

                    }
                }
            },
            //设置文本域
            setTextArea (data) {
                let textareaDom = document.getElementsByClassName('descpdetailSign')
                for (let i = 0; i < textareaDom.length; i++) {
                    textareaDom[i].setAttribute('tpeuid', this.$route.query.id)
                    textareaDom[i].setAttribute('type', i + 1)
                    textareaDom[i].innerHTML = ''
                    let type = textareaDom[i].getAttribute('type')
                    for (let k = 0; k < data.length; k++) {
                        if (type == data[k]['type']) {
                            textareaDom[i].innerHTML = data[k].content
                        }
                    }
                }
                //删除每个统计对象的空值的属性;
                this.descpdetaillist = this.descpdetaillist.filter((obj, index, arr) => {
                    return obj.content != ''
                })
            },
             textResize(){
                 $('textarea').each(function () {
                    $(this).css('height', $(this).prop('scrollHeight') + 'px')
                    $(this).on('input', function () {
                        this.style.height = 'auto'
                        this.style.height = this.scrollHeight + 'px'
                    })
                });
            },
            //获取文本域
            getTextArea () {
                let textareaDom = document.getElementsByClassName('descpdetailSign');
                this.descpdetaillist=[];
                for (let i = 0; i < textareaDom.length; i++) {
                    this.descpdetaillist.push({
                        tpeuid: this.$route.query.id,
                        type: i + 1,
                        content: textareaDom[i].value
                    })

                }
                //删除每个统计对象的空值的属性;
                this.descpdetaillist = this.descpdetaillist.filter((obj, index, arr) => {
                    return obj.content != ''
                })
            },
            //获取提交数据
            getSubmitInit () {
                let self = this
                self.post('/turnedoctormain/personalevasubinit', {
                    command: 'turnedoctormain/personalevasubinit',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id: this.$route.query.id,
                    stdid: $.cookie('uid'),
                    yearflag: this.$route.query.yearflag
                }).done((data) => {
                    //初始化数据
                    let res = data.bean
                    if (res.turnpersonalevainfobean.speciallectureflag === '' || res.turnpersonalevainfobean.speciallectureflag == null) {
                        self.speciallectureflag = ''
                    } else {
                        self.speciallectureflag = res.turnpersonalevainfobean.speciallectureflag
                    }
                    if (res.turnpersonalevainfobean.absenteeismdays === '' || res.turnpersonalevainfobean.absenteeismdays == null) {
                        self.absenteeismdays = ''
                    } else {
                        self.absenteeismdays = res.turnpersonalevainfobean.absenteeismdays
                    }
                    if (res.turnpersonalevainfobean.malpracticeflag === '' || res.turnpersonalevainfobean.malpracticeflag == null) {
                        self.malpracticeflag = ''
                    } else {
                        self.malpracticeflag = res.turnpersonalevainfobean.malpracticeflag
                    }
                    if (res.turnpersonalevainfobean.medicaldisputescounts === '' || res.turnpersonalevainfobean.medicaldisputescounts == null) {
                        self.medicaldisputescounts = ''
                    } else {
                        self.medicaldisputescounts = res.turnpersonalevainfobean.medicaldisputescounts
                    }
                    if (res.turnpersonalevainfobean.clinicaloperationflag === '' || res.turnpersonalevainfobean.clinicaloperationflag == null) {
                        self.clinicaloperationflag = ''
                    } else {
                        self.clinicaloperationflag = res.turnpersonalevainfobean.clinicaloperationflag
                    }
                    if (res.turnpersonalevainfobean.stdcontent === '' || res.turnpersonalevainfobean.stdcontent == null) {
                        self.stdcontent = ''
                    } else {
                        self.stdcontent = res.turnpersonalevainfobean.stdcontent;
                    }
                    if (res.turnpersonalevainfobean.practitionerflag === '' || res.turnpersonalevainfobean.practitionerflag == null) {
                        self.practitionerflag = ''
                    } else {
                        self.practitionerflag = res.turnpersonalevainfobean.practitionerflag;
                    }
                    if (res.turnpersonalevainfobean.practitionercode === '' || res.turnpersonalevainfobean.practitionercode == null) {
                        self.practitionercode = ''
                    } else {
                        self.practitionercode = res.turnpersonalevainfobean.practitionercode
                    }
                    //设置证书数据
                    self.setStatistical(res.uploaddescplist)
                    //设置文本数据
                    self.setTextArea(res.descpdetaillist)
                    //设置图片数据
                    self.setPictureUrl(res.uploadlist)
                    //设置基地数据
                    self.jd_status = res.turnpersonalevaluatebean.basestatus;
                    self.jd_content = res.turnpersonalevainfobean.basecontent;
                    //设置教办数据
                    self.jb_status = res.turnpersonalevaluatebean.teachofficestatus;
                    self.jb_content = res.turnpersonalevainfobean.teachofficecontent;
                    //文本框的自动收缩;
                    self.$nextTick(()=>{
                       self.textResize();
                    });
                });
            },
            //数据提交
            submit () {
                this.getStatistical()
                this.getTextArea()
                this.getPictureUrl()
                // return false;
                let self = this
                if (self.speciallectureflag === '') {
                    self.toast('请选择护培生培训专设讲座出勤率')
                } else if (self.absenteeismdays === '' || !(/^[0-9]*$/).test(self.absenteeismdays)) {
                    self.toast('请填写旷工天数')
                    self.absenteeismdays = ''
                } else if (self.malpracticeflag === '') {
                    self.toast('请选择是否有医疗事故')
                } else if (self.medicaldisputescounts === '' || !(/^[0-9]*$/).test(self.medicaldisputescounts)) {
                    self.toast('请填写医疗纠纷和投诉次数')
                    self.medicaldisputescounts = ''
                } else if (self.clinicaloperationflag === '') {
                    self.toast('请选择管理病人数、病种数、临床操作是否达到要求')
                }
                else if (self.practitionerflag === '') {
                    self.toast('请选择职业医师通过情况')
                }
                else if (self.practitionerflag === 1 && !self.practitionercode) {
                    self.toast('请填写职业医师资格证号');
                }
                else if((/[^\w\.\/]/ig).test(self.practitionercode)){
                     self.toast('请填写正确的职业医师资格证号');
                }
                else if ($.trim(self.stdcontent) === '') {
                    self.toast('请填写自我鉴定')
                }
                else {
                    if (self.practitionerflag === 0) {
                        self.practitionercode = '';
                    }
                    self.post('/turnedoctormain/stdpersonalevaluatesub', {
                        command: 'turnedoctormain/stdpersonalevaluatesub',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        id: self.$route.query.id,
                        //专设讲座出勤率是否合格
                        speciallectureflag: self.speciallectureflag,
                        //旷工天数
                        absenteeismdays: self.absenteeismdays,
                        //是否有医疗事故
                        malpracticeflag: self.malpracticeflag,
                        //医疗纠纷和投诉次数
                        medicaldisputescounts: self.medicaldisputescounts,
                        // 管理病人数、病种数、临床操作是否达到要求
                        clinicaloperationflag: self.clinicaloperationflag,
                        //职业医师通过情况
                        practitionerflag: self.practitionerflag,
                        //国家级 省级等指标数据
                        uploaddescplist: this.uploaddescplist.length > 0 ? this.uploaddescplist : null,
                        //职业医师资格证号
                        practitionercode: self.practitionercode,
                        // 学生自我鉴定内容
                        stdcontent: self.stdcontent,
                        //说明
                        descpdetaillist: this.descpdetaillist.length > 0 ? this.descpdetaillist : null,
                        //上传图片
                        uploadlist: this.uploadlist.length > 0 ? this.uploadlist : null
                    }).done(function (data) {
                        self.issubmit = false
                        if (data.errcode == '0') {
                            self.toast('提交成功')
                            self.$router.push({
                                // path: '/comprehensive/list'
                                name: "performance_list",
                            })
                        } else {
                            self.toast(data.errdesc)
                        }
                    }).fail(function (error) {
                        self.issubmit = false
                        self.noContent = true
                    })
                }
            },
            //获得学员的基本信息
            init () {
                let self = this
                this.post('/turnedoctormain/getuserpersonalevaluateinfo', {
                    command: 'turnedoctormain/getuserpersonalevaluateinfo',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    stdid: $.cookie('uid'),
                    yearflag: this.$route.query.yearflag
                }).done(res => {
                    self.stuData.turndoctorinfobean = res.result.turndoctorinfobean
                    self.stuData.turndoctortraininfobean = res.result.turndoctortraininfobean
                    self.stuData.turndoctorassessmentbean = res.result.turndoctorassessmentbean
                    self.fdfsurl = res.fdfsurl
                })
            },
            back () {
                window.history.back()
            }
        },
        watch:{
          practitionerflag(newVal,oldVal){
             if(newVal===0){
                 this.practitionercode='';
             }
          }
        },
        mounted () {
            let self = this;
            //获取初始化数据;
            self.getSubmitInit();
            //清除所有的disabled属性
            if (this.$route.query.stdstatus != 5) {
                $('input').add('textarea').removeAttr('disabled');
            } else {
                $('input').add('textarea').attr('disabled',true);
            }
            this.init()
            this.registerToNative('goBack', function (data) {
                self.back()
            })
            //input 是否为整数检测
            $("input[class!='certificateNumberText']").each(function () {
                $(this).on("input",function () {
                    this.value=parseInt(this.value.replace(/[^0-9]+$/g,''));
                    this.value=this.value.slice(0,3);
                    if(this.name=='absenteeismdays'){
                       self.absenteeismdays=this.value;
                    }
                    if(this.name=='medicaldisputescounts'){
                       self.medicaldisputescounts=this.value;
                    }
                });
                $(this).on("afterpaste",function () {
                    this.value=this.value.replace(/D/g,'');
                    this.value=this.value.slice(0,3);
                    if(this.name=='absenteeismdays'){
                       self.absenteeismdays=this.value;
                    }
                    if(this.name=='medicaldisputescounts'){
                       self.medicaldisputescounts=this.value;
                    }
                });

            });
            $('input.certificateNumberText').each(function () {
                $(this).on('input', function () {
                    this.value =this.value.replace(/[^\w\.\/]/ig,'');
                });
                  $(this).on("afterpaste",function () {
                    this.value =this.value.replace(/[^\w\.\/]/ig,'');
                });
            });
        }

    }
</script>
<style lang="scss" scoped>
    @import '../../scss/mixin.scss';

    $borderColor: #c3c3c3;
    $borderDashColor: #e0e0e0;
    $wordColor: rgb(100, 100, 100);
    $bgLineColor: rgb(242, 242, 242);
    .performance_Evaluation_Wrap {
        height: 100%;
        overflow-y: scroll;
        color: $wordColor;
        background: #fff !important;
        .textwrap{
            @include flex1(1);
            @include sexy-flex();
            overflow: hidden;
            min-height: 0.5rem;
            padding: 0.1rem;
            /*height: 18px;*/
            line-height:18px;
            box-sizing: border-box;
            border: solid 1px #000;
            border-left-color: #999;
            border-top-color: #999;
            border-right-color: #d8d8d8;
            border-bottom-color: #d8d8d8
        }
        .jd_detail{
            width: 100%!important;
        }
        input:disabled, input[disabled],textarea:disabled {
            -webkit-text-fill-color: $wordColor !important;
            -webkit-opacity: 1 !important;
            opacity: 1 !important;
            color: $wordColor !important;
        }
        .base {
            @include sexy-flex;
            height: 0.6rem;
            font-size: 14px;
            font-weight: bold;
            padding-left: 0.1rem;
            align-items: center;
            border-bottom: 1px solid $borderColor;
        }
        .baseContent {
            font-size: 0.2rem;
            padding: 0.2rem 0.3rem 0;
            .Ul {
                @include sexy-flex;;
                flex-flow: row wrap;
                li {
                    width: 50%;
                    margin-bottom: 0.25rem;
                }
            }
        }
        .bgLIne {
            background: $bgLineColor;
            height: 0.1rem;
        }
        .training_Situation {
            font-size: 0.22rem;
            .publish {
                @include flex1(1);
                .info{
                    @include sexy-flex();
                    textarea{
                        @include flex1(1);
                    }
                }
            }
            .trainingItem {
                padding-top: 0.15rem;
                padding: 0.15rem 0.1rem 0;
                border-bottom: 1px solid $borderDashColor;
                @include sexy-flex();
                .trainingName {
                    label {
                        text-align: left;
                    }
                    padding-left: 0.1rem;
                    .statistical {
                        div {
                            @include sexy-flex();
                            margin-bottom: 0.2rem;
                            input {
                                @include flex1(1);
                                border-bottom: 1px solid $borderDashColor;
                            }
                        }

                    }
                }
                .num {
                    @include flex1(1);
                    p {
                        min-height: 0.3rem;
                    }
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
                    .fillWrap {
                        p {
                            display: inline-block;
                            margin-right: 0.8rem;
                        }
                        input {
                            margin-right: 0.1rem;
                            vertical-align: middle;
                        }
                        label {
                            vertical-align: middle;
                        }
                    }
                    input {
                        background: none;
                        border: none;
                        display: inline-block;
                        color: $wordColor;
                    }
                    &.publish {
                        p {
                            span {
                                margin-right: 0.2rem;
                                font-size: 14px;
                                vertical-align: middle;
                            }
                            input {
                                vertical-align: middle;
                            }
                        }
                    }
                    .info {
                        margin-bottom: 0.15rem;
                        padding-right: 0.2rem;
                        line-height: 24px;
                    }
                    .certificateNumber {
                        @include sexy-flex();
                        margin-bottom: 0.2rem;
                        align-items: center;
                        .certificateNumberText {
                            border-bottom: 1px solid $borderColor;
                            @include flex1(1);
                        }
                        &.ngActive {
                            @include sexy-flex();
                            /*display:block;*/
                        }
                    }

                }
                &.identificationText {
                    padding-left: 0.2rem;
                    padding-right: 0.2rem;
                    .base {
                        padding-left: 0.2rem;
                    }
                    .num .info {
                        padding: 0;
                    }
                }

            }

            border-bottom: 1px solid #e0e0e0;
            .identification {
                .base {
                    justify-content: space-between;
                    padding-right: 0.2rem;
                    .fillWrap {
                        /*width:2.5rem;*/
                        @include sexy-flex();
                        justify-content: flex-end;
                        p {
                            label, input {
                                vertical-align: middle;
                                margin-left: 0.1rem;
                            }
                        }
                        .none {
                            margin-left: 0.5rem;
                        }

                    }
                    padding-left: 0.2rem;
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

