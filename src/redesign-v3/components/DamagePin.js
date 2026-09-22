import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import {COLORS} from '../tokens';
export default function DamagePin({x=50,y=50,label='Issue',tone='danger',onPress}){
 const color=tone==='danger'?COLORS.coral:tone==='watch'?COLORS.amber:COLORS.mint;
 return <Pressable onPress={onPress} style={{position:'absolute',left:`${x}%`,top:`${y}%`,transform:[{translateX:-15},{translateY:-15}]}}>
  <View style={{width:30,height:30,borderRadius:15,backgroundColor:color,borderWidth:3,borderColor:COLORS.white,alignItems:'center',justifyContent:'center'}}><Text variant="caption" color={COLORS.ink}>!</Text></View>
  <View style={{position:'absolute',top:34,left:-35,paddingHorizontal:7,paddingVertical:4,borderRadius:8,backgroundColor:'rgba(7,17,31,.90)'}}><Text variant="caption" numberOfLines={1}>{label}</Text></View>
 </Pressable>;
}
