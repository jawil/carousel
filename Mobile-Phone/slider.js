 ! function(window) {
     const DEFAULT_OPTIONS = { //默认参数
         auto: 1, //自动播放 1或0
         interval: 3000, //停顿时间
         effect: 'ease-out' //transition运动效果，也可以是贝塞尔曲线
     }
     class Slider {
         constructor(el, options = {}) {
             this.sliderWrap = document.querySelector(el) || document.getElementById(el)
             this.index = 0
             this.settings = Object.assign({}, DEFAULT_OPTIONS, options)
             this.init_data()
         }
         static set_position(obj, dis) { //更改轮播图位置
             obj.style.webkitTransform = `translate3d(${dis}px,0,0)` //兼容安卓版UC
             obj.style.transform = `translate3d(${dis}px,0,0)`
         }
         static set_focusIcon(obj, x) { //设置轮播图ICON焦点
             Array.from(obj.children).forEach((ele, index) =>
                 ele.className = index === x ? 'active' : ''
             )
         }
         init_data() { //初始化数据
             this.get_element()
             this.settings.auto === 1 && this.auto_play()
             this.touch_event()
         }
         get_element() { // 获取元素对象
             let oUl = this.sliderWrap.querySelectorAll('ul')
             this.sliderContent = oUl[0]
             this.sliderContent.innerHTML += this.sliderContent.innerHTML
             this.sliderFlag = oUl[1]
             this.iWidth = this.sliderWrap.offsetWidth
             this.length = this.sliderContent.childElementCount
             this.sliderContent.style.width = `${this.length}00%`
             Array.from(this.sliderContent.children).forEach(
                 (element, index) =>
                 element.style.width = `${1 / this.length * 100}%`
             )
         }
         auto_play() { //自动播放
             clearInterval(this.autotimer)
             this.autotimer = setInterval(f => {
                 this.index++;
                 this.sliderContent.style.transition = `.5s ${ this.settings.effect}`
                 Slider.set_position(this.sliderContent, -this.index * this.iWidth)
                 Slider.set_focusIcon(this.sliderFlag, this.index % (this.length / 2));
                 (this.index === 0) && (this.index = this.length / 2) //为0时候立即初始化跳转
                 setTimeout(f => {
                     if (this.index === this.length - 1) {
                         this.sliderContent.style.transition = "none"
                         this.index = this.length / 2 - 1
                         Slider.set_position(this.sliderContent, -this.index * this.iWidth)
                     }
                 }, 600)
             }, this.settings.interval)
         }
         touch_event() { //手指滑动轮播图,滑动距离超过一半才会运动到下一张
             let isMove = true,
                 isFirst = true,
                 touchStart, touchMove, touchEnd, iStartPageX, iStartPageY
             touchStart = e => {
                 e.preventDefault()
                 e.stopPropagation()
                 clearInterval(this.autotimer)
                 isMove = true
                 isFirst = true
                 iStartPageX = e.changedTouches[0].pageX
                 iStartPageY = e.changedTouches[0].pageY
             }
             touchMove = e => {
                 if (!isMove) {
                     return
                 }
                 let iDisX = (e.changedTouches[0].pageX - iStartPageX),
                     iDisY = (e.changedTouches[0].pageY - iStartPageY),
                     isDown = f => Math.abs(iDisY) > Math.abs(iDisX)
                 if (isFirst) { //判断用户向上还是向下滑动只需要判断一次就行了
                     isFirst = false
                     isDown() && (isMove = false) //用户向下滑动就不会触发轮播图抖动
                 }
                 if (isMove) {
                     this.sliderContent.style.transition = 'none'; //不清楚浏览器自动插入分号的规则千万不要学我
                     (this.index === 0) && (this.index = this.length / 2);
                     (this.index === this.length - 1) && (this.index = this.length / 2 - 1)
                     Slider.set_position(this.sliderContent, -this.index * this.iWidth + iDisX)
                 }
             }
             touchEnd = e => {
                 let iDisX = e.changedTouches[0].pageX - iStartPageX
                 this.sliderContent.style.transition = `.5s ${ this.settings.effect}`
                 this.index = this.index === this.length ? //防止诡异的越界，很难重现。。。
                     (this.length / 2) : (this.index - Math.round(iDisX / this.iWidth))
                 Slider.set_position(this.sliderContent, -this.index * this.iWidth)
                 Slider.set_focusIcon(this.sliderFlag, this.index % (this.length / 2))
                 this.auto_play()
             }
             this.sliderContent.addEventListener("touchstart", touchStart, false)
             this.sliderContent.addEventListener("touchmove", touchMove, false)
             this.sliderContent.addEventListener("touchend", touchEnd, false)
         }
     }
     window.Slider = Slider
 }(window)
