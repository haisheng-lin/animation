const imgUrl = 'rabbit-big.png';
const positions = [
  '0 -854',
  '-174 -852',
  '-349 -852',
  '-524 -852',
  '-698 -852',
  '-873 -848',
];
const ele = document.querySelector('#rabbit');

/**
 * 执行帧动画的函数
 *
 * @param {Element} ele
 * @param {string[]} positions
 * @param {string} imgUrl
 */
function animation (ele, positions, imgUrl) {

  let index = 0;
  ele.style.backgroundImage = 'url(' + imgUrl + ')';
  ele.style.backgroundRepeat = 'no-repeat';

  function run () {
    index = (index + 1) % positions.length;
    const position = positions[index].split(' ');
    ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
    setTimeout(run, 80);
  }

  run();
}

animation(ele, positions, imgUrl);