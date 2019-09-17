<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" round @click="addDialog = true">
          添加角色
        </el-button>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdborder-bottom', i1 === 0 ? 'bdborder-top' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              type="flex"
              align="middle"
            >
              <el-col :class="['ctel-col']" :span="5">
                <el-tag closable @close="delRight(scope.row, item1)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdborder-top']"
                  v-for="(item2, i2) in item1.children"
                  :key="i2"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6" :class="['ctel-col']">
                    <el-tag
                      type="success"
                      closable
                      @close="delRight(scope.row, item2)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      closable
                      @close="delRight(scope.row, item3)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="330px">
          <template slot-scope="scope">
            <el-button
              round
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              round
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRole(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              round
              @click="setRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogClose"
      center
    >
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
          autocomplete="off"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false" round>取 消</el-button>
        <el-button type="primary" @click="addRole" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClose"
      center
    >
      <span>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
          autocomplete="off"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false" round>取 消</el-button>
        <el-button type="primary" @click="editRole" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="rightDialog" width="50%">
      <el-tree
        :data="rightList"
        :props="treeProps"
        node-key="id"
        :default-expand-all="true"
        show-checkbox
        :default-checked-keys="defKeys"
        ref="rightTreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleListApi,
  addRoleApi,
  findRoleApi,
  editRoleApi,
  delRoleApi,
  delRightApi,
  rightListApi,
  setRightApi
} from '@/api'
export default {
  data() {
    return {
      roleList: [],
      addDialog: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editDialog: false,
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      rightDialog: false,
      rightList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    async getroleList() {
      const { data: res } = await roleListApi()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
    },
    addDialogClose() {
      this.addDialog = false
      this.$refs.addFormRef.resetFields()
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addRoleApi(this.addForm)
        this.addDialog = false
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功！')
        this.getroleList()
      })
    },
    editDialogClose() {
      this.editDialog = false
    },
    async showEditDialog(id) {
      const { data: res } = await findRoleApi(id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败！')
      }
      this.editForm = res.data
      this.editDialog = true
    },
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editRoleApi(this.editForm)
        this.editDialog = false
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败!')
        }
        this.$message.success('修改成功！')
        this.getroleList()
      })
    },
    async delRole(id) {
      const delResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await delRoleApi(id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getroleList()
    },
    async delRight(role, right) {
      const delResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await delRightApi({
        roleId: role.id,
        rightId: right.id
      })
      if (res.meta.status !== 200) {
        return this.$message.error('取消权限失败！')
      }
      role.children = res.data
      this.$message.success('取消权限成功！')
    },
    async setRightDialog(roleInfo) {
      const { data: res } = await rightListApi('tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.roleId = roleInfo.id
      this.defKeys = []
      this.rightList = res.data
      this.getDefKeys(roleInfo, this.defKeys)
      this.rightDialog = true
    },
    async setRight() {
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      this.rightDialog = false
      const { data: res } = await setRightApi({
        roleId: this.roleId,
        rids: keysStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
      this.getroleList()
      this.$message.success('更新成功！')
    },
    getDefKeys(obj, arr) {
      if (!obj.children) return arr.push(obj.id)
      obj.children.map(item => {
        this.getDefKeys(item, this.defKeys)
      })
    }
  },
  created() {
    this.getroleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
  border-radius: 16px;
}
.bdborder-top {
  border-top: 1px solid #eee;
}
.bdborder-bottom {
  border-bottom: 1px solid #eee;
}
.ctel-col {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
