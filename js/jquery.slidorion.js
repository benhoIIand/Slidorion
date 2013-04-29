/*
 * Slidorion, An Image Slider and Accordion Combined
 * Intructions: http://www.slidorion.com
 * Created by Ben Holland - http://www.benholland.me
 * Version: 2.0.0
 * Copyright 2013 Ben Holland <benholland99@gmail.com>
 */
(function($) {
    'use strict';

    $.fn.extend({
        slidorion: function(options) {
            var defaults = {
                autoPlay: true,
                easing: '',
                effect: 'random',
                first: 1,
                interval: 5000,
                hoverPause: false,
                speed: 1000
            };

            var opts = $.extend(defaults, options);

            return this.each(function() {

                var current         = opts.first,
                    section         = opts.first + 1,
                    effect          = opts.effect,
                    interval        = opts.interval,
                    controlNav      = opts.controlNav,
                    controlNavClass = opts.controlNavClass,
                    zPos            = 1,
                    intervalPause   = false,
                    active          = false,
                    prevEffect      = '',
                    obj             = $(this),
                    $linkHeaders    = $('.link-header', obj),
                    $linkContent    = $('.link-content', obj),
                    autoPlaying     = null;

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

                var sliderCount = $('#slider > div', obj).length,
                    accordionCount = $('#accordion > .link-header', obj).length;

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

                        $('#slider > div:eq(' + (current - 1) + ')', obj).css('z-index', zPos);
                        zPos++;

                        if (effect !== 'fade' || effect !== 'none') {
                            $('#slider > div', obj).css({
                                'top': '0',
                                'left': '-600px'
                            });
                            $('#slider > div:eq(' + (current - 1) + ')', obj).css({
                                'top': '0',
                                'left': '0'
                            });
                        }

                        $('.link-content', obj).hide();
                        $('#accordion .link-header:eq(' + (current - 1) + ')', obj).addClass('active').next().show();

                        if (controlNav) {
                            obj.append('<div class="' + controlNavClass + ' ' + controlNavClass + '-left"></div><div class="' + controlNavClass + ' ' + controlNavClass + '-right"></div>');
                            $('.' + controlNavClass + '-left').click(leftNavigation);
                            $('.' + controlNavClass + '-right').click(rightNavigation);
                        }

                        $('.link-header', obj).click(sectionClicked);

                    } else {
                        window.alert('The number of slider images does not match the number of accordion sections.');
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

                        var $current      = $('#slider > div:eq(' + (current - 1) + ')', obj),
                            $new          = $('#slider > div:eq(' + (section - 1) + ')', obj),
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
                                $.each($el, function(){ animateSlides($(this)); });
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
                                changeSlideCSS($new, {left: currentWidth});
                                animateSlides([$current, $new], {left: '-='+ currentWidth});
                                break;
                            case 'slideRight':
                                changeSlideCSS($new, {left: '-'+ currentWidth +'px'});
                                animateSlides([$current, $new], {left: '+='+ currentWidth});
                                break;
                            case 'slideUp':
                                changeSlideCSS($new, {top: currentWidth});
                                animateSlides([$current, $new], {top: '-='+ currentHeight});
                                break;
                            case 'slideDown':
                                changeSlideCSS($new, {top: '-'+ currentHeight +'px'});
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
                        }, opts.speed);
                    }
                };

                var sectionClicked = function() {
                    if (!active) {
                        var section = ($(this).index() / 2) + 1;

                        if (section === current) return false;

                        $linkHeaders.removeClass('active').next('.link-content').slideUp();
                        $linkHeaders.eq(section-1).addClass('active').next('.link-content').slideDown();
                        animation(current, section, effect);

                        zPos++;
                        current = section;

                        // checkZpos();

                        return false;
                    }
                };

                var playSlider = function(current, effect) {
                    $('#accordion .link-header:eq(' + getNextSlide(current) + ')', obj).trigger('click', sectionClicked);
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
                    $('#accordion .link-header:eq(' + getNextSlide(current - 2) + ')', obj).trigger('click', sectionClicked);
                };

                var rightNavigation = function() {
                    $('#accordion .link-header:eq(' + getNextSlide(current) + ')', obj).trigger('click', sectionClicked);
                };

                var getNextSlide = function(tempSection) {
                    if (tempSection === sliderCount) {
                        return 0;
                    } else if (tempSection < 0) {
                        return accordionCount - 1;
                    } else {
                        return tempSection;
                    }
                };

                var checkZpos = function() {
                    if(zPos > sliderCount * 3) resetLayers();
                };

                var resetLayers = function() {
                    for (var i = sliderCount; i > 0; i--) {
                        $('#slider > div:eq(' + (i - 1) + ')', obj).css('z-index', zPos);
                        zPos++;
                    }
                };

                init();

            });
        }
    });

})(jQuery);