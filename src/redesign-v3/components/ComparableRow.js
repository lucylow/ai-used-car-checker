import React from 'react';
import {Pressable,View,Image} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import {COLORS,RADIUS} from '../tokens';
export default function ComparableRow({item,onPress}){
 const delta=(item.price||0)-(21900);
 return <Pressable onPress={onPress} style={{flexDirection:'row',gap:11,padding:11,borderRadius:RADIUS.lg,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,marginBottom:8}}>
  {item.image?<Image source={{uri:item.image}} style={{width:78,height:62,borderRadius:12}}/>:<View style={{width:78,height:62,borderRadius:12,backgroundColor:COLORS.surface2}}/>}
  <View style={{flex:1}}><Text variant="bodyStrong" numberOfLines={1}>{item.title||'Comparable vehicle'}</Text><Text variant="caption" muted style={{marginTop:3}}>{(item.mileage||0).toLocaleString()} mi · {item.city||'Local market'}</Text><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:7}}><Text variant="h3">${(item.price||0).toLocaleString()}</Text><Badge label={delta<=0?'Below ask':'Above ask'} tone={delta<=0?'success':'watch'}/></View></View>
 </Pressable>;
}
