import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Button from './Button';
import {COLORS,RADIUS} from '../tokens';
export default function FairOfferCard({target=19400,minimum=18900,maximum=20000,onPress}){
 return <View style={{padding:16,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" muted>Suggested negotiation window</Text><Text variant="display" color={COLORS.mint} style={{marginTop:4}}>${target.toLocaleString()}</Text><Text variant="caption" muted>Target offer · ${minimum.toLocaleString()}–${maximum.toLocaleString()} acceptable band</Text><View style={{marginTop:14}}><Button title="Build negotiation script" onPress={onPress} icon="message"/></View></View>;
}
