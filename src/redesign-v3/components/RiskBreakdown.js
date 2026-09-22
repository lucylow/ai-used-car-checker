import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function RiskBreakdown({items=[]}){
 const total=Math.max(items.reduce((a,x)=>a+(Number(x.value)||0),0),1);
 return <View style={{padding:14,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
  {items.map((x,i)=>{const width=Math.min(100,((Number(x.value)||0)/total)*100);const color=x.tone==='danger'?COLORS.coral:x.tone==='watch'?COLORS.amber:COLORS.mint;return <View key={i} style={{marginBottom:i===items.length-1?0:13}}>
   <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text variant="caption">{x.label}</Text><Text variant="caption" color={color}>{x.value}</Text></View>
   <View style={{height:8,borderRadius:8,backgroundColor:COLORS.surface2,marginTop:6,overflow:'hidden'}}><View style={{width:`${width}%`,height:8,borderRadius:8,backgroundColor:color}}/></View>
  </View>})}
 </View>;
}
