<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8" class="query-round">
          <el-input
            v-model="queryInfo.query"
            clearable
            placeholder="请输入内容"
            class="input-with-select"
            @clear="selectGoods"
          >
            <el-button
              @click="selectGoods"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="skipAddPage" round
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              round
              @click="showExidDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="+queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="+total"
        background=""
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
      center
    >
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
          autocomplete="off"
        >
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="addUser" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改商品信息"
      :visible.sync="exidDialogVisible"
      width="50%"
      @close="exidDialogClose"
      center
    >
      <span>
        <el-form
          :model="exidForm"
          :rules="exidFormRules"
          ref="exidFormRef"
          label-width="70px"
          autocomplete="off"
        >
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exidDialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="exidUser()" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userStateApi,
  addUserApi,
  findUserApi,
  exidUserApi,
  roleListApi,
  setUserRoleApi,
  goodsListApi,
  delGoodsApi
} from '@/api'
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '10'
      },
      total: '',
      addDialogVisible: false,
      exidDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {},
      exidForm: {},
      exidFormRules: {},
      roleDialog: false,
      userInfo: {},
      roleList: [],
      selectId: ''
    }
  },
  methods: {
    async init() {
      const { data: res } = await goodsListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.init()
    },
    async userStateChange(userInfo) {
      const { data: res } = await userStateApi(userInfo)
      if (res.meta.status !== 200) {
        this.$message.error('修改用户状态失败！')
        userInfo.mg_state = !userInfo.mg_state
      }
    },
    selectGoods() {
      this.queryInfo.pagenum = 1
      this.init()
    },
    skipAddPage() {
      this.$router.push('/goods/add')
    },
    addDialogClose() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addUserApi(this.addForm)
        this.addDialogVisible = false
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功！')
        this.init()
      })
    },
    async showExidDialog(userInfo) {
      const { data: res } = await findUserApi(userInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.exidForm = res.data
      this.exidDialogVisible = true
    },
    exidDialogClose() {
      this.exidDialogVisible = false
    },
    exidUser() {
      this.$refs.exidFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await exidUserApi(this.exidForm)
        this.exidDialogVisible = false
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败!')
        }
        this.$message.success('修改用户信息成功！')
        this.init()
      })
    },
    async delGoods(id) {
      const delResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await delGoodsApi(id)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.init()
    },
    async showRoleDialog(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await roleListApi()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      this.roleDialog = true
    },
    async setUserRole() {
      this.roleDialog = false
      const { data: res } = await setUserRoleApi({
        id: this.userInfo.id,
        rid: this.selectId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败！')
      }
      this.init()
      this.$message.success('修改成功！')
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="less">
.query-round {
  input.el-input__inner {
    border-radius: 20px 0 0 20px;
  }
  div.el-input-group__append {
    border-radius: 0 20px 20px 0;
  }
}
</style>
