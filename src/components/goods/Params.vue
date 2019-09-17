<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意，只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row style="margin: 15px 0;">
        <el-col>
          <span>选择商品分类 :&nbsp;</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="selectProps"
            @change="selectChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many" @click="getCateParams">
          <el-button
            type="primary"
            size="mini"
            round
            :disabled="isAddBtn"
            @click="isAddDialog = true"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" @click="getCateParams">
          <el-button
            type="primary"
            size="mini"
            round
            :disabled="isAddBtn"
            @click="isAddDialog = true"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <el-table
        :data="manyTableData"
        border
        stripe
        v-if="activeName === 'many'"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              v-for="(item, i) in scope.row.attr_vals"
              :key="i"
              type="primary"
              closable
              :disable-transitions="true"
              @close="delParamsTag(i, scope.row)"
            >
              {{ item }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              round
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              round
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="delParams(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="onlyTableData" border stripe v-else>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              v-for="(item, i) in scope.row.attr_vals"
              :key="i"
              type="primary"
              closable
              :disable-transitions="true"
              @close="delParamsTag(i, scope.row)"
            >
              {{ item }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              round
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              round
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="delParams(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="`添加${addDialogTitle}`"
      :visible.sync="isAddDialog"
      width="50%"
      @closed="closeAddDialog"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`修改${addDialogTitle}`"
      :visible.sync="isEditDialog"
      width="50%"
      @closed="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  cateListApi,
  cateParamsApi,
  addParamsApi,
  findIdParamsApi,
  editParamsApi,
  delParamsApi
} from '@/api'
export default {
  data() {
    return {
      cateList: [],
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      isAddDialog: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      isEditDialog: false,
      editForm: {}
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await cateListApi()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateList = res.data
    },
    async selectChange(val) {
      if (val.length === 3) {
        this.getCateParams()
      } else {
        this.selectKeys = []
        this.onlyTableData = []
        this.manyTableData = []
        this.$message.warning('只允许设置第三级分类')
      }
    },
    tabClick(tab) {
      if (this.isAddBtn) return
      this.getCateParams()
    },
    async getCateParams() {
      const { data: res } = await cateParamsApi({
        id: this.cateId,
        sel: this.activeName
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      res.data.map(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addParamsApi({
          id: this.cateId,
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        this.isAddDialog = false
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.getCateParams()
        this.$message.success('添加成功！')
      })
    },
    async showEditDialog(paramsInfo) {
      const { data: res } = await findIdParamsApi({
        id: this.cateId,
        attrId: paramsInfo.attr_id,
        attr_sel: paramsInfo.attr_sel,
        attr_vals: paramsInfo.attr_vals
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`获取${this.addDialogTitle}数据失败`)
      }
      this.editForm = res.data
      this.isEditDialog = true
    },
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editParamsApi(this.editForm)
        this.isEditDialog = false
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.getCateParams()
        this.$message.success('更新成功！')
      })
    },
    async delParams(paramsInfo) {
      const delResult = await this.$confirm(
        `此操作将永久删除该${this.addDialogTitle}, 是否继续?`,
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
      const { data: res } = await delParamsApi(paramsInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.getCateParams()
      this.$message.success('删除成功！')
    },
    async handleInputConfirm(info) {
      const val = info.inputValue.trim()
      if (val) {
        info.attr_vals.push(val)
        const { data: res } = await editParamsApi({
          cat_id: info.cat_id,
          attr_id: info.attr_id,
          attr_name: info.attr_name,
          attr_sel: info.attr_sel,
          attr_vals: info.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) {
          info.attr_vals.pop()
          this.$message.error('添加失败！')
        } else {
          this.$message.success('添加成功！')
        }
      }
      info.inputValue = ''
      info.inputVisible = false
    },
    showInput(info) {
      info.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async delParamsTag(index, info) {
      const temp = info.attr_vals.splice(index, 1)
      const { data: res } = await editParamsApi({
        cat_id: info.cat_id,
        attr_id: info.attr_id,
        attr_name: info.attr_name,
        attr_sel: info.attr_sel,
        attr_vals: info.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        info.attr_vals.concat(temp)
        this.$message.error('删除失败！')
      } else {
        this.$message.success('删除成功！')
      }
    }
  },
  computed: {
    isAddBtn() {
      return this.selectKeys.length ? false : true
    },
    cateId() {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    },
    addDialogTitle() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  watch: {
    activeName(val) {
      if (val === 'many') {
        this.addFormRules.attr_name[0].message = '请输入参数名称'
      } else {
        this.addFormRules.attr_name[0].message = '请输入属性名称'
      }
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
  border-radius: 16px;
}

.input-new-tag {
  width: 100px;
}
</style>
