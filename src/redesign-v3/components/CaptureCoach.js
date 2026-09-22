import React from 'react';
import {View} from 'react-native';
import Icon from './Icon';
import Text from './Text';
import {COLORS,RADIUS} from '../tokens';
export default function CaptureCoach({state='ready',message='Center the panel and move closer'}){
 const map={ready:[COLORS.cyan,'Camera ready'],good:[COLORS.mint,'Great capture'],warning:[COLORS.amber,'Adjust framing'],dark:[COLORS.coral,'Need more light'],processing:[COLORS.blue,'Analyzing']};const [color,label]=map[state]||map.ready;
 return <View style={{alignSelf:'center',paddingVertical:9,paddingHorizontal:12,borderRadius:RADIUS.pill,backgroundColor:'rgba(7,17,31,.82)',borderWidth:1,borderColor:color,flexDirection:'row',alignItems:'center',gap:8}}><Icon name={state==='good'?'check':state==='warning'?'warning':'camera'} size={16} color={color}/><View><Text variant="caption" color={COLORS.white}>{label}</Text><Text variant="caption" muted>{message}</Text></View></View>;
}
