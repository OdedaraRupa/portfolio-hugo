"use strict";

const pixelParam = {
  
  cursor: {
    run: true,
    speed: 0.35,
    speedInner: 0.15
  },
  scrollbar: {
    duration: 1.5,
    smooth: true,
    smoothTouch: false,
    mouseMultiplier: 1
  },
  name: "EXFOLIO"
};

(function ($) {
  "use strict";

  preloader();
  effectBackForward();

  async function reloadAjax($off, $el = $(document)) {
    pixelGrid.hdevStartTheme();

    if (!$off) {
      window.$effectScroll = await effectScroller();
      window.$animate = await pixelGrid.effectAnimate();
    }

    imgPosition();
    gridGaps();
    await $effectScroll.start();
    await $animate.allInt();
    await loadLazyImage($el, ['bg', 'src']);
    await compareTowImage();
    await serviceSection($el);
    await scrollBarWidth();
    await menuInit();
    await dropHash();
    await projectSlider().run();
   
    await tabs($el);
    if (!$off) await Isotope($el);else setTimeout(Isotope, 500);
    if (!$body.hasClass('elementor-editor-active')) pixelAjax() && (await pixelAjax().start());
    await list_project($el);
    await mouseCirMove($off);
    await marquee($el);
    await hoverImage();
    if (!$off) changeStyle();
  }

  function hoverImage($el = $(document)) {
    const {
      motionHoverEffect
    } = pixelGrid;
    const itemWrap = $el.find('.pixel-style-hover-list ');
    itemWrap.each(function (index, item) {
      const animateStyle = pixelGrid.getData(item, "fx", "1");
      $(item).find(".pixel-style-hover").each(function (i, item) {
        const effect = new motionHoverEffect["HoverImgFx" + (animateStyle || "1")](item);
        pixelGrid.killAjax(() => {
          effect.kill();
        });
      });
    });
  }

  function marquee($el = $(document)) {
    if (typeof $.fn.marquee !== 'function') return;
    $el.find(".pixel-marquee").each((index, item) => {
      const marquees = $(item).marquee(pixelGrid.getData(item, 'option', {}) || {});
      pixelGrid.killAjax(() => {
        marquees === null || marquees === void 0 ? void 0 : marquees.marquee('destroy');
      });
    });
  }
  /**
   * Option Style Pages
   */


  function changeStyle() {
    const options = $('#pixel_box_options');

    function handleStyle() {
      const isDark = $body.hasClass('v-dark'),
            _dark = $('.v-dark'),
            _light = $('.v-light');

      $body.toggleClass('v-dark');

      _dark.removeClass('v-dark').addClass('v-light');

      _light.addClass('v-dark').removeClass('v-light');

      pixelGrid.hs.putColor(isDark ? 'v-light' : 'v-dark');
    }

    options.on('click', function () {
      handleStyle();
    });
  }

  function imgPosition() {
    $("[data-pixel-position]").each(function () {
      if (this.nodeName === "IMG") $(this).css("object-position", pixelGrid.getData(this, "position", "center"));else $(this).css("background-position", pixelGrid.getData(this, "position", "center"));
    });
  }

  function gridGaps() {
    $(".d-grid[data-pixel-gap]").each(function () {
      const gap = pixelGrid.getData(this, "gap", "30px 30px");
      const split = gap.split(" ");
      this.style.gridGap = gap;
      this.style.setProperty("--grid-gap", gap);

      if (this.classList.contains('pixel-isotope')) {
        if (split.length > 1) {
          this.style.setProperty("--grid-gap-row", split[0]);
          this.style.setProperty("--grid-gap-col", split[1]);
          this.style.setProperty("--grid-gap", split[1]);
        } else if (split.length) {
          this.style.setProperty("--grid-gap-row", split[0]);
          this.style.setProperty("--grid-gap-col", split[0]);
          this.style.setProperty("--grid-gap", split[0]);
        }
      }
    });
    $("[data-pixel-iconsize]").each(function () {
      this.style.setProperty("--pixel-icon-size", pixelGrid.getData(this, "iconsize"));
    });
  }
  /**
   *
   * servicestab
   *
   */


  function tabs($el) {
    $el.find(".pixel-tabs").each(function () {
      const $this = $(this);
      $this.on("click", ".link-click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $this.find("#" + $(this).attr("id") + "-content").fadeIn(1000).siblings().hide();
      });
      pixelGrid.killAjax(() => {
        $this.off("click", ".link-click");
      });
    });
  }


 
  /**
   *
   * @param $el
   */


  
  function preloader() {
    const preloader = $("#pixel_preloader");

    if (!preloader.length) {
      window.addEventListener('DOMContentLoaded', function () {
        reloadAjax().catch($err => {
          console.log($err);
        });
      });
      return false;
    }

    $body.css('overflow', 'hidden');
    const progress_number = preloader.find(".loading-count"),
          logoBoxTitle = preloader.find('.logo-box'),
          present = {
      value: 0
    };
    const char = pixelGrid.spltting.Char(logoBoxTitle.get(0));
    const animateText = gsap.timeline({
      // paused : true,
      repeat: -1
    });

    const ani = function (from = "start") {
      return {
        scaleY: 1.25,
        y: -15,
        yoyo: true,
        // marginRight : 10,
        ease: "back.out(4)",
        force3D: true,
        stagger: {
          amount: 0.3,
          from
        }
      };
    };

    if (char) {
      animateText.to(char.chars, ani()).to(char.chars, { ...ani("end"),
        scaleY: 1,
        y: 0,
        ease: "back.in(4)",
        marginRight: 0
      });
    }

    const updateVal = (val, isSetVal) => {
      progress_number.text(val.toFixed(0) + "%");
      if (isSetVal) present.value = val;
      preloader.css('--wd-progress', val.toFixed(0) + "%");
    };

    const timer = pixelGrid.pageLoad({
      startTime: 0,
      endTime: 100,
      duration: 5000,

      onProgress(val) {
        updateVal(val, true);
      }

    });
    window.addEventListener('DOMContentLoaded', function () {
      clearInterval(timer);
      const tl = gsap.timeline();
      tl.to(present, 3, {
        value: 100,

        onUpdate() {
          updateVal(present.value, true);
        }

      }).call(function () {
        reloadAjax().catch($err => {
          console.log($err);
        });
      }).to(preloader.find('> *:not(.bg-load)'), {
        autoAlpha: 0
      }).to(preloader.find('.bg-load'), {
        yPercent: -100,
        ease: Expo.easeInOut,
        duration: 1.5
      }).to(preloader.find('.bg-load .separator__path'), {
        attr: {
          d: pixelGrid.getData(preloader.find('.bg-load .separator__path').get(0), 'to')
        },
        ease: "Power4.easeInOut",
        duration: 1.5
      }, '-=1.5').fromTo("#main_root", 1, {
        y: 400
      }, {
        y: 0,
        clearProps: true,
        ease: Expo.easeInOut
      }, "-=1.2").call(function () {
        preloader.remove();
        ScrollTrigger.update();
        $body.css('overflow', '');
        animateText.kill();
        ScrollTrigger.getAll().forEach($item => {
          $item.refresh();
        });
      });
    });
  }
  /**
   *  -   event will be triggered by doing browser action such as
   *  a click on the back or forward button
   */


  function effectBackForward() {
    $wind.on("popstate", function (e) {
      if (window.location.hash.length) {
        $wind.scrollTop(0);
        pixelGrid.scrollTop(window.location.hash, 1, -100);
        return;
      }

      if (document.location.href.indexOf("#") > -1) {
        return;
      }

      setTimeout(function () {
        pixelAjax().backAnimate(e);
      }, 50);
    });
  }

  function pixelAjax() {
    return pixelGrid.pixelAjax({
      className: 'pixel-ajax-effect',
      beforeSend: () => $body.css('overflow', 'hidden'),

      async success(data) {
        const animate = {
          value: 0
        };
        return gsap.to(animate, 0.02, {
          value: 100,

          onStart() {
            reloadAjax(true).catch($err => {
              console.error($err);
            });
          }

        });
      },

      onComplete() {
        setTimeout(() => {
          $body.removeClass("over-hidden");
          $body.css('overflow', '');
        }, 500);
        ScrollTrigger.refresh();
      }

    });
  }

  function menuInit() {
    var _targets$toggle4;

    const menu = document.getElementById("site_menu_header");
    if (!menu) return;
    const targets = {
      toggle: menu.querySelector("#navbar_toggle"),
      backgroundMain: menu.querySelector(".bg-load:not(.pixel-svg-transition)"),
      svg: menu.querySelector("svg.bg-load path"),
      subMenu: $(menu).find("li.nav-item.has-sub-menu > a"),
      back: $(menu).find("li.pixel-back"),
      hamburger: menu.classList.contains('pixel-hamburger'),
      scrDown: 0
    };
    const reserved = pixelGrid.useState(false, (newValue, oldValue) => oldValue && removeOpenMenu());
    const typeNav = pixelGrid.useState(targets.hamburger, newValue => newValue ? menu.classList.add("pixel-hamburger") : menu.classList.remove("pixel-hamburger"));

    const removeOpenMenu = () => menu.querySelectorAll('ul').forEach(item => item.classList.remove('open'));

    const TransEnd = () => {
      var _menu$querySelector;

      return reserved.getValue() && ((_menu$querySelector = menu.querySelector('.primary-nav')) === null || _menu$querySelector === void 0 ? void 0 : _menu$querySelector.classList.add('open'));
    };

    const onCompleteAnimate = e => {
      e.classList.toggle('open');
      menu.classList.toggle('pixel-open');
      $body.toggleClass('over-hidden');
      reserved.setValue(!reserved.getValue());
    };

    const handleClick = e => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.closest('.open').classList.remove('open');
    };

    const handleClickSubMenu = function (e) {
      var _e$currentTarget, _e$currentTarget$pare, _e$currentTarget$pare2;

      if (!typeNav.getValue()) return;
      handleClick(e);
      (_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : (_e$currentTarget$pare = _e$currentTarget.parentElement) === null || _e$currentTarget$pare === void 0 ? void 0 : (_e$currentTarget$pare2 = _e$currentTarget$pare.querySelector('ul')) === null || _e$currentTarget$pare2 === void 0 ? void 0 : _e$currentTarget$pare2.classList.add("open");
    };

    const handleClickBackMenu = e => {
      handleClick(e);
      e.currentTarget.closest('ul').closest('li').closest('ul').classList.add("open");
    };

    const toggleClick = function () {
      if (!reserved.getValue()) {
        pixelGrid.svgAnimate.up(targets.svg, TransEnd).to("#pixel-scrollbar", {
          y: -200,
          duration: 1,
          ease: 'power4.in'
        }, "top").set(targets.backgroundMain, {
          autoAlpha: 1
        }, "center");
        onCompleteAnimate(this);
      } else pixelGrid.svgAnimate.down(targets.svg, () => onCompleteAnimate(this)).to("#pixel-scrollbar", {
        y: 0,
        clearProps: "y",
        duration: 1,
        ease: 'power4'
      }, "-=1").set(targets.backgroundMain, {
        autoAlpha: 0
      }, "center");
    };

    const resizeNav = function () {
      if (window.innerWidth > 991 && typeNav.getValue()) {
        typeNav.setValue(false);
      } else if (window.innerWidth <= 991 && !typeNav.getValue()) {
        typeNav.setValue(true);
      } else if (pixelGrid.isMobile()) {
        typeNav.setValue(true);
      }
    };

    if (!targets.hamburger) {
      window.addEventListener('resize', resizeNav);
      resizeNav();
    }

    new Promise(resolve => setTimeout(() => resolve(), 300)).then(() => {
      var _targets$toggle;

      return pixelGrid.spltting.Char((_targets$toggle = targets.toggle) === null || _targets$toggle === void 0 ? void 0 : _targets$toggle.querySelector('.text-menu'));
    }).then(() => {
      var _targets$toggle2;

      return pixelGrid.spltting.Char((_targets$toggle2 = targets.toggle) === null || _targets$toggle2 === void 0 ? void 0 : _targets$toggle2.querySelector('.text-open'));
    }).then(() => {
      var _targets$toggle3;

      return pixelGrid.spltting.Char((_targets$toggle3 = targets.toggle) === null || _targets$toggle3 === void 0 ? void 0 : _targets$toggle3.querySelector('.text-close'));
    }).then(() => {
      targets.back.find(".text-toggle-back").each(function ($index) {
        setTimeout(() => pixelGrid.spltting.Char(this), 10 * $index);
      });
    }).then(() => {
      menu.querySelectorAll('ul').forEach((item, index) => {
        item.style.setProperty('--pixel-li-name', "pixel" + index);
        Object.keys(item.children).forEach($key => {
          item.children[$key].style.setProperty('--pixel-li-index', $key);
        });
      });
    }).then(() => {
      gsap.set(menu, {
        yPercent: -100,
        autoAlpha: 0
      });
      menu.classList.remove('d-none');
      gsap.to(menu, {
        yPercent: 0,
        autoAlpha: 0,
        delay: 1,
        clearProps: true
      });
    });
    $effectScroll.getListener(function (e, x, y) {
      if (y > 170) {
        if (targets.scrDown < y) {
          menu.classList.add("nav-bg", "hide-nav");
        } else {
          menu.classList.remove("hide-nav");
        }
      } else {
        menu.classList.remove("nav-bg", "hide-nav");
      }

      targets.scrDown = y;
    });
    (_targets$toggle4 = targets.toggle) === null || _targets$toggle4 === void 0 ? void 0 : _targets$toggle4.addEventListener('click', toggleClick);
    targets.subMenu.on('click', handleClickSubMenu);
    targets.back.on('click', handleClickBackMenu);
    pixelGrid.killAjax(function () {
      var _targets$toggle5;

      (_targets$toggle5 = targets.toggle) === null || _targets$toggle5 === void 0 ? void 0 : _targets$toggle5.removeEventListener('click', toggleClick);
      targets.subMenu.off('click', handleClickSubMenu);
      targets.back.off('click', handleClickBackMenu);
    });
  }

  function dropHash() {
    const linked = {
      hash: $("a[href=\"#\"]"),
      scroll: $("[href*=\"#\"]:not([href=\"#\"]):not(.comment-reply-link):not(#cancel-comment-reply-link):not(.wc-tabs .wc-effect-tab)")
    };
    linked.hash.on("click", function (e) {
      e.preventDefault();
    });
    linked.scroll.on("click", function (e) {
      e.preventDefault();
      let href = $($(this).attr("href"));

      if (!href.length) {
        href = null;
        return false;
      }

      const option = $(this).data('pixel-option');
      pixelGrid.scrollTop(href.get(0).offsetTop, option);
      href = null;
    });

    if (window.location.hash.length) {
      $wind.scrollTop(0);
      pixelGrid.scrollTop(window.location.hash);
    }

    pixelGrid.killAjax(function () {
      linked.hash.off("click");
      linked.scroll.off("click");
    });
  }

  function scrollBarWidth() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = "width:100px;height:100px;overflow: scroll;position: absolute;top: -9999px;";
    document.body.appendChild(scrollDiv);
    document.body.style.setProperty('--pixel-width-scroll', scrollDiv.offsetWidth - scrollDiv.clientWidth + "px");
    document.body.removeChild(scrollDiv);
  }

  async function Isotope($el = $(document)) {
    const createIso = async function ($item) {
      if (!$item.length) return;
      $item.addClass('use-filter');
      return $item.isotope({
        itemSelector: '.grid-item'
      });
    };

    await $el.find('.root-posts').each(function () {
      const rootPosts = $(this),
            $filtering = rootPosts.find('.pixel-filtering .filtering'),
            $isoItem = rootPosts.hasClass('has-filter') ? rootPosts.find('.pixel-posts') : rootPosts.find('.pixel-isotope'),
            $buttonAjax = rootPosts.find('.button-load-more');
      if (!$filtering.length && !$isoItem.length && !$buttonAjax.length) return;

      const handleClickFilter = function ($iso) {
        if (!$filtering.length) return $iso;

        const handleClick = function () {
          $(this).addClass('active').siblings().removeClass("active");
          $iso.isotope({
            filter: $(this).attr("data-filter")
          });
        };

        $filtering.find('button').on("click", handleClick);
        return $iso;
      };

      const handleAjax = function ($iso) {
        if (!$buttonAjax.length) return;
        const $option = pixelGrid.getOptionAjax($buttonAjax.get(0));
        pixelGrid.loadMore({
          el: $buttonAjax,
          option: $option,
          isotope: $iso,
          success: function (data) {
            $animate.parallaxHover();
          },
          filtering: $filtering,
          posts: rootPosts.find('.pixel-posts')
        });
        return $iso;
      };

      createIso($isoItem).then(handleClickFilter).then(handleAjax).then(function ($iso) {
        pixelGrid.killAjax(function () {
          $filtering.find('button').off('click');
          if ($iso) $iso.isotope('destroy');
          $buttonAjax.off('click');
        });
      });
    });
    await $el.find(".pixel-isotope:not(.use-filter)").each(function () {
      if ($(this).parent('.root-posts').length) return;
      createIso($(this)).then(function ($iso) {
        pixelGrid.killAjax(function () {
          if ($iso) $iso.isotope('destroy');
        });
      });
    });
  }

  function loadLazyImage($el = $(document), $type, $args = {}) {
    if (typeof $type === 'object') {
      $type.forEach($item => {
        loadLazyImage($el, $item);
      });
    } else {
      const pixelData = $el.find("[data-pixel-" + $type + "]");
      pixelData.each(function ($index) {
        const $args = {};
        if (pixelData.length - 1 === $index && $type === "src") $args.onComplete = () => {
          $('.swiper-container.swiper-initialized').each(function () {
            var _swiper$passedParams;

            const swiper = this.swiper;
            if (!(swiper === null || swiper === void 0 ? void 0 : (_swiper$passedParams = swiper.passedParams) === null || _swiper$passedParams === void 0 ? void 0 : _swiper$passedParams.loop)) return;
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.update();
            swiper.updateSlides();
          });
          $('.pixel-isotope').each(function () {
            $(this).isotope({
              itemSelector: '.grid-item'
            });
          });
        };else $args.onComplete = () => {
          $('.pixel-isotope').each(function () {
            $(this).isotope({
              itemSelector: '.grid-item'
            });
          });
        };
        setTimeout(() => {
          pixelGrid.loadData(this, $type, $args);
        }, 1000);
      });
    }
  }

  function serviceSection($el = $(document)) {
    if (pixelGrid.isMobile()) return;
    ($el.hasClass("service-with-img") ? $el.find('.pixel-service') : $el.find(".service-with-img")).each(function () {
      const serviceItem = $(this).find(".service-item"),
            onEnter = function () {
        serviceItem.not(this).removeClass('active');
        this.classList.add("active");
        serviceItem.not(this).find('.service_description ').slideUp(400);
        $(this).find('.service_description ').slideDown(400);
      };

      serviceItem.first().addClass("active");
      serviceItem.on('mouseenter', onEnter);
      pixelGrid.killAjax(function () {
        serviceItem.off('mouseenter', onEnter);
      });
    });
  }
  /**
   * t is using translate3d to perform a momentum based scrolling
   * (aka inertial scrolling) on modern browsers.
   *
   */


  function effectScroller() {
    const locked_scroll = "locked-scroll";
    let lenisScroll = null;
    return {
      /**
       *
       * @returns {boolean}
       * Check smooth scroll is enable or not
       */
      isScroller: function () {
        var _pixelParam$scrollbar;

        return pixelParam === null || pixelParam === void 0 ? void 0 : (_pixelParam$scrollbar = pixelParam.scrollbar) === null || _pixelParam$scrollbar === void 0 ? void 0 : _pixelParam$scrollbar.smooth;
      },
      start: function () {
        $body.removeClass(locked_scroll);
        pixelGrid.scrollTop(0, {
          duration: 0.01
        });
        if (!this.isScroller()) return;
        lenisScroll = new Lenis(pixelParam.scrollbar);

        function raf(time) {
          lenisScroll.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      },

      /**
       *  locked smooth scrollbar
       */
      locked: function () {
        var _lenisScroll;

        $body.addClass(locked_scroll);
        this.isScroller() && ((_lenisScroll = lenisScroll) === null || _lenisScroll === void 0 ? void 0 : _lenisScroll.destroy());
      },

      /**
       *
       * @param $id
       * @returns {*}
       * Gets scrollbar on the given element. If no scrollbar instance exists, returns undefined:
       */
      getScrollbar: () => lenisScroll,

      /**
       *
       * @param listener
       * @param $useWin
       *
       * Since scrollbars will not fire a native scroll event
       */
      getListener: function (listener) {
        if (listener === undefined) return;

        const scroll = e => {
          listener(e, window.scrollX, window.scrollY);
        };

        $wind.on("scroll", scroll);
      }
    };
  }

  function compareTowImage($el = $(document)) {
    $el.find('.pixel-compare-container').each(function () {
      const compare = pixelGrid.compareTowImg(this);
      pixelGrid.killAjax(function () {
        compare.destroy();
      });
    });
  }


  /**
   *
   * @param $el
   */


  function projectSlider() {
    return {
      swiper: function ($id, $obj) {
        $id = pixelGrid.convertToJQuery($id);
        const swiperPaginate = $id.find('.swiper-pagination');
        const renderBullet = swiperPaginate.hasClass('pixel-swiper-img') ? function (index, className) {
          var _this$slides$index$qu;

          return '<span class="' + className + '">' + ((_this$slides$index$qu = this.slides[index].querySelector('img')) === null || _this$slides$index$qu === void 0 ? void 0 : _this$slides$index$qu.outerHTML) + '</span>';
        } : null;
        $obj = $.extend(true, {
          slidesPerView: 1,
          centeredSlides: true,
          spaceBetween: 0,
          grabCursor: true,
          speed: 1000,
          parallax: true,
          loop: true,
          pagination: {
            el: swiperPaginate.get(0),
            clickable: true,
            type: pixelGrid.getData(swiperPaginate.get(0), 'type', 'bullets'),
            renderBullet
          },
          navigation: {
            nextEl: $id.find('.next-paginate ,.next-container', '.pixel-nav-right').get(0),
            prevEl: $id.find('.prev-paginate , .prev-container', '.pixel-nav-left').get(0)
          }
        }, $obj);
        const $s = new Swiper($id.find(".swiper-container").get(0), $obj);
        pixelGrid.killAjax(() => {
          $s.destroy();
        });
      },
      run: function () {
        let $this = this;
        $(".pixel-swiper").each(function () {
          let option = pixelGrid.getData(this, "option", {});
          let syn = $(this).parent().find(pixelGrid.getData(this, "controller"));

          if (syn.length) {
            option['thumbs'] = {
              swiper: {
                el: syn.find('.swiper-container').get(0),
                allowTouchMove: false,
                slidesPerView: 1,
                speed: option.speed || 1000,
                parallax: true,
                autoHeight: true
              }
            };
          }

          option["breakpoints"] = {
            768: {
              slidesPerView: option.slidesPerView > 1 ? option.slidesPerView > 1.5 ? 2 : 1.30 : 1,
              spaceBetween: option.slidesPerView > 1 ? option.spaceBetween > 21 ? 20 : option.spaceBetween : 0
            },
            992: {
              slidesPerView: option.slidesPerView,
              spaceBetween: option.spaceBetween || 0
            },
            575: {
              slidesPerView: 1,
              spaceBetween: 0
            }
          };

          if (syn.length) {
            option['thumbs'] = {
              swiper: {
                el: syn.find('.swiper-container').get(0),
                allowTouchMove: false,
                slidesPerView: 1,
                speed: option.speed || 1000,
                parallax: true,
                autoHeight: true
              }
            };
            option.breakpoints['768'] = {
              slidesPerView: 1,
              spaceBetween: 0
            };
          }

          option['slidesPerView'] = 1;
          option['spaceBetween'] = 0;
          $this.swiper(this, option);
        });
      }
    };
  }

  function mouseCirMove($off) {
    const $element = $("#pixel_cursor"),
          inner = $("#pixel_cursor_inner");
    if (!$element.length || pixelGrid.isMobile() || !pixelParam.cursor.run) return;
    $body.addClass('pixel-cursor-effect');
    const mouseStop = 'pixel-stop-cursor';

    if (!$off) {
      pixelGrid.mouseMove($element, {
        speed: pixelParam.cursor.speed,
        mouseStop,
        inner: {
          el: inner,
          speed: pixelParam.cursor.speedInner
        }
      });
    }

    const defaultEl = $element.css(['opacity', 'width', 'height', 'borderColor', 'background']),
          {
      stop,
      run
    } = {
      stop: () => $body.addClass(mouseStop),
      run: () => $body.removeClass(mouseStop)
    };
    pixelGrid.mouseHover("a:not(> img):not(.vid) , .pixel-button-sidebar,  button , .button-load-more , [data-cursor=\"open\"]", {
      enter: () => gsap.to($element, 0.5, {
        width: 70,
        height: 70,
        opacity: 0.5,
        backgroundColor: defaultEl.borderColor
      }),
      leave: () => gsap.to($element, 0.5, { ...defaultEl
      })
    });
    pixelGrid.mouseHover(".c-hidden , .social-side a , .next-arrow , .prev-arrow , .pixel-btn.vid", {
      enter() {
        stop();
        const {
          x,
          y,
          width,
          height
        } = this.getBoundingClientRect();
        gsap.to($element, 0.5, {
          width,
          height,
          opacity: 0,
          x,
          y,
          xPercent: 0,
          yPercent: 0
        });
        gsap.to(inner, 0.1, {
          opacity: 0
        });
      },

      leave() {
        run();
        gsap.to($element, 0.5, { ...defaultEl,
          xPercent: -50,
          yPercent: -50
        });
        gsap.to(inner, 0.1, {
          opacity: 1
        });
      }

    });
  }

  function list_project($el = $(document)) {
    function changeState(_active, _remove, $product) {
      if (_active.hasClass('active')) return false;

      _active.addClass('active');

      _remove.removeClass('active');

      $product.fadeOut(300, function () {
        jQuery(this).toggleClass("list").fadeIn(300);
      });
      return false;
    }

    $el.find('.woocommerce').each(($index, $item) => {
      const $grid = $($item).find('.pixel_grid');
      const $list = $($item).find('.pixel_list');
      if (!$grid.length) return;
      const $product = $($item).find('ul.pixel-shop');
      $grid.on('click', function () {
        return changeState($grid, $list, $product);
      });
      $list.on('click', function () {
        return changeState($list, $grid, $product);
      });
      pixelGrid.killAjax(() => {
        $grid.off('click');
        $list.off('click');
      });
    });
  }



  
})(jQuery);

function sidebarOptions() {
  document.body.classList.toggle('pixel-show-sidebar');
}
//# sourceMappingURL=custom.js.map