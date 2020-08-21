<template>
  <div class="index">
    <div v-if="showTime" style="width:100%;height:100%">
      <!-- <div class="time"> -->
      <!-- <span>跳过</span> -->
      <span class="time">{{time}}s</span>
      <!-- </div> -->
      <img src="../assets/首页.jpg" style="width:100%;height:100%" />
    </div>
    <div v-else style="width:100%;height:100%">
      <router-view></router-view>
      <div class="tabbar">
        <router-link class="tab-item" to="/release" active-class="is-selected">
          <div class="tab-item-icon">
            <i class="iconfont icon-releasesicon"></i>
          </div>

          <div class="tab-item-label">需求</div>
        </router-link>
        <router-link class="tab-item" to="/reach" active-class="is-selected">
          <div class="tab-item-icon">
            <i class="iconfont icon-fabu"></i>
          </div>

          <div class="tab-item-label">供应</div>
        </router-link>
        <router-link class="tab-item" to="/find" active-class="is-selected">
          <div class="tab-item-icon">
            <i class="iconfont icon-0201chazhao"></i>
          </div>

          <div class="tab-item-label">发现</div>
        </router-link>
        <router-link class="tab-item" to="/me" active-class="is-selected">
          <div class="tab-item-icon">
            <el-row>
              <el-col :span="14" style="text-align: right;">
                <i class="iconfont icon-wode"></i>
              </el-col>
              <el-col :span="8" style="padding-left: 15px;" v-if="show">
                <div class="red"></div>
              </el-col>
            </el-row>
          </div>

          <div class="tab-item-label">我</div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "index",
  data() {
    return {
      tabbarData: [
        { title: "需求", icon: "icon-releasesicon", path: "/release" },
        { title: "供应", icon: "icon-fabu", path: "/reach" },
        { title: "发现", icon: "icon-0201chazhao", path: "/find" },
        { title: "我", icon: "icon-wode", path: "/me" }
      ],
      show: false,
      userType: "",
      requestTotal: "",
      porductTotal: "",
      show: true,
      time: 5,
      showTime: false
    };
  },
  mounted() {
    if (localStorage.getItem("loginToken")) {
      this.getData();
    }

    if (localStorage.getItem("isTip") != 1) {
      this.getShow();
      setInterval(this.Time, 1000);
      this.showTime = true;
      localStorage.setItem("isTrue", this.showTime);
    }
  },
  methods: {
    getShow() {
      setTimeout(() => {
        this.showTime = false;
      }, 5000);
    },
    Time() {
      this.time--;
    },
    getData() {
      this.userType = localStorage.getItem("loginLx");
      if (this.userType == 1) {
        // 供应商
        this.getPorductTotal();
      }
      if (this.userType == 2) {
        // 采购商
        this.getRequestTotal();
      }
    },
    getRequestTotal() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios
        .get(this.url + "/api/RequestPublish/GetRequestTotal")
        .then(res => {
          this.requestTotal = res.data.data;
          if (this.requestTotal != null) {
            if (
              this.requestTotal.waitingPaymentTotal > 0 ||
              this.requestTotal.waitingDeliveryTotal > 0 ||
              this.requestTotal.alreadyDelivery > 0 ||
              this.requestTotal.waitingConfirmTotal > 0 ||
              this.requestTotal.waitingProductSubmit > 0 ||
              this.requestTotal.waitingProductConfim > 0
            ) {
              this.show = true;
            }
          }
        });
    },
    getPorductTotal() {
      var token = localStorage.getItem("loginToken");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$axios
        .get(this.url + "/api/ProductPublish/GetPorductTotal")
        .then(res => {
          this.porductTotal = res.data.data;
          if (this.porductTotal != null) {
            if (
              this.porductTotal.waitingPaymentTotal > 0 ||
              this.porductTotal.waitingDeliveryTotal > 0 ||
              this.porductTotal.alreadyDelivery > 0 ||
              this.porductTotal.waitingGroupBuy > 0 ||
              this.porductTotal.waitingProductSubmit > 0 ||
              this.porductTotal.waitingProductConfim > 0
            ) {
              this.show = true;
            }
          }
        });
    }
  }
};
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
.tabbar {
  height: 65px;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  display: flex;
  text-align: center;
}

.tab-item {
  display: block;
  padding: 7px 0;
  flex: 1;
}

.tab-item-icon {
  /* width: 24px; */
  height: 24px;
  margin: 0 auto 5px;
}

.tab-item-icon i {
  font-size: 1.4rem;
}

.tab-item-label {
  color: inherit;
  font-size: 14px;
  line-height: 1;
}

a {
  text-decoration: none;
  color: #888;
}

.is-selected {
  color: #07c160;
}
.red {
  width: 10px;
  height: 10px;
  border: 1px solid red;
  border-radius: 50%;
  background: red;
}
.time {
  position: fixed;
  right: 15px;
  top: 15px;
  border: 1px solid #f1f1f1;
  border-radius: 50%;
  padding: 10px;
}
</style>