import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function SharePreview({vehicle='2020 Honda Accord Sport',score=68,headline='AI inspection summary'}){
 return <View style={{padding:18,borderRadius:RADIUS.xl,backgroundColor:COLORS.navy2,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" color={COLORS.cyan}>CARWISE</Text><Text variant="h2" style={{marginTop:4}}>{headline}</Text><Text muted style={{marginTop:4}}>{vehicle}</Text><View style={{flexDirection:'row',gap:10,marginTop:15}}><View style={{flex:1,padding:12,borderRadius:14,backgroundColor:COLORS.surface}}><Text variant="display" color={score>=75?COLORS.mint:score>=50?COLORS.amber:COLORS.coral}>{score}</Text><Text variant="caption" muted>risk score</Text></View><View style={{flex:1,padding:12,borderRadius:14,backgroundColor:COLORS.surface}}><Text variant="h2" color={COLORS.mint}>VERIFIED</Text><Text variant="caption" muted>evidence ready</Text></View></View></View>;
}
