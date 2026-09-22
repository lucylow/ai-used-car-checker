import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS} from '../tokens';
export default function PriceWaterfallLegend({items=[]}){
 return <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{items.map((x,i)=><View key={i} style={{flexDirection:'row',alignItems:'center',gap:6}}><View style={{width:9,height:9,borderRadius:3,backgroundColor:x.color||COLORS.blue}}/><Text variant="caption" muted>{x.label}</Text></View>)}</View>;
}
