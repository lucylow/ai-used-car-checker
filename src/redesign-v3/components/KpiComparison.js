import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function KpiComparison({label='Market position',leftLabel='You',leftValue='$21.9k',rightLabel='Market',rightValue='$21.1k',delta='+$800'}){
 return <View style={{padding:14,borderRadius:RADIUS.lg,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" muted>{label}</Text><View style={{flexDirection:'row',alignItems:'flex-end',gap:14,marginTop:8}}><View style={{flex:1}}><Text variant="caption" muted>{leftLabel}</Text><Text variant="h2">{leftValue}</Text></View><Text variant="caption" color={COLORS.amber}>{delta}</Text><View style={{flex:1,alignItems:'flex-end'}}><Text variant="caption" muted>{rightLabel}</Text><Text variant="h2" color={COLORS.mint}>{rightValue}</Text></View></View></View>;
}
