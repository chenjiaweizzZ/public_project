<template>
    <div class="wapper">
        <div class="tool-box">
            <div class="func-tools">
                <el-button type="primary" @click="exportData">批量导出</el-button>
            </div>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" :data="turnDetailList" border tooltip-effect="dark" style="width: 100%" v-loading="loading">
                <el-table-column prop="deptname" label="轮转科室" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.deptname" placement="top">
                                <span>
                                    {{scope.row.deptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="planTime" label="计划轮转周期" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.planTime" placement="top">
                                <span>
                                    {{scope.row.planTime}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="realTime" label="实际轮转周期" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.realTime" placement="top">
                                <span>
                                    {{scope.row.realTime}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="teacher" label="带教老师" min-width="120"></el-table-column>
                <el-table-column prop="turnstatueName" label="科室轮转状态" min-width="80"></el-table-column>
                <el-table-column prop="outDepartState" label="是否合格" min-width="80">
                </el-table-column>
                <el-table-column prop="finishRate" label="轮转手册完成进度" min-width="100"></el-table-column>
                <el-table-column fixed="right" width="120" label="操作">
                    <template slot-scope="scope">
                        <template v-if="scope.row.turnstatus == 1 || scope.row.turnstatus == 3">
                            <el-button @click="handleInput(scope.$index, scope.row)" type="text" size="small">轮转手册填写
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { post, getCookie, exportMouldExcel, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import api from '../../config/common_data.js';
    const _ = require('lodash');
    import moment from 'moment';
    export default {
        data() {
            return {
                loading: false,
                turnDetailList: [],
                exportOptions: {},
            }
        },
        methods: {
            // 导出
            exportData() {
                let data = {
                    command: 'turnManual/turnManualStdDetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    ...this.exportOptions
                }
                exportExcel(data);
            },
            // 轮转手册填写
            handleInput(index, row) {
                this.$router.push({
                    name: 'turnManualStdWrite/writeDetail',
                    query: {
                        id: row.detailId
                    }
                });
            },

            // 查询轮转详情
            queryTurnDetail() {
                this.loading = true;
                post('/turnManual/turnManualStdDetail', {
                    command: 'turnManual/turnManualStdDetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid')
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.loading = false;
                        this.turnDetailList = data.list;
                    }
                })
            },

            handleExport(index, row) { },
        },
        mounted() {
            this.queryTurnDetail();
        }
    }
</script>

<style lang='scss' scoped>
    .wapper {
        padding: 0 20px;
    }
    .tool-box {
        margin-bottom: 16px;
    }
</style>