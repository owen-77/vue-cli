<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" round @click="showAddDialog"
        >添加分类</el-button
      >
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: limegreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: res;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
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
            @click="delCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="+queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="+total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="isAddDialog"
      width="50%"
      center
      @close="closeAddDialog"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRule"
        label-width="80px"
      >
        <el-form-item prop="cat_name" label="分类名称">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="selectProps"
            @change="selectChange"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDialog = false" round>取 消</el-button>
        <el-button type="primary" @click="addCate" round>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改分类"
      :visible.sync="isEditDialog"
      width="50%"
      center
      @close="closeEditDialog"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRule"
        label-width="80px"
      >
        <el-form-item prop="cat_name" label="分类名称">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialog = false" round>取 消</el-button>
        <el-button type="primary" @click="editCate" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  cateListApi,
  addCateApi,
  editCateApi,
  getCateApi,
  delCateApi
} from '@/api'
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: '3',
        pagenum: '1',
        pagesize: '4'
      },
      total: '',
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          width: 200
        }
      ],
      isAddDialog: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectKeys: [],
      isEditDialog: false,
      editForm: {},
      editFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateIndexs: []
    }
  },
  methods: {
    async init() {
      const { data: res } = await cateListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateList = res.data.result
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
    async showAddDialog() {
      const { data: res } = await cateListApi({ type: 2 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.parentCateList = res.data
      this.isAddDialog = true
    },
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
      this.selectKeys = ''
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await addCateApi(this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.init()
        this.isAddDialog = false
        this.$message.success('添加成功！')
      })
    },
    selectChange(val) {
      if (val.length) {
        this.addForm.cat_pid = val[val.length - 1]
        this.addForm.cat_level = val.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    async showEditDialog(cateInfo) {
      this.editCateIndexs = []
      const { data: res } = await getCateApi(cateInfo.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.editForm = res.data
      this.isEditDialog = true
    },
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editCateApi({
          id: this.editForm.cat_id,
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        // this.getCate(this.cateList, res.data.cat_id)
        this.init()
        this.isEditDialog = false
        this.$message.success('修改成功！')
      })
    },
    /* getCate(arr, id) {
      arr.map(async (item, index) => {
        if (item.cat_id === id) {
          this.editCateIndexs.unshift(index)
          if (item.cat_level !== 0) {
            this.getCate(this.cateList, item.cat_pid)
          } else {
            let indexs = this.editCateIndexs
            const { data: res } = await cateListApi(this.queryInfo)
            if (indexs.length === 1) {
              this.$set(this.cateList, indexs[0], res.data.result[indexs[0]])
            } else if (indexs.length === 2) {
              console.log(this.cateList[indexs[0]].children[indexs[1]])
              this.$set(
                this.cateList[indexs[0]].children[indexs[1]],
                'cat_name',
                res.data.result[indexs[0]].children[indexs[1]].cat_name
              )
            } else {
              this.$set(this.cateList[indexs[0]][indexs[1]], indexs[2], res.data.result[indexs[0]][indexs[1]])
            }
          }
        }
        if (item.children && item.cat_id !== id) {
          this.getCate(item.children, id)
        }
      })
    }, */
    async delCate(cateInfo) {
      const delResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (delResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await delCateApi({ id: cateInfo.cat_id })
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.init()
      this.$message.success('删除成功！')
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
