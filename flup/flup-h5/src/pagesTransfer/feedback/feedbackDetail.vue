<template>
    <div class="feedback">
        <record :feedbackInfo="feedbackInfo" :imageList="imageList"></record>
    </div>
</template>

<script>
import record from "./components/record.vue"
export default {
    data() {
        return {
            feedbackInfo: {},
            imageList: []
        }
    },
    components: { record },
    created() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            let recordId = this.$route.query.recordId
            this.$apis.getFeedbackDetail(recordId).then(res => {
                this.feedbackInfo = res.retData
                let ids = []
                if (res.retData.fileIds) {
                    ids = res.retData.fileIds.split(",")
                }
                this.getImageList(ids)
                console.log("this.feedbackInfo",this.feedbackInfo)
            })
        },
        async getImageList(ids) {
            for (let i = 0; i < ids.length; i++) {
                // let blob = await this.$apis.getImageInfo(ids[i])
                // let binaryData = [];
                // binaryData.push(blob);
                // let url = window.URL.createObjectURL(new Blob(binaryData));
                // this.imageList.push(url)
                this.imageList.push(this.$baseURL.ICDMApiUrl + "/file/image/" + ids[i])
            }
        }
    }
}
</script>