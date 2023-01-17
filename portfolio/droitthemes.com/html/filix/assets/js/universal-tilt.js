/*!
* universal-tilt.js v0.5
* Created 2018 by Jakub Biesiada
* Original idea: https://github.com/gijsroge/tilt.js
* MIT License
*/class UniversalTilt{constructor(elements,settings={}){if(elements.length>0){this.init(elements,settings);return;}else if(elements.length===0){return;}else{this.element=elements;}
this.settings=this.settings(settings);this.reverse=this.settings.reverse?-1:1;if(this.settings.shine){this.shine();}
this.element.style.transform=`perspective(${this.settings.perspective}px)`;this.addEventListeners();}
init(elements,settings){for(var element=0;element<elements.length;element++){new UniversalTilt(elements[element],settings);}}
addEventListeners(){if(window.DeviceMotionEvent&&"ontouchstart"in document.documentElement){this.onDeviceMoveBind=this.onDeviceMove.bind(this);window.addEventListener('devicemotion',this.onDeviceMoveBind);}else{if(this.settings['position-base']==='element'){this.onMouseMoveBind=this.onMouseMove.bind(this);this.element.addEventListener('mousemove',this.onMouseMoveBind);this.element.addEventListener('mouseleave',()=>this.onMouseLeave());}else if(this.settings['position-base']==='window'){this.onMouseMoveBind=this.onMouseMove.bind(this);window.addEventListener('mousemove',this.onMouseMoveBind);window.addEventListener('mouseleave',()=>this.onMouseLeave());}}}
onMouseMove(event){this.event=event;this.updateElementPosition();if(window.DeviceMotionEvent&&"ontouchstart"in document.documentElement){this.update();}else{window.requestAnimationFrame(()=>this.update());}}
onMouseLeave(){if(window.DeviceMotionEvent&&"ontouchstart"in document.documentElement){this.reset();}else{window.requestAnimationFrame(()=>this.reset());}}
onDeviceMove(event){this.movementEvent=event;this.update();this.updateElementPosition();}
reset(){this.event={pageX:this.left+this.width/2,pageY:this.top+this.height/2};if(this.settings.reset){this.element.style.transform=`perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;}
if(this.settings.animation){this.element.style.transition='all 500ms ease';}
if(this.settings.shine&&!this.settings['shine-save']){this.shineElement.style.transition='all 500ms ease';this.shineElement.style.transform='rotate(180deg) translate3d(-50%, -50%, 0)';this.shineElement.style.opacity='0';}
if(this.settings.shadow&&!this.settings['shadow-save']){this.element.style.boxShadow='0 45px 100px rgba(0, 0, 0, 0)';}}
getValues(){var x;var y;if(window.DeviceMotionEvent&&"ontouchstart"in document.documentElement){x=Math.round(event.accelerationIncludingGravity.x)/6;y=Math.round(event.accelerationIncludingGravity.y)/6;var stateX;var stateY;if(window.orientation===90){stateX=1.0+x;stateY=1.0-y;y=stateX/2;x=stateY/2;}else if(window.orientation===-90){stateX=1.0-x;stateY=1.0+y;y=stateX/2;x=stateY/2;}else if(window.orientation===0){stateY=1.0+y;stateX=1.0+x;y=stateY/2;x=stateX/2;}else if(window.orientation===180){stateY=1.0-y;stateX=1.0-x;y=stateY/2;x=stateX/2;}}else{if(this.settings['position-base']==='element'){x=(this.event.clientX-this.left)/this.width;y=(this.event.clientY-this.top)/this.height;}else{x=(this.event.clientX)/window.innerWidth;y=(this.event.clientY)/window.innerHeight;}
x=Math.min(Math.max(x,0),1);y=Math.min(Math.max(y,0),1);}
var tiltX=((this.settings.max/2)-(x*this.settings.max)).toFixed(2);var tiltY=((y*this.settings.max)-(this.settings.max/2)).toFixed(2);var angle=Math.atan2(0.5-x,y-0.5)*(180/Math.PI);return{tiltX:this.reverse*tiltX,tiltY:this.reverse*tiltY,percentageX:x*100,percentageY:y*100,angle:angle};}
updateElementPosition(){let rect=this.element.getBoundingClientRect();this.width=this.element.offsetWidth;this.height=this.element.offsetHeight;this.left=rect.left;this.top=rect.top;}
update(){let values=this.getValues();if(this.settings.animation){this.element.style.transition='all 100ms ease';}
if(this.settings.shadow){this.boxShadow='0 45px 100px rgba(0, 0, 0, 0.4)';}
this.element.style.transform=`perspective(${this.settings.perspective}px)
    rotateX(${this.settings.disabled==="X"||this.settings.disabled==="x"?0:values.tiltY}deg)
    rotateY(${this.settings.disabled==="Y"||this.settings.disabled==="y"?0:values.tiltX}deg)
    scale(${this.settings.scale})`;if(this.settings.shine){this.shineElement.style.transition='all 0ms ease';this.shineElement.style.transform=`rotate(${-values.angle}deg) translate3d(-50%, -50%, 0)`;this.shineElement.style.opacity=`${this.settings["shine-opacity"]}`;}
if(this.settings.shadow){this.element.style.boxShadow=this.boxShadow;}
this.element.dispatchEvent(new CustomEvent("tiltChange",{"detail":{'X':values.tiltX,'Y':values.tiltY}}));}
shine(){const createShine=document.createElement("div");createShine.classList.add("shine");const createShineInner=document.createElement("div");createShineInner.classList.add("shine-inner");createShine.appendChild(createShineInner);this.element.appendChild(createShine);this.shineElementWrapper=this.element.querySelector(".shine");this.shineElement=this.element.querySelector(".shine-inner");Object.assign(this.shineElementWrapper.style,{'position':'absolute','top':'0','left':'0','height':'100%','width':'100%','overflow':'hidden'});Object.assign(this.shineElement.style,{'position':'absolute','top':'50%','left':'50%','pointer-events':'none','background-image':'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)','width':`${this.element.offsetWidth*2}px`,'height':`${this.element.offsetWidth*2}px`,'transform':'rotate(180deg) translate3d(-50%, -50%, 0)','transform-origin':'0% 0%','opacity':'0'});}
settings(settings){let defaults={'position-base':'element',reset:true,shadow:false,'shadow-save':false,shine:false,'shine-opacity':0,'shine-save':false,max:35,perspective:1000,scale:1.0,disabled:null,reverse:false,animation:true}
let custom={};for(var setting in defaults){if(setting in settings){custom[setting]=settings[setting];}else if(this.element.getAttribute(`data-${setting}`)){let attribute=this.element.getAttribute(`data-${setting}`);try{custom[setting]=JSON.parse(attribute);}catch(e){custom[setting]=attribute;}}else{custom[setting]=defaults[setting];}}
return custom;}}
if(window.jQuery){let $=window.jQuery;$.fn.UniversalTilt=function(options){for(var element=0;element<this.length;element++){new UniversalTilt(this[element],options);}}}