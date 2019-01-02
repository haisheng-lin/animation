'use strict';

const DEFAULT_INTERVAL = 1000 / 60;

const STATE_INITIAL = 0; // 初始化状态
const STATE_START = 1; // 开始状态
const STATE_STOP = 2; // 停止状态

/**
 * raf
 */
const requestAnimationFrame = (function () { // 立即执行函数，只做一次检测就可以了
  return window.requestAnimationFrame || // 标准浏览器
         window.webkitRequestAnimationFrame || // chrome
         window.mozRequestAnimationFrame || // firefox
         window.oRequestAnimationFrame || // opera
         function (callback) {
           return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
         };
})();

/**
 * caf
 */
const cancelAnimationFrame = (function () {
  return window.cancelAnimationFrame ||
         window.webkitCancelAnimationFrame ||
         window.mozCancelAnimationFrame ||
         window.oCancelAnimationFrame ||
         function (id) {
           return window.clearTimeout(id);
         };
})();

/**
 * Timeline 时间轴类
 *
 * @constructor
 */
function Timeline () {
  this.animationHandler = 0;
  this.state = STATE_INITIAL;
}

/**
 * 时间轴上每一次回调执行的函数，其实这是给 Timeline 实例实现的，所以这里不写任何代码
 * 例如传了 100ms，那么 Timeline 实例会在动画开始 100ms 后触发这个函数
 *
 * @param {number} time 从动画开始到当前执行的时间
 */
Timeline.prototype.onenterframe = function (time) {

};

/**
 * 开始动画
 *
 * @param {number} interval 每一次回调的间隔时间
 */
Timeline.prototype.start = function (interval) {
  if (this.state === STATE_START) {
    return;
  }
  this.state = STATE_START;
  this.interval = interval || DEFAULT_INTERVAL;
  startTimeline(this, +new Date());
};

/**
 * 停止动画
 */
Timeline.prototype.stop = function () {
  if (this.state !== STATE_START) {
    return;
  }
  this.state = STATE_STOP;
  if (this.startTime) {
    this.duration = +new Date() - this.startTime; // 记录动画从开始执行到现在所经历的时间, restart() 用到
  }
  cancelAnimationFrame(this.animationHandler);
};

/**
 * 重新开始动画
 */
Timeline.prototype.restart = function () {
  if (this.state === STATE_START) {
    return;
  }
  if (!this.duration || !this.interval) {
    return;
  }
  this.state = STATE_START;
  startTimeline(this, +new Date() - this.duration); // 无缝连接动画
};

/**
 * 时间轴动画启动函数
 *
 * @param {Timeline} timeline Timeline 实例
 * @param {number} startTime 动画开始的时间戳
 */
function startTimeline (timeline, startTime) {
  timeline.startTime = startTime;
  nextTick.interval = timeline.interval;
  let lastTick = +new Date(); // 记录上一次回调的时间戳
  nextTick();
  /**
   * 每一帧执行的函数
   */
  function nextTick () {
    const now = +new Date();
    timeline.animationHandler = requestAnimationFrame(nextTick);
    // 如果当前时间与上一次回调的时间戳大于设置的时间间隔
    // 表示这一次可以执行回调函数
    if (now - lastTick >= timeline.interval) {
      timeline.onenterframe(now - startTime); // 暴露给实例的接口，看对应的注释
      lastTick = now;
    }
  }
}

module.exports = Timeline;
