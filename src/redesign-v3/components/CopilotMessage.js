import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function CopilotMessage({text='',role='assistant',evidence=[]}) {
  const user=role==='user';
  return <View style={{alignItems:user?'flex-end':'flex-start',marginBottom:10}}><View style={{maxWidth:'90%',padding:13,borderRadius:RADIUS.lg,backgroundColor:user?COLORS.blue:COLORS.surface,borderWidth:user?0:1,borderColor:COLORS.line}}><Text color={user?COLORS.white:COLORS.white}>{text}</Text>{evidence.length?<View style={{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:8}}>{evidence.map(x=><View key={x} style={{paddingVertical:4,paddingHorizontal:7,borderRadius:RADIUS.pill,backgroundColor:user?'rgba(255,255,255,.15)':COLORS.surface2}}><Text variant="caption" muted={!user}>{x}</Text></View>)}</View>:null}</View></View>;
}
