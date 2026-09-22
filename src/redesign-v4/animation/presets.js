/**
 * Animation presets for the CarWise V4 demo layer.
 * These are framework-neutral configs consumed by Animated/Reanimated wrappers.
 */
export const MOTION={
 fast:180,
 base:240,
 slow:380,
 spring:{tension:180,friction:18},
 press:{scale:.97,duration:90},
 fadeIn:{duration:240,from:0,to:1},
 fadeOut:{duration:180,from:1,to:0},
 slideUp:{duration:280,distance:20},
 slideRight:{duration:260,distance:18},
 scaleIn:{duration:260,from:.94,to:1},
 pulse:{duration:900,from:1,to:1.04,loop:true},
 shimmer:{duration:1300,loop:true},
 scan:{duration:1400,loop:true},
 count:{duration:900},
 draw:{duration:700},
};

export const EASINGS={
 easeOut:'easeOut',
 easeInOut:'easeInOut',
 linear:'linear',
 spring:'spring',
};

export const SCREEN_TRANSITIONS={
 default:{enter:{type:'slide',axis:'x',duration:MOTION.base,easing:EASINGS.easeOut},exit:{type:'fade',duration:MOTION.fast,easing:EASINGS.easeOut}},
 modal:{enter:{type:'sheet',distance:48,duration:MOTION.slow,easing:EASINGS.spring},exit:{type:'sheet',distance:48,duration:MOTION.base,easing:EASINGS.easeInOut}},
 viewer:{enter:{type:'scaleFade',duration:MOTION.base,easing:EASINGS.easeOut},exit:{type:'fade',duration:MOTION.fast,easing:EASINGS.easeOut}},
 wizard:{enter:{type:'slideFade',axis:'x',duration:260,easing:EASINGS.easeOut},exit:{type:'slideFade',axis:'x',duration:220,easing:EASINGS.easeInOut}},
};

export const CARD_MOTION={
 enter:{type:'stagger',delayStep:45,duration:260,easing:EASINGS.easeOut,translateY:14,opacityFrom:0},
 press:{scale:.985,duration:90},
 lift:{translateY:-2,shadowOpacity:.18,duration:140},
 release:{translateY:0,shadowOpacity:.1,duration:160},
};

export const SCORE_MOTION={
 riskRing:{type:'arcDraw',duration:950,easing:EASINGS.easeOut},
 number:{type:'countUp',duration:900,easing:EASINGS.easeOut},
 trend:{type:'lineDraw',duration:800,easing:EASINGS.easeOut},
 severity:{type:'colorMorph',duration:420,easing:EASINGS.easeInOut},
};

export const AI_MOTION={
 idle:{type:'softGlow',duration:1600,opacity:[.5,.9,.5],loop:true},
 processing:{type:'scanSweep',duration:1400,direction:'leftToRight',loop:true},
 linking:{type:'dataParticles',duration:1200,loop:true},
 confidence:{type:'meterFill',duration:650},
 complete:{type:'sealReveal',duration:720},
};

export const CAPTURE_MOTION={
 target:{type:'breathe',scale:[1,.98,1],duration:1200,loop:true},
 scanLine:{type:'translateY',duration:MOTION.scan,loop:true},
 goodShot:{type:'flashBorder',duration:240},
 attach:{type:'pop',scale:[.92,1.04,1],duration:260},
 recording:{type:'recordingPulse',duration:900,loop:true},
 waveform:{type:'bars',duration:420,loop:true},
};

export const LIST_MOTION={
 pullRefresh:{type:'stretch',maxDistance:84},
 reorder:{type:'dragSpring'},
 swipeAction:{type:'reveal',distance:88,duration:220},
 skeleton:{type:'shimmerSweep',duration:1300,loop:true},
};

export const REDUCED_MOTION={
 transition:{type:'fade',duration:120},
 score:{type:'instant'},
 chart:{type:'instant'},
 looping:{type:'none'},
 celebration:{type:'none'},
};
