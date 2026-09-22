import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function CostBreakdown({lines=[]}) {
  const totalLow=lines.reduce((a,x)=>a+(Number(x.low)||0),0);
  const totalHigh=lines.reduce((a,x)=>a+(Number(x.high)||0),0);
  const max=Math.max(totalHigh,1);
  return <View style={{padding:14,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
    {lines.map((x,i)=><View key={i} style={{marginBottom:12}}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text variant="caption">{x.title||x.name||`Repair ${i+1}`}</Text><Text variant="caption" color={COLORS.amber}>${Number(x.low||0).toLocaleString()}–${Number(x.high||0).toLocaleString()}</Text></View><View style={{height:7,borderRadius:7,backgroundColor:COLORS.surface2,overflow:'hidden',marginTop:6}}><View style={{height:7,width:`${Math.max(8,((Number(x.high)||0)/max)*100)}%`,borderRadius:7,backgroundColor:x.severity==='critical'?COLORS.coral:COLORS.amber}}/></View></View>)}
    <View style={{borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:12,flexDirection:'row',justifyContent:'space-between'}}><Text variant="bodyStrong">Total range</Text><Text variant="bodyStrong" color={COLORS.mint}>${totalLow.toLocaleString()}–${totalHigh.toLocaleString()}</Text></View>
  </View>;
}
