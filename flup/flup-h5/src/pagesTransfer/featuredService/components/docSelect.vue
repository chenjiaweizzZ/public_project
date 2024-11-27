<template>
    <div class="docSelect">
        <doctor-list :docList="docList"></doctor-list>
    </div>
</template>

<script>
import doctorList from '../../featuredSearch/components/doctorList.vue'
export default {
  components: { doctorList },
    comments: {
        doctorList
    },
    data() {
        return {
            docList: []
        }
    },
    created() {
        this.getDocList()
    },
    methods: {
        getDocList(doctorName = '') {
            this.$apis.getAppointDoctorInfo({ doctorName }).then(res => {
                this.docList = res.retData || []
            })
        }
    }
}
</script>

<style scoped lang="scss">
.docSelect {
    height: calc(100vh - 88px);
    overflow: scroll;
}
</style>