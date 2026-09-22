import React from 'react';
import {View} from 'react-native';
import TimelineStep from './TimelineStep';
export default function InspectionTimeline({items=[]}) {
  return <View>{items.map((x,i)=><TimelineStep key={i} {...x}/>)}</View>;
}
