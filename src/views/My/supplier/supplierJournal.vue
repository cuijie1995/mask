<template>
  <div class="supplier_journal">
    <div class="top">
      <van-nav-bar title="操作记录" left-text="返回" left-arrow @click-left="$router.go('-1')"></van-nav-bar>
    </div>

    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(item,index) in logData"
          :key="index"
          :timestamp="item.operationTime | format"
          placement="top"
          color="#0bbd87"
        >
          <el-card>
            <p>{{item.operationContent}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>


<script>
import { format } from "../../DataFormator.js";

export default {
  name: "supplierJournal",
  filters: {
    format(time) {
      var date = new Date(time);

      return format(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  data() {
    return {
      logData: []
    };
  },
  mounted() {
    this.getBillog();
  },
  methods: {
    getBillog() {
      var id = localStorage.getItem("logId");
      this.$axios
        .post(this.url + "/api/BillLog/GetAllPage", {
          billId: id
        })
        .then(res => {
          this.logData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style  scoped>
.block {
  padding-top: 65px;
  width: 100%;
}
.el-timeline {
  width: 90%;
  margin-left: 5%;
}
p {
  margin: 0;
}
.top {
  position: fixed;
  width: 100%;
  z-index: 10;
}
</style>