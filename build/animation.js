(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/animation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/animation.js":
/*!**************************!*\
  !*** ./src/animation.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst loadImage = __webpack_require__(/*! ./image-loader */ \"./src/image-loader.js\");\r\nconst Timeline = __webpack_require__(/*! ./timeline */ \"./src/timeline.js\");\r\n\r\nconst STATE_INITIAL = 0; // 初始化状态\r\nconst STATE_START = 1; // 开始状态\r\nconst STATE_STOP = 2; // 停止状态\r\n\r\nconst TASK_SYNC = 0; // 同步任务\r\nconst TASK_ASYNC = 1; // 异步任务\r\n\r\n/**\r\n * 简单的函数封装，执行 callback\r\n *\r\n * @param {Function} callback\r\n */\r\nfunction next (callback) {\r\n  callback && callback();\r\n}\r\n\r\n/**\r\n * 帧动画类\r\n * \r\n * @constructor\r\n */\r\nfunction Animation () {\r\n  this.taskQueue = []; // 任务链数组: Array<{ taskFn: Function, taskType: number }>\r\n  this.index = 0; // 当前正在执行的任务的索引\r\n  this.timeline = new Timeline();\r\n  this.state = STATE_INITIAL; // 任务状态初始化\r\n}\r\n\r\n/**\r\n * 添加一个同步任务，去预加载图片\r\n *\r\n * @param  {string[]} imgList 图片数组\r\n * @return {Animation}\r\n */\r\nAnimation.prototype.loadImage = function (imgList) {\r\n  let taskFn = function (next) {\r\n    loadImage(imgList.slice(), next); // 操作 imgList 的副本，因为 loadImage 内部修改了 imgList 的属性\r\n  };\r\n  const type = TASK_SYNC;\r\n  return this._addTask(taskFn, type);\r\n};\r\n\r\n/**\r\n * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画\r\n *\r\n * @param {HTMLImageElement} ele dom 对象\r\n * @param {string[]} positions 背景位置数组\r\n * @param {string} imgUrl 图片地址\r\n */\r\nAnimation.prototype.changePosition = function (ele, positions, imgUrl) {\r\n  const length = positions.length;\r\n  let taskFn;\r\n  let taskType;\r\n  if (!length) {\r\n    taskFn = next;\r\n    taskType = TASK_SYNC;\r\n  } else {\r\n    const me = this;\r\n    taskFn = function (next, time) {\r\n      if (imgUrl) {\r\n        ele.style.backgroundImage = 'url(' + imgUrl + ')';\r\n      }\r\n      // 获得当前图片位置索引\r\n      let index = Math.min(time / me.interval | 0, length);\r\n      const position = positions[index - 1].split(' ');\r\n      // 改变 dom 对象背景图片设置\r\n      ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';\r\n      if (index === length) {\r\n        next();\r\n      }\r\n    };\r\n    taskType = TASK_ASYNC;\r\n  }\r\n  return this._addTask(taskFn, taskType);\r\n};\r\n\r\n/**\r\n * 添加一个异步定时任务，通过定时改变 image 标签的 src 属性，实现帧动画\r\n *\r\n * @param {HTMLImageElement} ele dom 对象\r\n * @param {string[]} imgList 图片地址数组\r\n */\r\nAnimation.prototype.changeSrc = function (ele, imgList) {\r\n  const length = imgList.length;\r\n  let taskFn;\r\n  let taskType;\r\n  if (!length) {\r\n    taskFn = next;\r\n    taskType = TASK_SYNC;\r\n  } else {\r\n    const me = this;\r\n    taskFn = function (next, time) {\r\n      // 获得当前图片索引\r\n      let index = Math.min(time / me.interval | 0, length - 1);\r\n      // 改变 image 对象的图片地址\r\n      ele.src = imgList[index];\r\n      if (index === length - 1) {\r\n        next();\r\n      }\r\n    };\r\n    taskType = TASK_ASYNC;\r\n  }\r\n  return this._addTask(taskFn, taskType);\r\n};\r\n\r\n/**\r\n * 高级用法，添加一个异步定时执行的任务\r\n * 该任务自定义帧动画每帧执行后的回调函数\r\n *\r\n * @param {Function} taskFn 自定义每帧执行的任务函数\r\n */\r\nAnimation.prototype.enterFrame = function (taskFn) {\r\n  return this._addTask(taskFn, TASK_ASYNC);\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，可以在上一个任务完成后执行回调函数\r\n *\r\n * @param {Function} callback 回调函数\r\n */\r\nAnimation.prototype.then = function (callback) {\r\n  const taskFn = function (next) {\r\n    callback();\r\n    next();\r\n  };\r\n  return this._addTask(taskFn, TASK_SYNC);\r\n};\r\n\r\n/**\r\n * 开始执行任务，异步定义任务执行的间隔\r\n *\r\n * @param  {number} interval 时间间隔（毫秒）\r\n * @return {Animation}\r\n */\r\nAnimation.prototype.start = function (interval) {\r\n  if (this.state === STATE_START) {\r\n    return this;\r\n  }\r\n  if (!this.taskQueue.length) { // 如果任务链没有任务，则返回\r\n    return this;\r\n  }\r\n  this.state = STATE_START;\r\n  this.interval = interval; // 保存 interval 到本实例\r\n  this._runTask();\r\n  return this;\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，该任务就是回退到上一个任务中\r\n * 实现重复上一个任务的效果，可以定义重复的次数\r\n *\r\n * @param {number} times 重复次数\r\n */\r\nAnimation.prototype.repeat = function (times) {\r\n  const me = this;\r\n  const taskFn = function () {\r\n    if (typeof times === 'undefined') {\r\n      // 无限回退到上一个任务\r\n      me.index--;\r\n      me._runTask();\r\n      return;\r\n    }\r\n    if (times) {\r\n      times--;\r\n      me.index--;\r\n      me._runTask();\r\n    } else { // 达到重复次数，跳转到下个任务\r\n      const task = me.taskQueue[me.index];\r\n      me._runNextTask(task);\r\n    }\r\n  };\r\n  return this._addTask(taskFn, TASK_SYNC);\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，相当于 repeat() 的更友好的接口\r\n * 无限重复上一个任务\r\n */\r\nAnimation.prototype.repeatForever = function () {\r\n  return this.repeat();\r\n};\r\n\r\n/**\r\n * 设置当前任务执行结束后到下一个任务开始前的等待时间\r\n *\r\n * @param {number} time 等待时长（毫秒）\r\n */\r\nAnimation.prototype.wait = function (time) {\r\n  if (this.taskQueue && this.taskQueue.length) {\r\n    this.taskQueue[this.taskQueue.length - 1].wait = time;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 暂停当前异步定时任务\r\n */\r\nAnimation.prototype.pause = function () {\r\n  if (this.state === STATE_START) {\r\n    this.state = STATE_STOP;\r\n    this.timeline.stop();\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 重新执行上一次暂停的异步定时任务\r\n */\r\nAnimation.prototype.restart = function () {\r\n  if (this.state === STATE_STOP) {\r\n    this.state = STATE_START;\r\n    this.timeline.restart();\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 释放资源（停掉计时器）\r\n */\r\nAnimation.prototype.dispose = function () {\r\n  if (this.state !== STATE_INITIAL) {\r\n    this.state = STATE_INITIAL;\r\n    this.taskQueue = null;\r\n    this.timeline.stop();\r\n    this.timeline = null;\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 添加一个任务到任务队列中\r\n *\r\n * @private\r\n * @param  {Function} taskFn 任务方法\r\n * @param  {number} taskType 任务类型\r\n * @return {Animation}\r\n */\r\nAnimation.prototype._addTask = function (taskFn, taskType) {\r\n  this.taskQueue.push({\r\n    taskFn,\r\n    taskType,\r\n  });\r\n  /**\r\n   * 由于链式调用，我们需要返回当前 Animation 的实例\r\n   * 举个例子：\r\n   * new Aniamtion.loadImage(imageList).then(afterLoadImage)\r\n   * 可以看到函数的每次调用都是基于 new Animation 这个实例的\r\n   * 这也是链式调用的常用技巧\r\n   */\r\n  return this; // 由于链式调用，我们需要返回当前 Animation 的实例\r\n};\r\n\r\n/**\r\n * 执行任务\r\n *\r\n * @private\r\n */\r\nAnimation.prototype._runTask = function () {\r\n  if (!this.taskQueue || this.state !== STATE_START) {\r\n    return;\r\n  }\r\n  if (this.index === this.taskQueue.length) { // 如果任务队列执行完\r\n    this.dispose();\r\n    return;\r\n  }\r\n  const task = this.taskQueue[this.index]; // 获取任务链上的当前任务\r\n  if (task.taskType === TASK_SYNC) {\r\n    this._runSyncTask(task);\r\n  } else {\r\n    this._runAsyncTask(task);\r\n  }\r\n};\r\n\r\n/**\r\n * 执行同步任务\r\n *\r\n * @private\r\n * @param { taskFn: Funciton, taskType: number } task\r\n */\r\nAnimation.prototype._runSyncTask = function (task) {\r\n  const me = this;\r\n  const next = function () { // 切换到下一个任务\r\n    me._runNextTask(task);\r\n  };\r\n  const taskFn = task.taskFn;\r\n  taskFn(next);\r\n};\r\n\r\n/**\r\n * 执行异步任务\r\n *\r\n * @private\r\n * @param { taskFn: Funciton, taskType: number }\r\n */\r\nAnimation.prototype._runAsyncTask = function (task) {\r\n  const me = this;\r\n  /**\r\n   * 由于浏览器的异步执行：setTimeout 的时间是不准确的\r\n   * 所以我们自己实现一个 timeline 来精确控制异步任务的执行间隔\r\n   * 定义每一帧执行的回调函数\r\n   *\r\n   * @param {number} time 从动画开始执行到现在的所经历的时间\r\n   */\r\n  const enterFrame = function (time) {\r\n    const taskFn = task.taskFn;\r\n    const next = function () {\r\n      // 停止当前任务\r\n      me.timeline.stop();\r\n      // 执行下一个任务\r\n      me._runNextTask(task);\r\n    };\r\n    taskFn(next, time);\r\n  };\r\n\r\n  this.timeline.onenterframe = enterFrame;\r\n  this.timeline.start(this.interval);\r\n};\r\n\r\n/**\r\n * 切换到下一个任务，支持如果当前任务需要等待，则延时进行\r\n *\r\n * @private\r\n * @param { taskFn: Funciton, taskType: number } task 当前任务\r\n */\r\nAnimation.prototype._runNextTask = function (task) {\r\n  this.index++;\r\n  const me = this;\r\n  task.wait ? setTimeout(function () {\r\n    me._runTask();\r\n  }, task.wait) : this._runTask();\r\n}\r\n\r\nmodule.exports = function () {\r\n  return new Animation();\r\n};\r\n\n\n//# sourceURL=webpack://animation/./src/animation.js?");

