import React from 'react';
import {Pressable,View} from 'react-native';
import Text from './Text';
import Icon from './Icon';
import {COLORS,RADIUS} from '../tokens';
export default function AIActionCard({title='Ask CarWise',detail='Use your inspection evidence to get a contextual answer.',icon='sparkles',onPress}){
 return <Pressable onPress={onPress} style={{padding:14,borderRadius:RADIUS.xl,backgroundColor:'rgba(0,212,255,.07)',borderWidth:1,borderColor:'rgba(0,212,255,.30)',flexDirection:'row',gap:11,alignItems:'center'}}><View style={{width:40,height:40,borderRadius:20,backgroundColor:COLORS.surface2,alignItems:'center',justifyContent:'center'}}><Icon name={icon} color={COLORS.cyan}/></View><View style={{flex:1}}><Text variant="bodyStrong">{title}</Text><Text variant="caption" muted style={{marginTop:2}}>{detail}</Text></View><Text variant="h3" color={COLORS.cyan}>›</Text></Pressable>;
}
