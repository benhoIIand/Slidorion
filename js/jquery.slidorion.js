/*
* Slidorion, An Image Slider and Accordion Combined
* Intructions: http://www.slidorion.com
* Created by Ben Holland - http://www.ben-holland.co.uk
* Version: 0.9
* Copyright 2011 Ben Holland <benholland99@gmail.com>
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function($){
	$.fn.extend({
		slidorion: function(options) {
			var defaults = {
				autoPlay: true,
				easing: '',
				effect: 'fade',
				first: "section1",
				interval: 7000,
				hoverPause: false,
				speed: 1000
			};
			
			var options = $.extend(defaults, options);
			
			return this.each(function() {
				
				var o = options;
				var current = o.first;
				var section = "";
				var speed = o.speed;
				var effect = o.effect;
				var easingOption = o.easing;
				var interval = o.interval;
				var hoverPause = o.hoverPause;
				var autoPlay = o.autoPlay;
				var zPos = 1;
				var slideCount = $('#slider .slider-image').size();
				var accordCount = $('#accordion .slider-link').size();
				var intervalPause = false;
				var stopAutoPlay = false;
				var effects = new Array('fade','slideLeft','slideUp','slideRight','slideDown','overLeft','overRight','overUp','overDown');
				var previousEffect = '';
				
				if(slideCount==accordCount){
					
					if(autoPlay==true){
						var autoPlaying = setInterval(function(){playSlider(current, effect, speed, easingOption);}, interval);
					}
					
					var obj = $(this);
					var items = $(".slider-link", obj);
					$('#accordion .content').hide();
					$('#accordion .header a[rel="'+current+'"]').addClass('active').parent().next().show();
					$('.slider-image').css({'opacity':'0'});
					$('.slider-image[rel="'+current+'"]').css({'opacity':'1', 'z-index':zPos});
					
					items.click(sectionClicked);
					
					//$(window).mouseover(offScreen);
					
					if(hoverPause==true){
						$('#slidorion').hover(function(){
							clearInterval(autoPlaying);
						},function(){
							autoPlaying = setInterval(function(){playSlider(current, effect, speed, easingOption);}, interval);
						});
					}
										
					function animation(current, section, effect, speed, easingOption){
						changeAutoPlay();
						var imgWidth = $('.slider-image[rel="'+current+'"] img').outerWidth();
						var imgHeight = $('.slider-image[rel="'+current+'"] img').outerHeight();
						$current = $('.slider-image[rel="'+current+'"]');
						$new = $('.slider-image[rel="'+section+'"]');
						switch(effect){
							case 'fade':
								$current.stop().animate({opacity:'0'}, {queue:false, duration:speed, easing:easingOption});
								$new.css({'z-index':zPos}).stop().animate({opacity:'1'}, {queue:false, duration:speed, easing:easingOption});
								break;
							case 'slideLeft':
								$new.css({'left':imgWidth,'opacity':'1'});
								$current.animate({'left':'-='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'left':'-='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideRight':
								$new.css({'left':'-'+imgWidth+'px','opacity':'1'});
								$current.animate({'left':'+='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'left':'+='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideUp':
								$new.css({'top':imgHeight,'opacity':'1'});
								$current.animate({'top':'-='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'top':'-='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideDown':
								$new.css({'top':'-'+imgHeight+'px','opacity':'1'});
								$current.animate({'top':'+='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'top':'+='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overLeft':
								$new.css({'left':imgWidth,'top':'0','opacity':'1','z-index':zPos});
								$new.animate({'left':'-='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overRight':
								$new.css({'left':'-'+imgWidth+'px','top':'0','opacity':'1','z-index':zPos});
								$new.animate({'left':'+='+imgWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overUp':
								$new.css({'top':imgHeight,'left':'0','opacity':'1','z-index':zPos});
								$new.animate({'top':'-='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overDown':
								$new.css({'top':'-'+imgHeight+'px','left':'0','opacity':'1','z-index':zPos});
								$new.animate({'top':'+='+imgHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'random':
								var randNum = Math.floor(Math.random()*9);
								effect = effects[randNum];
								while(effect==previousEffect){
									randNum = Math.floor(Math.random()*9);
									effect = effects[randNum];
								}
								console.log(effect);
								previousEffect = effect;
								animation(current, section, effect, speed, easingOption);
								break;
						}
					}
				}else{
					console.log("The number of slider images does not match the number of accordion sections.");
				}
				
				function sectionClicked(){
					$objHeader = $(this);
					section = $(this).attr('rel');
					if(section==current){
						return false;
					}else{
						if($objHeader.parent().next().is(':hidden')) {
							$('.active').removeClass('active').parent().next().slideUp();
							$objHeader.addClass('active').parent().next().slideDown();
						}
						animation(current, section, effect, speed, easingOption);
					}
					zPos++;
					current = section;
					return false;
				}
				
				function playSlider(current, effect, speed, easingOption){
					if(stopAutoPlay==false){
						var slideNum = current.substr(current.length - 1);
						slideNum++;
						if(slideNum==slideCount+1){
							$('.slider-link[rel="section1"]').trigger('click', sectionClicked);
						}else{
							section = "section"+slideNum;
							$('.slider-link[rel="'+section+'"]').trigger('click', sectionClicked);
						}
					}
				}
				
				function changeAutoPlay(){
					stopAutoPlay = true;
					setTimeout(function(){
						stopAutoPlay = false;
					},interval);
				}
				
				function offScreen(){
					$slidorion = $('#slidorion');
					var position = $slidorion.position();
					var t = $(window).scrollTop();
					var h = position.top;
					if(t > h){
						console.log("stopped");
						clearInterval(autoPlaying);
						stopAutoPlay = true;
					}else{
						console.log("started");
						stopAutoPlay = false;
					}
				}

			});
		}
	});
	
	//function setActive(){
		//active = true;
	//}
})(jQuery);





