/***/ }),

/***/ "./src/image-loader.js":
/*!*****************************!*\
  !*** ./src/image-loader.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * 预加载图片\r\n *\r\n * @param {string[] | object[]} images 需加载的图片的数组或对象\r\n * @param {Function} callback 全部图片加载完毕后执行的回调函数\r\n * @param {number} timeout 加载超时的时长\r\n */\r\nfunction loadImage (images, callback, timeout) {\r\n  let count = 0; // 加载完成图片的计数器\r\n  let success = true; // 全部图片加载成功的标志位\r\n  let timeoutId = 0; // 超时 timer 的 id\r\n  let isTimeout = false; // 是否加载超时的标志位\r\n  \r\n  for (let key in images) { // 对图片数组或对象进行遍历\r\n    if (images.hasOwnProperty(key)) { // 过滤 prototype 上的属性\r\n      continue;\r\n    }\r\n    let item = iamges[key]; // 获取每个图片元素，期望格式是个 object: { src: xxx }\r\n    if (typeof item === 'string') {\r\n      item = images[key] = {\r\n        src: item,\r\n      };\r\n    }\r\n    if (!item || !item.src) { // 如果格式不满足期望，则丢弃此数据，进行下一次遍历\r\n      continue;\r\n    }\r\n    count++; // 计数器 + 1\r\n    item.id = '__image__' + key + getId(); // 设置图片元素的 id\r\n    item.image = window[item.id] = new Image(); // 设置图片元素的 image，它是一个 Image 对象\r\n    doLoad(item);\r\n  }\r\n\r\n  if (!count) { // 遍历完成，如果计数为 0，则直接调用 callback\r\n    callback(success);\r\n  } else if (timeout) { // 如果用户定义了 timeout 延时，那么执行 onTimeout\r\n    timeoutId = setTimeout(onTimeout, timeout);\r\n  }\r\n\r\n  /**\r\n   * 真正进行图片的加载\r\n   *\r\n   * @param { src: string, id: string, image: Image } item 图片元素对象\r\n   */\r\n  function doLoad (item) {\r\n    item.status = 'loading';\r\n    let image = item.image;\r\n    image.onload = function () { // 图片加载成功后的回调函数\r\n      success = success & true;\r\n      item.status = 'loaded';\r\n      done();\r\n    }\r\n    image.onerror = function () { // 图片加载失败后的回调函数\r\n      success = false;\r\n      item.status = 'error';\r\n      done();\r\n    }\r\n    image.src = item.src; // 发起真正的 http 请求\r\n\r\n    /**\r\n     * 每张图片加载完成（不管成功失败）的回调函数\r\n     */\r\n    function done () {\r\n      image.onload = image.onerror = null;\r\n      try {\r\n        delete window[item.id];\r\n      } catch (e) {\r\n\r\n      }\r\n      if (!--count && !isTimeout) { // 当 count 为 0 时，当所有图片加载完成且没有超时的清空\r\n        clearTimeout(timeoutId); // 清除超时计时器\r\n        callback(success); // 且执行回调函数\r\n      }\r\n    }\r\n  }\r\n\r\n  /**\r\n   * 超时函数\r\n   */\r\n  function onTimeout () {\r\n    isTimeout = true;\r\n    callback(false);\r\n  }\r\n}\r\n\r\nlet _id = 0;\r\nfunction getId () {\r\n  return ++_id;\r\n}\r\n\r\nmodule.exports = loadImage;\n\n//# sourceURL=webpack://animation/./src/image-loader.js?");

/***/ }),

