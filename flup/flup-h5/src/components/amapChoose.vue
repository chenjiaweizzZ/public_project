<template>
  <div class="amap-choose" v-if="showPlace">
    <div class="map-box">
      <div id="map"></div>
    </div>
    <div class="content">
      <div class="search">
        <div class="search-info">
          <img
            class="search-info__img"
            @click.stop="inputValue"
            src="@/assets/images/icon/search.png"
            alt=""
          />
          <div
            @click.stop.prevent="inputPaentClick('field')"
            style="width: 100%"
          >
            <van-field
              class="search-info__field"
              ref="field"
              clearable
              v-model.trim="keyword"
              @input="inputValue"
              @blur="inputValue"
              placeholder="搜索地点"
            />
          </div>
        </div>
      </div>
      <div class="main">
        <div
          v-for="(item, index) in list"
          :key="index"
          @click="toChecked(item)"
          :style="{
            backgroundColor: item.location === checked.location ? color : '',
          }"
        >
          <div>
            <div class="main-title">
              <img
                class="main-title__img"
                src="@/assets/images/icon/fixed3.png"
                alt=""
              />
              <div class="main-title__text">{{ item.name }}</div>
            </div>
            <div class="detail">
              {{ item.district }}{{ item.district ? "-" + item.address : item.address }}
            </div>
          </div>
        </div>
      </div>
      <div class="btnWrap" v-if="this.checked && this.checked.location">
        <div class="btn" @click="confrom">完成</div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import fixed2 from "@/assets/images/icon/fixed2.png";
