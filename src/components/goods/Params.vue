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
            @click="showAddDialog"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" @click="getCateParams">
          <el-button
            type="primary"
            size="mini"
            round
            :disabled="isAddBtn"
            @click="showAddDialog"
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
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" round
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" round
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="onlyTableData" border stripe v-else>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" round
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" round
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="addDialogTitle"
      :visible.sync="isAddDialog"
      width="50%"
      @close="closeAddDialog"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="isAddDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { cateListApi, cateParamsApi } from '@/api'
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
      isAddDialog: false
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
      if (val.length) {
        this.getCateParams()
      } else {
        this.onlyTableData = []
        this.manyTableData = []
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
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showAddDialog() {
      this.isAddDialog = true
    },
    closeAddDialog() {}
  },
  computed: {
    isAddBtn() {
      return this.selectKeys.length ? false : true
    },
    cateId() {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    },
    addDialogTitle() {
      return this.activeName === 'many' ? '添加动态参数' : '添加静态属性'
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
</style>
