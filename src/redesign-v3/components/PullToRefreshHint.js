import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function PullToRefreshHint({active=false}){
 return <View style={{alignItems:'center',paddingVertical:6}}><View style={{width:44,height:4,borderRadius:4,backgroundColor:COLORS.line}}/><Text variant="caption" color={active?COLORS.cyan:COLORS.muted} style={{marginTop:4}}>{active?'Release to refresh':'Pull to refresh market data'}</Text></View>;
}
