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
                    $linkHeaders = obj.find('.link-header'),
                    $linkContent = obj.find('.link-content');

                /**
                 * Effects
                 */
                var effects         = ['fade', 'slideLeft', 'slideUp', 'slideRight', 'slideDown', 'overLeft', 'overRight', 'overUp', 'overDown'],
                    slideEffects    = ['slideLeft', 'slideUp', 'slideRight', 'slideDown'],
                    overEffects     = ['overLeft', 'overRight', 'overUp', 'overDown'],
                    wipeEffects     = ['wipeDown', 'wipeUp'],
                    wipeFadeEffects = ['wipeDownFade', 'wipeUpFade'],
                    wipeAllEffects  = ['wipeDown', 'wipeUp', 'wipeDownFade', 'wipeUpFade'];

                var sliderCount = $('#slider > div', obj).length,
                    accordionCount = $('#accordion > .link-header', obj).length;

                if (sliderCount === accordionCount) {
                    if (opts.autoPlay === true) {
                        var autoPlaying = setInterval(function() {
                            playSlider(current, effect, opts.speed, opts.easingOption);
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
                    alert('The number of slider images does not match the number of accordion sections.');
                    console.log('The number of slider images does not match the number of accordion sections.');
                }

                var randomEffectMap = {
                    'random': effects,
                    'slideRandom': slideEffects,
                    'overRandom': overEffects
                };

                var getRandomEffect = function(effect, arr) {
                    effect = arr[~~(Math.random() * arr.length)];
                    return effect == prevEffect ? getRandomEffect(effect, arr) : effect;
                };

                function animation(current, section, effect, speed, easingOption) {
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

                        prevEffect = effect;
                        switch (effect) {
                        case 'fade':
                            $new.css({
                                'z-index': zPos,
                                'top': '0',
                                'left': '0',
                                'display': 'none'
                            }).fadeIn(speed);
                            break;
                        case 'slideLeft':
                            $new.css({
                                'left': currentWidth,
                                'top': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $current.animate({
                                'left': '-=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            $new.animate({
                                'left': '-=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'slideRight':
                            $new.css({
                                'left': '-' + currentWidth + 'px',
                                'top': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $current.animate({
                                'left': '+=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            $new.animate({
                                'left': '+=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'slideUp':
                            $new.css({
                                'top': currentHeight,
                                'left': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $current.animate({
                                'top': '-=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            $new.animate({
                                'top': '-=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'slideDown':
                            $new.css({
                                'top': '-' + currentHeight + 'px',
                                'left': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $current.animate({
                                'top': '+=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            $new.animate({
                                'top': '+=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'overLeft':
                            $new.css({
                                'left': currentWidth,
                                'top': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $new.animate({
                                'left': '-=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'overRight':
                            $new.css({
                                'left': '-' + currentWidth + 'px',
                                'top': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $new.animate({
                                'left': '+=' + currentWidth,
                                'top': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'overUp':
                            $new.css({
                                'top': currentHeight,
                                'left': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $new.animate({
                                'top': '-=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'overDown':
                            $new.css({
                                'top': '-' + currentHeight + 'px',
                                'left': '0',
                                'opacity': '1',
                                'z-index': zPos
                            });
                            $new.animate({
                                'top': '+=' + currentHeight,
                                'left': '0',
                                'opacity': '1'
                            }, {
                                queue: true,
                                duration: speed,
                                easing: easingOption
                            });
                            break;
                        case 'none':
                            $new.css({
                                'z-index': zPos
                            });
                            break;
                        }
                        setTimeout(function() {
                            active = false;
                        }, speed);
                    }
                }

                function sectionClicked() {
                    if (!active) {
                        var section = ($(this).index() / 2) + 1;

                        if (section === current) return false;

                        $linkHeaders.removeClass('active').next('.link-content').slideUp();
                        $linkHeaders.eq(section-1).addClass('active').next('.link-content').slideDown();
                        animation(current, section, effect, opts.speed, opts.easing);

                        zPos++;
                        current = section;

                        return false;
                    }
                }

                function playSlider(current, effect, speed, easingOption) {
                    var nextSection = checkEnd(current);
                    $('#accordion .link-header:eq(' + nextSection + ')', obj).trigger('click', sectionClicked);
                }

                function startAuto() {
                    autoPlaying = setInterval(function() {
                        playSlider(current, effect, speed, easingOption);
                    }, interval);
                    obj.data('interval', autoPlaying);
                }

                function stopAuto() {
                    clearInterval(obj.data('interval'));
                }

                function leftNavigation() {
                    var nextSection = checkEnd(current - 2);
                    $('#accordion .link-header:eq(' + nextSection + ')', obj).trigger('click', sectionClicked);
                }

                function rightNavigation() {
                    var nextSection = checkEnd(current);
                    $('#accordion .link-header:eq(' + nextSection + ')', obj).trigger('click', sectionClicked);
                }

                function restartAuto() {
                    clearInterval(obj.data('interval'));
                    autoPlaying = setInterval(function() {
                        playSlider(current, effect, speed, easingOption);
                    }, interval);
                    obj.data('interval', autoPlaying);
                }

                function checkEnd(tempSection) {
                    if (tempSection === sliderCount) {
                        return 0;
                    } else if (tempSection < 0) {
                        return accordionCount - 1;
                    } else {
                        return tempSection;
                    }
                }

                function resetLayers() {
                    for (var i = sliderCount; i > 0; i--) {
                        $('#slider > div:eq(' + (i - 1) + ')', obj).css('z-index', zPos);
                        zPos++;
                    }
                }

            });
        }
    });

})(jQuery);