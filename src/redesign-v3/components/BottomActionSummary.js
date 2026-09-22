import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Button from './Button';
import {COLORS,RADIUS} from '../tokens';
export default function BottomActionSummary({label='Continue',title='Next best action',detail='Review the evidence before moving forward.',onPress}){
 return <View style={{padding:13,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" color={COLORS.cyan}>NEXT</Text><Text variant="h3" style={{marginTop:3}}>{title}</Text><Text variant="caption" muted style={{marginTop:3}}>{detail}</Text><View style={{marginTop:10}}><Button title={label} onPress={onPress}/></View></View>;
}