export default {
  props: {
    color: {
      type: String,
      default: "#E8F6EC",
    },
    keyMap: {
      type: String,
      default: "",
    },
    securityJsCode:{
      type: String,
      default: "",
    },
    initLocation: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      keyword: "",
      timeId: null,
      checked: {
        location: "",
      },
      showPlace: false,

      placeSearch:null,//
    };
  },
  mounted() {
    this.showPlace = this.show;
    window._AMapSecurityConfig = {
      securityJsCode:this.securityJsCode,
    }
    var script = document.getElementById("mapTest");
    let that = this;
    script
      ? this.loop()
      : (function () {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.setAttribute("id", "mapTest");
          script.src = `https://webapi.amap.com/maps?v=2.0&key=${that.keyMap}`;
          document.body.appendChild(script);
          that.loop();
        })();
  },
  watch: {
    show(newVal, oldVal) {
      this.showPlace = newVal;
      this.$nextTick(() => {
        this.loop();
      });
    },
  },
  methods: {
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    loop() {
      try {
        this.initMapWeb();
      } catch (e) {
        setTimeout(() => this.loop(), 200);
      }
    },
    autoInput(){
      AMap.plugin('AMap.AutoComplete', ()=>{
        var placeSearch = new AMap.AutoComplete({
          city: '全国'
        });
        placeSearch.search(this.keyword, (status, result) => {
          if(result.info == "OK" && result.tips){
            this.list = result.tips.filter(item => item.location).map(item => ({...item,location:`${item.location.lng},${item.location.lat}`}));
          }
        })
      })
    },
    inputValue:utils.debounce(function () {
      this.autoInput()
    }, 500),

    cancel() {
      this.keyword = "";
      this.list = [];
      if (this.maker) {
        this.marker.setMap(null);
      }
    },

    toCancel() {
      this.showPlace = false;
      this.cancel();
      this.$emit("changeShow", false);
    },

    //完成
    confrom() {
      if (this.checked && this.checked.location) {
        this.$emit("placeChoose", JSON.parse(JSON.stringify(this.checked)));
        // this.showPlace = false;
        this.cancel();
      }
    },

    toChecked(obj) {
      this.checked = obj;
      if(this.marker){
        this.marker.setMap(null);
      }
      let tempArr = obj.location.split(",");
      this.addMarker(tempArr[0], tempArr[1]);
    },

    initMapWeb() {
      let that = this;
      this.map = new AMap.Map("map", {
        center: ["106.55", "29.57"],
        zoom: 16,
      });

      this.map.on("click", (e) => {
        if (this.marker) {
          this.marker.setMap(null);
        }
        that.addMarker(e.lnglat.lng, e.lnglat.lat,true);
      });
      AMap.plugin(["AMap.Geolocation"], function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });

        geolocation.getCurrentPosition(function (status, result) {
          if (result.info == "SUCCESS" && result.position && result.position) {
            that.addMarker(result.position.lng, result.position.lat,true);
          }
        });
      });
    },
    //标记
    addMarker(lng, lat,isStatus = false) {
      var icon = new AMap.Icon({
        image:fixed2,
        imageSize: new AMap.Size(30, 36),
      });
      this.marker = new AMap.Marker({
        icon,
        position: [lng, lat],
        offset: new AMap.Pixel(-15,-35)
      });
      this.marker.setMap(this.map);
      this.map.setCenter([lng, lat]);
      if(isStatus){
        this.getAddres(lng, lat);
      }
    },
    //根据经纬度获取地址
    getAddres(lng, lat){
      AMap.plugin(["AMap.Geocoder"],()=>{
        var geocoder = new AMap.Geocoder({
          city: "全国", //城市设为北京，默认：“全国”
          radius: 1000 //范围，默认：500
        });
        geocoder.getAddress([lng, lat], (status, result) => {
          if(result.info == 'OK'){
            let {addressComponent, formattedAddress} = result.regeocode;
            // let data = {
            //   adcode:addressComponent.adcode,
            //   address:formattedAddress,
            //   district:`${addressComponent.province}${addressComponent.city}${addressComponent.district}`,
            //   location:`${lng},${lat}`,
            //   name:''
            // }
            // this.checked = data;
            let district = `${addressComponent.province}${addressComponent.city}${addressComponent.district}`
            this.PlaceSearch(lng, lat, district, addressComponent.adcode);
          }
        })
      })
    },
    //获取周边地址
    PlaceSearch(lng, lat, district, adcode){
      AMap.plugin(["AMap.PlaceSearch"], ()=>{
        var placeSearch = new AMap.PlaceSearch({ 
            pageSize: 20, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "全国",
        });
        placeSearch.searchNearBy('', [lng, lat], 2000, (status, result) => {
          if(status == 'complete' && result.poiList){
            let setList = [];
            let list = result.poiList.pois.filter(item => item.location).map(item => ({...item,location:`${item.location.lng},${item.location.lat}`,district, adcode})).filter((item) => !setList.includes(item.location) && setList.push(item.location))
            
            this.keyword = '';
            this.list = list;
          }
        });
      })
    }
  },
};
</script>
<style lang="scss">
.amap-choose {
  .content {
    .search {
      &-info {
        &__field {
          .van-field__control {
            font-size: 16px;
            color: #111111;
            caret-color: #32ae57;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.amap-choose {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 99999;
  .top-button {
    top: 0;
    box-sizing: border-box;
    padding: 24px;
    position: fixed;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    .cancel {
      // color: white;
    }
    .conform {
      // background-color: #ff6000;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
    }
  }

  .map-box {
    height: 50%;
    // background-color: pink;
    #map {
      width: 100%;
      height: 100%;
    }
    /deep/ .amap-logo {
      display: none !important;
    }
    /deep/ .amap-copyright {
      display: none !important;
    }
  }

  .content {
    position: fixed;
    bottom: 0;
    height: 50%;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 22px 0px 0;
    display: flex;
    flex-direction: column;
    .search {
      position: absolute;
      left: 0px;
      top: -22px;
      z-index: 10;
      height: 44px;
      width: 100%;
      padding: 0 20px;
      &-info {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: 1px solid #cbdcd0;
        border-radius: 14px;
        box-shadow: 1px 1px 8px 0px rgba(178, 197, 184, 0.7);
        display: flex;
        align-items: center;
        padding-left: 18px;
        padding-right: 12px;
        overflow: hidden;
        &__img {
          width: 20px;
          height: 20px;
        }
        &__field {
          width: 100%;
          height: 100%;
          padding: 0;
          display: flex;
          align-items: center;
          margin-left: 5px;
        }
      }
    }

    .main {
      flex: 1;
      // height:100%;
      // background: pink;
      overflow-y: auto;
      & > div {
        box-sizing: border-box;
        padding: 15px 20px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .detail {
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
          color: #666666;
          margin-top: 6px;
        }
      }
      &-title {
        display: flex;
        align-items: center;
        &__img {
          width: 15px;
          height: 15px;
        }
        &__text {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          line-height: 19px;
          color: #111111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 6px;
        }
      }
    }
    .btnWrap {
      height: 70px;
      background-color: #fff;
      padding: 8px 14px 0;
      .btn {
        width: 100%;
        height: 42px;
        border-radius: 23px;
        background: #32ae57;
        font-size: 16px;
        font-weight: 500;
        line-height: 42px;
        text-align: center;
        color: #ffffff;
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
  .tab-icon {
    width: 30px;
    height: 36px;
  }
}
</style>
