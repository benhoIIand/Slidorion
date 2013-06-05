/*!
 * Slidorion, An Image Slider and Accordion Combined
 * Intructions: http://www.slidorion.com
 * Created by Ben Holland - http://www.benholland.me
 * Version: 1.2.0
 * Copyright 2013 Ben Holland <hi@benhlland.me>
 */
(function($) {
    'use strict';

    $.fn.extend({
        slidorion: function(options) {

            var defaults = {
                autoPlay: true,
                controlNav: false,
                controlNavClass: 'slidorion-nav',
                easing: '',
                effect: 'random',
                first: 1,
                interval: 5000,
                hoverPause: false,
                speed: 1000
            };

            var opts       = $.extend(defaults, options),
                firstSlide = window.location.hash.match(/slidorion/i) ? location.hash.split('/')[1] - 1 : null;

            return this.each(function() {

                var current         = firstSlide || opts.first - 1,
                    section         = opts.first,
                    effect          = opts.effect,
                    interval        = opts.interval,
                    controlNav      = opts.controlNav,
                    controlNavClass = opts.controlNavClass,
                    zPos            = 1,
                    intervalPause   = false,
                    active          = false,
                    prevEffect      = '',
                    obj             = $(this),
                    autoPlaying     = null;


                /**
                 * Cache elements
                 */
                var $slider      = $('.slider', obj),
                    $accordion   = $('.accordion', obj),
                    $slides      = $slider.find('.slide'),
                    $linkHeaders = $accordion.find('.header'),
                    $linkContent = $accordion.find('.content');


                /**
                 * Effects
                 */
                var effects         = ['fade', 'slideLeft', 'slideUp', 'slideRight', 'slideDown', 'overLeft', 'overRight', 'overUp', 'overDown'],
                    slideEffects    = ['slideLeft', 'slideUp', 'slideRight', 'slideDown'],
                    overEffects     = ['overLeft', 'overRight', 'overUp', 'overDown'],
                    wipeEffects     = ['wipeDown', 'wipeUp'],
                    wipeFadeEffects = ['wipeDownFade', 'wipeUpFade'],
                    wipeAllEffects  = ['wipeDown', 'wipeUp', 'wipeDownFade', 'wipeUpFade'];

                /**
                 * Set the animation options
                 */
                var animationOptions = {
                    queue: true,
                    duration: opts.speed,
                    easing: opts.easingOption
                };

                var sliderCount = $slides.length,
                    accordionCount = $linkHeaders.length;

                var randomEffectMap = {
                    'random': effects,
                    'slideRandom': slideEffects,
                    'overRandom': overEffects
                };

                var init = function() {
                    if (sliderCount === accordionCount) {

                        if (opts.autoPlay === true) {

                            autoPlaying = setInterval(function() {
                                playSlider(current, effect);
                            }, interval);

                            obj.data('interval', autoPlaying);
                        }

                        if (opts.hoverPause === true && opts.autoPlay === true) {
                            obj.hover(function() {
                                intervalPause = true;
                                stopAuto();
                            }, function() {
                                intervalPause = false;
                                restartAuto();
                            });
                        }

                        resetLayers();

                        $slides.eq(current).css('z-index', zPos);
                        zPos++;

                        $linkContent.hide();
                        $linkHeaders.eq(current).addClass('active').next().show();

                        if (controlNav) {
                            obj.append('<div class="' + controlNavClass + ' ' + controlNavClass + '-left"></div><div class="' + controlNavClass + ' ' + controlNavClass + '-right"></div>');
                            $('.' + controlNavClass + '-left').click(leftNavigation);
                            $('.' + controlNavClass + '-right').click(rightNavigation);
                        }

                        $linkHeaders.click(sectionClicked);

                    } else {
                        console.log('The number of slider images does not match the number of accordion sections.');
                    }
                };

                var getRandomEffect = function(effect, arr) {
                    effect = arr[~~(Math.random() * arr.length)];
                    return effect == prevEffect ? getRandomEffect(effect, arr) : effect;
                };

                var animation = function(current, section, effect) {
                    if (!active) {
                        active = true;

                        if (opts.autoPlay === true && opts.intervalPause === false) {
                            restartAuto();
                        }

                        var $current      = $slides.eq(current),
                            $new          = $slides.eq(section),
                            currentWidth  = $current.outerWidth(),
                            currentHeight = $current.outerHeight();

                        if(randomEffectMap[effect]) {
                            effect = getRandomEffect(effect, randomEffectMap[effect]);
                        }

                        var changeSlideCSS = function($el, settings) {
                            var defs = {
                                left: '0',
                                top: '0',
                                zIndex: zPos
                            };

                            $el.css($.extend(defs, settings));
                        };

                        var animateSlides = function($el, settings) {
                            if($el instanceof Array) {
                                $.each($el, function(){ animateSlides($(this), settings); });
                                return;
                            }

                            var defs = {
                                left: '0',
                                top: '0'
                            };

                            $el.animate($.extend(defs, settings), animationOptions);
                        };

                        prevEffect = effect;

                        switch (effect) {
                            case 'fade':
                                $new.css({'z-index': zPos, 'top': '0', 'left': '0', 'display': 'none'}).fadeIn(opts.speed);
                                break;
                            case 'slideLeft':
                                changeSlideCSS($new, {left: currentWidth, top: 0});
                                animateSlides([$current, $new], {left: '-='+ currentWidth});
                                break;
                            case 'slideRight':
                                changeSlideCSS($new, {left: '-'+ currentWidth +'px', top: 0});
                                animateSlides([$current, $new], {left: '+='+ currentWidth});
                                break;
                            case 'slideUp':
                                changeSlideCSS($new, {top: currentHeight, left: 0});
                                animateSlides([$current, $new], {top: '-='+ currentHeight});
                                break;
                            case 'slideDown':
                                changeSlideCSS($new, {top: '-'+ currentHeight +'px', left: 0});
                                animateSlides([$current, $new], {top: '+='+ currentHeight});
                                break;
                            case 'overLeft':
                                changeSlideCSS($new, {left: currentWidth});
                                animateSlides($new, {left: '-='+ currentWidth});
                                break;
                            case 'overRight':
                                changeSlideCSS($new, {left: '-'+ currentWidth +'px'});
                                animateSlides($new, {left: '+='+ currentWidth +'px'});
                                break;
                            case 'overUp':
                                changeSlideCSS($new, {top: currentHeight});
                                animateSlides($new, {top: '-='+ currentHeight});
                                break;
                            case 'overDown':
                                changeSlideCSS($new, {top: '-'+ currentHeight +'px'});
                                animateSlides($new, {top: '+='+ currentHeight});
                                break;
                            case 'none':
                                $new.css({'z-index': zPos});
                                break;
                        }

                        setTimeout(function() {
                            active = false;
                            resetZpos($new);
                        }, opts.speed);
                    }
                };

                var sectionClicked = function() {
                    if (!active) {
                        var section = $(this).index() / 2;

                        if (section === current) return false;

                        $linkHeaders.removeClass('active').next('.content').slideUp();
                        $linkHeaders.eq(section).addClass('active').next('.content').slideDown();
                        animation(current, section, effect);

                        zPos++;
                        current = section;

                        return false;
                    }
                };

                var playSlider = function(current, effect) {
                    $linkHeaders.eq(getNextSlide(current)).trigger('click', sectionClicked);
                };

                var startAuto = function() {
                    autoPlaying = setInterval(function() {
                        playSlider(current, effect);
                    }, interval);
                    obj.data('interval', autoPlaying);
                };

                var stopAuto = function() {
                    clearInterval(obj.data('interval'));
                };

                var restartAuto = function() {
                    clearInterval(obj.data('interval'));

                    autoPlaying = setInterval(function() {
                        playSlider(current, effect);
                    }, interval);

                    obj.data('interval', autoPlaying);
                };

                var leftNavigation = function() {
                    $linkHeaders.eq(getNextSlide(current - 2)).trigger('click', sectionClicked);
                };

                var rightNavigation = function() {
                    $linkHeaders.eq(getNextSlide(current)).trigger('click', sectionClicked);
                };

                var getNextSlide = function(tempSection) {
                    tempSection++;  // increment to account for Array index starting at 0

                    if (tempSection === sliderCount) {
                        return 0;
                    } else if (tempSection < 0) {
                        return accordionCount - 1;
                    } else {
                        return tempSection;
                    }
                };

                var resetZpos = function($el) {
                    if(zPos > sliderCount * 3) {
                        zPos = 2;
                        $slides.css('z-index', '1');
                        $el.css('z-index', zPos);
                        zPos++;
                    }
                };

                var resetLayers = function() {
                    for (var i = sliderCount-1; i > 0; i--) {
                        $slides.eq(i).css('z-index', zPos);
                        zPos++;
                    }
                };

                init();

            });
        }
    });

})(jQuery);