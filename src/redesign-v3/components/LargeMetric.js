import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Badge from './Badge';
import {COLORS, SPACE} from '../tokens';
export default function LargeMetric({label='Metric', value='—', caption, tone='info'}) {
  const color=tone==='success'?COLORS.mint:tone==='watch'?COLORS.amber:tone==='danger'?COLORS.coral:COLORS.cyan;
  return <View accessibilityLabel={`${label}: ${value}`} style={{padding:SPACE.lg}}>
    <Text variant="caption" muted>{label}</Text>
    <Text variant="display" style={{marginTop:4}}>{value}</Text>
    {caption?<Text variant="caption" color={color} style={{marginTop:4}}>{caption}</Text>:null}
  </View>;
}
