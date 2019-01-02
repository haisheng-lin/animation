function $ (id) {
  return document.querySelector('#' + id);
}

const rabbit1 = $('rabbit1');
const rabbit2 = $('rabbit2');
const rabbit3 = $('rabbit3');
const rabbit4 = $('rabbit4');

const images = ['rabbit-big.png', 'rabbit-lose.png', 'rabbit-win.png'];

const rightRunningMap = [
  '0 -854',
  '-174 -852',
  '-349 -852',
  '-524 -852',
  '-698 -852',
  '-873 -848',
];
const leftRunningMap = [
  '0 -373',
  '-175 -376',
  '-350 -377',
  '-524 -377',
  '-699 -377',
  '-873 -379',
];
const rabbitWinMap = [
  '0 0',
  '-198 0',
  '-401 0',
  '-609 0',
  '-816 0',
  '0 -96',
  '-208 -97',
  '-415 -97',
  '-623 -97',
  '-831 -97',
  '0 -203',
  '-207 -203',
  '-415 -203',
  '-623 -203',
  '-831 -203',
  '0 -307',
  '-206 -307',
  '-414 -307',
  '-623 -307',
];
const rabbitLoseMap = [
  '0 0',
  '-163 0',
  '-327 0',
  '-491 0',
  '-655 0',
  '-819 0',
  '0 -135',
  '-166 -135',
  '-333 -135',
  '-500 -135',
  '-668 -135',
  '-835 -135',
  '0 -262',
];

const animation = window.animation;

function repeat () {
  const repeatAnimation = animation().loadImage(images).changePosition(rabbit1, rightRunningMap, images[0]).repeatForever();
  repeatAnimation.start(80);
}

function run () {
  const speed = 6;
  const initLeft = 100;
  const finalLeft = 400;
  const frameLength = 6;
  let frame = 4;
  let right = true;
  const interval = 50;
  const runAnimation = animation().loadImage(images).enterFrame(function (success, time) {
    let ratio = time / interval; // 运行了几帧
    let position;
    let left;
    if (right) { // 向右跑
      position = rightRunningMap[frame].split(' ');
      left = Math.min(initLeft + speed * ratio, finalLeft);
      if (left === finalLeft) {
        right = false;
        frame = 4;
        success();
        return;
      }
    } else { // 向左跑
      position = leftRunningMap[frame].split(' ');
      left = Math.max(initLeft, finalLeft - speed * ratio);
      if (left === initLeft) {
        right = true;
        frame = 4;
        success();
        return;
      }
    }
    rabbit2.style.backgroundImage = 'url(' + images[0] + ')';
    rabbit2.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
    rabbit2.style.left = left + 'px';
    frame++;
    if (frame === frameLength) {
      frame = 0;
    }
  }).repeat(1).wait(1000).changePosition(rabbit2, rabbitWinMap, images[2]).then(function () {
    console.log('run animation finished');
  });
  runAnimation.start(interval);
}

function win () {
  const winAnimation = animation().loadImage(images).changePosition(rabbit3, rabbitWinMap, images[2]).repeat(3).then(function () {
    console.log('win animation repeat 3 times and finished');
  });
  winAnimation.start(200);
}

function lose () {
  const loseAnimation = animation().loadImage(images).changePosition(rabbit4, rabbitLoseMap, images[1]).wait(1000).repeat(1).then(function () {
    console.log('lose animation wait 1 sec and repeat 1 time and finished');
  });
  loseAnimation.start(200);
}

repeat();
win();
lose();
run();