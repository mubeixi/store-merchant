<template>
  <div class="home-wrap">
    <div class="flex main">
      <div class="lists">
        <div class="item" v-for="(item,idx) in 10" title="添加" :style="{backgroundImage:'url('+img_url+')'}" @click="addCart(idx)" @mouseover="mouseoverFn">
          <i class="el-icon-plus" ></i>
        </div>
      </div>
    </div>
<!--    v-show="isMove"-->
    <img :src="img_url" id="pic" :class="{run_top_right:isMove}" style="width: 100px;height: 100px"  :style="{left:curPosX+'px',top:curPosY+'px'}" />
    <div class="handle" id="handle">
      <el-button @click="saveData(0)" type="primary" size="small">保存</el-button>
      <div class="padding10-c font14">总共选择 {{count_num}} 商品</div>
    </div>

  </div>
</template>

<script lang="ts">

    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import {fun} from '../common';
    import {UnitBezier} from '../common/UnitBezier';

    const imgData = 'data:image/jpeg;base64,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';

    const UnitBezierInstance = new UnitBezier()
    let T = 0
    let IntervalInstance = null

    import {Fly} from '../common/UnitBezier';

    @Component({
        mixins:[],
        components: {

        }
    })


    export default class Empty extends Vue {

        count_num = 0
        img_url = imgData

        curPosX = 0
        curPosY = 0

        lastPosX = 0
        lastPosY = 0


        isMove = false



        fn = function () {

            let temp = null;
            temp = UnitBezierInstance.solve(T)
            T += 0.1
            console.log(temp,T)
        }
        addCart(e,idx){
            this.isMove = true

            let _self = this
            let opt = {
                start:{left:this.curPosX,top:this.curPosY,height:100,width:100},
                end:{left:this.lastPosX,top:this.lastPosY,height:20,width:20},
                onEnd:function(){
                    _self.isMove = false
                }
            }
            let fly = new Fly('pic',opt)


            // UnitBezierInstance.setPoint({p1x:0.4,p1y:0.4,p2x:0.8,p2y:0.9})
            // console.log(UnitBezierInstance)
            //
            //
            // IntervalInstance = setInterval(this.fn,100)
            // this.curPosX = this.lastPosX
            // this.curPosY = this.lastPosY




        }

        mouseoverFn(e) {

            if(this.isMove)return;
            // 获取当前位置x
            this.curPosX = e.clientX
            this.curPosY = e.clientY
            console.log(this.curPosX,this.curPosY)

        }

        mounted(){
            this.$nextTick().then(()=>{
                let handle = document.getElementById('handle')
                let preBoundingClientRect = handle.getBoundingClientRect()
                this.lastPosY = preBoundingClientRect.top
                this.lastPosX = handle.offsetWidth/2
            })
        }




    }
</script>
<style lang="stylus" scoped>
.lists
  display flex
  flex-wrap wrap
  padding 25px
  .item
    margin-right 10px
    width 100px
    height 100px
    border-radius 4px
    border dashed 1px #eee
    text-align center
    line-height 100px
    cursor pointer
    background-size cover
    background-repeat no-repeat
    background-position center
    .el-icon-plus
      color white
      font-size 36px
#pic
  position fixed
  z-index 999

.handle
  position fixed
  z-index 999
  bottom 0
  width 100%
  height 50px
  display flex
  align-items center
  background white
  justify-content center
  border-top 1px solid #e7e7e7
</style>
<style scoped lang="less" >
//定义动画的流程
.run_top_right {
  //display: block;
  //transition: all 2s cubic-bezier(0.300, 4.000, 0.580, 1.000);
  /*transition: left 2s ease-in-out;*/
  /*transition: top 2s ease-in-out;*/
  /*animation-fill-mode: forwards;*/
}
</style>

