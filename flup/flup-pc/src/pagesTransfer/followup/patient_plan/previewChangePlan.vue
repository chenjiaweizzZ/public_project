<template>
  <section class="page-wrapper">
    <preview-followup-route :mainList="routeList" :noback="true" @addRoute="adjustFollowupRoute"></preview-followup-route>
  </section>
</template>

<script>
import PreviewFollowupRoute from '../followup_rule/preview_followup_route'
export default {
  data() {
    return {
      serial_no: '',
      routeList: [],
    }
  },
  mounted() {
    this.serial_no = this.$route.query.serial_no
    this.getData()
  },
  components: {
    PreviewFollowupRoute,
  },
  methods: {
    async getData() {
      await this.$apis
        .timeconfigqueryTimeconfigListByRuleId({
          ruleId: this.serial_no,
        })
        .then((res) => {
          let promises = []
          res.forEach((element) => {
            promises.push(
              this.$apis.flupPathqueryFlupPathListNew({
                timeconfigId: element.id,
                ruleType: '1',
              })
            )
            //  this.$apis
            //     .flupPathqueryFlupPathList({
            //       timeconfigId: element.id,
            //       ruleType: "1"
            //     })
            //     .then(ele => {
            //       if (ele.generalList.length < this.routeList.length) {
            //         this.routeList = this.routeList.concat(ele.generalList);
            //       } else {
            //         this.routeList = ele.generalList.concat(this.routeList);
            //       }
            //       console.log("————————————————————", this.routeList);
            //     });
          })
          Promise.all(promises).then((res) => {
            res.forEach((element) => {
              this.routeList = this.routeList.concat(
                element.checkPathList,
                element.examPathList,
                element.generalPathList
              )
            })
            this.routeList.sort(this.sortMethod)
          })
        })
      // this.$apis
      //   .getFollowupPathListById({
      //     serial_no: this.serial_no
      //   })
      //   .then(res => {
      //     this.routeList = res;
      //     this.routeList.sort(this.sortMethod);
      //   });
    },
    sortMethod(a, b) {
      let map = {
        入院前: 1,
        入院后: 2,
        手术前: 3,
        手术后: 4,
        出院前: 5,
        出院后: 6,
      }
      let mapDay = {
        0: 1,
        1: 7,
        2: 30,
      }
      return (
        map[a.interventionBenchmark] * 1000 +
        a.interventionDay * mapDay[a.executeUnit] -
        (map[b.interventionBenchmark] * 1000 +
          b.interventionDay * mapDay[b.executeUnit])
      )
    },
    adjustFollowupRoute() {},
    goBack() {},
  },
}
</script>
