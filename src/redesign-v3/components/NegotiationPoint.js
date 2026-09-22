import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import Icon from './Icon';
import {COLORS,RADIUS} from '../tokens';
export default function NegotiationPoint({title='Point',detail='',evidence=[],onPress}) {
  return <Pressable onPress={onPress} style={{padding:14,borderRadius:RADIUS.lg,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,flexDirection:'row',gap:11,marginBottom:9}}>
    <View style={{width:36,height:36,borderRadius:18,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Icon name="pricetag" color={COLORS.cyan}/></View>
    <View style={{flex:1}}><Text variant="bodyStrong">{title}</Text><Text variant="caption" muted style={{marginTop:3}}>{detail}</Text>{evidence.length?<View style={{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:7}}>{evidence.map(x=><View key={x} style={{paddingVertical:3,paddingHorizontal:7,borderRadius:RADIUS.pill,backgroundColor:COLORS.surface2}}><Text variant="caption" color={COLORS.muted}>{x}</Text></View>)}</View>:null}</View>
  </Pressable>;
}
