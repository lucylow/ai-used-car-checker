import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function RepairImpactBadge({amount='$1,400',label='potential negotiation impact',tone='watch'}){
 const c=tone==='danger'?COLORS.coral:tone==='success'?COLORS.mint:COLORS.amber;
 return <View style={{paddingVertical:8,paddingHorizontal:11,borderRadius:RADIUS.pill,backgroundColor:COLORS.surface2,borderWidth:1,borderColor:c,alignSelf:'flex-start'}}><Text variant="caption" color={c}>{amount}</Text><Text variant="caption" muted style={{marginTop:1}}>{label}</Text></View>;
}
