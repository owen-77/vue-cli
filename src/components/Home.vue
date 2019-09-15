<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuListFlag ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenuList">|||</div>
        <el-menu
          class="home_el-menu"
          background-color="#333744"
          text-color="#808080"
          active-text-color="#409EFF"
          unique-opened
          :collapse="menuListFlag"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActivePath('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { homeMenuApi } from '@/api'
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      menuListFlag: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
      this.$router.push('/login')
    },
    async getMenuList() {
      // const { data: res } = await this.$http.get('menus')
      const { data: res } = await homeMenuApi()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleMenuList() {
      this.menuListFlag = !this.menuListFlag
    },
    saveActivePath(path) {
      window.sessionStorage.activePath = path
      this.activePath = path
    }
  },
  created() {
    this.$message.closeAll()
    this.$message({
      type: 'success',
      showClose: true,
      message: '成功进入后台管理系统'
    })
    this.getMenuList()
    this.activePath = window.sessionStorage.activePath
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  user-select: none;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    ul.home_el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  i.iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
</style>
