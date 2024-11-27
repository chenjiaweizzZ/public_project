<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科小结
            <div slot="headerRight">
                <button v-if="role == 0 && !disabled" style="font-size:0.3rem"
                    @click="submit_Stu">提交</button>
                <button v-if="role == 1 && !telDisabled" style="font-size:0.3rem"
                    @click="submit_Tea">提交</button>
                <button v-if="role == 2 && !directorDisabled" style="font-size:0.3rem"
                    @click="submit_Director">提交</button>
            </div>
        </c-header>
        <div class="g-main" id="sign-box">
            <div class="stu-info-box">
                <ul>
                    <li>
                        <span>姓名:</span>
                        <span>{{infoData.username}}</span>
                    </li>
                    <li>
                        <span>年级:</span>
                        <span>{{infoData.turngrade}}</span>
                    </li>
                    <li>
                        <span>基地:</span>
                        <span>{{infoData.base}}</span>
                    </li>
                    <li>
                        <span>轮转周期:</span>
                        <span>{{infoData.turnRealtime}}</span>
                    </li>
                    <li>
                        <span>教学活动次数:</span>
                        <span>{{infoData.teachingActionCount}}</span>
                    </li>
                    <li>
                        <span>出勤率:</span>
                        <span>{{infoData.attendanceRate}}</span>
                    </li>
                    <li>
                        <span>岗位胜任力评价得分:</span>
                        <span>{{infoData.stdScore | formatData}}</span>
                    </li>
                    <li>
                        <span>出科考核:</span>
                        <div class="score-box">
                            <div class="score-item" v-for="(item, index) in infoData.turnscoreList" :key="index">
                                <span>综合- {{item.theoryScore}}</span>
                                <span>技能- {{item.skillScore}}</span>
                                <span>理论- {{item.compreScore}}</span>
                                <span>病历- {{item.bigCaseScore}}</span>
                            </div>
                        </div>

                    </li>
                    <li>
                        <span>轮转手册完成进度:</span>
                        <span>{{infoData.turnManualRate}}</span>
                    </li>
                </ul>
            </div>
            <div class="stu-summary-box">
                <div class="title">个人小结:</div>
                <van-cell-group class="boxs">
                    <van-field v-model.trim="infoData.stdAppraise" :disabled="disabled" label="" type="textarea"
                        :placeholder="message" rows="8" maxlength="1000" autosize @focus="onFocus" @blur="onBlurs" />
                </van-cell-group>
                <div class="sign-box" v-if="infoData.phase >= 0">
                    <span>{{infoData.stdname}}</span>
                    <span>{{infoData.stdDate}}</span>
                </div>
            </div>
            <div class="tea-summary-box" v-if="infoData.phase > 0 || role == 1">
                <div class="title">带教评语:</div>
                <van-cell-group class="boxs">
                    <van-field v-model="infoData.tecAppraise" :disabled="telDisabled" label="" type="textarea"
                        placeholder="请输入带教评语" rows="8" maxlength="1000" autosize @focus="onFocus" @blur="onBlurs" />
                </van-cell-group>
                <!-- <img class="img-signature" :src="infoData.tecsignature"> -->
                <div class="sign-box" v-if="infoData.phase > 0">
                    <span>{{infoData.tecname}}</span>
                    <span>{{infoData.tecDate}}</span>
                </div>
            </div>
            <div class="director-summary-box" v-if="infoData.phase > 1 || role == 2">
                <div class="top-box">
                    <div>出科鉴定意见：</div>
                    <div class="radio-box">
                        <template v-if="infoData.isSubmit == 0">
                            <van-radio-group v-model="radio">
                                <van-radio v-if="radio == 1" name="1" checked-color="#3499db">同意出科</van-radio>
                                <van-radio v-if="radio == 0" name="0" checked-color="#3499db">不同意出科</van-radio>
                            </van-radio-group>
                        </template>
                        <template v-else>
                            <van-radio-group v-model="radio" :disabled="directorDisabled">
                                <van-radio name="1" checked-color="#3499db">同意出科</van-radio>
                                <van-radio name="0" checked-color="#3499db">不同意出科</van-radio>
                            </van-radio-group>
                        </template>
                    </div>
                </div>
                <van-cell-group class="boxs">
                    <van-field v-model="infoData.directorAppraise" :disabled="directorDisabled" label="" type="textarea"
                        placeholder="请输入出科评语" rows="8" maxlength="1000" autosize @focus="onFocus" @blur="onBlurs" />
                </van-cell-group>
                <!-- <img class="img-signature" :src="infoData.directorsignature"> -->
                <div class="sign-box" v-if="infoData.phase > 1">
                    <span>{{infoData.directorname}}</span>
                    <span>{{infoData.directorDate}}</span>
                </div>
            </div>
        </div>

        <!-- 提交签名 -->
        <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
            <div v-show="signBoxShow" class="g-wrapper signature-box">
                <c-header>
                    <div slot="headerLeft">
                        <a @click="signBoxShow = false" class="header-back-btn">
                            <img src="../../assets/images/icon_fanhui.png" />
                        </a>
                    </div>
                    签名
                    <div slot="headerRight">
                        <button class="header-button" style="font-size:0.3rem" @click="submit_sign">提交</button>
                    </div>
                </c-header>
                <div class="g-main">
                    <div class="signature-c">
                        <p @click="signatureFn" class="sign-p">此处签名</p>
                        <div id="canvas" ref="canvas">
                        </div>
                    </div>
                    <div class="signature-btn">
                        <button id="clearCanvas" ref="clearCanvas" style="margin-left:0.2rem">清除签名</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '@/methods'
    import { mapState, mapActions } from 'vuex'
    import cHeader from '@/views/header'
    export default {
        data() {
            return {
                // 签名
                isSign: false,
                signSrc: '',
                //
                radio: '',
                signBoxShow: false,
                plandetailid: '',
                turnid: '',
                role: '', // 0学生 1老师 2科主任
                infoData: '', // phase 0学生填写 1老师填写 2科主任鉴定
                disabled: false,
                telDisabled: false,
                directorDisabled: false,
                message: '个人小结：（结合培训细则对医德医风、组织纪律、服务态度及质量，理论学习、管理病床数，学习的病种、所参加的手术、技术操作、查房时的表现等方面进行小结）'
            }
        },
        components: {
            cHeader,
        },
        filters: {
            // 综合
            compreScore(val) {
                if (val) {
                    return '综合-' + parseInt(val);
                }
                return '综合-';
            },
            // 技能
            skillScore(val) {
                if (val) {
                    return '技能-' + parseInt(val);
                }
                return '技能-';

            },
            // 理论
            theoryScore(val) {
                if (val) {
                    return '理论-' + parseInt(val);
                }
                return '理论-';
            },
            caseScore(val) {
                if (val) {
                    return '病历-' + parseInt(val);
                }
                return '病历-';
            },
            formatData(val) {
                if (val) {
                    return parseFloat(val).toFixed(2);
                }
                return val;
            }
        },
        computed: {
            ...mapState([
                'turninfo',
                'turnManual'
            ]),
        },
        methods: {
            ...methods,
            ...mapActions([
                'showConfirm',
            ]),
            onFocus() {
                $('.g-main').css('padding-bottom', '6rem')
            },
            onBlurs() {
                $('.g-main').css('padding-bottom', '0')
            },
            // 学生提交
            submit_Stu() {
                if (this.infoData.stdAppraise) {
                    this.submitComment(this.infoData.id, '', 0, this.plandetailid, this.infoData.stdAppraise, '', '', '');
                } else {
                    this.$toast('个人小结不能为空!');
                }
            },
            // 教师提交
            submit_Tea() {
                // if (this.infoData.phase == 1) {
                    this.showConfirm({
                        title: '温馨提示',
                        // msg: '是否需要重新签名后提交？',
                        msg: '是否确认提交?',
                        theme: 'modal-confirm modal-white',
                        cancelLabel: '直接提交',
                        okLabel: '取消',
                        cancel: () => {
                            this.submitComment(this.infoData.id, '', 1, this.plandetailid, this.infoData.tecAppraise, '', this.infoData.tecsignature, '');
                        },
                        ok: () => {
                            // this.toCanvas();
                        },
                    })
                // } else {
                //     this.toCanvas();
                // }
            },

            // 科主任提交
            submit_Director() {
                // if (this.infoData.phase == 2) {
                    this.showConfirm({
                        title: '温馨提示',
                        // msg: '是否需要重新签名后提交？',
                        msg: '是否确认提交?',
                        theme: 'modal-confirm modal-white',
                        cancelLabel: '直接提交',
                        // okLabel: '重新签名',
                        okLabel: '取消',
                        cancel: () => {
                            this.submitComment(this.infoData.id, $.cookie('uid'), 2, this.plandetailid, this.infoData.directorAppraise, this.radio, '', this.infoData.directorsignature);
                        },
                        ok: () => {
                            // this.toCanvas();
                        },
                    })
                // } else {
                //     this.toCanvas();
                // }
            },

            // 教师,科主任 签名后提交
            submit_sign() {
                if (this.isSign && this.role == 1) {
                    this.submitComment(this.infoData.id, '', 1, this.plandetailid, this.infoData.tecAppraise, '', this.signSrc, '');
                } else if (this.isSign && this.role == 2) {
                    this.submitComment(this.infoData.id, $.cookie('uid'), 2, this.plandetailid, this.infoData.directorAppraise, this.radio, '', this.signSrc);
                } else {
                    this.$toast('请签名后提交');
                }
            },

            // 提交评语
            submitComment(id, uid, roleId, detailId, evaluationInfo, status, tecsignature, directorsignature) {
                let option = {
                    id: id, // 新增不传,修改传id
                    uid: uid, // 科主任ID, 有则传
                    roleId: roleId, // 0学生 1老师 2科主任
                    detailId: detailId,
                    evaluationInfo: evaluationInfo,
                    status: status, // 出科鉴定通过状态 0否 1是 科主任填写传
                    tecsignature: tecsignature, // 教室签名图
                    directorsignature: directorsignature, // 科主任签名图
                }
                // 新增无ID不传
                if (!id) {
                    delete option.id
                }
                return new Promise((resolve, reject) => {
                    this.post('/turnAppraise/addTurnAppraise', {
                        command: 'turnAppraise/addTurnAppraise',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        ...option
                    }).done(data => {
                        if (data && data.errcode == 0) {
                            this.signBoxShow = false;
                            this.$toast('提交成功!');
                            // this.getPersonalInfo();
                            resolve(data);
                            // 回退
                            setTimeout(() => {
                                this.$router.go(-1);
                            }, 500);
                        }else {
                            this.$toast(data.errdesc);
                        }
                    }).fail(error => {
                        reject(error);
                    })
                })
            },

            // 绘制canvas
            toCanvas() {
                if (this.role == 1) {
                    this.signBoxShow = true;
                    this.$nextTick(() => {
                        this.lineCanvas({
                            el: this.$refs.canvas,//绘制canvas的父级div
                            clearEl: this.$refs.clearCanvas,//清除按钮
                            saveEl: this.$refs.saveCanvas,//保存按钮
                        })
                    });
                } else if (this.role == 2 && this.radio) {
                    this.signBoxShow = true;
                    this.$nextTick(() => {
                        this.lineCanvas({
                            el: this.$refs.canvas,//绘制canvas的父级div
                            clearEl: this.$refs.clearCanvas,//清除按钮
                            saveEl: this.$refs.saveCanvas,//保存按钮
                        })
                    });
                } else {
                    this.$toast('请选择是否同意该学生出科');
                }
            },

            // 签名
            lineCanvas(obj) {
                this.linewidth = 1;
                this.color = "#000000";
                this.background = "#ffffff";
                for (var i in obj) {
                    this[i] = obj[i];
                };
                if (!this.canvas) {
                    this.canvas = document.createElement("canvas");
                    this.el.appendChild(this.canvas);
                    this.cxt = this.canvas.getContext("2d");
                    this.canvas.width = this.el.clientWidth;
                    this.canvas.height = this.el.clientHeight - 10;
                    this.cxt.fillStyle = this.background;
                    this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
                    this.cxt.strokeStyle = this.color;
                    this.cxt.lineWidth = this.linewidth;
                    this.cxt.lineCap = "round";
                }
                //开始绘制
                this.canvas.addEventListener("touchstart", function (e) {
                    $('.sign-p').css('display', 'none');
                    this.cxt.beginPath();
                    this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY - $('.signature-c').offset().top);
                }.bind(this), false);
                //绘制中
                this.canvas.addEventListener("touchmove", function (e) {
                    this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY - $('.signature-c').offset().top);
                    this.isSign = true;
                    this.cxt.stroke();
                }.bind(this), false);
                //结束绘制
                this.canvas.addEventListener("touchend", function () {
                    this.cxt.closePath();
                    let imgBase64 = this.canvas.toDataURL();
                    this.signSrc = imgBase64;
                    console.log(this.signSrc);
                    this.isSign = true;
                }.bind(this), false);
                //清除画布
                this.clearEl.addEventListener("click", function () {
                    this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.isSign = false;
                }.bind(this), false);
            },

            signatureFn() {
                $(".sign-p").html('');
            },

            // 查询个人信息
            getPersonalInfo(turnId) {
                this.post('/turnAppraise/queryTurnAppraise', {
                    command: 'turnAppraise/queryTurnAppraise',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    turnId: turnId,
                    roleId: this.role,
                    detailId: this.plandetailid,
                }).done(data => {
                    if (data && data.errcode == 0) {
                        this.infoData = data.result;
                        // 判断是否为学生,老师没有填写的情况下,才可以修改
                        // if (this.role == 0 && this.infoData.isSubmit == 1) {
                        //     this.disabled = false;
                        // } else {
                        //     this.disabled = true;
                        // }
                        // 判断是否为老师, 科主任没有填写的情况下,才可以修改
                        // if (this.role == 1 && this.infoData.isSubmit == 1) {
                        //     this.telDisabled = false;
                        // } else {
                        //     this.disabled = true;
                        // }
                        // 判断科主任 可以修改
                        // if (this.role == 2 && this.infoData.isSubmit == 1) {
                        //     this.directorDisabled = false;
                        // } else {
                        //     this.disabled = true;
                        // }
                        this.radio = data.result.status;
                        if(data.result.directorDate) {
                            this.disabled = true;
                            this.telDisabled = true;
                            this.directorDisabled = true;
                        }else if(data.result.tecDate) {
                            if(this.role == 1) {
                                this.disabled = true;
                                this.telDisabled = false;
                                this.directorDisabled = false;
                            }else if(this.role == 2) {
                                this.disabled = true;
                                this.telDisabled = true;
                                this.directorDisabled = false;
                            }else {
                                this.disabled = true;
                                this.telDisabled = true;
                                this.directorDisabled = true;
                            }
                        }else if(data.result.stdDate) {
                            if(this.role == 0) {
                                this.disabled = false;
                                this.telDisabled = true;
                                this.directorDisabled = true;
                            }else if(this.role == 1) {
                                this.disabled = true;
                                this.telDisabled = false;
                                this.directorDisabled = true;
                            }else {
                                this.disabled = true;
                                this.telDisabled = true;
                                this.directorDisabled = true;
                            }
                        }
                        console.log(data.result)
                        console.log(this.disabled,this.telDisabled,this.directorDisabled)
                    }
                }).fail(error => {

                })
            },
            // 获取用户基础数据
            initData() {
                return new Promise((resolve, reject) => {
                    this.post('/turn/getturndetailbyid', {
                        command: 'turn/getturndetailbyid',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        plandetailid: this.plandetailid,
                    }).done(data => {
                        resolve(data.detailinfo.turnId);
                    }).fail(data => {
                        reject(data);
                    })
                });
            },

            back() {
                // 学生端
                if (this.role == 0) {
                    this.$router.push({
                        name: 'fdRotation_doctor_exam',
                        query: {
                            type: this.turninfo.type,
                            id: this.turninfo.plandetailid,
                        }
                    })
                } else if (this.role == 1 && this.$route.query.type == 1) {
                    // 教师
                    this.$router.push({
                        name: 'fdRotation_teacher'
                    })
                } else if (this.role == 1 && this.$route.query.type == 2) {
                    this.$router.push({
                        name: 'fdRotation_teacher_history'
                    })
                } else if (this.role == 1 && !this.$route.query.type) {
                    // 从任务进来
                    // location.href = '/pages/futuredoctorapp/todo.html?view=application';
    //                 if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
    window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
                } else if (this.role == 2) {
                    // 科主任
                    this.$router.push({
                        name: 'directorAppraisal',
                    })
                }
            }
        },
        mounted() {
            this.role = this.$route.query.role;
            this.plandetailid = this.$route.query.plandetailid;

            // 获取turnId
            this.initData().then(res => {
                this.getPersonalInfo(res); // 获取个人信息
            });

            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../scss/mixin.scss';

    .focusState {
        position: absolute;
    }

    .g-main {
        background: #fff !important;
    }

    .stu-summary-box {
        margin: torem(12px) 0 torem(10px) 0;
    }

    .title {
        background: #F2F2F2;
        height: torem(36px);
        line-height: torem(36px);
        font-size: torem(14px);
        padding-left: .1rem;
    }

    .boxs /deep/ textarea {
        color: #323233;
    }

    .boxs /deep/ .van-field__label {
        max-width: 0 !important;
    }

    .sign-box {
        border-top: 1px solid #C9CACA;
        text-align: right;
        padding: .1rem .2rem 0 0;
    }

    .stu-info-box {
        margin: .1rem 0 0 0;
    }

    .stu-info-box ul li>span:first-child {
        width: torem(150px);
        text-align: right;
        margin-right: torem(10px);
    }

    .stu-info-box ul li {
        display: flex;
        align-items: flex-start;
        padding: .05rem 0;
    }

    .score-item {
        display: flex;
        align-items: center;
    }

    .score-item span {
        padding: torem(2px) torem(4px);
    }

    .tea-summary-box {
        margin-bottom: .1rem;
    }

    .director-summary-box {
        border-top: 1px solid #C9CACA;
    }

    .top-box {
        display: flex;
        align-items: center;
        padding: .1rem 0 .1rem .1rem;
    }

    .radio-box /deep/ .van-radio-group {
        display: flex;
        align-items: center;
    }

    .radio-box /deep/ .van-radio {
        margin: 0 .1rem;
    }

    .director-summary-box {
        padding-bottom: .1rem;
    }

    /* 签名弹框 */
    .signature-box {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: #f8f8f8;
        z-index: 999;
    }

    .signature-c {
        height: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.5rem;
        position: relative;
    }

    .sign-p {
        position: absolute;
        margin: auto;
        z-index: 10;
        opacity: 0.3;
    }

    .signature-btn {
        position: absolute;
        bottom: .2rem;
        right: .2rem;
    }

    .signature-btn button {
        padding: 0.1rem;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #3499db;
        color: #3499db;
        border-radius: 5px;
    }

    .img-signature {
        width: 40%;
        margin: 0 auto;
        display: flex;
        height: auto;
    }

    .header-button {
        columns: #fff;
    }

    #canvas {
        width: 100%;
        height: 100%;
        position: relative;
    }

    #canvas canvas {
        display: block;
    }
</style>