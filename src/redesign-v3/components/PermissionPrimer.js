import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import Button from './Button';
import {COLORS,RADIUS} from '../tokens';
export default function PermissionPrimer({kind='camera',onContinue}){
 const copy=kind==='camera'?['Camera','CarWise uses your camera to capture vehicle evidence.','Capture clear photos and short clips of issues.']:kind==='microphone'?['Microphone','Use voice notes to record observations while inspecting.','Your audio stays attached to the inspection context.']:['Notifications','Get reminders when reports, signatures or analysis are ready.','You can change this later in Settings.'];
 return <View style={{padding:18,borderRadius:RADIUS.xl,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line}}><Text variant="caption" color={COLORS.cyan}>ONE-TIME SETUP</Text><Text variant="h2" style={{marginTop:5}}>{copy[0]} access</Text><Text muted style={{marginTop:6}}>{copy[1]}</Text><Text variant="caption" muted style={{marginTop:8}}>{copy[2]}</Text><View style={{marginTop:15}}><Button title="Continue" onPress={onContinue}/></View></View>;
}
