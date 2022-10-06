
const contentWrap = (function contentWrap() {
  let rows
  let liList, res;
  let morebox = document.querySelector('.morebox'),
    modmore = morebox.querySelector('.mod_more');
  //按钮切换操作
  const control = function (row, ulbox) {
    const rowItem = row;
    let ulListArr = [];

    let modList = rowItem.querySelector('.mod_list'),
      nextBtn = Array.from(rowItem.getElementsByClassName('next_btn'))[0],
      prevBtn = Array.from(rowItem.getElementsByClassName('prev_btn'))[0],
      ulList = ulbox;
    ulListArr.push(ulList);

    const operationBtn = function operationBtn() {
      //移入
      const btnEnter = function btnEnter() {
        this.style.color = 'hsla(0, 0%, 100%, 0.4)';
      }
      //移出
      const btnLeave = function btnEnter() {
        this.style.color = 'hsla(0, 0%, 100%, 0.2)';
      }

      //点击左右按钮内容移动

      ulList.style.marginLeft = '0px';

      let itemLi = ulList.children[0];//获取一个li
      let itemLiMarginRight = parseInt(getComputedStyle(itemLi).marginRight) //每个li的margin-right值
      ulList.maxWidth = ulList.scrollWidth - itemLiMarginRight;
      ulList.nowWidth = ulList.offsetWidth;

      const toNextPage = function toNextPage() {
        let ulListMaginLeft = parseInt(ulList.style.marginLeft);
        let moveDistance = modList.offsetWidth + itemLiMarginRight;
        if (ulList.nowWidth < ulList.maxWidth) {
          if ((ulList.maxWidth - ulList.nowWidth) > moveDistance) {
            ulList.style.marginLeft = `${ulListMaginLeft - moveDistance}px`;
            ulList.nowWidth += moveDistance;
            return;
          }
          ulList.style.marginLeft = `${ulListMaginLeft - (ulList.maxWidth - ulList.nowWidth)}px`;
          ulList.nowWidth += (ulList.maxWidth - ulList.nowWidth);
        }

      }

      const toPrevPage = function toPrevPage() {
        let ulListMaginLeft = parseInt(ulList.style.marginLeft);
        let moveDistance = modList.offsetWidth + itemLiMarginRight;
        if (ulListMaginLeft < 0) {
          if (ulList.nowWidth - moveDistance > moveDistance) {
            ulList.style.marginLeft = `${ulListMaginLeft + moveDistance}px`;
            ulList.nowWidth -= moveDistance;
            return;
          }
          ulList.style.marginLeft = `0px`;
          ulList.nowWidth = moveDistance - itemLiMarginRight;
        }
      }

      nextBtn.addEventListener('mouseenter', btnEnter);
      nextBtn.addEventListener('mouseleave', btnLeave);
      nextBtn.addEventListener('click', toNextPage);
      prevBtn.addEventListener('mouseenter', btnEnter);
      prevBtn.addEventListener('mouseleave', btnLeave);
      prevBtn.addEventListener('click', toPrevPage);

      window.onresize = function () {
        ulListArr.forEach(item => {
          item.style.marginLeft = '0px';
          item.nowWidth = item.parentNode.offsetWidth;
          item.maxWidth = item.children.length * (itemLi.offsetWidth + itemLiMarginRight) - itemLiMarginRight;
        })
      }
    }
    operationBtn();





  }

  //获取数据渲染,各部分的渲染数据都从这里获取
  const render = async function render() {
    res = await axios.get('./json/header.json');
    renderOneLeft();
    renderOneRight();
    renderSecond();
    renderThird();
    renderVariety();
    renderAd();
    renderChild();
    liList = document.querySelectorAll('.contentList');
    rows = document.querySelectorAll('.row');
    delayLoading();
    delayLoadingRow();
    hideDark();
    renderSport();
    obrenderMore();
  }

  //猜你喜欢----今日热点,公共渲染方法 ---传参-> 元素容器名--title数据--内容数据
  const renderFirstRow = function renderFirstRow(rowboxName, titledata, contentdata) {
    let modTeaderTitle = rowboxName.querySelector('.mod_header .mod_header_title'),
      controlbtn = rowboxName.querySelector('.mod_header_title .control_btn'),
      modUl = rowboxName.querySelector('.mod_list .mod_ul');

    //第一行左列
    //插入title--猜你喜欢
    let spanTitle = document.createElement('span');
    spanTitle.className = 'title';
    spanTitle.innerHTML = titledata;
    modTeaderTitle.insertBefore(spanTitle, controlbtn);
    //内容
    let str1 = '';
    contentdata.forEach((item, index) => {
      if (index >= 1) {
        let { playtitle, desc, imgurl, newest } = item;
        if (!newest) newest = '';
        str1 += `
                <li class="contentList">  
                  <div class="mod-link-wrap">
                    <a class="mod-link">
                      <img src="" data_src="${imgurl}" alt="">
                      <div class="icon_br">
                        <span class="newest" newest="${newest}"></span>
                      </div>
                    </a>
                  </div>
                  <div class="title_wrap">
                    <p class="main" playtitle="${playtitle}"></p>
                    <p class="sub" desc="${desc}"></p>
                  </div>
                </li>`
      }
    })
    modUl.innerHTML = str1;
    control(rowboxName, modUl);
  }

  //猜你喜欢--渲染
  const renderOneLeft = function renderOneLeft() {
    let rowoneLeftdata = res.data.rowoneLeft,
      title = rowoneLeftdata[0].title;
    let rowoneLeft = document.querySelector('.row_one_left');
    renderFirstRow(rowoneLeft, title, rowoneLeftdata);
  }
  //今日热点--渲染
  const renderOneRight = function renderOneRight() {
    let rowonerightdata = res.data.rowoneRight,
      title = rowonerightdata[0].title;
    let rowoneRight = document.querySelector('.row_one_right');
    renderFirstRow(rowoneRight, title, rowonerightdata);
  }
  //公共渲染方法 ---传参-> 元素容器名--title数据--内容数据
  const renderPublic = function renderPublic(rowboxName, titledata, contentdata) {
    let headerList = rowboxName.querySelector('.mod_header .headerList'),
      modUl = rowboxName.querySelector('.mod_list .mod_ul');
    //标题部分渲染
    let frag1 = document.createDocumentFragment(),
      titleLi = document.createElement('li');
    titleLi.className = 'title';
    titleLi.innerHTML = titledata.title;
    frag1.appendChild(titleLi);

    if (titledata.title2) {
      let titleList = titledata.title2;
      titleList.forEach((text, index) => {
        let li = document.createElement('li');
        if (index === 0) {
          li.innerHTML = `<a href="">${text}</a>`;
          frag1.appendChild(li);
          return;
        }
        li.innerHTML = `<i>|</i><a href="">${text}</a>`;
        frag1.appendChild(li);
      })
    }
    headerList.appendChild(frag1);

    //内容部分渲染
    let frag2 = document.createDocumentFragment();
    contentdata.forEach((item, index) => {
      if (index > 0) {
        let { playtitle, desc, imgurl, newest } = item;
        if (!newest) newest = "";
        let li = document.createElement('li');
        li.className = 'contentList';
        li.innerHTML = `
                  <div class="mod-link-wrap">
                    <a class="mod-link">
                      <img src="" data_src="${imgurl}">
                      <div class="icon_br">
                        <span class="newest" newest="${newest}"></span>
                      </div>
                    </a>
                  </div>
                  <div class="title_wrap">
                    <p class="main" playtitle="${playtitle}"></p>
                    <p class="sub" desc="${desc}"></p>
                  </div>
        `
        frag2.appendChild(li);
      };
    })
    modUl.appendChild(frag2);
    control(rowboxName, modUl);
  }

  //电视剧--渲染
  const renderSecond = function renderSecond() {
    let rowSecondData = res.data.rowSecond,
      titledata = rowSecondData[0];
    let rowSecondBox = document.querySelector('.row_two_inner');
    renderPublic(rowSecondBox, titledata, rowSecondData)

  }

  //电影--渲染
  const renderThird = function renderThird() {
    let rowSecondData = res.data.rowThird,
      titledata = rowSecondData[0];
    let rowThirdbox = document.querySelector('.row_three_inner');
    renderPublic(rowThirdbox, titledata, rowSecondData);
  }

  //综艺--渲染
  const renderVariety = function renderVariety() {
    let data = res.data.variety_data,
      titledata = data[0];
    let row_variety_inner = document.querySelector('.row_variety_inner');
    renderPublic(row_variety_inner, titledata, data);
  }

  //赛事--渲染
  const renderSport = function renderSport() {
    let rowSportsInner = document.querySelector('.row_sports_inner');
    headerList = rowSportsInner.querySelector('.mod_header .headerList'),
      modUl = rowSportsInner.querySelector('.ec__list .ec__ul');
    let rowSportsData = res.data.sports,
      titledata = rowSportsData[0],
      titleList = titledata.title2;

    //标题部分渲染
    let frag1 = document.createDocumentFragment(),
      titleLi = document.createElement('li');
    titleLi.className = 'title';
    titleLi.innerHTML = titledata.title;
    frag1.appendChild(titleLi);

    titleList.forEach((text, index) => {
      let li = document.createElement('li');
      if (index === 0) {
        li.innerHTML = `<a href="">${text}</a>`;
        frag1.appendChild(li);
        return;
      }
      li.innerHTML = `<i>|</i><a>${text}</a>`;
      frag1.appendChild(li);
    })
    headerList.appendChild(frag1);

    //内容部分渲染
    let frag2 = document.createDocumentFragment();
    rowSportsData.forEach((item, index) => {
      if (index > 0) {
        let { title, leftimg, timetext, rightimg, leftteamname, rightteamname } = item;
        let li = document.createElement('li');
        li.className = 'contentList';
        li.innerHTML = `
        <div class="ec__content">
        <p class="ec__title">${title}</p>
        <div class="ec__team">
          <p class="ec__team__item">
            <img src="${leftimg}" alt="">
          </p>
          <div class="scroll">
            <p class="timeline">${timetext[0]}</p>
            <p class="timeline">${timetext[1]}</p>
          </div>
          <p class="ec__team__item">
            <img src="${rightimg}" alt="">
          </p>
        </div>
        <div class="ec__team__name">
          <p title="${leftteamname}" class="ec__ellipsiss ">${leftteamname}</ptitle=>
          <p title="${rightteamname}" class="ec__ellipsiss">${rightteamname}</p>
        </div>
        <div class="ec_combine">
          <div class="ec__team__item__name">
            <div class="yuyue_wrap">
              <span class="mp_yuyue_link mp-toyuyue">
                <span class="mp-txt-toyuyue">预约<span>
                  </span>
            </div>
          </div>
        </div>
      </div>
        `
        frag2.appendChild(li);
      };
    })
    modUl.appendChild(frag2);

    control(rowSportsInner, modUl)
  }

  //儿童--渲染
  const renderChild = function renderChild() {
    let data = res.data.row_childData,
      titledata = data[0];
    let row_child_inner = document.querySelector('.row_child_inner');
    renderPublic(row_child_inner, titledata, data);
  }

  //推广广告--操作
  let theatreitemList;//每个a标签
  const controlAd = function controlAd(data) {
    for (let i = 0; i < theatreitemList.length; i++) {
      theatreitemList[i].onmouseenter = function () {
        this.classList.add('theatre_hover');
        this.index = i;
        if (this.index > 0 && this.index < 5) {
          for (let n = 0; n < this.index; n++) {
            theatreitemList[n].classList.add("theatre_no_width");
          }
          return;
        }
        if (this.index >= 5) {
          for (let m = 0; m < this.index - 2; m++) {
            theatreitemList[m].classList.add("theatre_no_width");
          }
        }

      }
      theatreitemList[i].onmouseleave = function () {
        this.classList.remove('theatre_hover');
        if (this.index > 0 && this.index < 5) {
          for (let n = 0; n < this.index; n++) {
            theatreitemList[n].classList.remove("theatre_no_width");
          }
          return;
        }
        if (this.index >= 5) {
          for (let m = 0; m < this.index - 2; m++) {
            theatreitemList[m].classList.remove("theatre_no_width");
          }
        }
      }

    }

    let arrowleftBtn = document.querySelector('.theatre_arrow_left'),
      arrowrightBtn = document.querySelector('.theatre_arrow_right');

    if (theatreitemList.length < data.length) {
      arrowleftBtn.onclick = function () {
        data.reverse();
        renderAd();
      }
      arrowrightBtn.onclick = function () {
        data.reverse();
        renderAd();
      }
      return;
    }
    arrowleftBtn.onclick = null;
    arrowrightBtn.onclick = null;
  }

  //推广广告--渲染
  const renderAd = function renderAd() {
    let data = res.data.ad_wrapData;
    let str = '';
    let theatre_carousel_box = document.querySelector('.theatre_carousel_box');
    let boxWidth = theatre_carousel_box.parentNode.offsetWidth;
    data.forEach((item, index) => {
      let { leftimgurl, rightimgurl } = item;
      if (boxWidth <= 1196 && index <= 4) {
        str += `
        <a href="" class="theatre-item">
        <div class="theatre_expand">
          <div class="theatre_left">
            <img src="${leftimgurl}" alt="">
          </div>
          <div class="theatre_right">
            <img src="${rightimgurl}" alt="">
          </div>
        </div>
      </a>
        `
      } else if (boxWidth > 1196 && boxWidth <= 1400 && index <= 5) {
        str += `
        <a href="" class="theatre-item">
        <div class="theatre_expand">
          <div class="theatre_left">
            <img src="${leftimgurl}" alt="">
          </div>
          <div class="theatre_right">
            <img src="${rightimgurl}" alt="">
          </div>
        </div>
      </a>
        `
      } else if (boxWidth > 1400) {
        str += `
        <a href="" class="theatre-item">
        <div class="theatre_expand">
          <div class="theatre_left">
            <img src="${leftimgurl}" alt="">
          </div>
          <div class="theatre_right">
            <img src="${rightimgurl}" alt="">
          </div>
        </div>
      </a>
        `
      }
    })
    theatre_carousel_box.innerHTML = str;
    theatreitemList = Array.from(document.querySelectorAll('.theatre-item'));
    controlAd(data);
  }
  window.addEventListener('resize', renderAd);


  //加载更多--渲染
  const renderMore = function renderMore() {
    let data = res.data.moreboxData;
    //渲染基本结构
    data.forEach((item, index) => {
      let div = document.createElement('div');
      div.className = 'row clearfix';
      div.innerHTML = `
      <div class="morebox_inner${index} row_list clearfix">
      <div class="mod_header">
        <h2 class="mod_header_title">
          <div class="control_btn">
            <span class="prev_btn">
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                class="leftarrow_cu">
                <path
                  d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm2.439 4.95a1.429 1.429 0 0 0-2.02 0L5.367 10l5.05 5.05.125.112c.56.444 1.378.407 1.896-.111l.11-.125a1.429 1.429 0 0 0-.11-1.896L9.409 10l3.03-3.03.11-.125a1.429 1.429 0 0 0-.11-1.896z"
                  data-v-0324911b=""></path>
              </svg>
            </span>
            <span class="next_btn">
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                class="rightarrow_cu" data-v-0324911b="">
                <path
                  d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM7.561 4.95a1.429 1.429 0 0 1 2.02 0L14.633 10l-5.05 5.05-.125.112a1.429 1.429 0 0 1-1.896-.111l-.11-.125a1.429 1.429 0 0 1 .11-1.896l3.03-3.03-3.03-3.03-.11-.125a1.429 1.429 0 0 1 .11-1.896z"
                  data-v-0324911b=""></path>
              </svg>
            </span>
          </div>
        </h2>
      </div>
      <div class="mod_list">
        <ul class="mod_ul" style="margin-left: 0px;">
        </ul>
      </div>
    </div>
      `
      morebox.insertBefore(div, modmore);

      //渲染内容
      let box = document.querySelector(`.morebox_inner${index}`),
        titledata = item[0].title;
      //调用渲染的方法
      renderFirstRow(box, titledata, item);
    })
  }

  //监控当页面滚动最下边时开始加载更多的渲染
  const obrenderMore = function obrenderMore() {
    //获取morebox的上一个兄弟盒子，监控这个盒子
    let prevBox = morebox.previousElementSibling;
    let timer;
    let ob2 = new IntersectionObserver(box => {
      if (box[0].isIntersecting) {
        modmore.innerHTML = `
        <span>加载中...</span>
        `
        ob2.unobserve(prevBox);
        return new Promise(resolve => {
          timer = setTimeout(() => {
            renderMore();
            resolve();
          }, 1500)
        }).then(() => {
          timer = null;
          modmore.innerHTML = `
          <span data-v-3d6e72b3="" data-v-3d14d529="" class="mod_more_svg"><svg data-v-3d6e72b3="" data-v-3d14d529=""
          width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          <g data-v-3d6e72b3="" data-v-3d14d529="" id="看更多" stroke="none" stroke-width="1" fill="none"
            fill-rule="evenodd">
            <g data-v-3d6e72b3="" data-v-3d14d529="">
              <path data-v-3d6e72b3="" data-v-3d14d529=""
                d="M10.3192319,7.17033132 L11.8985764,9.42653766 C12.2152909,9.87898695 12.1052561,10.5025174 11.6528068,10.8192319 C11.4847232,10.9368904 11.2845165,11 11.0793444,11 L7.92065556,11 C7.36837081,11 6.92065556,10.5522847 6.92065556,10 C6.92065556,9.7948279 6.98376517,9.59462119 7.10142364,9.42653766 L8.68076808,7.17033132 C8.99748259,6.71788202 9.62101305,6.60784723 10.0734623,6.92456174 C10.1691037,6.99151066 10.252283,7.07468999 10.3192319,7.17033132 Z"
                id="三角形" fill="#00CC4C"
                transform="translate(9.500000, 8.500000) rotate(-270.000000) translate(-9.500000, -8.500000) ">
              </path>
              <circle data-v-3d6e72b3="" data-v-3d14d529="" id="椭圆形" stroke="#00CC4C" stroke-width="2" cx="8.5"
                cy="8.5" r="7.5"></circle>
            </g>
          </g>
        </svg></span>
      <span>看更多</span>
          `
          liList = document.querySelectorAll('.contentList');
          rows = document.querySelectorAll('.row');
          delayLoading();
          delayLoadingRow();
          hideDark();
        })
      }

    }, { threshold: [1] })
    ob2.observe(prevBox);
  };


  //图片加载
  const load = function load(img) {
    let dataSrc = img.getAttribute('data_src');
    let newImg = new Image;
    newImg.src = dataSrc;
    newImg.onload = function () {
      img.src = dataSrc;
      img.style.opacity = 1
    }
  }


  //图片文字延迟加载
  const delayLoading = function delayLoading() {
    let ob = new IntersectionObserver(changes => {
      for (let i = 0; i < changes.length; i++) {
        if (changes[i].isIntersecting) {
          let target = changes[i].target;
          let img = target.querySelector('img'),
            newest = target.querySelector('.newest'),
            main = target.querySelector('.main'),
            mainA = document.createElement('a');
          sub = target.querySelector('.sub');

          let newestInner = newest.getAttribute('newest'),
            mainInner = main.getAttribute('playtitle'),
            subInner = sub.getAttribute('desc');
          load(img);
          newest.innerHTML = newestInner;
          mainA.innerHTML = mainInner;
          main.appendChild(mainA)
          sub.innerHTML = subInner;
          ob.unobserve(target);
        }

      }
    }, {
      threshold: [.5]
    })
    liList.forEach(li => {
      ob.observe(li);
    })
  }

  //控制每行首次出现在可视区域的效果
  const delayLoadingRow = function delayLoadingRow() {
    let ob = new IntersectionObserver(changes => {
      for (let i = 0; i < changes.length; i++) {
        let target = changes[i].target;
        if (changes[i].isIntersecting) {
          target.style.opacity = 1;
          target.style.animation = 'delayloding .5s';
          ob.unobserve(target);
        }
      }
    }, {
      threshold: [.1]
    })
    rows.forEach(row => {
      ob.observe(row)
    })

  }

  //当鼠标划入时渲染一个隐藏盒子---->qy_dark盒子
  let imgurlArr = [];
  const hideDarkRender = function hideDarkRender(imgurl, box) {
    if (!imgurlArr.includes(imgurl)) {
      imgurlArr.push(imgurl);
      let darkBlock = document.createElement('div');
      darkBlock.className = `dark_block`;
      darkBlock.innerHTML = `
  <a href="">
    <div class="img_wrap">
      <div class="img"><img src="${imgurl}" alt=""></div>
    </div>
    <div class="content">
      <span class="title">XXXX</span>
      <div class="tab_wrap">
        <span class="tab">XX</span>
        <span class="tab">XX</span>
        <span class="tab">XX</span>
      </div>
      <div class="people">
        <span>主演：XXX/XXX/XXX/XXX</span>
      </div>
      <div class="desc">

      </div>
      <a href="" class="play_btn">
        <svg data-v-0697eb04="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          width="10" height="12">
          <path data-v-0697eb04=""
            d="M884.622222 440.888889L216.177778 25.6C159.288889-11.377778 85.333333 31.288889 85.333333 96.711111v830.577778c0 68.266667 73.955556 108.088889 130.844445 71.111111l671.288889-415.288889c51.2-31.288889 51.2-110.933333-2.844445-142.222222z">
          </path>
        </svg>
        立即播放
      </a>
    </div>
  </a>
    `
      box.appendChild(darkBlock);
    }
  }

  //隐藏盒子显示
  const hideDark = function hideDark() {
    let modUl = Array.from(document.querySelectorAll('.mod_ul'));
    let qyDark = document.querySelector('.qy_dark');
    let darkList;

    modUl.forEach(ul => {
      ul.onmouseover = function (ev) {
        let target = ev.target
        if (target.tagName === 'IMG') {
          let imgurl = target.src,
            top = ev.pageY - ev.offsetY - 40,
            left = ev.pageX - ev.offsetX - 40;

          hideDarkRender(imgurl, qyDark);

          darkList = document.querySelectorAll('.dark_block');
          for (let i = 0; i < darkList.length; i++) {
            let nowimgurl = darkList[i].querySelector('img').src;
            if (imgurl === nowimgurl) {
              darkList[i].style.top = `${top}px`;
              darkList[i].style.left = `${left}px`;
              darkList[i].classList.add("card_hover");
              return;
            }
            darkList[i].style.top = `${top}px`;
            darkList[i].style.left = `${left}px`;
            darkList[i].classList.add("card_hover");
          }
        }
      }

      qyDark.onmouseout = function () {
        darkList.forEach(item => {
          item.classList.remove('card_hover');
        })
      }
    })
  }

  return {
    finally() {
      render();
    }
  }
})();

contentWrap.finally();


