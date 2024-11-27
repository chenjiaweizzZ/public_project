<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考核
            <div slot="headerRight">
                <button style="font-size:0.3rem" @click="createActivity" v-if="roleAuthority['app:outDeptTest']">创建</button>
            </div>
        </c-header>
        <div class="g-main">
            <van-tabs class="reset" :active="vantactive">
                <van-tab title="待考核">
                    <van-pull-refresh v-model="list[0].refreshing" @refresh="onRefresh(0)">
                        <van-list v-model="list[0].loading" :finished="list[0].finished" :loading-text="text" @load="onLoad(0)">
                            <div class="list-wrap" v-for="(item,key) in list[0].items" :key="key+1">
                                <div class="h3">{{item.examTypeName}}</div>
                                <div class="wrap-c">
                                    <ul @click="extranceDetail(item)">
                                        <li>
                                            <div class="tit">科室：</div>
                                            <div>{{ deptnameString(item.deptIdNameVoList) }}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核项目：</div>
                                            <div>{{item.turnExamItem}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考官：</div>
                                            <div>{{item.turnExamTeachers}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核学员：</div>
                                            <div>{{item.studentCount}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核时间：</div>
                                            <div>{{item.turnTime}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核地点：</div>
                                            <div>{{item.place}}</div>
                                        </li>
                                    </ul>
                                    <div class="action">
                                        <button class="edit" @click.stop="editCreate(item,item.editFlag)" v-if="isOwn(item.createUid) && roleAuthority['app:outDeptTest']">编辑</button>
                                        <!-- <button class="edit" @click.stop="editCreate(item,item.editFlag)" v-if="item.editFlag!=0 && roleAuthority['app:outDeptTest']">编辑</button> -->
                                        <button class="delete" @click.stop="deleteCreate(item,0,key)" v-if="isOwn(item.createUid) && item.deleteFlag==1">删除</button>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>

                <van-tab title="已考核">
                    <van-pull-refresh v-model="list[1].refreshing" @refresh="onRefresh(1)">
                        <van-list v-model="list[1].loading" :finished="list[1].finished" :error.sync="list[1].error" @load="onLoad(1)">
                            <div class="list-wrap" v-for="item in list[1].items">
                                <div class="h3">{{item.examTypeName}}</div>
                                <div class="wrap-c">
                                    <ul @click="extranceDetail(item,true)">
                                        <li>
                                            <div class="tit">科室：</div>
                                            <div>{{ deptnameString(item.deptIdNameVoList) }}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核项目：</div>
                                            <div>{{item.turnExamItem}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考官：</div>
                                            <div>{{item.turnExamTeachers}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核学员：</div>
                                            <div>{{item.studentCount}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核时间：</div>
                                            <div>{{item.turnTime}}</div>
                                        </li>
                                        <li>
                                            <div class="tit">考核地点：</div>
                                            <div>{{item.place}}</div>
                                        </li>
                                    </ul>
                                    <div class="action">
                                        <button class="edit" @click.stop="editCreate(item,item.editFlag)" v-if="isOwn(item.createUid) && roleAuthority['app:outDeptTest']">编辑</button>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import cHeader from '@/views/header'
    import cTab from '@/components/tab'
    import cTabs from '@/components/tabs'
    import methods from '@/methods'
    import { mapState, mapActions } from 'vuex'
    let bus = new Vue()
    export default {
        name: 'list',
        components: {
            cHeader,
            cTab,
            cTabs,
        },
        data() {
            return {
                bus: bus,
                vantactive: 0,
                count: 0,
                type: 1,
                iscreate: false,
                userRole: '',
                text: '加载中',
                list: [{
                    items: [],
                    refreshing: false,
                    loading: false,
                    error: false,
                    finished: false,
                    pagenum: 0,
                }, {
                    items: [],
                    refreshing: false,
                    loading: false,
                    error: false,
                    finished: false,
                    pagenum: 0
                }]
            }
        },
        mounted() {
            this.getRoleAuthority(["app:outDeptTest"])
            this.registerToNative('goBack', function (data) {
                self.back()
            });
            // this.initLevel();
            if (sessionStorage.getItem('vantactive') != null) {
                this.vantactive = sessionStorage.getItem('vantactive');
            } else {
                this.vantactive = 0;
            }

        },
        computed: {
            ...mapState(["roleAuthority"]),
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                "getRoleAuthority"
            ]),
            deptnameString(list) {
                return list.map(i => i.deptName).join("、")
            },
            isOwn(createUid) {
                if(createUid == $.cookie("uid")) {
                    return true
                }else {
                    return false
                }
            },
            // //创建权限
            // initLevel(){
            //     this.post('/turnExamInfo/getturnexamlevel',{
            //         command: 'turnExamInfo/getturnexamlevel',
            //         sessionid:$.cookie('sid'),
            //         loginid:$.cookie('uid'),
            //         uid:$.cookie('uid'),
            //     }).done(res => {
            //         if(res.errcode==0){
            //             let data=res.turnexamlevellist;
            //             for(let i=0;i<data.length;i++){
            //                 if(data[i].levelvalue===1){
            //                     this.iscreate=true;
            //                     break;
            //                 }else{
            //                     this.iscreate=false;
            //                 }
            //             }
            //         }else{
            //             this.$toast(res.errdesc);
            //         }
            //     })
            // },
            deleteCreate(item, index, key) {
                let self = this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: '确定删除此出科考核？',
                    theme: 'modal-confirm modal-whte',
                    cancel: function () { },
                    ok: function () {
                        self.list[index].loading = true;
                        self.text = '正在删除';
                        self.post('/turnExamInfo/deleteturnexam', {
                            command: 'turnExamInfo/deleteturnexam',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            id: item.id
                        }).done(res => {
                            if (res.errcode == 0) {
                                self.getInfo(self.list[index], index).then((data) => {
                                    self.list[index].loading = false;
                                    self.list[index].items.splice(key, 1)
                                });
                            } else {
                                self.$toast(res.errdesc);
                            }
                        })
                    },
                })
            },
            editCreate(item, flag) {
                this.$router.push({
                    // path: '/extranceExam/create',
                    name: 'extranceExamcreate',
                    query: {
                        id: item.id,
                        editflag: flag
                    }
                })
            },
            back() {
                // window.location.href = '/pages/futuredoctorapp/todo.html?view=application';
                window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
    //             if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
            },
            // 查看出科考核详情
            extranceDetail(item, sign) {
                sessionStorage.setItem('vantactive', this.vantactive);
                this.$router.push({
                    // path: '/extranceExam/examiner',
                    name: 'examiner',
                    query: {
                        id: item.id,
                        info: JSON.stringify(item),
                        key: item.key,
                        editflag: item.editFlag,
                        endtime: item.endTime,
                        starttime: item.startTime,
                        examfinished: sign
                    }
                })
            },
            changeTab(tab) {
                this.type = tab.data;
                sessionStorage.setItem('urlFrom', this.type);
                if (Number(this.type) !== 1) {
                    this.showEvaluate = false;
                } else {
                    this.showEvaluate = true;
                }
            },
            onRefresh(index) {
                console.log(index)
                const list = this.list[index];
                list.pagenum = 1;
                list.refreshing = true;
                this.getInfo(list, index).then(data => {
                    console.log(data)
                    console.log(list)
                    if (list.refreshing) {
                        list.refreshing = false;
                        list.items = data.beanlist;
                        this.userRole = data.userRole;
                    }
                });
            },
            getInfo(list, index) {
                list.loading = true;
                return new Promise((resolve, reject) => {
                    this.post('/turnExamInfo/queryTurnExamListByRole', {
                        command: "turnExamInfo/queryTurnExamListByRole",
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        status: index,
                        pagesize: 10,
                        pagenum: list.pagenum
                    }).done(data => {
                        console.log(data)
                        if (data.errcode == 0) {
                            console.log(data)
                            if(data.beanlist) {
                              resolve(data);//请求成功
                                list.loading = false;  
                            }else {
                                list.loading = false;  
                                list.finished = true;
                                return
                            }
                            
                        }

                    })
                })

            },
            createActivity() {
                this.$router.push({ 
                    name: 'extranceExamcreate',
                     query: {} })
            },
            onLoad(index) {
                console.log("13141414",index)
                const list = this.list[index];
                this.vantactive = index;
                list.pagenum++;
                list.loading = true;
                this.getInfo(list, index).then(data => {
                    console.log(data)
                    if (list.loading) {
                        list.loading = false;
                    }
                    if (data.beanlist.length < 10 || data.beanlist == null) {
                        list.finished = true;
                    }
                    list.items = list.items.concat(data.beanlist);
                });

            }
        }

    }

</script>
<style scoped lang="scss">
    @import "../../scss/resetVant.css";
    .g-main {
        font-size: 0.26rem;
        background: #f8f7f9 !important;
        color: rgb(100, 100, 100);
        padding-top: 0.76rem;
    }

    .toast-wrap {
        display: none;
    }

    /*.main{
        margin-top:0.2rem;
    }*/
    .list {
        margin-top: 0.1rem;
        padding: 0.2rem 0.3rem;
        height: 0.8rem;
        line-height: 0.8rem;
        /*font-size: 0.3rem;*/
        /*color: #333333;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*border-bottom: solid 1px rgb(230,230,230);*/

    }

    /* .list:nth-last-of-type(1) {
         border: none;
     }*/

    .list img {
        width: 0.2rem;
        height: 0.2rem;
    }

    .van-list {
        background: #fff;
        span {
            display: inline-block;
        }
        .list-wrap {
            font-size: 0.26rem;
            text-align: center;
            .h3 {
                font-size: 0.25rem;
                height: 0.6rem;
                line-height: 0.6rem;
                background: #f8f7f9;
            }
            .wrap-c {
                ul {
                    padding-top: 0.1rem;
                }
                li {
                    display: flex;
                    flex-flow: row nowrap;
                    font-size: 0.24rem;
                    line-height: 0.5rem;
                    text-align: left;
                    div {
                        line-height: 0.5rem;
                    }
                    div.tit {
                        min-width: 1.4rem;
                        text-align: right;
                    }
                }
                .action {
                    padding: 0.1rem;
                    text-align: right;
                    button {
                        display: inline-block;
                        width: 0.8rem;
                        height: 0.35rem;
                        border: 1px solid #3499db;
                        border-radius: 3px;
                        color: #3499db;
                        font-size: 0.24rem;
                        &.delete {
                            margin-left: 0.1rem
                        }
                    }
                }
            }
        }

    }
</style>

<style lang="scss">
.van-tabs__wrap {
    width: 100%;
}
</style>