/***/ "./src/timeline.js":
/*!*************************!*\
  !*** ./src/timeline.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst DEFAULT_INTERVAL = 1000 / 60;\r\n\r\nconst STATE_INITIAL = 0; // 初始化状态\r\nconst STATE_START = 1; // 开始状态\r\nconst STATE_STOP = 2; // 停止状态\r\n\r\n/**\r\n * raf\r\n */\r\nconst requestAnimationFrame = (function () { // 立即执行函数，只做一次检测就可以了\r\n  return window.requestAnimationFrame || // 标准浏览器\r\n         window.webkitRequestAnimationFrame || // chrome\r\n         window.mozRequestAnimationFrame || // firefox\r\n         window.oRequestAnimationFrame || // opera\r\n         function (callback) {\r\n           return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);\r\n         };\r\n})();\r\n\r\n/**\r\n * caf\r\n */\r\nconst cancelAnimationFrame = (function () {\r\n  return window.cancelAnimationFrame ||\r\n         window.webkitCancelAnimationFrame ||\r\n         window.mozCancelAnimationFrame ||\r\n         window.oCancelAnimationFrame ||\r\n         function (id) {\r\n           return window.clearTimeout(id);\r\n         };\r\n})();\r\n\r\n/**\r\n * Timeline 时间轴类\r\n *\r\n * @constructor\r\n */\r\nfunction Timeline () {\r\n  this.animationHandler = 0;\r\n  this.state = STATE_INITIAL;\r\n}\r\n\r\n/**\r\n * 时间轴上每一次回调执行的函数，其实这是给 Timeline 实例实现的，所以这里不写任何代码\r\n * 例如传了 100ms，那么 Timeline 实例会在动画开始 100ms 后触发这个函数\r\n *\r\n * @param {number} time 从动画开始到当前执行的时间\r\n */\r\nTimeline.prototype.onenterframe = function (time) {\r\n\r\n};\r\n\r\n/**\r\n * 开始动画\r\n *\r\n * @param {number} interval 每一次回调的间隔时间\r\n */\r\nTimeline.prototype.start = function (interval) {\r\n  if (this.state === STATE_START) {\r\n    return;\r\n  }\r\n  this.state = STATE_START;\r\n  this.interval = interval || DEFAULT_INTERVAL;\r\n  startTimeline(this, +new Date());\r\n};\r\n\r\n/**\r\n * 停止动画\r\n */\r\nTimeline.prototype.stop = function () {\r\n  if (this.state !== STATE_START) {\r\n    return;\r\n  }\r\n  this.state = STATE_STOP;\r\n  if (this.startTime) {\r\n    this.duration = +new Date() - this.startTime; // 记录动画从开始执行到现在所经历的时间, restart() 用到\r\n  }\r\n  cancelAnimationFrame(this.animationHandler);\r\n};\r\n\r\n/**\r\n * 重新开始动画\r\n */\r\nTimeline.prototype.restart = function () {\r\n  if (this.state === STATE_START) {\r\n    return;\r\n  }\r\n  if (!this.duration || !this.interval) {\r\n    return;\r\n  }\r\n  this.state = STATE_START;\r\n  startTimeline(this, +new Date() - this.duration); // 无缝连接动画\r\n};\r\n\r\n/**\r\n * 时间轴动画启动函数\r\n *\r\n * @param {Timeline} timeline Timeline 实例\r\n * @param {number} startTime 动画开始的时间戳\r\n */\r\nfunction startTimeline (timeline, startTime) {\r\n  timeline.startTime = startTime;\r\n  nextTick.interval = timeline.interval;\r\n  let lastTick = +new Date(); // 记录上一次回调的时间戳\r\n  nextTick();\r\n  /**\r\n   * 每一帧执行的函数\r\n   */\r\n  function nextTick () {\r\n    const now = +new Date();\r\n    timeline.animationHandler = requestAnimationFrame(nextTick);\r\n    // 如果当前时间与上一次回调的时间戳大于设置的时间间隔\r\n    // 表示这一次可以执行回调函数\r\n    if (now - lastTick >= timeline.interval) {\r\n      timeline.onenterframe(now - startTime); // 暴露给实例的接口，看对应的注释\r\n      lastTick = now;\r\n    }\r\n  }\r\n}\r\n\r\nmodule.exports = Timeline;\r\n\n\n//# sourceURL=webpack://animation/./src/timeline.js?");

/***/ })

/******/ });
});