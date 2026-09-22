import React from 'react';
import {View} from 'react-native';
import Icon from './Icon';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function HumanApprovalBanner({signed=false}){
 return <View style={{padding:13,borderRadius:RADIUS.lg,backgroundColor:signed?'rgba(53,208,186,.08)':'rgba(244,183,64,.08)',borderWidth:1,borderColor:signed?COLORS.mint:COLORS.amber,flexDirection:'row',gap:10}}><Icon name={signed?'check':'pen'} color={signed?COLORS.mint:COLORS.amber}/><View style={{flex:1}}><Text variant="bodyStrong">{signed?'Human signature recorded':'Human approval required'}</Text><Text variant="caption" muted style={{marginTop:3}}>{signed?'The agreement was authorized by a person.':'CarWise can prepare the agreement, but only the user can authorize the final signature.'}</Text></View></View>;
}
