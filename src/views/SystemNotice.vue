<template>
  <div class="page-wrap">
    <div class="artice">
      <div class="head">
        <div class="title">{{info.title}}</div>
        <div class="create_at">发布时间:{{info.create_at}}</div>
      </div>
      <div class="container" v-html="info.content"></div>
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


    @Component({
        mixins:[],
        components: {

        }
    })


    export default class SystemNotice extends Vue {

        info = {title:'',create_at:'',content:''}

        created(){

            let id = this.$route.query.id
            console.log(id)
            this.info.title = '俄版东风17！俄罗斯将高超音速导弹搬上军舰，中国海军需要吗？'
            this.info.create_at = '2019-11-24'

            let tempStr = '<section class="_135editor" data-role="paragraph">\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        据悉，天猫双11招商入口已于今晚10点正式开启，与往年相比，今年最大区别是商家不用等待，立刻可以知道是否能够有资格，而且今年不能补报。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        亿邦动力将今年天猫双11招商规则重要信息整理如下：\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>一、活动节奏</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        9月12日22:00:00至9月20日23:59:59为活动报名期，9月23日10:00:00至9月30日23:59:59为预售商品报名期，10月15日10:00:00至10月25日23:59:59为正式商品报名期，11月1日00:00:00至11月10日23:59:59为活动预热期，10月21日00:00:00至11月10日21:59:59为预售活动其，11月11日00:00:00至11月11日23:59:59为正式活动期。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091309315683431253174.jpeg" title="" alt="" data-width="550" data-height="196" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>二、流量支持</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        2019年天猫双十一流量支持包括五大板块，分别是天猫、阿里集团、外部媒体、线下媒体以及电视广告资源。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091327015683432826502.jpeg" title="" alt="" data-width="550" data-height="201" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>三、资金支持</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        为助力商家备战2019双十一，网商银行资金扶持政策包括信用贷款和提前收款。其中，<strong>信用贷款</strong>针对满足提额条件的商家，提供临时提升贷款额度，并且在活动期间借款，有机会获得利率优惠，同时还享其他金融权益。而<strong>提前收款</strong>则支持发货后即可操作回款，快速回笼资金，按需取用，按笔收费。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>四、招商要求</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        本次天猫双十一活动面向天猫平台商家及天猫国际平台商家。猫商家须满足《天猫商家营销准入基础规则》，且本次招商要求会以2019年08月25日0点的各项指标数据为准进行系统校验。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        根据规则，天猫会根据2019双十一的整体策略，优先选择可更好地为消费者服务的商家（优选条件包括但不限于品牌知名度、活动契合度、消费者需求、开店时长、诚信经营情况、运费险及服务保障情况等）。<strong>商家同意天猫可基于对2019双十一品牌的整体管理与维护，不时采用诚信经营管控治理措施（包括但不限于降级、警告、清退等）。</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091395915683432826313.jpg" title="" alt="" data-width="550" data-height="122" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>商品申报</strong>规则方面，商家的商品可申报数量会根据以往商家参与天猫大型营销活动时活动商品的销售情况进行限制。具体要求如图所示：\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091352415683434382995.png" title="" alt="" data-width="550" data-height="364" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>包邮要求</strong>方面，商家应当提供活动商品收货地为中国（不包括中国香港、中国澳门、中国台湾地区）的包邮服务，以下特殊场景特殊处理：\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091394615683432826424.jpg" title="" alt="" data-width="550" data-height="127" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>发货要求</strong>方面，主要分为天猫与天猫国际两类订单。其中，天猫订单：11月11日-11月15日的订单，商家须在11月18日前发货，而11月16日-11月19日期间的订单，商家须在72小时内发货，否则按照《天猫规则》延迟发货处理。天猫国际订单：11月11日-11月15日的跨境电商保税进口的订单，商家须在11月18日前发货，而11月11日-11月17日的海外直邮及跨境电商集货进口的订单，商家须在11月20日前发货。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>运费险要求</strong>方面，2019年双11期间运费险生效时间为2019年11月10日18时-2019年11月11日，生效范围是除部分特殊类目商品因存在运输及退货方面的特殊性可不支持运费险，活动商家店铺内其他类目商品在2019双十一期间均须支持运费险。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>购物津贴要求</strong>方面，详细规则如下：\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091329315683432824662.jpg" title="" alt="" data-width="550" data-height="194" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>五、 营销管理规定</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        据悉，活动期间（自2019年10月21日至2019年11月11日），天猫会将商家的专注度和商品的竞争力（包括款式、品质、价格等）等作为全域资源分配的重要考量因素。如商家对天猫消费者的关注度不足、商品优惠力度不足，甚至与该商品在其他渠道的营销政策相比没有竞争优势，均不符合2019双十一对消费者的承诺，天猫将限制、取消这类商家/商品双十一活动全域资源。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        同时，系统还会将2019双十一在内的天猫营销活动和搜索结果等公共推荐域流量资源提供给合适的品牌和商家，综合评估的维度同样包括品牌、商家的下述表现：服务能力、产品竞争力、价格、信用度、诚信度、对天猫消费者的专注度等。相应的，活动期间系统可能在由部分公共推荐域引导进入的活动商品详情页展现“场景推荐”区块，将详情页流量在商家间实现共享。\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        <strong>六、店铺及商家须知</strong>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               text-align: center;" align="center">\n' +
                '        <img src="http://imgs.ebrun.com/resources/2019_09/2019_09_13/2019091393715683435440524.png" title="" alt="" data-width="550" data-height="276" style="border-style: none; vertical-align: middle; max-width: 100%;" data-ratio="1"/>\n' +
                '    </p>\n' +
                '    <p style="margin: 0px 0px 28px; padding: 0px; font-size: medium; line-height: 28px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Helvetica, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, SimSun, sans-serif;               ">\n' +
                '        （By LY24）\n' +
                '    </p>\n' +
                '    <p>\n' +
                '        <br/>\n' +
                '    </p>\n' +
                '</section>'
            this.info.content = tempStr

        }
    }
</script>
<style lang="less" scoped>
.artice{
  width: 677px;
  margin: 0 auto;
  padding-top: 32px;
  .head{
    margin-bottom: 10px;
    .title{
      font-size: 22px;
      line-height: 1.4;
      margin-bottom: 14px;
    }
    .create_at{
      font-size: 15px;
      color: rgba(0,0,0,.3);
    }
  }
  .container{
    line-height: 1.4;
  }
}
</style>

