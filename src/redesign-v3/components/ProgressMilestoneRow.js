import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS} from '../tokens';
export default function ProgressMilestoneRow({items=[]}){
 return <View style={{flexDirection:'row',alignItems:'flex-start'}}>{items.map((x,i)=>{const done=x.done;return <View key={i} style={{flex:1,alignItems:'center'}}><View style={{flexDirection:'row',width:'100%',alignItems:'center'}}>{i>0?<View style={{flex:1,height:2,backgroundColor:items[i-1].done?COLORS.mint:COLORS.line}}/>:null}<View style={{width:25,height:25,borderRadius:13,backgroundColor:done?COLORS.mint:COLORS.surface2,borderWidth:1,borderColor:done?COLORS.mint:COLORS.line,alignItems:'center',justifyContent:'center'}}><Text variant="caption" color={done?COLORS.ink:COLORS.muted}>{done?'✓':i+1}</Text></View>{i<items.length-1?<View style={{flex:1,height:2,backgroundColor:done?COLORS.mint:COLORS.line}}/>:null}</View><Text variant="caption" muted style={{marginTop:5,textAlign:'center'}}>{x.label}</Text></View>})}</View>;
}
