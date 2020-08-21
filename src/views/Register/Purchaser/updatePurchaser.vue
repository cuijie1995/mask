<template>
  <div class="updatePurchaser">
    <div class="top">
      <van-nav-bar title="信息修改" left-text="返回" left-arrow @click-left="$router.push('/me')"></van-nav-bar>
    </div>
    <div class="content">
      <el-form
        ref="purchaserForm"
        :model="purchaserForm"
        :rules="rules"
        label-width="95px"
        size="mini"
      >
        <el-form-item label="公司名称：" prop="gsmc">
          <el-input v-model="purchaserForm.gsmc" placeholder="个人填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件号：" prop="yyzzh">
          <el-input v-model="purchaserForm.yyzzh" placeholder="证件号"></el-input>
        </el-form-item>

        <el-form-item label="上传证件正反面：" prop="sqzs">
          <el-row>
            <div
              v-for="(item,index) in purchaserForm.sqzsFiles"
              :key="index"
              style="text-align: center;"
            >
              <el-col :span="8">
                <div class="item_img">
                  <img
                    :src="pictureserverurl+item.thumbnailpath"
                    :large="pictureserverurl+item.fildpath"
                    :preview="index"
                    preview-text="证件信息"
                    class="avatar"
                  />

                  <i class="el-icon-delete" @click="deleteImg(index)"></i>
                </div>
              </el-col>
            </div>
          </el-row>
          <el-upload
            class="upload-demo"
            ref="uploadpicture1"
            :action="uploadurl1"
            :multiple="true"
            :auto-upload="true"
            :before-upload="doUpload1"
            :on-success="onUploadSuccess1"
            :before-remove="OnBeforeRemoveUpLoad1"
            :show-file-list="true"
            :file-list="fileList"
            accept="image/*"
            name="files"
            list-type="picture"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="申请人：" prop="sqr">
          <el-input v-model="purchaserForm.sqr" placeholder="申请人"></el-input>
        </el-form-item>

        <el-form-item label="手机号：" prop="sjh">
          <el-input v-model="purchaserForm.sjh" placeholder="手机号"></el-input>
        </el-form-item>

        <el-form-item label="采购产品：" prop="ghlx">
          <el-checkbox-group v-model="limit" @change="chooseItem(limit)">
            <el-checkbox v-for="data in goodType" :key="data.Lm" :label="data.Lm"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="详细地址：" prop="xxdz">
          <el-input v-model="purchaserForm.xxdz" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="bz">
          <el-input v-model="purchaserForm.bz" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item size="large" class="next">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
let self;
export default {
  name: "updatePurchaser",
  data() {
    return {
      limit:[],
      goodType:[],
      purchaserForm: {},
      purchaserID: "",
      rules: {},
      imageUrl: "",
      imgId: "",
      fileList: [],
      userId: "",
      sqzsId: "",
      sqzsFiles: [],
      imageUrl1: [],
      uploadurl1: "",
      imgArry: []
    };
  },
  mounted() {
    self = this;
    // self.purchaserForm.sjh = localStorage.getItem("loginSjh");
    self.purchaserID = localStorage.getItem("purchaserID");
    self.getId();
    self.getGoodType();
  },
  methods: {
    getId() {
      self.$axios
        .post(self.url + "/api/User/GetPurchaserEdit?id=" + self.purchaserID)
        .then(res => {
          self.purchaserForm = res.data.data;
        
        })
        .catch(err => {
          console.log(err);
        });
      self.$axios
        .get(self.url + "/api/User/GetPurchaser")
        .then(res => {
          self.userId = localStorage.getItem("loginId");
          self.sqzsId = self.purchaserForm.sqzs;
          self.uploadurl1 =
            self.uploadurl +
            "/api/FildLoad/UpLoadFildAndZoom?userId=" +
            self.userId +
            "&relationKey=" +
            self.sqzsId;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getGoodType() {
      self.$axios
        .get(self.url + "/api/BaseData/GetGoodsType")
        .then(res => {
          self.goodType = res.data.Value.Data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    onUploadSuccess1(response, file, fileList) {
      self.sqzsFiles.push(response.filds[0]);
    },
    doUpload1(file, files) {
      self.fileuploaded = false;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpeg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "jpg";
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是jpeg、png、jpg格式!",
          type: "warning"
        });
      }

      return extension || extension2 || extension3;
    },
    OnBeforeRemoveUpLoad1(file, fileList) {
      var ress = false;

      self.sqzsFiles.forEach(item => {
        if (item.fildName == file.name) {
          ress = true;
        }
        if (ress) {
          self.sqzsFiles = self.sqzsFiles.filter(function(element, index) {
            return element["fildName"] != file.name;
          });
        }
      });

      return ress;
    },
    onSubmit() {
      if (
        self.$refs.uploadpicture1.$data.uploadFiles.length !=
        self.sqzsFiles.length
      ) {
        self.$message({
          message: "请等待图片上传完成",
          type: "success"
        });
      } else {
        self.$refs["purchaserForm"].validate(valid => {
          if (valid) {
            self.purchaserForm.kzuseroid = self.userId;
            self.purchaserForm.sqzs = self.sqzsId;
            self.purchaserForm.sqzsFiles = self.sqzsFiles.concat(
              self.purchaserForm.sqzsFiles
            );

            var token = localStorage.getItem("loginToken");
            self.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + token;

            self.$axios
              .post(self.url + "/api/User/ExamineUser", self.purchaserForm, {
                headers: {
                  "Content-Type": "application/json-patch+json"
                }
              })
              .then(res => {
                self.$message({
                  message: "信息修改成功",
                  type: "success"
                });
                self.$router.push("me");
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
      }
    },
    deleteImg(index) {
      self.purchaserForm.sqzsFiles.splice(index, 1);
    },
      chooseItem(value) {
      self.purchaserForm.ghlx = value.join(",");
    },
  }
};
</script>
<style  scoped>
.el-form {
  margin-top: 10%;
  padding-right: 5%;
  padding-left: 5%;
}
button.el-button.el-button--primary.el-button--large {
  width: 100%;
}
.title {
  color: #409eff;
}
img {
  width: 70px;
}
i {
  font-size: 14px;
}
.top {
  position: fixed;
  width: 100%;
  z-index: 10;
  top: 0;
}
.content {
  margin-top: 70px;
}
.item_img {
  position: relative;
  overflow: hidden;
}
.item_img:hover i {
  /* i { */
  display: block;
  /* } */
}
.el-icon-delete {
  /* display: none; */
  color: red;
  font-weight: 1000;
  position: absolute;
  left: 40%;
  top: 40%;
  font-size: 15px;
}
</style>>

<style>
.van-popup--top {
  top: 300px;
}
.updatePurchaser .next .el-form-item__content {
  margin-left: 0 !important;
}
.updatePurchaser label.el-form-item__label {
  font-size: 11px;
}
</style>