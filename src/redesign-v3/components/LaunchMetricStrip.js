import React from 'react';
import {ScrollView,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function LaunchMetricStrip({items=[]}){
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>{items.map((x,i)=><View key={i} style={{minWidth:108,padding:12,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="h2" color={x.color||COLORS.cyan}>{x.value}</Text><Text variant="caption" muted style={{marginTop:3}}>{x.label}</Text></View>)}</ScrollView>;
}
