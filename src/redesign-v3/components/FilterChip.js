import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function FilterChip({label,selected=false,onPress,count}) {
  return <Pressable onPress={onPress}><View style={{paddingVertical:8,paddingHorizontal:12,borderRadius:RADIUS.pill,borderWidth:1,borderColor:selected?COLORS.cyan:COLORS.line,backgroundColor:selected?'rgba(0,212,255,.10)':COLORS.surface,flexDirection:'row',gap:6,alignItems:'center'}}><Text variant="caption" color={selected?COLORS.cyan:COLORS.white}>{label}</Text>{count!=null?<Text variant="caption" muted>{count}</Text>:null}</View></Pressable>;
}
