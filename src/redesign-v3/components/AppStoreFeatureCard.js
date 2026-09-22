import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function AppStoreFeatureCard({title='AI-Powered Inspection',subtitle='See the evidence behind every finding.',metric='24 checks'}){
 return <View style={{padding:16,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line,overflow:'hidden'}}><View style={{height:90,borderRadius:16,backgroundColor:COLORS.navy2,justifyContent:'center',paddingHorizontal:16}}><Text variant="display" color={COLORS.cyan}>{metric}</Text></View><Text variant="h3" style={{marginTop:12}}>{title}</Text><Text variant="body" muted style={{marginTop:4}}>{subtitle}</Text></View>;
}
