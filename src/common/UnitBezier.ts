function division(x, t1, t2, epsilon, func) {//计算x的近似值
  var t0,
    t1,
    t2,
    x2,
    i;
  t2 = x;
  if (t2 < t0)
    return t0;
  if (t2 > t1)
    return t1;
  while (t0 < t1) {
    x2 = func(t2);
    if (Math.abs(x2 - x) < epsilon)
      return t2;
    if (x > x2)
      t0 = t2;
    else t1 = t2;
    t2 = (t1 - t0) * .5 + t0;
  }
  return t2;
}

export class UnitBezier {
  cx
  bx
  ax
  cy
  by
  ay

  constructor() {

  }

  setPoint({p1x = 0, p1y = 0, p2x = 0, p2y = 0}) {

    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;

  }

  sampleCurveX = (t) => {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }

  sampleCurveY = (t) => {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }

  solve = (t) => {
    return {x: this.sampleCurveY(t), y: this.sampleCurveX(t)}
  }

}

const noop = () => {
}



export class Fly {

  defaults = {
    version: '1.0.0',
    autoPlay: true,
    vertex_Rtop: 20, // 默认顶点高度top值
    speed: 1.2,
    start: {}, // top, left, width, height
    end: {},
    onEnd: noop
  }

  settings = {}

  $element

  constructor(element, options) {
    this.$element = document.getElementById(element)
    console.log(this.$element)
    this.init(options);
  }


  play = function () {
    this.move();
  }


  move = function () {
    var settings = this.settings;

    let start = settings.start,
      count = settings.count,
      steps = settings.steps,
      end = settings.end;

    // 计算left top值
    var left = start.left + (end.left - start.left) * count / steps,
      top = settings.curvature == 0 ? start.top + (end.top - start.top) * count / steps : settings.curvature * Math.pow(left - settings.vertex_left, 2) + settings.vertex_top;
    // 运动过程中有改变大小
    if (end.width != null && end.height != null) {
      var i = steps / 2,
        width = end.width - (end.width - start.width) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2),
        height = end.height - (end.height - start.height) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2);

      this.$element.style.width = width + "px"
      this.$element.style.height = height + "px"
      //this.$element.css({width: width + "px", height: height + "px", "font-size": Math.min(width, height) + "px"});
    }
    // this.$element.css({
    //   left: left + "px",
    //   top: top + "px"
    // });
    this.$element.style.left = left + "px"
    this.$element.style.top = top + "px"

    settings.count++;
    // 定时任务
    let _self = this
    var time = window.requestAnimationFrame(this.move.bind(this));
    if (count == steps) {
      window.cancelAnimationFrame(time);
      // fire callback
      settings.onEnd.apply(this);
    }
  }

  destroy = function () {
    this.$element.style.display = 'none';
  };


  init = function (options) {
    this.setOptions(options);
    !!this.settings.autoPlay && this.play();
  }

  setOptions = function (options) {

    Object.assign(this.settings, this.defaults, options)

    var settings = this.settings,
      start = settings.start,
      end = settings.end;

    //this.$element.css({marginTop: '0px', marginLeft: '0px', position: 'fixed'}).appendTo('body');
    // 运动过程中有改变大小
    // if (end.width != null && end.height != null) {
    //   $.extend(true, start, {
    //     width: $element.width(),
    //     height: $element.height()
    //   });
    // }


    // 运动轨迹最高点top值
    var vertex_top = Math.min(start.top, end.top) - Math.abs(start.left - end.left) / 3;
    if (vertex_top < settings.vertex_Rtop) {
      // 可能出现起点或者终点就是运动曲线顶点的情况
      vertex_top = Math.min(settings.vertex_Rtop, Math.min(start.top, end.top));
    }

    /**
     * ======================================================
     * 运动轨迹在页面中的top值可以抽象成函数 y = a * x*x + b;
     * a = curvature
     * b = vertex_top
     * ======================================================
     */

    var distance = Math.sqrt(Math.pow(start.top - end.top, 2) + Math.pow(start.left - end.left, 2)),
      // 元素移动次数
      steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / settings.speed),
      ratio = start.top == vertex_top ? 0 : -Math.sqrt((end.top - vertex_top) / (start.top - vertex_top)),
      vertex_left = (ratio * start.left - end.left) / (ratio - 1),
      // 特殊情况，出现顶点left==终点left，将曲率设置为0，做直线运动。
      curvature = end.left == vertex_left ? 0 : (end.top - vertex_top) / Math.pow(end.left - vertex_left, 2);

    Object.assign(settings, {
      count: -1, // 每次重置为-1
      steps: steps,
      vertex_left: vertex_left,
      vertex_top: vertex_top,
      curvature: curvature
    })

  }


}
