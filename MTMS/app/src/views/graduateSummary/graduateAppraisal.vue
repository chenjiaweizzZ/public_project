<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科鉴定
            <div slot="headerRight"></div>
        </c-header>
        <div class="g-main container">
            <van-tabs @click="onClick" class="reset-style">
                <van-tab title="待鉴定">
                    <van-pull-refresh v-model="list[0].isLoading" @refresh="onRefresh(0)">
                        <van-list v-model="list[0].loading" :loading-text="text" finished-text="没有更多了"
                            :finished="list[0].finished" @load="onLoad(0)" :offset="10">
                            <ul>
                                <li v-for="(item, index) in list[0].items" :key="index">
                                    <div class="info-box">
                                        <div class="avator-box">
                                            <div>
                                                <img src="../../assets/images/site.png" />
                                            </div>
                                            <div>
                                                <span style="padding-bottom: .1rem;">{{item.stdName}}</span>
                                                <span>{{item.grade}}</span>
                                            </div>
                                        </div>
                                        <div class="other-info-box">
                                            <span>{{item.base}}</span>
                                            <span>{{item.moblie}}</span>
                                        </div>
                                    </div>
                                    <div class="other-box">
                                        <div>
                                            <span>轮转科室:</span>
                                            <span>{{item.turnDept}}</span>
                                        </div>
                                        <div>
                                            <span>带教老师:</span>
                                            <span>{{item.tecName}}</span>
                                        </div>
                                        <div class="special-box">
                                            <div>
                                                <span>轮转周期:</span>
                                                <span>{{item.turntime}}</span>
                                            </div>
                                            <div class="special-content">
                                                <span>轮转进度:</span>
                                                <span>{{item.turnRate}}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fun-box">
                                        <a @click="goDetails(item)">出科鉴定</a>
                                    </div>
                                </li>
                            </ul>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
                <van-tab title="已鉴定">
                    <van-pull-refresh v-model="list[1].isLoading" @refresh="onRefresh(1)">
                        <van-list v-model="list[1].loading" :loading-text="text" finished-text="没有更多了"
                            :finished="list[1].finished" @load="onLoad(1)" :offset="10">
                            <ul>
                                <li v-for="(item, index) in list[1].items" :key="index">
                                    <div class="info-box">
                                        <div class="avator-box">
                                            <div>
                                                <img src="../../assets/images/site.png" />
                                            </div>
                                            <div>
                                                <span style="padding-bottom: .1rem;">{{item.stdName}}</span>
                                                <span>{{item.grade}}</span>
                                            </div>
                                        </div>
                                        <div class="other-info-box">
                                            <span>{{item.base}}</span>
                                            <span>{{item.moblie}}</span>
                                        </div>
                                    </div>
                                    <div class="other-box">
                                        <div>
                                            <span>轮转科室:</span>
                                            <span>{{item.turnDept}}</span>
                                        </div>
                                        <div>
                                            <span>带教老师:</span>
                                            <span>{{item.tecName}}</span>
                                        </div>
                                        <div class="special-box">
                                            <div>
                                                <span>轮转周期:</span>
                                                <span>{{item.turntime}}</span>
                                            </div>
                                            <div class="special-content">
                                                <span>轮转进度:</span>
                                                <span>{{item.turnRate}}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fun-box">
                                        <a @click="goDetails(item)">出科鉴定</a>
                                    </div>
                                </li>
                            </ul>
                        </van-list>
                    </van-pull-refresh>
                </van-tab>
            </van-tabs>
        </div>
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
                text: '加载中',
                searchValue: '',
                pagenum: 1,
                pagesize: 10,
                tabIndex: 0, // 0 通过  1不通过
                check: '1', // check 1待鉴定 2已鉴定
                list: [{
                    isLoading: false,
                    loading: false,
                    items: [],
                    finished: false,
                }, {
                    isLoading: false,
                    loading: false,
                    items: [],
                    finished: false,
                }],
            }
        },
        components: {
            cHeader,
        },
        computed: {
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

            // tab切换
            onClick(index) {
                const list = this.list[index];
                list.items = [];
                this.pagenum = 1;
                list.isLoading = false;
                list.finished = false;
                if (index == 0) {
                    this.tabIndex = 0;
                    this.check = 1;
                }

                if (index == 1) {
                    this.tabIndex = 1;
                    this.check = 2;
                }
            },

            // 查询鉴定列表
            queryCheckList() {
                return new Promise((resolve, reject) => {
                    this.post('/turnAppraise/queryDirectorAppraise', {
                        command: 'turnAppraise/queryDirectorAppraise',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        check: this.check, // check 0待鉴定 1已鉴定
                        // pagenum: this.pagenum,
                        // pagesize: this.pagesize,
                        pagenum: 1,
                        pagesize: 999,
                    }).done(data => {
                        if (data && data.errcode == 0) {
                            resolve(data);
                        }
                    }).fail(error => {
                        reject(error);
                    })
                });
            },

            // 刷新
            onRefresh(type) {
                const list = this.list[type];
                this.pagenum = 1;
                list.isLoading = true;
                this.queryCheckList().then(data => {
                    list.items = [];
                    this.pagenum++;
                    list.finished = false;
                    if (list.isLoading) {
                        list.isLoading = false;
                        list.items = data.list;
                    }
                })
            },
            onLoad(type) {
                // 分页判断 判断是否加载完成
                // 加载完成 finish设为true
                // 加载没完成 将loading 设为false, 到底会再次出发onload函数  page++
                this.queryCheckList().then(data => {
                    this.pagenum++;
                    const list = this.list[type];
                    list.loading = false;
                    if (list.items.length < 10) {
                        list.finished = true;
                    }
                    list.items = list.items.concat(data.list);
                });
            },
            // 进入详情
            goDetails(item) {
                this.$router.push({
                    name: 'stuSummary',
                    query: {
                        role: 2, // 0学生 1老师 2科主任
                        plandetailid: item.detailId
                    }
                })
            },

            back() {
                // window.location.href = '/pages/futuredoctorapp/todo.html?view=application';
    //             if(this.$route.query.stem) {
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
            }
        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../scss/mixin.scss';

    .g-wrapper {
        background: #fff;
    }

    .van-tabs--line {
        padding-top: 0 !important;
    }

    // .reset-style /deep/ .van-tabs__wrap {
    //     position: fixed;
    //     border-bottom: 1px solid #c9caca;
    //     top: .8rem;
    // }

    .reset-style /deep/ .van-tabs__line {
        background: #3499db;
    }

    .reset-style /deep/ .van-tab--active {
        color: #3499db;
    }

    .reset-style /deep/ .van-list {
        margin-top: .8rem;
    }

    .container {
        margin-bottom: .8rem;
        background: #fff !important;
    }

    .container ul li {
        width: 100%;
        min-height: 1rem;
        display: flex;
        flex-direction: column;
        margin-bottom: .2rem;
        font-size: 14px;
        padding: 0 torem(14px);
    }

    .info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: torem(10px);
    }

    .avator-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .avator-box img {
        width: torem(45px);
        height: torem(45px);
        background: #d9d9d9;
        /* border-radius: 50%; */
        margin-right: torem(8px);
        border: none;
    }

    .avator-box div:last-child {
        display: flex;
        flex-direction: column;
    }

    .other-info-box {
        display: flex;
        flex-direction: column;
        line-height: torem(12px);
    }

    .other-info-box span:first-child {
        padding-bottom: torem(6px);
    }

    .other-box>div {
        padding-bottom: torem(8px);
    }

    .fun-box {
        text-align: right;
        border-top: 1px solid #d9d9d9;
        padding-top: torem(8px);
    }

    .fun-box a {
        background: #3499db;
        color: white;
        padding: 0.1rem 0.05rem;
        border-radius: 0.1rem;
    }

    .special-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .special-content {
        color: #3499db;
    }
</style>