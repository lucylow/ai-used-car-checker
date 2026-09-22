import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function CertificateFactGrid({facts=[]}){
 return <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{facts.map((f,i)=><View key={i} style={{width:'48%',padding:12,borderRadius:RADIUS.md,backgroundColor:COLORS.surface2,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" muted>{f.label}</Text><Text variant="bodyStrong" style={{marginTop:5}} numberOfLines={2}>{f.value}</Text></View>)}</View>;
}
