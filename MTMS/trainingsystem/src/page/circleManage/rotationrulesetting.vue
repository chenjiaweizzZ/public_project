<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" size="small" @click="addRotationSetting">添加</el-button>
            </div>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" border tooltip-effect="dark" style="width: 100%" v-loading.body="loading" :data="rulelist">
                <el-table-column prop="name" label="规则名称"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="最后操作人" prop="updatename"></el-table-column>
                <el-table-column label="最后操作时间" prop="updatetime"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.stop="editRotationSetting(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click.stop="deleteRotationSetting(scope.row.id)">删除</el-button>
                        <el-button size="small" type="text" @click.stop="detailRotationSetting(scope.row.id)">查看</el-button>
                        <el-button size="small" type="text" @click.stop="rotationCopy(scope.row.id)">复制</el-button>
                    </template>
                </el-table-column>

            </el-table>

        </div>
        <!--添加智能排轮转规则设置-->
        <rotation-setting :datalist="rotationrulesetting" :ruledetaildata="ruledetaildata" v-if="rotationrulesetting.visible" @getTurnruleList="getTurnruleList"
            :detailshow="detailshow" :rulelist="rulelist"></rotation-setting>
    </div>

</template>
<script>
    import { mapState, mapActions } from 'vuex';
    import rotationSetting from './components/rotationsetting'
    import { currentYear, getCookie, post, exportExcel } from '../../config/util'
    export default {
        data() {
            return {
                loading: false,
                arr: [],
                rulelist: [],
                addvisible: false,
                loading: false,
                ruledetaildata: {},
                detailshow: {
                    isshow: false,
                },
                rotationrulesetting: {
                    visible: false,
                    isdetail: false,
                    isedit: false,
                    title: '新增智能排轮转规则'
                }
            }
        },
        components: {
            rotationSetting
        },
        ...mapState([
            'stagecount',
        ]),
        methods: {
            ...mapActions(['initStagecount']),
            //查询规则列表
            getTurnruleList() {
                this.loading = true;
                post('/turnrule/list', {
                    command: 'turnrule/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name: ''
                }).then(res => {
                    this.loading = false;
                    if (res && res.errcode == 0) {
                        this.rulelist = res.list
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            //阶段默认配置
            getStageCount() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: 'turn_phase'
                }).then(res => {
                    if (res && res.errcode == 0) {
                        let data = res.commparaconflist;
                        this.stagecount = Number(data[0].paramvalue);
                        this.initStagecount({ k: 'stagecount', v: this.stagecount })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                })
            },
            rotationCopy(id) {
                post('/turnrule/copy', {
                    command: 'turnrule/copy',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: id
                }).then(res => {
                    if (res && res.errcode == 0) {
                        this.$message({
                            type: "success",
                            message: "复制成功"
                        })
                        this.getTurnruleList();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            cancel() {
                this.rotationrulesetting.visible = false;
            },
            addRotationSetting() {
                this.rotationrulesetting = {
                    visible: true,
                    isedit: false,
                    title: "添加 "
                }

            },
            deleteRotationSetting(id) {
                this.$confirm('确定删除此规则?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/turnrule/delete', {
                        command: 'turnrule/delete',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: id
                    }).then(res => {
                        if (res && res.errcode == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getTurnruleList();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            cancel() {
                this.addvisible = false;
            },
            detailRotationSetting(id) {
                this.rotationrulesetting = {
                    visible: true,
                    title: '智能排轮转规则详情',
                    isedit: false,
                    isdetail: true,
                    id: id
                }
                this.detailshow.isshow = false;
                post('/turnrule/detail', {
                    command: 'turnrule/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: id
                }).then(res => {
                    this.detailshow.isshow = true;
                    if (res && res.errcode == 0) {
                        this.ruledetaildata = res;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            editRotationSetting(id) {
                this.rotationrulesetting = {
                    visible: true,
                    title: '编辑智能排轮转规则',
                    isedit: true,
                    id: id
                }
                post('/turnrule/detail', {
                    command: 'turnrule/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: id
                }).then(res => {
                    if (res && res.errcode == 0) {
                        this.ruledetaildata = res;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            }
        },
        watch: {
            plandata(val) {
                console.log(val)
            },
            arr(val) {
                console.log(val)
            }
        },
        mounted() {
            this.getTurnruleList();
            this.getStageCount();
        }
    }
</script>
<style scoped lang="scss">
    .wapper {
        padding: 0 20px;
        padding-bottom: 20px;
    }

    .tools {
        margin-bottom: 15px;
    }

    .plan-box {
        width: 60%;
        margin: 0 auto;
        .enableform {
            margin-bottom: 5px;
        }
    }
</style>