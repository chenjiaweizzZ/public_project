<template>
    <div class="consult">
        <div class="consult-loading" v-if="loading"></div>
        <div class="consult-list">
            <div class="consult-list-title">请选择需要咨询的服务</div>
            <service ref="service" :orderList="orderList"></service>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import service from "../home/components/service.vue";
export default {
    name: 'consult',
    components: {
        service,
    },
    data() {
        return {
            orderList: [],
            loading: true
        }
    },
    computed: {

    },
    created() {
        this.homeConsultList()
    },
    methods: {
        ...mapActions('chat', ['getImInfo']),
        homeConsultList() {
            if (localStorage.getItem('openId') || (JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).openId)) {
                this.$apis.homeConsultList({
                    pageNo: 1,
                    pageSize: 999
                }).then(res => {
                    if (res.retData.list.length == 0) {
                        this.seek()
                    } else if (res.retData.list.length == 1) {
                        this.$refs.service.seek(res.retData.list[0])
                    } else {
                        this.orderList = res.retData.list
                        this.loading = false
                    }
                    // this.seek()
                })
            } else {
                let url = window.location.href;
                let name = window.location.href.split('/#/')[0] + '/#/transportV2?url=';
                let newUrl = name + url;
                let redirect_uri = encodeURIComponent(newUrl);
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
            }
        },
        //售前
        async seek() {
            let { retData } = await this.$apis.preSalesConsultation({})
            // let imUrl = JSON.parse(retData.imUrl);
            // this.$apis.personalReadMessageCallback({
            //     personalConsultId: retData.id
            // })
            if (!localStorage.getItem("userInfo")) {
                let openId =
                    
                    this.openId ||
                    localStorage.getItem("openId") ||
                    (localStorage.getItem("userInfo")
                        ? JSON.parse(localStorage.getItem("userInfo")).openId
                    || this.$route.query.openId
                        : "");
                let res = await this.$apis.getPatientInfo({ openId: openId });
                if (res.retData && res.retData.openId) {
                localStorage.setItem("userInfo", JSON.stringify(res.retData));
                }
            }
            let imData = await this.$apis.getIMData(retData.userId)
            let imUrl = JSON.parse(imData.retData)
            if (imUrl) {
                let userSig = imUrl.userSig;
                let roomId = retData.roomId;
                let patientId = retData.userId;
                localStorage.setItem('userId', patientId);
                localStorage.setItem('userSig', userSig);
                let consultId = retData.id;
                this.$router.push({
                    path: '/chat',
                    query: {
                        consultId,
                        serviceStatus: 0,
                        patientId,
                        patientName: JSON.parse(localStorage.getItem('userInfo')).patientName,
                        roomId,
                        preSales: 1,//1售前
                    }
                })
            }
        },

    }
}
</script>

<style lang="scss" scoped>
.consult {
    background: #949494;
    overflow: scroll;
    height: 100vh;
    display: flex;
    flex-direction: column-reverse;

    &-loading {
        background-color: #FFF;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
    }

    &-list {
        // position: fixed;
        // bottom: 0;
        // left: 0;
        // right: 0;
        background-color: #FFF;
        padding: 10px 22px;
        overflow: scroll;

        &-title {
            font-size: 17px;
            font-weight: 500;
            line-height: 28px;
            height: 28px;
            letter-spacing: 0px;
            color: #111111;
            margin-bottom: -10px;
        }

    }
}
</style>