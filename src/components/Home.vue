<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  created() {
    this.$message.closeAll()
    this.$message({
      type: 'success',
      showClose: true,
      message: '成功进入后台管理系统'
    })
  }
}
</script>

<style lang="less" scoped>
</style>
