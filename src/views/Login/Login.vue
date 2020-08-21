<template>
  <div class="login">
    <div class="title">全球人AI供应链平台</div>
    <div class="content">
      <el-form ref="loginForm" :model="loginForm" label-width="80px" :rules="rules" size="mini">
        <el-form-item label="账号：">
          <el-input v-model="loginForm.phoneNo" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="密码：">
          <el-input v-model="loginForm.passWord" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item size="large" class="next">
          <!-- <el-button type="primary" @click="submitLogin" :disabled="disabled">登录</el-button> -->
          <el-button type="primary" @click="submitLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <a style="margin-right: 60px;" @click="goChange()">修改密码</a>
      <a style="margin-right:3%" @click="goSupplier()">供应商注册</a>
      <a @click="goPurchaser()">采购商注册</a>
    </div>

    <!-- <div>2222</div> -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        phoneNo: "",
        passWord: "",
        openid: ""
      },
      rules: {
        phoneNo: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      loginToken: "",
      loginId: "",
      loginGsmc: "",
      loginLx: "",
      loginSqr: "",
      disabled: false
    };
  },
  computed: {},
  methods: {
    submitLogin() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          let ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            // this.loginForm.openid = localStorage.getItem("openid");
          }

          alert(this.loginForm.openid)
          this.$axios
            .post(this.url + "/api/OAuth/GetToken", this.loginForm)
            .then(res => {
              if (res.data.statusCode == 0) {
                localStorage.setItem("loginToken", res.data.data.token);
                localStorage.setItem("loginId", res.data.data.user.kzuseroid);
                localStorage.setItem("loginGsmc", res.data.data.user.gsmc);
                localStorage.setItem("loginLx", res.data.data.user.lx);
                localStorage.setItem("loginSqr", res.data.data.user.sqr);
                localStorage.setItem("loginZt", res.data.data.user.zt);
                localStorage.setItem("loginSjh", res.data.data.user.sjh);
                this.$router.push("/");
              }
              if (res.data.statusCode == 9) {
                alert("登录失败!帐号或密码错误");
                this.loginForm.phoneNo == "";
                this.loginForm.passWord == "";
              }
              if (res.data.statusCode == 1) {
                // alert("res.data.statusCode111111");
                // alert(res.data.resultMsg);
                // localStorage.setItem("openid", res.data.resultMsg);
                this.loginForm.openid = res.data.resultMsg;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    getWxCode() {
      let ua = navigator.userAgent.toLowerCase();
      alert(ua)

      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        let code = this.GetQueryString("code");
        alert(code)
        this.loginForm.code = code;
        this.$axios
          .post(this.url + "/api/OAuth/GetToken", this.loginForm)
          .then(res => {
            if (res.data.statusCode == 0) {
              localStorage.setItem("loginToken", res.data.data.token);
              localStorage.setItem("loginId", res.data.data.user.kzuseroid);
              localStorage.setItem("loginGsmc", res.data.data.user.gsmc);
              localStorage.setItem("loginLx", res.data.data.user.lx);
              localStorage.setItem("loginSqr", res.data.data.user.sqr);
              localStorage.setItem("loginZt", res.data.data.user.zt);
              localStorage.setItem("loginSjh", res.data.data.user.sjh);

              this.$router.push("/");
            }

            if (res.data.statusCode == 1) {
              // localStorage.setItem("openid", res.data.resultMsg);
              this.loginForm.openid = res.data.resultMsg;
            }
            if (res.data.statusCode == 9) {
              alert("登录失败!帐号或密码错误");
              this.loginForm.phoneNo == "";
              this.loginForm.passWord == "";
            }
          })
          .catch(err => {
            console.log(err);
          });

        // 此处调用后端方法，通过 code 换取 openid
        // }
      }
    },
    GetQueryString(name) {
      let url = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let newUrl = window.location.search.substr(1).match(url);
      if (newUrl != null) {
        return unescape(newUrl[2]);
      } else {
        return false;
      }
    },
    goSupplier() {
      this.$router.push("/supplierHeader");
    },
    goPurchaser() {
      this.$router.push("/purchaserHeader");
    },
    goChange() {
      this.$router.push("changePwd");
    }
  },
  mounted() {
    this.getWxCode();
  }
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100%;
}
.title {
  text-align: center;
  padding: 30% 8% 5% 8%;
  font-size: 5vw;
}
.content {
  padding-right: 6%;
  padding-left: 3%;
}
.content .el-button {
  width: 100%;
}
.footer {
  text-align: right;
  padding-right: 3%;
}
.footer a {
  cursor: pointer;
  color: #0068d8;
}
</style>

<style>
.login .content .next .el-form-item__content {
  margin-left: 5% !important;
}
</style>