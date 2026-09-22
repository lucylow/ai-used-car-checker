import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import {COLORS,RADIUS} from '../tokens';
export default function RepairLine({title='Repair item',low=0,high=0,severity='minor',note}) {
  const tone=severity==='critical'?'danger':severity==='major'||severity==='watch'?'watch':'success';
  return <View style={{padding:13,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line,marginBottom:8}}><View style={{flexDirection:'row',justifyContent:'space-between',gap:10}}><View style={{flex:1}}><Text variant="bodyStrong">{title}</Text>{note?<Text variant="caption" muted style={{marginTop:3}}>{note}</Text>:null}</View><Badge label={severity} tone={tone}/></View><Text variant="h3" color={COLORS.amber} style={{marginTop:9}}>${Number(low).toLocaleString()}–${Number(high).toLocaleString()}</Text></View>;
}
