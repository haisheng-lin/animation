'use strict';

/**
 * 预加载图片
 *
 * @param {string[] | object[]} images 需加载的图片的数组或对象
 * @param {Function} callback 全部图片加载完毕后执行的回调函数
 * @param {number} timeout 加载超时的时长
 */
function loadImage (images, callback, timeout) {
  let count = 0; // 加载完成图片的计数器
  let success = true; // 全部图片加载成功的标志位
  let timeoutId = 0; // 超时 timer 的 id
  let isTimeout = false; // 是否加载超时的标志位
  
  for (let key in images) { // 对图片数组或对象进行遍历
    if (images.hasOwnProperty(key)) { // 过滤 prototype 上的属性
      continue;
    }
    let item = iamges[key]; // 获取每个图片元素，期望格式是个 object: { src: xxx }
    if (typeof item === 'string') {
      item = images[key] = {
        src: item,
      };
    }
    if (!item || !item.src) { // 如果格式不满足期望，则丢弃此数据，进行下一次遍历
      continue;
    }
    count++; // 计数器 + 1
    item.id = '__image__' + key + getId(); // 设置图片元素的 id
    item.image = window[item.id] = new Image(); // 设置图片元素的 image，它是一个 Image 对象
    doLoad(item);
  }

  if (!count) { // 遍历完成，如果计数为 0，则直接调用 callback
    callback(success);
  } else if (timeout) { // 如果用户定义了 timeout 延时，那么执行 onTimeout
    timeoutId = setTimeout(onTimeout, timeout);
  }

  /**
   * 真正进行图片的加载
   *
   * @param { src: string, id: string, image: Image } item 图片元素对象
   */
  function doLoad (item) {
    item.status = 'loading';
    let image = item.image;
    image.onload = function () { // 图片加载成功后的回调函数
      success = success & true;
      item.status = 'loaded';
      done();
    }
    image.onerror = function () { // 图片加载失败后的回调函数
      success = false;
      item.status = 'error';
      done();
    }
    image.src = item.src; // 发起真正的 http 请求

    /**
     * 每张图片加载完成（不管成功失败）的回调函数
     */
    function done () {
      image.onload = image.onerror = null;
      try {
        delete window[item.id];
      } catch (e) {

      }
      if (!--count && !isTimeout) { // 当 count 为 0 时，当所有图片加载完成且没有超时的清空
        clearTimeout(timeoutId); // 清除超时计时器
        callback(success); // 且执行回调函数
      }
    }
  }

  /**
   * 超时函数
   */
  function onTimeout () {
    isTimeout = true;
    callback(false);
  }
}

let _id = 0;
function getId () {
  return ++_id;
}

module.exports = loadImage;