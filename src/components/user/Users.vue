<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="+userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="+totalpage"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { userListApi } from '@/api'
export default {
  data() {
    return {
      userList: [],
      userInfo: {
        query: '',
        pagenum: '1',
        pagesize: '3'
      },
      totalpage: '',
      currentPage: 1,
      totalpage: ''
    }
  },
  methods: {
    async init() {
      const { data: res } = await userListApi(this.userInfo)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      console.log(res);
      this.userList = res.data.users
      this.totalpage = res.data.total
    },
    handleSizeChange(val) {
      this.userInfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.userInfo.pagenum = val
      this.init()
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>
