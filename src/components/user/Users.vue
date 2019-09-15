<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8" class="query-round">
          <el-input
            v-model="queryInfo.query"
            clearable
            placeholder="请输入内容"
            class="input-with-select"
            @clear="selectUsers"
          >
            <el-button
              @click="selectUsers"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog" round
            >添加用户</el-button
          >
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
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
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
              @click="delUser(scope.row.id)"
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
                round
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="+queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="+total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
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
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="addUser" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
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
          <el-form-item label="用户名" prop="username">
            <el-input v-model="exidForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="exidForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="exidForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exidDialogVisible = false" round>取 消</el-button>
        <el-button type="primary" @click="exidUser()" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialog"
      width="50%"
      @close="selectId = ''"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：<el-select v-model="selectId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userListApi,
  userStateApi,
  addUserApi,
  findUserApi,
  exidUserApi,
  delUserApi,
  roleListApi,
  setUserRoleApi
} from '@/api'
export default {
  data() {
    var validEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱地址'))
    }
    var validMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '3'
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
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 ~ 10 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 ~ 15 个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      },
      exidForm: {},
      exidFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      },
      roleDialog: false,
      userInfo: {},
      roleList: [],
      selectId: ''
    }
  },
  methods: {
    async init() {
      const { data: res } = await userListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
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
    selectUsers() {
      this.queryInfo.pagenum = 1
      this.init()
    },
    showDialog() {
      this.addDialogVisible = true
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
    async delUser(id) {
      const delResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await delUserApi(id)
      if (res.meta.status !== 200) {
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
