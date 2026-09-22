import React from 'react';
import {View} from 'react-native';
import Icon from './Icon';
import Text from './Text';
import {COLORS} from '../tokens';
export default function UpgradeFeatureRow({title,detail,included=true}){
 return <View style={{flexDirection:'row',gap:10,alignItems:'flex-start',paddingVertical:8}}><View style={{width:24,height:24,borderRadius:12,backgroundColor:included?'rgba(53,208,186,.12)':COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Icon name={included?'check':'lock'} size={14} color={included?COLORS.mint:COLORS.muted}/></View><View style={{flex:1}}><Text variant="bodyStrong">{title}</Text>{detail?<Text variant="caption" muted style={{marginTop:2}}>{detail}</Text>:null}</View></View>;
}
