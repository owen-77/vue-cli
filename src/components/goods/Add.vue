<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-steps
        class="stepFz"
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeleave"
          @tab-click="tabClick"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model.number="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model.number="addForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model.number="addForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model.number="addForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateListProp"
                @change="cateChange"
                :clearable="true"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              v-for="(item, i) in manyParamsList"
              :key="i"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cp"
                  v-for="(cp, i2) in item.attr_vals"
                  :key="i2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              v-for="(item, i) in onlyParamsList"
              :key="i"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary" round>点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">角色管理</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { cateListApi, cateParamsApi } from '@/api'
export default {
  data() {
    var validCat = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择商品分类'))
      } else if (value.length !== 3) {
        callback(new Error('只允许选择三级分类'))
      } else {
        callback()
      }
    }
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: []
      },
      addFormRule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [{ validator: validCat, trigger: 'change' }]
      },
      cateList: [],
      cateListProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyParamsList: [],
      onlyParamsList: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      fileList: []
    }
  },
  methods: {
    cateChange(keys) {},
    async getCateList() {
      const { data: res } = await cateListApi()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
    },
    beforeleave(newName, oldName) {
      /* if (oldName === '0') {
        let result = true
        this.$refs.addFormRef.validate((valid, errObj) => {
          if (!valid) {
            result = valid
            const keys = Object.keys(this.addFormRule)
            keys.some(item => {
              if (errObj[item]) {
                this.$message.error(errObj[item][0].message)
                return true
              }
            })
          }
        })
        return result
      } */
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await cateParamsApi({
          id: this.addForm.goods_cat[2],
          sel: 'many'
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败！')
        }
        res.data.map(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyParamsList = res.data
        console.log(this.manyParamsList)
      } else if (this.activeIndex === '2') {
        const { data: res } = await cateParamsApi({
          id: this.addForm.goods_cat[2],
          sel: 'only'
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败！')
        }
        this.onlyParamsList = res.data
        console.log(this.onlyParamsList)
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style>
div.stepFz .el-step__title {
  font-size: 12px;
}
</style>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
