export default {
  computed: {
    type() {
      if (this.$route.params.type) {
        if (this.$route.params.type === 'wenjuan' || this.$route.params.type.toLowerCase() === 'dcwj' || this.$route.params.type.toLowerCase() === 'wjdc') {
          return 2
        } else {
          return 3
        }
      } else {
        return 3
      }

    },
    label() {
      if (this.$route.params.type) {
        if (this.$route.params.type === 'wenjuan' || this.$route.params.type.toLowerCase() === 'dcwj' || this.$route.params.type.toLowerCase() === 'wjdc') {
          return '问卷'
        } else {
          return '宣教'
        }
      } else {
        return '宣教'
      }
    }
  },
}