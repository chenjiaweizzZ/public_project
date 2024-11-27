<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path" class="item">
      <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
      <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
  export default {
    data() {
      return {
        levelList: null
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    created() {
      this.getBreadcrumb()
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => {
          if (item.name) {
            return true
          }
        })
        const first = matched[0];
        if (first && first.name == 'escort') {
          // matched = [{ path: '/detailsnotification', meta: { title: '首页' }}].concat(matched)
        }
        console.log(matched)
        this.levelList = matched;

      },
      pathCompile(name) {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = this.$route
        var toPath = pathToRegexp.compile(name)
        return toPath(params)
      },
      handleLink(item) {
        const { redirect, name } = item
        if (redirect) {
          this.$router.push(redirect)
          return
        }
        if (item.name == 'index') {
          this.$router.push('detailsnotification')
        } else {
          this.$router.push(this.pathCompile(name))
        }

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    margin-left: 10px;
    .item {
      line-height: 40px;
      height: 40px;
    }
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>