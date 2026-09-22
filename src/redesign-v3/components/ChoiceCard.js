import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function ChoiceCard({title,description,selected,onPress,icon}) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{selected}}><View style={{padding:14,borderRadius:RADIUS.lg,borderWidth:selected?2:1,borderColor:selected?COLORS.cyan:COLORS.line,backgroundColor:selected?'rgba(0,212,255,.08)':COLORS.surface,marginBottom:9}}><View style={{flexDirection:'row',gap:10,alignItems:'center'}}>{icon?<Text color={COLORS.cyan}>{icon}</Text>:null}<View style={{flex:1}}><Text variant="bodyStrong">{title}</Text>{description?<Text variant="caption" muted style={{marginTop:3}}>{description}</Text>:null}</View><View style={{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:selected?COLORS.cyan:COLORS.line,backgroundColor:selected?COLORS.cyan:'transparent'}}/></View></View></Pressable>;
}
