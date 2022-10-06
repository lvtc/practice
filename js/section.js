const section = (function () {
  let wrapper = document.querySelector('.wrapper'),
    pagination = document.querySelector('.pagination'),
    slideImg = document.querySelector('.slideTitimg img'),
    sectionBox = document.querySelector('section'),
    html = document.documentElement;

  //轮播图鼠标操作部分
  const operation = function operation() {
    let container = document.querySelector('#container1'),
      slideList = Array.from(container.querySelectorAll('.slide')),
      paginationList = Array.from(container.querySelectorAll('.pagination div'));
    //console.log(container,slideList,paginationList,btnPrev,btnNext);
    /* 
    count:记录轮播图的数量
    intervar:自动轮播的时间因子(多久切换一次)
    speed:每一次切换的运动所需的时间(transition动画过渡时间)单位：毫秒
    step:记录当前展示这张的索引
    prev:记录上一张展示的索引
    autoTimer：存储自动轮播的定时器
    */
    let count = slideList.length,
      interval = 25000,
      speed = 300,
      step = 0,
      prev = 0,
      autoTimer = null;

    /*定义初始样式*/
    const initial = function initial() {
      step = step <= 0 ? 0 : (step > count - 1 ? count - 1 : step);
      prev = step;
      slideList.forEach((slide, index) => {
        slide.style.transitionDuration = '0ms';
        if (step === index) {
          //默认展示
          slide.style.opacity = 1;
          slide.style.zIndex = 1;
          return;
        }
        //其余移出
        slide.style.opacity = 0;
        slide.style.zIndex = 0;
      });
      paginationList.forEach((pagination, index) => {
        if (index === step) {
          pagination.classList.add('active');
          return
        }
        pagination.classList.remove('active');
      });
    };
    initial();

    /* 控制切换*/
    const autoFocus = function autoFocus() {
      //控制当前选中上一个移出选中
      paginationList[step].classList.add('active');
      paginationList[prev].classList.remove('active');
      //把当前所引赋值给prev，作为下一次切换的上一个索引项
      prev = step;
    }

    const move = function move() {
      let cur = slideList[step],
        pre = slideList[prev]
      //先改层级
      cur.style.zIndex = 1;
      pre.style.zIndex = 0;
      //再改透明度
      cur.style.transitionDuration = speed + 'ms';
      cur.style.opacity = 1;
      cur.ontransitionend = () => {
        //动画结束后
        pre.style.transitionDuration = '0ms';
        pre.style.opacity = 0;
      }
      //分页器对齐
      autoFocus();
      slideImg.src = `./images/轮播图/titleimg${step + 1}.png`

    }

    const moveToNext = function moveToNext() {
      step++;
      if (step > count - 1) step = 0;
      move();
    }
    const moveToPrev = function moveToPrev() {
      step--;
      if (step < 0) step = count - 1;
      move();
    }
    //自动轮播
    if (autoTimer === null) autoTimer = setInterval(moveToNext, interval);
    //控制按钮点击
    const handle = function handle() {
      //鼠标移入移出暂停或重启自动轮播
      container.onmouseenter = function () {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      container.onmouseleave = function () {
        if (autoTimer === null) autoTimer = setInterval(moveToNext, interval);
      }
      //页卡切换时也要控制自动轮播的暂定和重启
      document.onvisibilitychange = function () {
        if (document.hidden) {
          clearInterval(autoTimer);
          autoTimer = null;
          return;
        }
        if (autoTimer === null) autoTimer = setInterval(moveToNext, interval);
      }
      //点击分页器控制切换
      paginationList.forEach((item, index) => {
        item.onmouseenter = function () {
          if (step === index) return;
          step = index;
          move();
        }
      })
    }();
  }

  //渲染部分
  const sectionRender = async function sectionRender() {
    let res = await axios.get('./json/header.json');
    let data = res.data.Carousel_chart;
    let str = '',
      frag = document.createDocumentFragment();

    data.forEach(item => {
      let { bgurl, desc, title, titleimg } = item;
      let slide = document.createElement('div');
      slide.className = 'slide';
      slide.style.backgroundImage = `url(${bgurl})`;
      frag.appendChild(slide);

      str += `
      <div class="panel-item">
            <a href="" class="panel-item-link">
              <p class="panel-item-title">
                <span class="title-main">${title}</span>
              </p>
              <p class="panel-item-dec">${desc}</p>
            </a>
          </div>
      `
    })
    wrapper.appendChild(frag);
    pagination.innerHTML = str;
    operation();
    rollControl();
  }

  //页面滚动后盖住轮播图之后把section的透明度改为0
  const rollControl = function rollControl() {
    window.addEventListener('scroll', function () {
      if (html.scrollTop >= 586) {
        sectionBox.style.display = 'none'
        return;
      }
      sectionBox.style.display = 'block'
    })
  }

  return {
    finally() {
      sectionRender();

    }
  }

})();
section.finally();