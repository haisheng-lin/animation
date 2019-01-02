'use strict';

const loadImage = require('./image-loader');

const STATE_INITIAL = 0; // 初始化状态
const STATE_START = 1; // 开始状态
const STATE_STOP = 2; // 停止状态

const TASK_SYNC = 0; // 同步任务
const TASK_ASYNC = 1; // 异步任务

/**
 * 帧动画类
 * 
 * @constructor
 */
function Animation () {
  this.taskQueue = []; // 任务链数组
  this.index = 0; // 当前正在执行的任务的索引
  this.state = STATE_INITIAL; // 任务状态初始化
}

/**
 * 添加一个同步任务，去预加载图片
 *
 * @param  {string[]} imgList 图片数组
 * @return {Animation}
 */
Animation.prototype.loadImage = function (imgList) {
  let taskFn = function (next) {
    loadImage(imgList.slice(), next); // 操作 imgList 的副本，因为 loadImage 内部修改了 imgList 的属性
  };
  const type = TASK_SYNC;
  return this._addTask(taskFn, type);
};

/**
 * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画
 *
 * @param {HTMLImageElement} ele dom 对象
 * @param {string[]} positions 背景位置数组
 * @param {string} imgUrl 图片地址
 */
Animation.prototype.changePosition = function (ele, positions, imgUrl) {

};

/**
 * 添加一个异步定时任务，通过定时改变 image 标签的 src 属性，实现帧动画
 *
 * @param {HTMLImageElement} ele dom 对象
 * @param {string[]} imgList 图片地址数组
 */
Animation.prototype.changeSrc = function (ele, imgList) {

};

/**
 * 高级用法，添加一个异步定时执行的任务
 * 该任务自定义帧动画每帧执行后的回调函数
 *
 * @param {Function} taskFn 自定义每帧执行的任务函数
 */
Animation.prototype.enterFrame = function (taskFn) {

};

/**
 * 添加一个同步任务，可以在上一个任务完成后执行回调函数
 *
 * @param {Function} callback 回调函数
 */
Animation.prototype.then = function (callback) {

};

/**
 * 开始执行任务，异步定义任务执行的间隔
 *
 * @param {number} interval 时间间隔（毫秒）
 */
Animation.prototype.start = function (interval) {

};

/**
 * 添加一个同步任务，该任务就是回退到上一个任务中
 * 实现重复上一个任务的效果，可以定义重复的次数
 *
 * @param {number} times 重复次数
 */
Animation.prototype.repeat = function (times) {

};

/**
 * 添加一个同步任务，相当于 repeat() 的更友好的接口
 * 无限重复上一个任务
 */
Animation.prototype.repeatForever = function () {

};

/**
 * 设置当前任务执行结束后到下一个任务开始前的等待时间
 *
 * @param {number} time 等待时长（毫秒）
 */
Animation.prototype.wait = function (time) {

};

/**
 * 暂停当前异步定时任务
 */
Animation.prototype.pause = function () {

};

/**
 * 重新执行上一次暂停的异步定时任务
 */
Animation.prototype.restart = function () {

};

/**
 * 释放资源（停掉计时器）
 */
Animation.prototype.dispose = function () {

};

/**
 * 添加一个任务到任务队列中
 *
 * @param  {Function} taskFn 任务方法
 * @param  {number} taskType 任务类型
 * @return {Animation}
 */
Animation.prototype._addTask = function (taskFn, taskType) {
  this.taskQueue.push({
    taskFn,
    taskType,
  });
  /**
   * 由于链式调用，我们需要返回当前 Animation 的实例
   * 举个例子：
   * new Aniamtion.loadImage(imageList).then(afterLoadImage)
   * 可以看到函数的每次调用都是基于 new Animation 这个实例的
   * 这也是链式调用的常用技巧
   */
  return this; // 由于链式调用，我们需要返回当前 Animation 的实例
}