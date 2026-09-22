import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import {COLORS,RADIUS} from '../tokens';
export default function DocumentCardLarge({title='Service history',type='PDF',pages=4,status='Review',confidence=82,onPress}){
 const tone=status==='Verified'?'success':status==='Needs review'?'danger':'watch';
 return <Pressable onPress={onPress} style={{padding:15,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
  <View style={{flexDirection:'row',gap:12}}><View style={{width:58,height:70,borderRadius:14,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="h3" color={COLORS.cyan}>{type}</Text><Text variant="caption" muted>{pages} pages</Text></View><View style={{flex:1}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8}}><Text variant="bodyStrong" numberOfLines={1}>{title}</Text><Badge label={status} tone={tone}/></View><Text variant="caption" muted style={{marginTop:7}}>{confidence}% extraction confidence</Text><View style={{height:7,borderRadius:7,backgroundColor:COLORS.surface2,overflow:'hidden',marginTop:8}}><View style={{width:`${confidence}%`,height:7,borderRadius:7,backgroundColor:confidence>=90?COLORS.mint:COLORS.amber}}/></View></View></View>
 </Pressable>;
}
