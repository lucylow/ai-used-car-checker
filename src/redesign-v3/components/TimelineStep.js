import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS, RADIUS} from '../tokens';
export default function TimelineStep({title='Step', description, time, status='complete', icon='✓'}) {
  const color=status==='complete'?COLORS.mint:status==='active'?COLORS.cyan:status==='warning'?COLORS.amber:COLORS.muted;
  return <View style={{flexDirection:'row',gap:12,paddingVertical:10}}>
    <View style={{width:34,height:34,borderRadius:17,borderWidth:1,borderColor:color,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text color={color} variant="bodyStrong">{status==='complete'?'✓':icon}</Text></View>
    <View style={{flex:1,padding:10,borderRadius:RADIUS.md,backgroundColor:COLORS.surface2}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',gap:8}}><Text variant="bodyStrong">{title}</Text>{time?<Text variant="caption" muted>{time}</Text>:null}</View>
      {description?<Text variant="caption" muted style={{marginTop:4}}>{description}</Text>:null}
    </View>
  </View>;
}
