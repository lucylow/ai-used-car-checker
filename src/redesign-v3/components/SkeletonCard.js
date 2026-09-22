import React from 'react';
import {Animated,View} from 'react-native';
import {COLORS,RADIUS} from '../tokens';
export default function SkeletonCard({height=110}){
 const opacity=new Animated.Value(.55);
 Animated.loop(Animated.sequence([Animated.timing(opacity,{toValue:1,duration:700,useNativeDriver:true}),Animated.timing(opacity,{toValue:.55,duration:700,useNativeDriver:true})])).start();
 return <Animated.View style={{height,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface2,borderWidth:1,borderColor:COLORS.line,opacity,padding:14}}><View style={{width:'48%',height:13,borderRadius:7,backgroundColor:COLORS.line}}/><View style={{width:'75%',height:10,borderRadius:5,backgroundColor:COLORS.line,marginTop:12}}/><View style={{width:'62%',height:10,borderRadius:5,backgroundColor:COLORS.line,marginTop:7}}/><View style={{width:'35%',height:32,borderRadius:16,backgroundColor:COLORS.line,marginTop:16}}/></Animated.View>;
}
