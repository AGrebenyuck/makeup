
$(function(){

  // Dynamic Adapt v.1
  "use strict";

  function DynamicAdapt(type) {
    this.type = type;
  }

  DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");

    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    });

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
        return item.breakpoint === mediaBreakpoint;
      });
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };

  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
    } else {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname)) {
          this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
      }
    }
  };

  // Функция перемещения
  DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend', element);
      return;
    }
    if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
  }

  // Функция возврата
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }

  // Функция получения индекса внутри родителя
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return -1;
          }

          if (a.place === "last" || b.place === "first") {
            return 1;
          }

          return a.place - b.place;
        }

        return a.breakpoint - b.breakpoint;
      });
    } else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return 1;
          }

          if (a.place === "last" || b.place === "first") {
            return -1;
          }

          return b.place - a.place;
        }

        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };

  const da = new DynamicAdapt("max");
  da.init();

  var destinations = new Swiper('.destinations__swiper', {
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true
    },
    breakpoints: {
      320: {
        direction: 'horizontal',    
      },
      450: {
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          renderBullet: function(index, currentClass){
            let num = index + 1;
            if(num < 10){
              num = '0' + num;
            }
            return `<span class="${currentClass}">${num}</span>`
          },
          clickable: true,
        },    
      },
      1600: {
        direction: 'vertical',
      }
    }
  });

  $('.portfolio-page__tab').on('click', function(){
    $('.portfolio-page__tab').removeClass('portfolio-page__tab--active');
    $(this).addClass('portfolio-page__tab--active');
  })

  $('.forma__textarea').on('keyup', function(){
    let length = $('.forma__textarea').prop('textLength');
    let max = $('.forma__textarea').attr('maxlength');
    $('.forma__num-curr').text(length);
    $('.forma__num-max').text(max);
  })

  $('.dropdown-menu__link').on('click', function(e){
    e.preventDefault();
    let id = $(this).attr('href');

    $('.dropdown-menu__link').removeClass('dropdown-menu__link--active');
    $('.testimonial__item').removeClass('testimonial__item--active');

    $(this).addClass('dropdown-menu__link--active');
    $(`[data-customer=${id}]`).addClass('testimonial__item--active');
  })
  
  var featured = new Swiper('.featured__swiper', {
    breakpoints: {
      320: {
        spaceBetween: 24,
        slidesPerView: 1,
        slidesPerGroup: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      450: {
        spaceBetween: 24,
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      768: {
        spaceBetween: 24,
        slidesPerView: 3,
        slidesPerGroup: 3,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      1150: {
        spaceBetween: 24,
        slidesPerView: 4,
        slidesPerGroup: 4,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      }
    },
  });

  var headerContent = new Swiper('.header-content__swiper', {
    breakpoints: {
      320: {
        initialSlide: 1,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
      },
      1150: {
        initialSlide: 1,
        spaceBetween: 65,
      }
    },
    
  });

  $('body').on('click', function(e){
    if(!$('.submenu').is(e.target) && $('.submenu').has(e.target).length === 0 && !$('.menu__link--submenu').is(e.target)){
      $('.submenu').removeClass('submenu--active');
    }
  })

  var width = $(window).width();

  if(width < 450){
    $('.footer__list-link--makeup').clone().appendTo('.menu__list');
    $('.footer__list-link--course').clone().appendTo('.menu__list');
    $('.footer__social').clone().appendTo('.menu__list');
  }else {
    $('.menu__list').find('.footer__social').remove();
    $('.menu__list').find('.footer__list-link--makeup').remove();
    $('.menu__list').find('.footer__list-link--course').remove();
  }

  $('.menu__btn').on('click', function(){
    $(this).toggleClass('menu__btn--active');
    $('.menu__list').toggleClass('menu__list--active');
  })

  $('.menu__link').on('click', function(e){
    if(width > 950){
      if($(this).hasClass('menu__link--submenu')){
        e.preventDefault();
        let data = $(this).attr('data-menu');
        let offset = $('.container').offset();
        $(`[data-submenu=${data}]`).css({
          'width': $('.container').width(),
          'left' : offset.left + 15,
        })
        $(`[data-submenu=${data}]`).toggleClass('submenu--active');
        $(this).toggleClass('rotate-triangle')
      }
    }else{
      if($(this).hasClass('menu__link--submenu')){
        e.preventDefault();
        $(this).parent().next().slideToggle(); 
      }
    }
  })
  
  $('.submenu').on('mousemove', function(e){
    var x,y,offset;

    offset = $(this).offset();
    x = e.pageX - offset.left;
    y = e.pageY - offset.top;
    x = x + 'px';
    y = y + 'px';

    $($(this).find('.submenu__circle')).css({'left':`${x}`, 'top': `${y}`});
  });

  $('.header-content__scroll-link').on('click',function(e) {
    $('html').animate({scrollTop:$(document).height()}, 'slow');
  })
  
})