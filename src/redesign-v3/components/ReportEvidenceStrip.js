import React from 'react';
import {ScrollView,Pressable,View} from 'react-native';
import MediaTile from './MediaTile';
import Text from './Text';
export default function ReportEvidenceStrip({items=[],onOpen}){
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:9}}>{items.map((x,i)=><Pressable key={i} onPress={()=>onOpen?.(x,i)}><MediaTile item={x}/><Text variant="caption" muted style={{marginTop:4,width:90}} numberOfLines={1}>{x.label||'Evidence'}</Text></Pressable>)}</ScrollView>;
}
