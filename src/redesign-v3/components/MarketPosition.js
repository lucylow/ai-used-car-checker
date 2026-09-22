import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function MarketPosition({asking=21900,market=21100,low=19800,high=23900}){
 const range=Math.max(high-low,1);const left=Math.max(0,Math.min(100,((market-low)/range)*100));const ask=Math.max(0,Math.min(100,((asking-low)/range)*100));
 return <View style={{padding:15,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}>
  <View style={{flexDirection:'row',justifyContent:'space-between'}}><View><Text variant="caption" muted>Market</Text><Text variant="h2" style={{marginTop:2}}>${market.toLocaleString()}</Text></View><View style={{alignItems:'flex-end'}}><Text variant="caption" muted>Asking</Text><Text variant="h2" color={COLORS.amber} style={{marginTop:2}}>${asking.toLocaleString()}</Text></View></View>
  <View style={{height:12,borderRadius:12,backgroundColor:COLORS.surface2,marginTop:18,position:'relative'}}><View style={{position:'absolute',left:'0%',width:`${left}%`,height:12,backgroundColor:COLORS.mint,borderRadius:12}}/><View style={{position:'absolute',left:`${ask}%`,top:-6,width:24,height:24,borderRadius:12,backgroundColor:COLORS.amber,borderWidth:3,borderColor:COLORS.ink}}/></View>
  <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}><Text variant="caption" muted>${low.toLocaleString()}</Text><Text variant="caption" color={COLORS.mint}>fair range</Text><Text variant="caption" muted>${high.toLocaleString()}</Text></View>
 </View>;
}
