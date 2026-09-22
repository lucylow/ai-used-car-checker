import React from 'react';
import {View,Pressable} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function ReviewPrompt({onRate,onDismiss}){
 return <View style={{padding:16,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" color={COLORS.cyan}>HELP CARWISE IMPROVE</Text><Text variant="h2" style={{marginTop:5}}>How was your inspection?</Text><Text muted style={{marginTop:4}}>A quick rating helps us improve the experience.</Text><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:14}}>{['1','2','3','4','5'].map(n=><Pressable key={n} onPress={()=>onRate?.(n)} style={{width:46,height:46,borderRadius:23,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="h3">{n}</Text></Pressable>)}</View><Pressable onPress={onDismiss} style={{alignSelf:'center',marginTop:11}}><Text variant="caption" muted>Not now</Text></Pressable></View>;
}
