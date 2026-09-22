import { StyleSheet } from 'react-native';
export const COLORS={ink:'#07111F',navy:'#0B1626',navy2:'#101F34',surface:'#14243A',surface2:'#192C45',line:'#28405D',white:'#F7FBFF',muted:'#8FA5BA',blue:'#2F80ED',cyan:'#00D4FF',mint:'#35D0BA',amber:'#F4B740',coral:'#F16B6B',lilac:'#9B8AFB',cloud:'#EAF1F7'};
export const FONT={display:{fontSize:34,lineHeight:39,fontWeight:'800'},h1:{fontSize:28,lineHeight:34,fontWeight:'800'},h2:{fontSize:21,lineHeight:27,fontWeight:'700'},h3:{fontSize:17,lineHeight:22,fontWeight:'700'},body:{fontSize:15,lineHeight:22,fontWeight:'400'},bodyStrong:{fontSize:15,lineHeight:21,fontWeight:'650'},caption:{fontSize:12,lineHeight:17,fontWeight:'500'},mono:{fontSize:13,lineHeight:19,fontWeight:'600',fontFamily:'monospace',letterSpacing:0.5}};
export const SPACE={xxs:4,xs:8,sm:12,md:16,lg:20,xl:24,xxl:32,huge:44};
export const RADIUS={sm:10,md:14,lg:18,xl:24,pill:999};
export const MOTION={fast:160,normal:220,slow:360,spring:{damping:14,stiffness:170,mass:0.65}};
export const shadowSoft={shadowColor:'#000',shadowOpacity:0.12,shadowRadius:18,shadowOffset:{width:0,height:10},elevation:5};
export const screenStyles=StyleSheet.create({content:{paddingHorizontal:16,paddingBottom:128},row:{flexDirection:'row',alignItems:'center'},between:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}});
