<template>
    <div class="wxInfo">
        <van-cell title="头像" @click="updateAvator">
            <template #right-icon>
                <img src="info.imageurl" v-if="info.imageurl" />
                <van-icon v-else name="user-circle-o" size="35" />
                <van-icon name="arrow" />
            </template>
        </van-cell>
        <van-cell title="姓名" :value="info.name" />
        <van-cell title="绑定手机号码" :value="info.mobile" />
        <van-cell title="绑定邮箱" :value="info.email" />
        <van-cell title="单位" :value="info.workunit" />
        <van-cell title="部门" :value="info.deptname" />
        <van-cell title="工号/学号" :value="info.code" />
    </div>
</template>


<script>
import methods from "../../methods";
export default {
    name: "wxInfo",
    data() {
        return {
            info: {
                imageurl: "",
                name: "",
                mobile: "",
                email: "",
                workunit: "",
                deptname: "",
                code: ""
            }
        };
    },
    created() {
        this.getInfo()
    },
    methods: {
        ...methods,
        updateAvator() {
            this.invokeNative("TakeAndUploadPhoto", { count: 1, currentImg: 0, imgMax: 1 }, this.geturl);
        },
        geturl(data) {
            let self = this
            let me = JSON.parse(data);
            let avator = "";
            if (me.data instanceof Array) {
                avator = me.data[0].uri
            } else {
                avator = me.data.uri
            }
            console.log(avator)
            self.post("/user/uploaduserphoto", {
                command: "user/uploaduserphoto",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                uid: $.cookie('uid'),
                photourl: avator
            }).done(res => {
                console.log(res)
                self.getInfo()
            })
        },
        getInfo() {
            let self = this
            self.post("/user/queryuserdetail", {
                command: "user/queryuserdetail",
                loginid: $.cookie("uid"),
                sessionid: $.cookie("sid"),
                uid: $.cookie("uid"),
            }).done(res => {
                this.info = res.users[0]
            })
        }
    },
};
</script>

<style lang="scss">
.wxInfo {
    .van-cell {
        height: 60px;
        align-items: center;
    }
}
</style>