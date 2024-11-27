## 关键函数：



1. choicedCard(),选择卡片，并加载对应的门诊还是住院的数据


2. openDialog({type,...props}),打开弹窗，根据type来选择对应的弹窗

3. getTimeline(),获取时间轴，swiper数据的


4. getMenZheng() 获取门诊数据

5. 获取住院数据 1.getTable()获取中间数据，2.getChart()获取三测图数据

6. initPage() 根据目前已经有的条件初始化页面

## 关键函数的依赖问题



1. initPage()里调用getTimeline()得到swiper数据
2. 根据swiper数据自动选取第一条数据，getTimeline()里调用choicedCard()

3. choicedCard()里根据判断是住院则调用getTable(),getChart()；判断是门诊则调用getMenZheng()
            






