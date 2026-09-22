import {DEMO_EVENTS,DEMO_ANIMATION_TIMELINES} from '../animation/demoTimeline';

export class DemoEngine{
 constructor(){this.running=false;this.listeners=new Set();this.cursor=0;this.clock=0;}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 emit(payload){this.listeners.forEach(fn=>fn(payload));}
 reset(){this.running=false;this.cursor=0;this.clock=0;this.emit({type:'reset'});}
 async play(events=DEMO_EVENTS){
  this.running=true;this.cursor=0;this.clock=0;this.emit({type:'start',events});
  for(let i=0;i<events.length;i+=1){if(!this.running)break;const event=events[i];const wait=Math.max(0,event.at-this.clock);await new Promise(r=>setTimeout(r,wait));this.clock=event.at;this.cursor=i;this.emit({type:'event',event,index:i});}
  this.running=false;this.emit({type:'complete'});
 }
 stop(){this.running=false;this.emit({type:'stop'});}
 timeline(key){return DEMO_ANIMATION_TIMELINES[key]||[];}
}

export const createDemoEngine=()=>new DemoEngine();
