/*
* Slidorion, An Image Slider and Accordion Combined
* Intructions: http://www.slidorion.com
* Created by Ben Holland - http://www.ben-holland.co.uk
* Version: 1.0
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
				stopOnClick: false,
				easing: '',
				effect: 'fade',
				first: 1,
				interval: 5000,
				hoverPause: false,
				speed: 1000
			};
			
			var options = $.extend(defaults, options);
			
			return this.each(function() {
				
				var o = options;
				var current = o.first;
				var section = o.first+1;
				var speed = o.speed;
				var effect = o.effect;
				var easingOption = o.easing;
				var interval = o.interval;
				var hoverPause = o.hoverPause;
				var autoPlay = o.autoPlay;
				var stopOnClick = o.stopOnClick;
				var zPos = 1;
				var sliderCount = 0;
				var accordionCount = 0;
				var intervalPause = false;
				var active = false;
				var prevEffect = "";
				var obj = $(this);
				var effects = new Array('fade','slideLeft','slideUp','slideRight','slideDown','overLeft','overRight','overUp','overDown');
				var slideEffects = new Array('slideLeft','slideUp','slideRight','slideDown');
				var overEffects = new Array('overLeft','overRight','overUp','overDown');
				var wipeEffects = new Array('wipeDown','wipeUp');
				var wipeFadeEffects = new Array('wipeDownFade','wipeUpFade');
				var wipeAllEffects = new Array('wipeDown','wipeUp','wipeDownFade','wipeUpFade');
				
				sliderCount = $('#slider > div', obj).size();
				obj.data('slideCount', sliderCount);
				
				accordionCount = $('#accordion > .link-header', obj).size();
				obj.data('accordCount', accordionCount);
				
				if(sliderCount==accordionCount){
					if(autoPlay==true){
						var autoPlaying = setInterval(function(){
							playSlider(current, effect, speed, easingOption);
						}, interval);
						obj.data('interval', autoPlaying);
					}
					if(hoverPause==true && autoPlay==true){
						obj.hover(function(){
							intervalPause = true;
							stopAuto();
						}, function(){
							intervalPause = false;
							restartAuto();
						});
					}
					
					resetLayers();
					
					$('#slider > div:eq('+(current-1)+')', obj).css('z-index',zPos);
					zPos++;
					
					if(effect != "fade" || effect != "none"){
						$('#slider > div', obj).css({'top':'0','left':'-600px'});
						$('#slider > div:eq('+(current-1)+')', obj).css({'top':'0','left':'0'});
					}
					
					$('.link-content', obj).hide();
					$('#accordion .link-header:eq('+(current-1)+')', obj)
						.addClass('active')
						.next()
						.show();
					
					$(".link-header", obj).click(sectionClicked);					
					
				}else{
					alert("The number of slider images does not match the number of accordion sections.");
					console.log("The number of slider images does not match the number of accordion sections.");
				}
				
				function animation(current, section, effect, speed, easingOption){
					if(!active){
						active = true;
						if(autoPlay==true && intervalPause==false) {
							restartAuto();
						}
						$current = $('#slider > div:eq('+(current-1)+')', obj);
						$new = $('#slider > div:eq('+(section-1)+')', obj);
						var currentWidth = $current.outerWidth();
						var currentHeight = $current.outerHeight();
						
						if(effect=="random"){
							var num = Math.floor(Math.random()*effects.length);
							effect = effects[num];
							while(effect == prevEffect){
								var num = Math.floor(Math.random()*effects.length);
								effect = effects[num];
							}
						}else if(effect=="slideRandom"){
							var num = Math.floor(Math.random()*slideEffects.length);
							effect = slideEffects[num];
							while(effect == prevEffect){
								var num = Math.floor(Math.random()*slideEffects.length);
								effect = slideEffects[num];
							}
						}else if(effect=="overRandom"){
							var num = Math.floor(Math.random()*overEffects.length);
							effect = overEffects[num];
							while(effect == prevEffect){
								var num = Math.floor(Math.random()*overEffects.length);
								effect = overEffects[num];
							}
						}
						prevEffect = effect;
						switch(effect){
							case 'fade':
								$new.css({'z-index':zPos,'top':'0','left':'0','display':'none'}).fadeIn(speed);
								break;
							case 'slideLeft':
								$new.css({'left':currentWidth,'top':'0','opacity':'1','z-index':zPos});
								$current.animate({'left':'-='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'left':'-='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideRight':
								$new.css({'left':'-'+currentWidth+'px','top':'0','opacity':'1','z-index':zPos});
								$current.animate({'left':'+='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'left':'+='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideUp':
								$new.css({'top':currentHeight,'left':'0','opacity':'1','z-index':zPos});
								$current.animate({'top':'-='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'top':'-='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'slideDown':
								$new.css({'top':'-'+currentHeight+'px','left':'0','opacity':'1','z-index':zPos});
								$current.animate({'top':'+='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								$new.animate({'top':'+='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overLeft':
								$new.css({'left':currentWidth,'top':'0','opacity':'1','z-index':zPos});
								$new.animate({'left':'-='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overRight':
								$new.css({'left':'-'+currentWidth+'px','top':'0','opacity':'1','z-index':zPos});
								$new.animate({'left':'+='+currentWidth,'top':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overUp':
								$new.css({'top':currentHeight,'left':'0','opacity':'1','z-index':zPos});
								$new.animate({'top':'-='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'overDown':
								$new.css({'top':'-'+currentHeight+'px','left':'0','opacity':'1','z-index':zPos});
								$new.animate({'top':'+='+currentHeight,'left':'0','opacity':'1'}, {queue:true, duration:speed, easing:easingOption});
								break;
							case 'none':
								$new.css({'z-index':zPos});
								break;
						}
						setTimeout(function(){
							active = false;
						}, speed);
					}
				}
				
				function sectionClicked() {
					if (stopOnClick) {
						intervalPause = true;
						stopAuto();
					}
					return selectSection(this);
				}
				function selectSection(header) {
					if(active == false) {
						$objHeader = $(header, obj);
						var section = ($objHeader.index()/2)+1;
						if(section==current){
							return false;
						}else{
							$('.link-header.active', obj)
								.removeClass('active')
								.next('.link-content')
								.slideUp();
							
							$objHeader
								.addClass('active')
								.next('.link-content')
								.slideDown();
							
							animation(current, section, effect, speed, easingOption);
						}
						zPos++;
						current = section;
						return false;
					}
				}
				
				function playSlider(current, effect, speed, easingOption){
					var nextSection = checkEnd(current);
					selectSection($('#accordion .link-header:eq('+nextSection+')', obj));
				}
				
				function startAuto(){
					autoPlaying = setInterval(function(){playSlider(current, effect, speed, easingOption);}, interval);
					obj.data('interval', autoPlaying);
				}
				
				function stopAuto(){
					clearInterval(obj.data('interval'));
				}
				
				function restartAuto(){
					clearInterval(obj.data('interval'));
					autoPlaying = setInterval(function(){
						playSlider(current, effect, speed, easingOption);
					}, interval);
					obj.data('interval', autoPlaying);
				}
				
				function checkEnd(tempSection) {
					if(tempSection == sliderCount) {
						tempSection = 0;
						return tempSection;
					} else {
						return tempSection;
					}
				}
				
				function resetLayers() {
					for(var i=sliderCount;i>0;i--){
						$('#slider > div:eq('+(i-1)+')', obj).css('z-index',zPos);
						zPos++;
					}
				}
				
			});
		}
	});
	
})(jQuery);
