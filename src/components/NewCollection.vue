<template>
    <el-container>
      <el-header>
        <nav-component/>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="11" :offset="7">
            <div>
              <h3 class="title">新建专题</h3>
              <table>
                <tbody class="base">
                  <tr>
                    <td>
                      <div class="avatar-collection">
                        <el-upload
                          class="avatar-uploader"
                          action="/api/topic/uploadImg"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess">
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon">上传封面</i>
                        </el-upload>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="setting-title">名称</td>
                    <td class="setting-content">
                      <el-input placeholder="填写名称，不超过50字" v-model="title"></el-input>
                    </td>
                  </tr>
                  <tr>
                    <td class="setting-title">描述</td>
                    <td class="setting-content">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows:5, maxRows: 6}"
                        placeholder="请填写描述"
                        v-model="description">
                      </el-input>
                    </td>
                  </tr>
                  <tr>
                    <td class="setting-title setting-other">是否允许投稿</td>
                    <td class="setting-content">
                      <el-radio v-model="isSubmit" :label="true">允许</el-radio>
                      <el-radio v-model="isSubmit" :label="false">不允许</el-radio>
                    </td>
                  </tr>
                  <tr>
                    <td class="setting-title setting-other">投稿是否需要审核</td>
                    <td class="setting-content">
                      <el-radio v-model="isVerify" :label="true">需要</el-radio>
                      <el-radio v-model="isVerify" :label="false">不需要</el-radio>
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-button class="create" type="success" round @click="create">创建专题</el-button>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
</template>

<script>
import NavComponent from './common/Nav'
export default {
  name: 'NewCollection',
  components: {
    NavComponent
  },
  data () {
    return {
      imageUrl: '',
      title: '',
      description: '',
      isSubmit: true,
      isVerify: true
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = res.data
    },
    create () {
      let _this = this
      this.axios.post('/api/topic', {
        'headUrl': _this.imageUrl,
        'name': _this.title,
        'introduce': _this.description,
        'isSubmit': _this.isSubmit,
        'isVerify': _this.isVerify,
        'userId': localStorage.getItem('userId')
      }).then(function (res) {
        if (res.data.code === '403') {
          _this.$message({
            message: '您还未登录',
            type: 'error',
            center: true
          })
          return
        }
        if (res.data.code) {
          _this.$message({
            message: '创建成功',
            type: 'success',
            center: true
          })
          _this.$router.push({name: 'Collection', params: {id: res.data.data}})
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
  table {
    width: 100%;
  }
  .title {
    margin: 30px 0 20px;
    font-size: 21px;
    font-weight: 700;
    color: #333;
  }
  .base td {
    padding: 16px 0;
  }
  .base .setting-title {
    width: 20%;
    padding-right: 20px;
  }
  .base .setting-content {
    width: 100%;
  }
  .avatar-collection {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 15px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .create {
    margin: 20px 0 50px;
  }
</style>
