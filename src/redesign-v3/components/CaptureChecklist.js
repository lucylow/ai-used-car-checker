import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function CaptureChecklist({items=[]}){
 return <View style={{gap:8}}>{items.map((x,i)=>{const done=x.done;return <View key={i} style={{padding:11,borderRadius:RADIUS.md,backgroundColor:done?'rgba(53,208,186,.08)':COLORS.surface,borderWidth:1,borderColor:done?COLORS.mint:COLORS.line,flexDirection:'row',alignItems:'center',gap:10}}><View style={{width:22,height:22,borderRadius:11,backgroundColor:done?COLORS.mint:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Text variant="caption" color={done?COLORS.ink:COLORS.muted}>{done?'✓':'•'}</Text></View><View style={{flex:1}}><Text variant="bodyStrong">{x.label}</Text>{x.detail?<Text variant="caption" muted>{x.detail}</Text>:null}</View><Text variant="caption" color={done?COLORS.mint:COLORS.muted}>{done?'Done':'Needed'}</Text></View>})}</View>;
}
