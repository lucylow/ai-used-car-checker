import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Animated,Dimensions,FlatList,Image,Modal,Pressable,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {VEHICLE_MEDIA,MEDIA_STATS} from './data/mediaFixtures';
import {VEHICLES,VEHICLE_ZONES,VEHICLE_SPEC_ROWS} from './data/vehicleFixtures';
import {AI_FINDINGS,AI_PIPELINE,AI_EXPLANATIONS} from './data/aiFixtures';
import {COMPARABLE_LISTINGS,MARKET_SERIES,MARKET_BANDS} from './data/marketFixtures';
import {DOCUMENTS,DOCUMENT_FIELDS} from './data/documentFixtures';
import {NEGOTIATION_SCENARIOS,NEGOTIATION_TALKING_POINTS,SELLER_QUESTIONS} from './data/negotiationFixtures';
import {COPILOT_SUGGESTIONS,COPILOT_THREAD,COPILOT_ACTIONS} from './data/copilotFixtures';
import {REPORT_SECTIONS,REPORT_STATS,REPORT_HIGHLIGHTS,REPORT_ACTIVITY} from './data/reportFixtures';
import {CAPTURE_TASKS,MULTIMODAL_SESSIONS,MEDIA_REVIEW_STATES} from './data/multimodalFixtures';
import {NOTIFICATIONS} from './data/notificationFixtures';
import {PLANS,PAYWALL_MESSAGING} from './data/subscriptionFixtures';

const W=Dimensions.get('window').width;
const C={bg:'#08111D',surface:'#101C2A',surface2:'#152337',surface3:'#1C2D43',text:'#F2F7FB',muted:'#8FA6B5',blue:'#2F80ED',cyan:'#00D4FF',mint:'#35D0BA',amber:'#F4B740',coral:'#F16B6B',line:'#24354D',white:'#FFFFFF'};

const shadow={shadowColor:'#000',shadowOpacity:.2,shadowRadius:14,shadowOffset:{width:0,height:7},elevation:5};
const scoreColor=(score)=>score>=80?C.mint:score>=55?C.amber:C.coral;
const severityColor=(severity)=>severity==='critical'?C.coral:severity==='major'?C.amber:severity==='watch'?C.amber:C.mint;
const money=(n)=>`$${Number(n).toLocaleString()}`;
const cx=(a,b)=>a*b;

export function DemoPage({title,subtitle,children,scroll=true,onExit}){
 const body=scroll?<ScrollView contentContainerStyle={s.page}>{children}</ScrollView>:<View style={s.page}>{children}</View>;
 return <View style={s.screen}><View style={s.header}><View style={{flex:1}}><Text style={s.eyebrow}>CARWISE V4</Text><Text style={s.title}>{title}</Text>{subtitle?<Text style={s.subtitle}>{subtitle}</Text>:null}</View>{onExit?<Pressable accessibilityRole="button" accessibilityLabel="Close V4 showcase" onPress={onExit} style={s.headerDot}><Ionicons name="close" color={C.cyan} size={19}/></Pressable>:<View style={s.headerDot}><Ionicons name="sparkles" color={C.cyan} size={17}/></View>}</View>{body}</View>;
}

export function Section({title,action,children}){
 return <View style={s.section}><View style={s.sectionHead}><Text style={s.sectionTitle}>{title}</Text>{action?<Text style={s.sectionAction}>{action}</Text>:null}</View>{children}</View>;
}

export function Pill({label,tone='neutral',icon}){
 const color=tone==='success'?C.mint:tone==='warning'?C.amber:tone==='danger'?C.coral:tone==='info'?C.cyan:C.muted;
 return <View style={[s.pill,{borderColor:color+'55',backgroundColor:color+'18'}]}>{icon?<Ionicons name={icon} color={color} size={12}/>:null}<Text style={[s.pillText,{color}]}>{label}</Text></View>;
}

export function IconBox({icon,color=C.cyan,size=42}){
 return <View style={[s.iconBox,{width:size,height:size,borderRadius:size/3,backgroundColor:color+'15',borderColor:color+'35'}]}><Ionicons name={icon} color={color} size={size*.48}/></View>;
}

export function AnimatedReveal({children,delay=0,style}){
 const v=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(v,{toValue:1,duration:320,delay,useNativeDriver:true}).start()},[v,delay]);
 const translate=v.interpolate({inputRange:[0,1],outputRange:[16,0]});
 return <Animated.View style={[style,{opacity:v,transform:[{translateY:translate}]}]}>{children}</Animated.View>;
}

export function CountUp({value,prefix='',suffix='',duration=900}){
 const v=useRef(new Animated.Value(0)).current;
 const [display,setDisplay]=useState(0);
 useEffect(()=>{
  const id=v.addListener(({value:x})=>setDisplay(Math.round(x)));
  Animated.timing(v,{toValue:value,duration,useNativeDriver:false}).start();
  return()=>v.removeListener(id);
 },[v,value,duration]);
 return <Text style={s.metric}>{prefix}{display}{suffix}</Text>;
}

export function ProgressBar({value,color=C.cyan,height=8}){
 const w=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(w,{toValue:value,duration:550,useNativeDriver:false}).start()},[w,value]);
 return <View style={[s.track,{height}]}><Animated.View style={[s.fill,{height,backgroundColor:color,width:w.interpolate({inputRange:[0,1],outputRange:['0%','100%']})}]}/></View>;
}

export function ScoreRing({score,size=116}){
 const p=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(p,{toValue:score,duration:900,useNativeDriver:false}).start()},[p,score]);
 return <View style={[s.ring,{width:size,height:size,borderRadius:size/2,borderColor:scoreColor(score),shadowColor:scoreColor(score)}]}><Text style={[s.ringScore,{fontSize:size*.28}]}>{score}</Text><Text style={s.ringLabel}>RISK</Text></View>;
}

export function VehicleHero({vehicle=VEHICLES[0],compact=false}){
 return <View style={[s.hero,{minHeight:compact?180:242}]}><Image source={{uri:vehicle.image}} style={StyleSheet.absoluteFillObject}/><View style={s.heroOverlay}/><View style={s.heroContent}><View style={s.heroTop}><Pill label={vehicle.status==='active'?'ACTIVE INSPECTION':'SAVED'} tone={vehicle.status==='active'?'info':'success'} icon="pulse-outline"/><Text style={s.heroLocation}>{vehicle.location}</Text></View><View><Text style={s.heroVehicle}>{vehicle.year} {vehicle.make} {vehicle.model}</Text><Text style={s.heroTrim}>{vehicle.trim} · {vehicle.mileage.toLocaleString()} mi</Text><View style={s.heroRow}><Text style={s.heroPrice}>{money(vehicle.asking)}</Text><Pill label={`${vehicle.risk} risk`} tone={vehicle.risk>=70?'danger':vehicle.risk>=55?'warning':'success'}/></View></View></View></View>;
}

export function MetricCard({label,value,helper,icon,color=C.cyan,onPress}){
 return <Pressable onPress={onPress} style={({pressed})=>[s.metricCard,pressed&&s.pressed]}><IconBox icon={icon} color={color} size={38}/><Text style={s.metricLabel}>{label}</Text><Text style={s.metricValue}>{value}</Text><Text style={s.metricHelper}>{helper}</Text></Pressable>;
}

export function EvidenceThumb({item,onPress,selected=false}){
 const [loading,setLoading]=useState(true);
 return <Pressable onPress={()=>onPress?.(item)} style={[s.thumb,selected&&{borderColor:C.cyan,borderWidth:2}]}><Image source={{uri:item.uri?.startsWith('http')?item.uri:VEHICLES[0].image}} style={s.thumbImage} onLoad={()=>setLoading(false)}/>{loading&&<View style={s.thumbSkeleton}/>}<View style={s.thumbBadge}><Ionicons name={item.kind==='photo'?'image-outline':item.kind==='video'?'videocam-outline':item.kind==='audio'?'mic-outline':'document-outline'} color={C.white} size={12}/></View>{item.duration?<Text style={s.duration}>{item.duration}s</Text>:null}</Pressable>;
}

export function EvidenceMosaic({items=VEHICLE_MEDIA.slice(0,6),onOpen}){
 return <View style={s.mosaic}>{items.map((item,i)=><EvidenceThumb key={item.id} item={item} onPress={onOpen} selected={i===0}/>)}</View>;
}

export function EvidenceCounter(){
 return <View style={s.counterRow}><IconBox icon="images-outline" color={C.cyan} size={34}/><View style={{flex:1}}><Text style={s.counterTitle}>{MEDIA_STATS.total} evidence items</Text><Text style={s.counterSub}>{MEDIA_STATS.photos} photos · {MEDIA_STATS.videos} videos · {MEDIA_STATS.audio} voice · {MEDIA_STATS.documents} docs</Text></View><Ionicons name="chevron-forward" color={C.muted} size={18}/></View>;
}

export function MarketGauge({asking=21900,low=19800,center=21100,high=23900}){
 const range=high-low;
 const pos=Math.max(0,Math.min(1,(asking-low)/range));
 return <View style={s.gaugeBox}><View style={s.gaugeLabels}><Text style={s.gaugeLabel}>LOW {money(low)}</Text><Text style={s.gaugeLabel}>FAIR {money(center)}</Text><Text style={s.gaugeLabel}>HIGH {money(high)}</Text></View><View style={s.gaugeTrack}><View style={s.gaugeFair}/><View style={[s.gaugeMarker,{left:`${pos*100}%`}]}><View style={s.gaugeBubble}><Text style={s.gaugeBubbleText}>ASK</Text></View></View></View><Text style={s.gaugeFoot}>{asking>center?'Above observed center':'Within observed center'} by {money(Math.abs(asking-center))}</Text></View>;
}

export function MiniLineChart({values=MARKET_SERIES.map(x=>x.value),height=100}){
 const max=Math.max(...values);const min=Math.min(...values);const spread=max-min||1;
 return <View style={[s.chart,{height}]}>{values.map((v,i)=>{const left=i/(values.length-1)*100;const top=(1-(v-min)/spread)*72+4;return <View key={i} style={[s.chartDot,{left:`${left}%`,top:`${top}%`}]} />})}<View style={[s.chartLine,{width:'92%',left:'4%'}]}/></View>;
}

export function SparkBars({values=[2,4,5,4,7,6,8,9,8,10,11,10]}){
 const max=Math.max(...values);
 return <View style={s.sparkBars}>{values.map((v,i)=><View key={i} style={[s.sparkBar,{height:Math.max(10,v/max*64)}]}/>)}</View>;
}

export function AIReasoningCard({finding=AI_FINDINGS[0],onPress}){
 return <Pressable onPress={onPress} style={({pressed})=>[s.aiCard,pressed&&s.pressed]}><View style={s.aiHeader}><View style={s.aiGlow}><Ionicons name="sparkles" color={C.cyan} size={16}/></View><Text style={s.aiLabel}>AI-ASSISTED FINDING</Text><Text style={s.aiConf}>{Math.round(finding.confidence*100)}%</Text></View><Text style={s.aiTitle}>{finding.title}</Text><Text style={s.aiBody}>{finding.action}</Text><View style={s.aiEvidenceRow}>{finding.why.map(x=><Pill key={x} label={x} tone="info"/> )}</View><View style={s.aiBottom}><Text style={s.cost}>{finding.cost}</Text><Text style={s.linkText}>View evidence <Ionicons name="arrow-forward" size={13} color={C.cyan}/></Text></View></Pressable>;
}

export function ConfidenceMeter({value,label='Confidence'}){
 return <View style={s.confidence}><View style={s.confHead}><Text style={s.small}>{label}</Text><Text style={s.small}>{Math.round(value*100)}%</Text></View><ProgressBar value={value} color={value>.85?C.mint:value>.7?C.amber:C.coral} height={6}/></View>;
}

export function FindingList({limit=6,onOpen}){
 return <View>{AI_FINDINGS.slice(0,limit).map((f,i)=><AnimatedReveal key={f.id} delay={i*55}><AIReasoningCard finding={f} onPress={()=>onOpen?.(f)}/></AnimatedReveal>)}</View>;
}

export function Timeline({items=REPORT_ACTIVITY}){
 return <View>{items.map((x,i)=><View key={`${x.time}-${x.title}`} style={s.timelineRow}><View style={[s.timelineDot,{backgroundColor:x.status==='done'?C.mint:x.status==='current'?C.cyan:C.line}]} />{i<items.length-1?<View style={s.timelineLine}/>:null}<View style={s.timelineContent}><Text style={s.timelineTime}>{x.time}</Text><Text style={s.timelineTitle}>{x.title}</Text><Pill label={x.status==='done'?'COMPLETE':x.status==='current'?'CURRENT':'NEXT'} tone={x.status==='done'?'success':x.status==='current'?'info':'neutral'}/></View></View>)}</View>;
}

export function VehicleZoneMap({onSelect}){
 return <View style={s.zoneMap}><View style={s.carOutline}><View style={s.windshield}/><View style={s.hood}/><View style={s.cabin}/><View style={s.frontBumper}/><View style={[s.wheel,{left:36}]}/><View style={[s.wheel,{right:36}]}/>{VEHICLE_ZONES.map((z,i)=>{const pos=[['front',42,8],['rear',42,78],['driver',8,43],['passenger',77,43],['roof',43,31],['interior',50,47],['engine',43,16],['wheels',19,43]][i];return <Pressable key={z.id} onPress={()=>onSelect?.(z)} style={[s.zonePin,{left:`${pos[1]}%`,top:`${pos[2]}%`,borderColor:scoreColor(z.score)}]}><Text style={[s.zonePinText,{color:scoreColor(z.score)}]}>{z.findings}</Text></Pressable>})}</View><View style={s.zoneLegend}><Pill label="Healthy" tone="success"/><Pill label="Watch" tone="warning"/><Pill label="Issue" tone="danger"/></View></View>;
}

export function ChipRow({items,selected,onChange}){
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{items.map(x=><Pressable key={x} onPress={()=>onChange?.(x)} style={[s.chip,selected===x&&s.chipActive]}><Text style={[s.chipText,selected===x&&s.chipTextActive]}>{x}</Text></Pressable>)}</ScrollView>;
}

export function CaptureTaskRow({task,done,onPress}){
 return <Pressable onPress={onPress} style={({pressed})=>[s.taskRow,pressed&&s.pressed]}><View style={[s.taskIcon,{backgroundColor:done?C.mint+'20':C.surface3}]}><Ionicons name={task.media==='photo'?'camera-outline':task.media==='video'?'videocam-outline':task.media==='voice'?'mic-outline':'document-outline'} color={done?C.mint:C.muted} size={18}/></View><View style={{flex:1}}><Text style={s.taskTitle}>{task.area}</Text><Text style={s.taskTip}>{task.tip}</Text></View>{done?<Ionicons name="checkmark-circle" color={C.mint} size={24}/>:<Ionicons name="add-circle-outline" color={C.cyan} size={24}/>}</Pressable>;
}

export function FloatingCaptureButton({label='Capture',icon='camera',onPress}){
 const scale=useRef(new Animated.Value(1)).current;
 useEffect(()=>{Animated.loop(Animated.sequence([Animated.timing(scale,{toValue:1.03,duration:900,useNativeDriver:true}),Animated.timing(scale,{toValue:1,duration:900,useNativeDriver:true})])).start()},[scale]);
 return <Animated.View style={{transform:[{scale}]}}><Pressable onPress={onPress} style={s.captureFab}><Ionicons name={icon} color={C.bg} size={24}/><Text style={s.captureFabText}>{label}</Text></Pressable></Animated.View>;
}

export function CaptureOverlay({mode='photo',status='Align bumper inside frame'}){
 return <View style={s.captureFrame}><View style={s.captureCornerTL}/><View style={s.captureCornerTR}/><View style={s.captureCornerBL}/><View style={s.captureCornerBR}/><Animated.View style={s.scanLine}/><View style={s.captureCenter}><Ionicons name={mode==='video'?'videocam-outline':'scan-outline'} color={C.cyan} size={34}/></View><View style={s.captureStatus}><Pill label={mode.toUpperCase()} tone={mode==='video'?'danger':'info'} icon={mode==='video'?'radio-button-on':'camera-outline'}/><Text style={s.captureStatusText}>{status}</Text></View></View>;
}

export function Waveform({bars=28,color=C.cyan}){
 const vals=useMemo(()=>Array.from({length:bars},(_,i)=>18+(i*17)%42),[bars]);
 return <View style={s.wave}>{vals.map((v,i)=><Animated.View key={i} style={[s.waveBar,{height:v,backgroundColor:color,opacity:.45+(i%5)*.1}]}/>)}</View>;
}

export function VoiceNoteCard({transcript='Clicking noise when steering left at low speed.',duration=17}){
 return <View style={s.voiceCard}><View style={s.voiceTop}><IconBox icon="mic" color={C.cyan} size={40}/><View style={{flex:1}}><Text style={s.voiceTitle}>Buyer voice note</Text><Text style={s.voiceMeta}>{duration}s · Test Drive</Text></View><View style={s.play}><Ionicons name="play" color={C.bg} size={15}/></View></View><Waveform/><Text style={s.voiceTranscript}>“{transcript}”</Text><Pill label="Linked to steering" tone="info" icon="link-outline"/></View>;
}

export function VideoEvidenceCard({title='Cold start',duration=12,uri}){
 return <Pressable style={s.videoCard}><Image source={{uri:VEHICLES[0].image}} style={s.videoImage}/><View style={s.videoOverlay}><View style={s.playCircle}><Ionicons name="play" color={C.white} size={18}/></View></View><View style={s.videoMeta}><Text style={s.videoTitle}>{title}</Text><Text style={s.videoDuration}>{duration}s</Text></View>{uri?<Text style={s.videoHint}>Tap to review frames + AI observations</Text>:null}</Pressable>;
}

export function DocumentCard({doc}){
 const tone=doc.status==='verified'||doc.status==='ready'?'success':doc.status==='review'?'warning':'neutral';
 return <Pressable style={s.docCard}><View style={s.docPreview}><Ionicons name="document-text-outline" color={C.cyan} size={28}/><Text style={s.docPages}>{doc.pages}p</Text></View><View style={{flex:1}}><Text style={s.docTitle}>{doc.name}</Text><Text style={s.docMeta}>{doc.type} · {doc.size} · {doc.date}</Text><Pill label={doc.status.toUpperCase()} tone={tone}/></View><Ionicons name="chevron-forward" color={C.muted} size={18}/></Pressable>;
}

export function DocumentField({field}){
 return <View style={s.docField}><View style={{flex:1}}><Text style={s.docFieldLabel}>{field.label}</Text><Text style={s.docFieldValue}>{field.value}</Text></View><View style={{width:100}}><ConfidenceMeter value={field.confidence||0}/></View></View>;
}

export function PriceWaterfall({market=21100,repairs=1700,asking=21900}){
 const target=Math.max(0,market-repairs);
 return <View style={s.waterfall}><View style={s.waterHeader}><Text style={s.waterTitle}>Price impact</Text><Pill label="DEMO ESTIMATE" tone="warning"/></View>{[['Market',market,C.cyan],['Repairs',-repairs,C.coral],['Target',target,C.mint],['Asking',asking,C.amber]].map(([label,val,color])=><View key={label} style={s.waterRow}><Text style={s.waterLabel}>{label}</Text><View style={s.waterTrack}><View style={[s.waterBar,{backgroundColor:color,width:`${Math.min(100,Math.abs(val)/250)}%`}]} /></View><Text style={[s.waterValue,{color}]}>{val<0?'−':''}{money(Math.abs(val))}</Text></View>)}<Text style={s.waterNote}>Use this as negotiation context, then confirm the underlying condition and market assumptions.</Text></View>;
}

export function NegotiationCard({scenario=NEGOTIATION_SCENARIOS[1],onSelect}){
 return <Pressable onPress={()=>onSelect?.(scenario)} style={({pressed})=>[s.negCard,pressed&&s.pressed]}><View style={s.negTop}><Text style={s.negTitle}>{scenario.label}</Text><Pill label="OFFER SCENARIO" tone="info"/></View><View style={s.negNumbers}><View><Text style={s.small}>OPEN</Text><Text style={s.negNumber}>{money(scenario.offer)}</Text></View><View><Text style={s.small}>TARGET</Text><Text style={s.negNumber}>{money(scenario.target)}</Text></View><View><Text style={s.small}>MAX</Text><Text style={s.negNumber}>{money(scenario.max)}</Text></View></View><Text style={s.negReason}>{scenario.reason}</Text></Pressable>;
}

export function SellerQuestionCard({text,index}){
 return <View style={s.questionCard}><View style={s.qNum}><Text style={s.qNumText}>{index+1}</Text></View><Text style={s.qText}>{text}</Text><Pressable style={s.copyBtn}><Ionicons name="copy-outline" color={C.cyan} size={16}/></Pressable></View>;
}

export function CopilotBubble({role='assistant',text,evidence=[]}){
 const user=role==='user';
 return <View style={[s.bubble,{alignSelf:user?'flex-end':'flex-start',backgroundColor:user?C.blue:C.surface2}]}><View style={s.bubbleHead}><Text style={s.bubbleRole}>{user?'YOU':'CARWISE AI'}</Text>{!user?<Ionicons name="sparkles" color={C.cyan} size={13}/>:null}</View><Text style={s.bubbleText}>{text}</Text>{evidence.length?<View style={s.bubbleEvidence}>{evidence.map(x=><Pill key={x} label={x} tone="info" icon="link-outline"/>)}</View>:null}</View>;
}

export function CopilotComposer({onSend}){
 const [text,setText]=useState('');
 const submit=()=>{if(!text.trim())return;onSend?.(text.trim());setText('')};
 return <View style={s.composer}><Pressable style={s.attach}><Ionicons name="add" color={C.cyan} size={20}/></Pressable><TextInput value={text} onChangeText={setText} placeholder="Ask CarWise…" placeholderTextColor={C.muted} style={s.input}/><Pressable onPress={submit} style={s.send}><Ionicons name="arrow-up" color={C.bg} size={17}/></Pressable></View>;
}

export function CertificateVisual(){
 return <View style={s.certificate}><View style={s.certGlow}/><View style={s.certSeal}><Ionicons name="shield-checkmark" color={C.mint} size={58}/></View><Text style={s.certTitle}>INSPECTION VERIFIED</Text><Text style={s.certVehicle}>2020 Honda Accord Sport</Text><Text style={s.certId}>CERT-A8C1-90BF</Text><View style={s.certDivider}/><View style={s.certFacts}>{[['Evidence','14 items'],['AI findings','6'],['Human review','Required'],['Issued','Sep 22, 2026']].map(([a,b])=><View key={a} style={s.certFact}><Text style={s.certFactLabel}>{a}</Text><Text style={s.certFactValue}>{b}</Text></View>)}</View></View>;
}

export function ContractPreview(){
 return <View style={s.contract}><View style={s.contractTop}><Text style={s.contractWord}>PURCHASE AGREEMENT</Text><Pill label="DRAFT" tone="warning"/></View><View style={s.contractLine}/>{['Buyer and seller information','Vehicle description and VIN','Purchase price and deposit','Known condition findings','Disclosures and conditions','Human authorization and signature'].map((x,i)=><View key={x} style={s.contractClause}><Text style={s.contractNum}>{String(i+1).padStart(2,'0')}</Text><Text style={s.contractClauseText}>{x}</Text><Ionicons name="chevron-forward" color={C.muted} size={15}/></View>)}<View style={s.contractNotice}><Ionicons name="person-circle-outline" color={C.cyan} size={18}/><Text style={s.contractNoticeText}>CarWise prepares this document; only the human user can authorize and sign it.</Text></View></View>;
}

export function PaywallCard({plan=PLANS[1]}){
 return <View style={s.paywall}><View style={s.paywallOrb}/><View style={s.payTop}><Pill label="CARWISE PRO" tone="info" icon="sparkles"/><Text style={s.close}>×</Text></View><Text style={s.payTitle}>{PAYWALL_MESSAGING.headline}</Text><Text style={s.paySub}>{PAYWALL_MESSAGING.subhead}</Text>{PAYWALL_MESSAGING.proof.map(x=><View key={x} style={s.payFeature}><Ionicons name="checkmark-circle" color={C.mint} size={19}/><Text style={s.payFeatureText}>{x}</Text></View>)}<View style={s.priceToggle}><Text style={s.priceText}>Monthly {money(plan.monthly)}</Text><Text style={s.priceTextStrong}>Yearly {money(plan.annual)}</Text></View><Pressable style={s.payCta}><Text style={s.payCtaText}>{PAYWALL_MESSAGING.cta}</Text></Pressable><Text style={s.restore}>{PAYWALL_MESSAGING.restore}</Text><Text style={s.legal}>{PAYWALL_MESSAGING.legal}</Text></View>;
}

export function NotificationRow({item}){
 return <Pressable style={[s.notification,!item.read&&{backgroundColor:C.surface2}]}><IconBox icon={item.icon} color={item.kind==='inspection'?C.cyan:item.kind==='market'?C.mint:item.kind==='signature'?C.amber:C.cyan} size={38}/><View style={{flex:1}}><View style={s.notifyTop}><Text style={s.notifyTitle}>{item.title}</Text>{!item.read?<View style={s.unreadDot}/>:null}</View><Text style={s.notifyBody}>{item.body}</Text><Text style={s.notifyTime}>{item.time}</Text></View><Ionicons name="chevron-forward" color={C.muted} size={17}/></Pressable>;
}

export function AppStoreFeatureStrip(){
 const cards=[['Instant price intelligence','stats-chart-outline',C.cyan],['AI condition scan','sparkles-outline',C.blue],['Visual evidence report','images-outline',C.mint],['Negotiation coach','chatbubbles-outline',C.amber]];
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.featureStrip}>{cards.map(([t,ic,col])=><View key={t} style={s.featureCard}><IconBox icon={ic} color={col}/><Text style={s.featureTitle}>{t}</Text><Text style={s.featureCaption}>Built for one-handed mobile review.</Text></View>)}</ScrollView>;
}

export function LoadingState({kind='ai'}){
 const [step,setStep]=useState(0);const labels=AI_PIPELINE.map(x=>x.label);
 useEffect(()=>{const id=setInterval(()=>setStep(x=>(x+1)%labels.length),1100);return()=>clearInterval(id)},[labels.length]);
 return <View style={s.loadingCard}><View style={s.loadingIcon}><Ionicons name="sparkles" color={C.cyan} size={26}/></View><Text style={s.loadingTitle}>CarWise is working…</Text><Text style={s.loadingSub}>{kind==='market'?'Preparing market context':labels[step]}</Text><ProgressBar value={(step+1)/labels.length}/><View style={s.loadingSteps}>{labels.slice(0,4).map((x,i)=><View key={x} style={s.loadStep}><View style={[s.loadCheck,{backgroundColor:i<=step?C.cyan:C.line}]}>{i<step?<Ionicons name="checkmark" color={C.bg} size={10}/>:null}</View><Text style={s.loadText}>{x}</Text></View>)}</View></View>;
}

export function ErrorState({title='Something went wrong',body='Your inspection data is saved. Try again when ready.'}){
 return <View style={s.stateCard}><IconBox icon="cloud-offline-outline" color={C.coral} size={56}/><Text style={s.stateTitle}>{title}</Text><Text style={s.stateBody}>{body}</Text><View style={s.stateActions}><Pressable style={s.primaryButton}><Text style={s.primaryText}>Retry</Text></Pressable><Pressable style={s.secondaryButton}><Text style={s.secondaryText}>Review saved data</Text></Pressable></View></View>;
}

export function EmptyGarage(){
 return <View style={s.empty}><View style={s.emptyCircle}><Ionicons name="car-outline" color={C.cyan} size={44}/></View><Text style={s.emptyTitle}>Your garage is empty</Text><Text style={s.emptyBody}>Start an inspection and CarWise will keep the evidence, price context and report together.</Text><Pressable style={s.primaryButton}><Ionicons name="add" color={C.bg} size={17}/><Text style={s.primaryText}>Start inspection</Text></Pressable></View>;
}

export function DashboardShowcase(){
 return <DemoPage title="Dashboard" subtitle="Visual-first home for the active buying journey"><VehicleHero/><Section title="Continue"><View style={s.continueCard}><View style={{flex:1}}><Text style={s.continueTitle}>Complete your inspection</Text><Text style={s.continueSub}>18 of 27 evidence + checks complete</Text><ProgressBar value={.67}/></View><ScoreRing score={68} size={86}/></View></Section><Section title="Quick actions"><View style={s.metricGrid}>{[['Scan VIN','barcode-outline',C.cyan],['Capture photos','camera-outline',C.blue],['Market check','stats-chart-outline',C.mint],['My reports','document-text-outline',C.amber]].map(([a,ic,col])=><MetricCard key={a} label={a} value="" helper="Open" icon={ic} color={col}/>)}</View></Section><Section title="Recent inspections"><ScrollView horizontal showsHorizontalScrollIndicator={false}>{VEHICLES.slice(0,4).map(v=><View key={v.id} style={s.recentCard}><Image source={{uri:v.image}} style={s.recentImage}/><Text style={s.recentTitle}>{v.year} {v.make} {v.model}</Text><Text style={s.recentMeta}>{money(v.asking)} · {v.risk} risk</Text></View>)}</ScrollView></Section><Section title="App Store feature set"><AppStoreFeatureStrip/></Section></DemoPage>;
}

export function VINShowcase(){
 const [mode,setMode]=useState('scan');
 return <DemoPage title="VIN scanner" subtitle="Camera-first identification with graceful fallback"><ChipRow items={['scan','manual','document']} selected={mode} onChange={setMode}/>{mode==='scan'?<View style={s.captureShell}><CaptureOverlay status="Align the VIN inside the frame"/><View style={s.captureFooter}><Pill label="17 characters" tone="info"/><Text style={s.captureHelp}>Avoid glare and keep the entire VIN visible.</Text><FloatingCaptureButton label="Scan VIN" icon="scan-outline"/></View></View>:mode==='manual'?<View style={s.formCard}><Text style={s.formLabel}>VIN</Text><TextInput style={s.formInput} placeholder="17-digit VIN" placeholderTextColor={C.muted} value="1HGCV2F34LA000000"/><Pill label="17/17 characters" tone="success"/></View>:<View style={s.formCard}><IconBox icon="document-text-outline" color={C.cyan} size={54}/><Text style={s.formTitle}>Upload registration</Text><Text style={s.formBody}>CarWise can extract VIN and key vehicle fields from a document.</Text><Pressable style={s.primaryButton}><Text style={s.primaryText}>Choose document</Text></Pressable></View>}<Section title="Verified vehicle"><VehicleHero compact/><View style={s.specGrid}>{VEHICLE_SPEC_ROWS.flatMap((r,i)=>r.map((x,j)=><View key={`${i}-${j}`} style={s.specItem}><Text style={s.specLabel}>{['Category','Value','Category','Value'][j]}</Text><Text style={s.specValue}>{x}</Text></View>))}</View></Section></DemoPage>;
}

export function MarketShowcase(){
 const [tab,setTab]=useState('Price');
 return <DemoPage title="Market intelligence" subtitle="Turn listings into a clear price story"><VehicleHero compact/><Section title="Position"><View style={s.priceHero}><View><Text style={s.bigLabel}>ASKING PRICE</Text><Text style={s.bigPrice}>$21,900</Text><Text style={s.priceDelta}>+$800 above observed center</Text></View><Pill label="92% data confidence" tone="success"/></View><MarketGauge/></Section><Section title="30-day trend"><View style={s.chartCard}><View style={s.chartHead}><Text style={s.chartTitle}>{tab}</Text><ChipRow items={['Price','Mileage','Listings']} selected={tab} onChange={setTab}/></View><MiniLineChart/><SparkBars/><Text style={s.chartFoot}>Observed price center moved gradually downward over the demo period.</Text></View></Section><Section title="Comparable listings"><ScrollView horizontal showsHorizontalScrollIndicator={false}>{COMPARABLE_LISTINGS.map(x=><View key={x.id} style={s.compCard}><View style={s.compPhoto}><Image source={{uri:VEHICLES[0].image}} style={StyleSheet.absoluteFillObject}/><Pill label={`${x.delta<0?'below':'above'} center`} tone={x.delta<0?'success':'warning'}/></View><Text style={s.compTitle}>{x.title}</Text><Text style={s.compMeta}>{money(x.price)} · {x.mileage.toLocaleString()} mi</Text><Text style={s.compMeta}>{x.city} · {x.distance}</Text></View>)}</ScrollView></Section><Section title="Price bands"><View style={s.bandList}>{MARKET_BANDS.map(b=><View key={b.id} style={s.bandRow}><View style={[s.bandDot,{backgroundColor:b.id==='fair'?C.mint:b.id==='low'?C.cyan:C.amber}]}/><View style={{flex:1}}><Text style={s.bandTitle}>{b.label}</Text><Text style={s.bandDesc}>{b.description}</Text></View><Text style={s.bandPrice}>{money(b.min)}–{money(b.max)}</Text></View>)}</View></Section></DemoPage>;
}

export function CaptureShowcase(){
 const [done,setDone]=useState(['ct1','ct2']);
 const toggle=(id)=>setDone(x=>x.includes(id)?x.filter(y=>y!==id):[...x,id]);
 return <DemoPage title="Multimodal capture" subtitle="Photo + video + voice + documents in one flow"><View style={s.captureHero}><Text style={s.captureHeroTitle}>18 / 27 evidence checks complete</Text><ProgressBar value={.66}/><View style={s.captureStatRow}><Pill label={`${done.length} visual tasks`} tone="success"/><Pill label="1 video" tone="info"/><Pill label="1 voice note" tone="info"/></View></View><Section title="Capture checklist">{CAPTURE_TASKS.map((t)=><CaptureTaskRow key={t.id} task={t} done={done.includes(t.id)} onPress={()=>toggle(t.id)}/>)}</Section><Section title="Live camera preview"><CaptureOverlay status="Good framing — tap to capture"/></Section><Section title="Evidence already attached"><EvidenceMosaic onOpen={()=>{}}/></Section><Section title="Video evidence"><VideoEvidenceCard title="Cold start" duration={12} uri="mock://video/cold-start-01"/><VideoEvidenceCard title="Walkaround" duration={28} uri="mock://video/walkaround-01"/></Section><Section title="Voice evidence"><VoiceNoteCard/></Section><Section title="Review states"><View style={s.reviewGrid}>{MEDIA_REVIEW_STATES.map(x=><View key={x.id} style={s.reviewCard}><Pill label={x.label} tone={x.tone}/><Text style={s.reviewDesc}>{x.description}</Text></View>)}</View></Section></DemoPage>;
}

export function AIShowcase(){
 const [selected,setSelected]=useState(AI_FINDINGS[0]);
 return <DemoPage title="AI analysis" subtitle="Show what the model saw, why it matters, and what to verify"><View style={s.aiHero}><View><Text style={s.aiHeroEyebrow}>OVERALL RISK</Text><CountUp value={68}/><Text style={s.aiHeroStatus}>Moderate risk</Text></View><ScoreRing score={68} size={118}/></View><Section title="Analysis pipeline"><View style={s.pipeline}>{AI_PIPELINE.map((p,i)=><View key={p.id} style={s.pipeRow}><View style={[s.pipeIcon,{backgroundColor:i<4?C.cyan+'18':C.surface3}]}><Ionicons name={p.icon} color={i<4?C.cyan:C.muted} size={17}/></View><Text style={s.pipeText}>{p.label}</Text><Text style={s.pipeState}>{i<4?'DONE':'NEXT'}</Text></View>)}</View></Section><Section title="Findings"><FindingList onOpen={setSelected}/></Section><Section title="Explainability"><View style={s.explainCard}><Text style={s.explainTitle}>{AI_EXPLANATIONS.risk.title}</Text><Text style={s.explainBody}>{AI_EXPLANATIONS.risk.body}</Text>{AI_EXPLANATIONS.risk.evidence.map(x=><Pill key={x} label={x} tone="info" icon="link-outline"/> )}<ConfidenceMeter value={.88} label="Aggregate evidence confidence"/></View></Section><Section title="Selected finding"><AIReasoningCard finding={selected}/></Section></DemoPage>;
}

export function VehicleHealthShowcase(){
 const [zone,setZone]=useState(VEHICLE_ZONES[0]);
 return <DemoPage title="Vehicle health map" subtitle="Turn inspection status into a visual vehicle model"><VehicleZoneMap onSelect={setZone}/><View style={s.zoneDetail}><View style={s.zoneHead}><View><Text style={s.zoneEyebrow}>SELECTED AREA</Text><Text style={s.zoneTitle}>{zone.label}</Text></View><ScoreRing score={zone.score} size={74}/></View><Text style={s.zoneBody}>{zone.findings?`${zone.findings} finding${zone.findings>1?'s':''} linked to this area.`:'No active findings linked to this area.'}</Text><View style={s.zoneStats}><MetricCard label="Score" value={zone.score} helper="condition" icon="speedometer-outline" color={scoreColor(zone.score)}/><MetricCard label="Evidence" value={zone.media} helper="items" icon="images-outline" color={C.cyan}/></View></View></DemoPage>;
}

export function ReportShowcase(){
 return <DemoPage title="Interactive report" subtitle="Evidence-rich report designed for mobile review"><VehicleHero compact/><View style={s.reportKpis}>{REPORT_STATS.map(x=><MetricCard key={x.id} label={x.label} value={x.value} helper={x.helper} icon={x.id==='risk'?'pulse-outline':x.id==='market'?'stats-chart-outline':x.id==='asking'?'pricetag-outline':x.id==='repairs'?'construct-outline':'images-outline'} color={x.trend==='good'?C.mint:x.trend==='watch'?C.amber:C.cyan}/>)}</View><Section title="Highlights"><View>{REPORT_HIGHLIGHTS.map(x=><View key={x.id} style={s.highlightRow}><View style={[s.highlightBar,{backgroundColor:severityColor(x.severity)}]}/><View style={{flex:1}}><Text style={s.highlightTitle}>{x.title}</Text><Text style={s.highlightEvidence}>{x.evidence} evidence item{x.evidence>1?'s':''}</Text></View><Pill label={x.severity.toUpperCase()} tone={x.severity==='critical'?'danger':x.severity==='major'?'warning':'warning'}/></View>)}</View></Section><Section title="Evidence"><EvidenceCounter/><EvidenceMosaic onOpen={()=>{}}/></Section><Section title="Activity timeline"><Timeline/></Section><Section title="Report sections"><View style={s.reportSections}>{REPORT_SECTIONS.map(x=><View key={x.id} style={s.reportSectionRow}><View style={[s.sectionAccent,{backgroundColor:x.accent==='coral'?C.coral:x.accent==='amber'?C.amber:x.accent==='orange'?C.amber:C.cyan}]}/><View style={{flex:1}}><Text style={s.reportSectionTitle}>{x.title}</Text><Text style={s.reportSectionSummary}>{x.summary}</Text></View><Ionicons name="chevron-forward" color={C.muted} size={17}/></View>)}</View></Section></DemoPage>;
}

export function EvidenceViewerShowcase(){
 const [selected,setSelected]=useState(VEHICLE_MEDIA[0]);
 return <DemoPage title="Evidence viewer" subtitle="Zoom, annotate, compare, confirm"><View style={s.viewer}><Image source={{uri:selected.uri.startsWith('http')?selected.uri:VEHICLES[0].image}} style={s.viewerImage}/><View style={s.viewerOverlay}><View style={s.annotation}><Text style={s.annotationLabel}>{selected.area}</Text><Text style={s.annotationTitle}>AI observation</Text><ConfidenceMeter value={.92}/></View></View></View><Section title="Evidence strip"><ScrollView horizontal showsHorizontalScrollIndicator={false}>{VEHICLE_MEDIA.slice(0,10).map(x=><EvidenceThumb key={x.id} item={x} onPress={setSelected} selected={x.id===selected.id}/>)}</ScrollView></Section><Section title="Evidence actions"><View style={s.actionRow}>{['Confirm','Edit label','Add note','Share'].map((x,i)=><Pressable key={x} style={i===0?s.primaryButton:s.secondaryButton}><Ionicons name={['checkmark','create-outline','add-circle-outline','share-outline'][i]} color={i===0?C.bg:C.cyan} size={16}/><Text style={i===0?s.primaryText:s.secondaryText}>{x}</Text></Pressable>)}</View></Section></DemoPage>;
}

export function DocumentsShowcase(){
 return <DemoPage title="Document center" subtitle="Keep paperwork, extracted fields and confidence together"><Section title="Documents"><View>{DOCUMENTS.map(d=><DocumentCard key={d.id} doc={d}/>)}</View></Section><Section title="Extracted fields"><View>{DOCUMENT_FIELDS.map(f=><DocumentField key={f.id} field={f}/>)}</View></Section><Section title="Verification notice"><View style={s.notice}><Ionicons name="shield-checkmark-outline" color={C.mint} size={22}/><Text style={s.noticeText}>Low-confidence fields remain visibly flagged for human review.</Text></View></Section></DemoPage>;
}

export function NegotiationShowcase(){
 const [active,setActive]=useState(NEGOTIATION_SCENARIOS[1]);
 return <DemoPage title="Negotiation coach" subtitle="Convert findings into calm, evidence-backed talking points"><PriceWaterfall/><Section title="Offer scenarios">{NEGOTIATION_SCENARIOS.map(x=><NegotiationCard key={x.id} scenario={x} onSelect={setActive}/>)}</Section><Section title="Selected strategy"><NegotiationCard scenario={active}/></Section><Section title="Talking points">{NEGOTIATION_TALKING_POINTS.map((x,i)=><View key={x.id} style={s.talkingPoint}><View style={s.talkingIcon}><Text style={s.talkingNum}>{i+1}</Text></View><View style={{flex:1}}><Text style={s.talkingTitle}>{x.title}</Text><Text style={s.talkingDetail}>{x.detail}</Text><View style={s.talkingEvidence}>{x.evidence.map(e=><Pill key={e} label={e} tone="info" icon="link-outline"/>)}</View></View></View>)}</Section><Section title="Questions for seller">{SELLER_QUESTIONS.map((x,i)=><SellerQuestionCard key={x} text={x} index={i}/>)}</Section></DemoPage>;
}

export function CopilotShowcase(){
 const [thread,setThread]=useState(COPILOT_THREAD);
 const send=(text)=>setThread(x=>[...x,{id:`u-${Date.now()}`,role:'user',text},{id:`a-${Date.now()}`,role:'assistant',text:'I would verify the highest-impact finding first, then use the market context to shape the offer. I can open the evidence used for each recommendation.',evidence:['af4','af1','c1']}]);
 return <DemoPage title="CarWise Copilot" subtitle="Multimodal assistant grounded in the current inspection"><View style={s.suggestRow}>{COPILOT_SUGGESTIONS.slice(0,4).map(x=><Pressable key={x} style={s.suggest} onPress={()=>send(x)}><Text style={s.suggestText}>{x}</Text></Pressable>)}</View><View style={s.thread}>{thread.map(m=><CopilotBubble key={m.id} role={m.role} text={m.text} evidence={m.evidence}/>)}</View><Section title="Context actions"><View style={s.actionTiles}>{COPILOT_ACTIONS.map(x=><View key={x.id} style={s.actionTile}><IconBox icon={x.icon} color={C.cyan}/><Text style={s.actionTileText}>{x.label}</Text></View>)}</View></Section><CopilotComposer onSend={send}/></DemoPage>;
}

export function CertificateShowcase(){return <DemoPage title="Verified certificate" subtitle="A shareable end-state for the inspection journey"><CertificateVisual/><Section title="What is verified"><View style={s.verifyList}>{['Inspection record exists','Evidence is linked to findings','Human review state is recorded','Certificate hash is generated'].map(x=><View key={x} style={s.verifyRow}><Ionicons name="checkmark-circle" color={C.mint} size={19}/><Text style={s.verifyText}>{x}</Text></View>)}</View></Section><View style={s.actionRow}><Pressable style={s.primaryButton}><Ionicons name="share-outline" color={C.bg} size={16}/><Text style={s.primaryText}>Share certificate</Text></Pressable><Pressable style={s.secondaryButton}><Ionicons name="link-outline" color={C.cyan} size={16}/><Text style={s.secondaryText}>Copy link</Text></Pressable></View></DemoPage>}

export function ContractShowcase(){return <DemoPage title="Contract & signature" subtitle="Beautiful document preview with explicit human authorization"><ContractPreview/><Section title="Human approval"><View style={s.approval}><IconBox icon="person-circle-outline" color={C.cyan} size={48}/><View style={{flex:1}}><Text style={s.approvalTitle}>Only you can sign</Text><Text style={s.approvalBody}>Review the generated agreement, confirm the key terms, then authorize the signature yourself.</Text></View></View></Section><View style={s.actionRow}><Pressable style={s.secondaryButton}><Text style={s.secondaryText}>Edit terms</Text></Pressable><Pressable style={s.primaryButton}><Text style={s.primaryText}>Review & sign</Text></Pressable></View></DemoPage>}

export function PaywallShowcase(){return <DemoPage title="Pro upgrade" subtitle="Subscription UI designed around the product value"><PaywallCard/><Section title="Plan comparison"><View>{PLANS.map(p=><View key={p.id} style={s.planRow}><View style={{flex:1}}><Text style={s.planName}>{p.name}</Text><Text style={s.planDesc}>{p.features.join(' · ')}</Text></View><Text style={s.planPrice}>{p.monthly?money(p.monthly)+'/mo':'Free'}</Text></View>)}</View></Section></DemoPage>}

export function NotificationsShowcase(){return <DemoPage title="Notification center" subtitle="Contextual updates that move the inspection forward"><View style={s.unreadSummary}><Text style={s.unreadCount}>{NOTIFICATIONS.filter(x=>!x.read).length}</Text><View><Text style={s.unreadTitle}>unread updates</Text><Text style={s.unreadBody}>Mostly inspection and market activity.</Text></View></View>{NOTIFICATIONS.map(x=><NotificationRow key={x.id} item={x}/>)}</DemoPage>}

export function StatesShowcase(){return <DemoPage title="Visual states QA" subtitle="Every important flow should have a designed state"><Section title="Loading"><LoadingState/></Section><Section title="Error"><ErrorState/></Section><Section title="Empty"><EmptyGarage/></Section><Section title="Offline"><View style={s.notice}><Ionicons name="cloud-offline-outline" color={C.amber} size={22}/><Text style={s.noticeText}>Offline mode keeps the current inspection readable and stores pending changes for later.</Text></View></Section></DemoPage>}

export function ShowcaseIndex({onExit}){
 const screens=[['Dashboard','DashboardShowcase'],['VIN scanner','VINShowcase'],['Market intelligence','MarketShowcase'],['Multimodal capture','CaptureShowcase'],['AI analysis','AIShowcase'],['Vehicle health map','VehicleHealthShowcase'],['Interactive report','ReportShowcase'],['Evidence viewer','EvidenceViewerShowcase'],['Documents','DocumentsShowcase'],['Negotiation','NegotiationShowcase'],['Copilot','CopilotShowcase'],['Certificate','CertificateShowcase'],['Contract','ContractShowcase'],['Pro upgrade','PaywallShowcase'],['Notifications','NotificationsShowcase'],['Visual states QA','StatesShowcase']];
 return <DemoPage title="V4 showcase" subtitle="A visual gallery for Cursor integration" onExit={onExit}><View style={s.indexHero}><Text style={s.indexHeroTitle}>Make the app feel alive.</Text><Text style={s.indexHeroBody}>Use this screen as the design-system playground while integrating the components into the production navigation and state flow.</Text></View>{screens.map(([name,key],i)=><AnimatedReveal key={key} delay={i*35}><View style={s.indexRow}><View style={s.indexNum}><Text style={s.indexNumText}>{String(i+1).padStart(2,'0')}</Text></View><View style={{flex:1}}><Text style={s.indexTitle}>{name}</Text><Text style={s.indexSub}>{key}</Text></View><Ionicons name="arrow-forward" color={C.cyan} size={18}/></View></AnimatedReveal>)}<View style={s.indexFooter}><Text style={s.indexFooterText}>Replace mock fixtures with live repository state progressively.</Text></View></DemoPage>;
}

export default ShowcaseIndex;

export const showcaseRegistry={
 DashboardShowcase,
 VINShowcase,
 MarketShowcase,
 CaptureShowcase,
 AIShowcase,
 VehicleHealthShowcase,
 ReportShowcase,
 EvidenceViewerShowcase,
 DocumentsShowcase,
 NegotiationShowcase,
 CopilotShowcase,
 CertificateShowcase,
 ContractShowcase,
 PaywallShowcase,
 NotificationsShowcase,
 StatesShowcase,
 ShowcaseIndex,
};

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.bg},
 page:{padding:16,paddingBottom:80,gap:14},
 header:{paddingTop:10,paddingBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},
 headerDot:{width:36,height:36,borderRadius:18,backgroundColor:C.surface,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},
 eyebrow:{fontSize:10,letterSpacing:1.8,color:C.muted,fontWeight:'800'},
 title:{fontSize:30,lineHeight:35,color:C.text,fontWeight:'800',marginTop:3},
 subtitle:{fontSize:14,lineHeight:20,color:C.muted,marginTop:4,maxWidth:320},
 section:{gap:10},
 sectionHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 sectionTitle:{fontSize:18,color:C.text,fontWeight:'800'},
 sectionAction:{fontSize:12,color:C.cyan,fontWeight:'700'},
 hero:{borderRadius:24,overflow:'hidden',backgroundColor:C.surface,...shadow},
 heroOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,8,15,.44)'},
 heroContent:{padding:18,flex:1,justifyContent:'space-between'},
 heroTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 heroLocation:{color:'#D6E5F0',fontSize:12},
 heroVehicle:{fontSize:25,color:C.white,fontWeight:'800',maxWidth:315},
 heroTrim:{color:'#D1DDE7',marginTop:3,fontSize:13},
 heroRow:{flexDirection:'row',alignItems:'center',gap:9,marginTop:9},
 heroPrice:{fontSize:22,color:C.white,fontWeight:'800'},
 pill:{paddingHorizontal:9,paddingVertical:5,borderRadius:999,borderWidth:1,flexDirection:'row',alignItems:'center',gap:4},
 pillText:{fontSize:10,fontWeight:'800',letterSpacing:.6},
 iconBox:{alignItems:'center',justifyContent:'center',borderWidth:1},
 continueCard:{backgroundColor:C.surface,borderRadius:18,padding:16,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:14,...shadow},
 continueTitle:{fontSize:16,color:C.text,fontWeight:'800'},
 continueSub:{fontSize:12,color:C.muted,marginVertical:8},
 ring:{borderWidth:7,alignItems:'center',justifyContent:'center',backgroundColor:C.surface2,shadowOpacity:.16,shadowRadius:18,shadowOffset:{width:0,height:0},elevation:4},
 ringScore:{color:C.text,fontWeight:'900'},
 ringLabel:{fontSize:8,letterSpacing:1.6,color:C.muted,fontWeight:'800',marginTop:1},
 track:{backgroundColor:C.surface3,borderRadius:999,overflow:'hidden',width:'100%'},
 fill:{borderRadius:999},
 metricGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
 metricCard:{backgroundColor:C.surface,padding:12,borderRadius:18,borderWidth:1,borderColor:C.line,width:(W-42)/2,minHeight:132,gap:5},
 metricLabel:{fontSize:11,color:C.muted,fontWeight:'700'},
 metricValue:{fontSize:22,color:C.text,fontWeight:'900',minHeight:26},
 metricHelper:{fontSize:11,color:C.muted},
 pressed:{transform:[{scale:.985}],opacity:.94},
 recentCard:{width:180,backgroundColor:C.surface,borderRadius:18,overflow:'hidden',borderWidth:1,borderColor:C.line,marginRight:10},
 recentImage:{width:'100%',height:105},
 recentTitle:{fontSize:14,color:C.text,fontWeight:'800',paddingHorizontal:12,paddingTop:10},
 recentMeta:{fontSize:11,color:C.muted,padding:12},
 featureStrip:{gap:10,paddingRight:10},
 featureCard:{width:164,backgroundColor:C.surface,padding:14,borderRadius:18,borderWidth:1,borderColor:C.line,gap:9},
 featureTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 featureCaption:{fontSize:11,color:C.muted,lineHeight:15},
 chips:{gap:8,paddingVertical:2,paddingRight:10},
 chip:{paddingHorizontal:14,paddingVertical:9,borderRadius:999,borderWidth:1,borderColor:C.line,backgroundColor:C.surface},
 chipActive:{borderColor:C.cyan,backgroundColor:C.cyan+'18'},
 chipText:{fontSize:12,color:C.muted,fontWeight:'700'},
 chipTextActive:{color:C.cyan},
 captureShell:{height:420,borderRadius:22,overflow:'hidden',backgroundColor:'#02070D',borderWidth:1,borderColor:C.line},
 captureFrame:{height:360,margin:12,borderRadius:20,borderWidth:1,borderColor:C.cyan+'38',overflow:'hidden',position:'relative',backgroundColor:'#050B13'},
 captureCornerTL:{position:'absolute',top:18,left:18,width:34,height:34,borderLeftWidth:3,borderTopWidth:3,borderColor:C.cyan,borderTopLeftRadius:8},
 captureCornerTR:{position:'absolute',top:18,right:18,width:34,height:34,borderRightWidth:3,borderTopWidth:3,borderColor:C.cyan,borderTopRightRadius:8},
 captureCornerBL:{position:'absolute',bottom:18,left:18,width:34,height:34,borderLeftWidth:3,borderBottomWidth:3,borderColor:C.cyan,borderBottomLeftRadius:8},
 captureCornerBR:{position:'absolute',bottom:18,right:18,width:34,height:34,borderRightWidth:3,borderBottomWidth:3,borderColor:C.cyan,borderBottomRightRadius:8},
 scanLine:{position:'absolute',left:0,right:0,height:2,backgroundColor:C.cyan,opacity:.7,top:'48%'},
 captureCenter:{position:'absolute',top:'42%',left:'42%',width:56,height:56,borderRadius:28,backgroundColor:C.cyan+'13',borderWidth:1,borderColor:C.cyan+'66',alignItems:'center',justifyContent:'center'},
 captureStatus:{position:'absolute',bottom:18,left:18,right:18,alignItems:'center',gap:9},
 captureStatusText:{color:C.white,fontWeight:'700',fontSize:13},
 captureFooter:{paddingHorizontal:16,gap:8},
 captureHelp:{fontSize:12,color:C.muted},
 captureFab:{height:52,borderRadius:26,backgroundColor:C.cyan,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingHorizontal:18,alignSelf:'center'},
 captureFabText:{fontWeight:'900',color:C.bg},
 specGrid:{flexDirection:'row',flexWrap:'wrap',backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.line,overflow:'hidden'},
 specItem:{width:'50%',padding:12,borderBottomWidth:1,borderRightWidth:1,borderColor:C.line},
 specLabel:{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:.7},
 specValue:{fontSize:13,color:C.text,fontWeight:'700',marginTop:3},
 formCard:{backgroundColor:C.surface,padding:18,borderRadius:20,borderWidth:1,borderColor:C.line,gap:10},
 formLabel:{fontSize:11,color:C.muted,fontWeight:'800',letterSpacing:1},
 formInput:{height:54,borderRadius:14,borderWidth:1,borderColor:C.cyan+'88',backgroundColor:C.surface2,color:C.text,paddingHorizontal:14,fontSize:15,fontWeight:'700'},
 formTitle:{fontSize:20,color:C.text,fontWeight:'800'},
 formBody:{fontSize:13,color:C.muted,lineHeight:19},
 primaryButton:{minHeight:48,borderRadius:16,backgroundColor:C.cyan,paddingHorizontal:16,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},
 primaryText:{color:C.bg,fontWeight:'900',fontSize:13},
 secondaryButton:{minHeight:48,borderRadius:16,borderWidth:1,borderColor:C.cyan+'66',paddingHorizontal:16,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},
 secondaryText:{color:C.cyan,fontWeight:'800',fontSize:13},
 priceHero:{backgroundColor:C.surface,padding:18,borderRadius:20,borderWidth:1,borderColor:C.line,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 bigLabel:{fontSize:10,color:C.muted,letterSpacing:1.2,fontWeight:'800'},
 bigPrice:{fontSize:38,color:C.text,fontWeight:'900',marginTop:2},
 priceDelta:{fontSize:12,color:C.amber,fontWeight:'700',marginTop:2},
 gaugeBox:{backgroundColor:C.surface,padding:16,borderRadius:18,borderWidth:1,borderColor:C.line,gap:10},
 gaugeLabels:{flexDirection:'row',justifyContent:'space-between'},
 gaugeLabel:{fontSize:9,color:C.muted,fontWeight:'800'},
 gaugeTrack:{height:16,borderRadius:999,backgroundColor:C.surface3,position:'relative',overflow:'hidden'},
 gaugeFair:{position:'absolute',left:'24%',right:'40%',top:0,bottom:0,backgroundColor:C.mint+'77'},
 gaugeMarker:{position:'absolute',top:-2,width:3,height:20,backgroundColor:C.white},
 gaugeBubble:{position:'absolute',top:-25,left:-14,backgroundColor:C.white,paddingHorizontal:6,paddingVertical:3,borderRadius:6},
 gaugeBubbleText:{fontSize:8,color:C.bg,fontWeight:'900'},
 gaugeFoot:{fontSize:11,color:C.muted},
 chartCard:{backgroundColor:C.surface,padding:14,borderRadius:20,borderWidth:1,borderColor:C.line},
 chartHead:{gap:6},
 chartTitle:{fontSize:16,color:C.text,fontWeight:'800'},
 chart:{position:'relative',marginTop:9,backgroundColor:C.surface2,borderRadius:14,overflow:'hidden'},
 chartDot:{position:'absolute',width:5,height:5,borderRadius:3,backgroundColor:C.cyan},
 chartLine:{position:'absolute',height:1,top:'48%',backgroundColor:C.cyan+'22'},
 chartFoot:{fontSize:11,color:C.muted,marginTop:8},
 sparkBars:{height:70,flexDirection:'row',alignItems:'flex-end',gap:5,marginTop:5},
 sparkBar:{flex:1,maxWidth:16,backgroundColor:C.cyan+'44',borderTopLeftRadius:4,borderTopRightRadius:4},
 compCard:{width:220,backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.line,overflow:'hidden',marginRight:10,paddingBottom:13},
 compPhoto:{height:120,position:'relative',padding:10},
 compTitle:{fontSize:13,color:C.text,fontWeight:'800',paddingHorizontal:12,paddingTop:10},
 compMeta:{fontSize:11,color:C.muted,paddingHorizontal:12,paddingTop:4},
 bandList:{backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.line,overflow:'hidden'},
 bandRow:{flexDirection:'row',alignItems:'center',padding:14,borderBottomWidth:1,borderColor:C.line,gap:10},
 bandDot:{width:8,height:8,borderRadius:4},
 bandTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 bandDesc:{fontSize:10,color:C.muted},
 bandPrice:{fontSize:12,color:C.text,fontWeight:'800'},
 captureHero:{backgroundColor:C.surface,padding:16,borderRadius:20,borderWidth:1,borderColor:C.line,gap:10},
 captureHeroTitle:{fontSize:17,color:C.text,fontWeight:'900'},
 captureStatRow:{flexDirection:'row',gap:7,flexWrap:'wrap'},
 taskRow:{flexDirection:'row',alignItems:'center',gap:12,padding:14,backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.line,marginBottom:8},
 taskIcon:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center'},
 taskTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 taskTip:{fontSize:10,color:C.muted,marginTop:3,lineHeight:14},
 mosaic:{flexDirection:'row',flexWrap:'wrap',gap:8},
 thumb:{width:(W-48)/3,height:(W-48)/4.3,borderRadius:14,overflow:'hidden',backgroundColor:C.surface2,borderWidth:1,borderColor:C.line,position:'relative'},
 thumbImage:{width:'100%',height:'100%'},
 thumbSkeleton:{...StyleSheet.absoluteFillObject,backgroundColor:C.surface3},
 thumbBadge:{position:'absolute',top:7,right:7,width:22,height:22,borderRadius:11,backgroundColor:'rgba(0,0,0,.55)',alignItems:'center',justifyContent:'center'},
 duration:{position:'absolute',bottom:7,right:7,color:C.white,fontSize:10,fontWeight:'800',backgroundColor:'rgba(0,0,0,.6)',paddingHorizontal:5,paddingVertical:3,borderRadius:5},
 voiceCard:{backgroundColor:C.surface,padding:15,borderRadius:20,borderWidth:1,borderColor:C.line,gap:11},
 voiceTop:{flexDirection:'row',alignItems:'center',gap:10},
 voiceTitle:{fontSize:14,color:C.text,fontWeight:'800'},
 voiceMeta:{fontSize:11,color:C.muted,marginTop:2},
 play:{width:36,height:36,borderRadius:18,backgroundColor:C.cyan,alignItems:'center',justifyContent:'center'},
 wave:{height:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:3},
 waveBar:{width:3,borderRadius:2},
 voiceTranscript:{fontSize:13,color:'#D7E5EE',lineHeight:19,fontStyle:'italic'},
 videoCard:{backgroundColor:C.surface,borderRadius:20,borderWidth:1,borderColor:C.line,overflow:'hidden',marginBottom:10},
 videoImage:{height:180,width:'100%'},
 videoOverlay:{...StyleSheet.absoluteFillObject,alignItems:'center',justifyContent:'center'},
 playCircle:{width:54,height:54,borderRadius:27,backgroundColor:'rgba(0,0,0,.52)',borderWidth:1,borderColor:'rgba(255,255,255,.45)',alignItems:'center',justifyContent:'center'},
 videoMeta:{padding:12,flexDirection:'row',justifyContent:'space-between'},
 videoTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 videoDuration:{fontSize:11,color:C.muted},
 videoHint:{fontSize:11,color:C.muted,paddingHorizontal:12,paddingBottom:12},
 reviewGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
 reviewCard:{width:(W-48)/2,backgroundColor:C.surface,padding:12,borderRadius:16,borderWidth:1,borderColor:C.line,gap:6},
 reviewDesc:{fontSize:11,color:C.muted,lineHeight:16},
 aiHero:{backgroundColor:C.surface,padding:18,borderRadius:22,borderWidth:1,borderColor:C.line,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 aiHeroEyebrow:{fontSize:10,color:C.muted,letterSpacing:1.5,fontWeight:'800'},
 aiHeroStatus:{fontSize:13,color:C.amber,fontWeight:'800'},
 metric:{fontSize:46,color:C.text,fontWeight:'900',lineHeight:54},
 pipeline:{backgroundColor:C.surface,borderRadius:20,borderWidth:1,borderColor:C.line,overflow:'hidden'},
 pipeRow:{padding:13,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10},
 pipeIcon:{width:34,height:34,borderRadius:12,alignItems:'center',justifyContent:'center'},
 pipeText:{fontSize:12,color:C.text,flex:1,fontWeight:'700'},
 pipeState:{fontSize:9,color:C.muted,fontWeight:'900'},
 aiCard:{backgroundColor:C.surface,padding:15,borderRadius:20,borderWidth:1,borderColor:C.line,marginBottom:10,...shadow},
 aiHeader:{flexDirection:'row',alignItems:'center',gap:7},
 aiGlow:{width:26,height:26,borderRadius:13,backgroundColor:C.cyan+'18',alignItems:'center',justifyContent:'center'},
 aiLabel:{fontSize:9,color:C.cyan,fontWeight:'900',letterSpacing:1.1,flex:1},
 aiConf:{fontSize:10,color:C.mint,fontWeight:'900'},
 aiTitle:{fontSize:16,color:C.text,fontWeight:'900',marginTop:10},
 aiBody:{fontSize:12,color:C.muted,lineHeight:18,marginTop:5},
 aiEvidenceRow:{flexDirection:'row',gap:6,flexWrap:'wrap',marginTop:10},
 aiBottom:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:12},
 cost:{fontSize:12,color:C.amber,fontWeight:'900'},
 linkText:{fontSize:11,color:C.cyan,fontWeight:'800'},
 small:{fontSize:9,color:C.muted,fontWeight:'900',letterSpacing:.8},
 confidence:{gap:5,marginTop:10},
 confHead:{flexDirection:'row',justifyContent:'space-between'},
 zoneMap:{backgroundColor:C.surface,padding:16,borderRadius:24,borderWidth:1,borderColor:C.line},
 carOutline:{height:390,borderRadius:130,borderWidth:2,borderColor:C.line,backgroundColor:C.surface2,position:'relative',alignItems:'center',justifyContent:'center'},
 windshield:{position:'absolute',top:68,width:170,height:70,borderRadius:32,borderWidth:1,borderColor:C.cyan+'38',backgroundColor:C.cyan+'09'},
 hood:{position:'absolute',top:12,width:120,height:78,borderRadius:35,borderWidth:1,borderColor:C.cyan+'22'},
 cabin:{position:'absolute',top:120,width:180,height:150,borderRadius:56,borderWidth:1,borderColor:C.line},
 frontBumper:{position:'absolute',bottom:15,width:135,height:32,borderRadius:14,borderWidth:1,borderColor:C.line},
 wheel:{position:'absolute',width:38,height:84,borderRadius:18,borderWidth:4,borderColor:C.line,backgroundColor:C.bg},
 zonePin:{position:'absolute',width:28,height:28,borderRadius:14,backgroundColor:C.bg,borderWidth:2,alignItems:'center',justifyContent:'center'},
 zonePinText:{fontSize:10,fontWeight:'900'},
 zoneLegend:{flexDirection:'row',gap:7,justifyContent:'center',marginTop:13},
 zoneDetail:{backgroundColor:C.surface,padding:16,borderRadius:20,borderWidth:1,borderColor:C.line},
 zoneHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 zoneEyebrow:{fontSize:9,color:C.muted,letterSpacing:1.4,fontWeight:'900'},
 zoneTitle:{fontSize:21,color:C.text,fontWeight:'900',marginTop:4},
 zoneBody:{fontSize:12,color:C.muted,lineHeight:18,marginTop:9},
 zoneStats:{flexDirection:'row',gap:8,marginTop:12},
 explainCard:{backgroundColor:C.surface,padding:16,borderRadius:20,borderWidth:1,borderColor:C.line,gap:8},
 explainTitle:{fontSize:15,color:C.text,fontWeight:'900'},
 explainBody:{fontSize:12,color:C.muted,lineHeight:18},
 reportKpis:{gap:8},
 highlightRow:{backgroundColor:C.surface,padding:12,borderRadius:16,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:9,marginBottom:8},
 highlightBar:{width:5,height:44,borderRadius:3},
 highlightTitle:{fontSize:12,color:C.text,fontWeight:'800',lineHeight:17},
 highlightEvidence:{fontSize:10,color:C.muted,marginTop:2},
 counterRow:{backgroundColor:C.surface,padding:13,borderRadius:18,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10},
 counterTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 counterSub:{fontSize:10,color:C.muted,marginTop:3},
 timelineRow:{minHeight:66,flexDirection:'row',position:'relative'},
 timelineDot:{width:10,height:10,borderRadius:5,marginTop:6,marginHorizontal:2},
 timelineLine:{position:'absolute',left:6,top:16,bottom:-3,width:2,backgroundColor:C.line},
 timelineContent:{flex:1,paddingLeft:12,paddingBottom:10},
 timelineTime:{fontSize:10,color:C.muted},
 timelineTitle:{fontSize:13,color:C.text,fontWeight:'800',marginVertical:3},
 reportSections:{backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.line,overflow:'hidden'},
 reportSectionRow:{padding:13,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10},
 sectionAccent:{width:4,height:32,borderRadius:2},
 reportSectionTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 reportSectionSummary:{fontSize:10,color:C.muted,marginTop:2,lineHeight:14},
 viewer:{height:360,borderRadius:22,overflow:'hidden',backgroundColor:C.black},
 viewerImage:{width:'100%',height:'100%'},
 viewerOverlay:{...StyleSheet.absoluteFillObject},
 annotation:{position:'absolute',left:'9%',top:'40%',width:'82%',padding:12,borderWidth:2,borderColor:C.coral,borderRadius:12,backgroundColor:'rgba(8,17,29,.65)'},
 annotationLabel:{fontSize:9,color:C.coral,fontWeight:'900',letterSpacing:1},
 annotationTitle:{fontSize:15,color:C.white,fontWeight:'900',marginTop:3},
 docCard:{backgroundColor:C.surface,padding:12,borderRadius:18,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
 docPreview:{width:56,height:70,borderRadius:12,backgroundColor:C.surface2,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line},
 docPages:{fontSize:9,color:C.muted,fontWeight:'800',marginTop:4},
 docTitle:{fontSize:12,color:C.text,fontWeight:'800'},
 docMeta:{fontSize:10,color:C.muted,marginVertical:5,lineHeight:14},
 docField:{backgroundColor:C.surface,padding:12,borderRadius:16,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
 docFieldLabel:{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:.8},
 docFieldValue:{fontSize:13,color:C.text,fontWeight:'800',marginTop:3},
 notice:{padding:14,borderRadius:17,backgroundColor:C.surface,borderWidth:1,borderColor:C.mint+'44',flexDirection:'row',alignItems:'center',gap:10},
 noticeText:{fontSize:12,color:C.muted,flex:1,lineHeight:17},
 waterfall:{backgroundColor:C.surface,padding:16,borderRadius:20,borderWidth:1,borderColor:C.line,gap:10},
 waterHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 waterTitle:{fontSize:16,color:C.text,fontWeight:'900'},
 waterRow:{flexDirection:'row',alignItems:'center',gap:8},
 waterLabel:{width:58,fontSize:10,color:C.muted,fontWeight:'700'},
 waterTrack:{flex:1,height:12,backgroundColor:C.surface3,borderRadius:999,overflow:'hidden'},
 waterBar:{height:'100%',borderRadius:999},
 waterValue:{width:78,textAlign:'right',fontSize:11,fontWeight:'900'},
 waterNote:{fontSize:10,color:C.muted,lineHeight:15},
 negCard:{backgroundColor:C.surface,padding:15,borderRadius:20,borderWidth:1,borderColor:C.line,marginBottom:9},
 negTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 negTitle:{fontSize:16,color:C.text,fontWeight:'900'},
 negNumbers:{flexDirection:'row',justifyContent:'space-between',marginTop:14},
 negNumber:{fontSize:18,color:C.text,fontWeight:'900',marginTop:3},
 negReason:{fontSize:11,color:C.muted,lineHeight:16,marginTop:10},
 questionCard:{backgroundColor:C.surface,padding:12,borderRadius:17,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
 qNum:{width:28,height:28,borderRadius:14,backgroundColor:C.cyan+'18',alignItems:'center',justifyContent:'center'},
 qNumText:{fontSize:11,color:C.cyan,fontWeight:'900'},
 qText:{fontSize:12,color:C.text,lineHeight:17,flex:1},
 copyBtn:{width:34,height:34,borderRadius:12,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},
 talkingPoint:{backgroundColor:C.surface,padding:13,borderRadius:18,borderWidth:1,borderColor:C.line,flexDirection:'row',gap:10,marginBottom:8},
 talkingIcon:{width:30,height:30,borderRadius:15,backgroundColor:C.blue+'18',alignItems:'center',justifyContent:'center'},
 talkingNum:{fontSize:10,color:C.blue,fontWeight:'900'},
 talkingTitle:{fontSize:13,color:C.text,fontWeight:'900'},
 talkingDetail:{fontSize:11,color:C.muted,lineHeight:16,marginTop:4},
 talkingEvidence:{flexDirection:'row',gap:5,flexWrap:'wrap',marginTop:7},
 suggestRow:{gap:8,flexDirection:'row',flexWrap:'wrap'},
 suggest:{backgroundColor:C.surface,borderRadius:999,borderWidth:1,borderColor:C.line,paddingHorizontal:12,paddingVertical:8},
 suggestText:{fontSize:10,color:C.muted,fontWeight:'700'},
 thread:{gap:9},
 bubble:{padding:12,borderRadius:18,maxWidth:'88%'},
 bubbleHead:{flexDirection:'row',gap:6,alignItems:'center',marginBottom:5},
 bubbleRole:{fontSize:9,color:'#D8E7F1',fontWeight:'900',letterSpacing:1},
 bubbleText:{fontSize:12,color:C.text,lineHeight:18},
 bubbleEvidence:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:8},
 composer:{height:54,backgroundColor:C.surface,borderRadius:27,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',paddingHorizontal:7,gap:7},
 attach:{width:40,height:40,borderRadius:20,backgroundColor:C.surface2,alignItems:'center',justifyContent:'center'},
 input:{flex:1,color:C.text,fontSize:13},
 send:{width:40,height:40,borderRadius:20,backgroundColor:C.cyan,alignItems:'center',justifyContent:'center'},
 certificate:{backgroundColor:'#EEF6F5',borderRadius:24,padding:22,alignItems:'center',overflow:'hidden',...shadow},
 certGlow:{position:'absolute',width:220,height:220,borderRadius:110,backgroundColor:C.mint+'15',top:-70},
 certSeal:{width:94,height:94,borderRadius:47,backgroundColor:'#05261F',alignItems:'center',justifyContent:'center',borderWidth:6,borderColor:C.mint+'55'},
 certTitle:{fontSize:13,color:'#0D3D35',fontWeight:'900',letterSpacing:1.8,marginTop:12},
 certVehicle:{fontSize:18,color:'#102A38',fontWeight:'900',marginTop:7},
 certId:{fontFamily:'monospace',fontSize:11,color:'#5B707C',marginTop:5},
 certDivider:{height:1,width:'82%',backgroundColor:'#C5D7D4',marginVertical:14},
 certFacts:{width:'100%',flexDirection:'row',flexWrap:'wrap'},
 certFact:{width:'50%',padding:8},
 certFactLabel:{fontSize:9,color:'#68808A',textTransform:'uppercase',letterSpacing:.7},
 certFactValue:{fontSize:12,color:'#163039',fontWeight:'800',marginTop:3},
 verifyList:{backgroundColor:C.surface,padding:14,borderRadius:18,borderWidth:1,borderColor:C.line,gap:13},
 verifyRow:{flexDirection:'row',alignItems:'center',gap:9},
 verifyText:{fontSize:12,color:C.text,fontWeight:'700'},
 contract:{backgroundColor:'#F7FAFC',borderRadius:22,padding:18,...shadow},
 contractTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 contractWord:{fontSize:12,color:'#243A48',fontWeight:'900',letterSpacing:1},
 contractLine:{height:1,backgroundColor:'#CFD8DE',marginVertical:13},
 contractClause:{flexDirection:'row',alignItems:'center',gap:9,paddingVertical:10,borderBottomWidth:1,borderColor:'#DFE5E9'},
 contractNum:{fontSize:10,color:'#748894',fontWeight:'900'},
 contractClauseText:{fontSize:12,color:'#1E3038',fontWeight:'700',flex:1},
 contractNotice:{marginTop:13,padding:11,borderRadius:14,backgroundColor:'#EAF8FF',flexDirection:'row',gap:8,alignItems:'center'},
 contractNoticeText:{fontSize:10,color:'#3D5A68',flex:1,lineHeight:14},
 approval:{padding:14,backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.cyan+'40',flexDirection:'row',gap:10,alignItems:'center'},
 approvalTitle:{fontSize:14,color:C.text,fontWeight:'900'},
 approvalBody:{fontSize:11,color:C.muted,lineHeight:16,marginTop:3},
 actionRow:{flexDirection:'row',gap:8,flexWrap:'wrap'},
 paywall:{backgroundColor:'#071019',borderRadius:28,padding:22,borderWidth:1,borderColor:C.cyan+'38',overflow:'hidden',...shadow},
 paywallOrb:{position:'absolute',right:-80,top:-70,width:240,height:240,borderRadius:120,backgroundColor:C.cyan+'0D'},
 payTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 close:{color:C.muted,fontSize:25},
 payTitle:{fontSize:30,color:C.text,fontWeight:'900',lineHeight:36,marginTop:15},
 paySub:{fontSize:13,color:C.muted,lineHeight:19,marginTop:6,marginBottom:15},
 payFeature:{flexDirection:'row',alignItems:'center',gap:9,marginBottom:9},
 payFeatureText:{fontSize:12,color:C.text,fontWeight:'700'},
 priceToggle:{marginTop:10,padding:12,borderRadius:16,backgroundColor:C.surface2,flexDirection:'row',justifyContent:'space-between'},
 priceText:{fontSize:11,color:C.muted},
 priceTextStrong:{fontSize:11,color:C.cyan,fontWeight:'900'},
 payCta:{height:52,borderRadius:16,backgroundColor:C.cyan,alignItems:'center',justifyContent:'center',marginTop:12},
 payCtaText:{fontSize:14,color:C.bg,fontWeight:'900'},
 restore:{textAlign:'center',fontSize:11,color:C.cyan,fontWeight:'800',marginTop:12},
 legal:{textAlign:'center',fontSize:9,color:C.muted,lineHeight:13,marginTop:8},
 planRow:{backgroundColor:C.surface,padding:14,borderRadius:17,borderWidth:1,borderColor:C.line,flexDirection:'row',gap:8,alignItems:'center',marginBottom:8},
 planName:{fontSize:14,color:C.text,fontWeight:'900'},
 planDesc:{fontSize:10,color:C.muted,lineHeight:14,marginTop:4},
 planPrice:{fontSize:13,color:C.cyan,fontWeight:'900'},
 unreadSummary:{backgroundColor:C.surface,padding:14,borderRadius:18,borderWidth:1,borderColor:C.cyan+'35',flexDirection:'row',alignItems:'center',gap:12,marginBottom:8},
 unreadCount:{fontSize:29,color:C.cyan,fontWeight:'900'},
 unreadTitle:{fontSize:13,color:C.text,fontWeight:'800'},
 unreadBody:{fontSize:10,color:C.muted,marginTop:2},
 notification:{padding:13,borderRadius:17,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
 notifyTop:{flexDirection:'row',alignItems:'center',gap:6},
 notifyTitle:{fontSize:12,color:C.text,fontWeight:'900',flex:1},
 notifyBody:{fontSize:11,color:C.muted,lineHeight:16,marginTop:3},
 notifyTime:{fontSize:9,color:C.muted,marginTop:5},
 unreadDot:{width:7,height:7,borderRadius:4,backgroundColor:C.cyan},
 loadingCard:{backgroundColor:C.surface,padding:18,borderRadius:22,borderWidth:1,borderColor:C.line,alignItems:'center',gap:8},
 loadingIcon:{width:58,height:58,borderRadius:29,backgroundColor:C.cyan+'13',alignItems:'center',justifyContent:'center'},
 loadingTitle:{fontSize:17,color:C.text,fontWeight:'900'},
 loadingSub:{fontSize:11,color:C.muted},
 loadingSteps:{width:'100%',gap:8,marginTop:6},
 loadStep:{flexDirection:'row',alignItems:'center',gap:8},
 loadCheck:{width:18,height:18,borderRadius:9,alignItems:'center',justifyContent:'center'},
 loadText:{fontSize:10,color:C.muted},
 stateCard:{backgroundColor:C.surface,padding:20,borderRadius:22,borderWidth:1,borderColor:C.line,alignItems:'center',gap:8},
 stateTitle:{fontSize:18,color:C.text,fontWeight:'900'},
 stateBody:{fontSize:12,color:C.muted,textAlign:'center',lineHeight:18,maxWidth:300},
 stateActions:{flexDirection:'row',gap:8,marginTop:5},
 empty:{backgroundColor:C.surface,padding:24,borderRadius:22,borderWidth:1,borderColor:C.line,alignItems:'center',gap:9},
 emptyCircle:{width:96,height:96,borderRadius:48,backgroundColor:C.cyan+'12',borderWidth:1,borderColor:C.cyan+'44',alignItems:'center',justifyContent:'center'},
 emptyTitle:{fontSize:20,color:C.text,fontWeight:'900'},
 emptyBody:{fontSize:12,color:C.muted,textAlign:'center',lineHeight:18,maxWidth:300},
 indexHero:{backgroundColor:C.surface,padding:19,borderRadius:22,borderWidth:1,borderColor:C.cyan+'30'},
 indexHeroTitle:{fontSize:27,color:C.text,fontWeight:'900'},
 indexHeroBody:{fontSize:12,color:C.muted,lineHeight:18,marginTop:6},
 indexRow:{backgroundColor:C.surface,padding:13,borderRadius:17,borderWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',gap:11},
 indexNum:{width:34,height:34,borderRadius:17,backgroundColor:C.cyan+'12',alignItems:'center',justifyContent:'center'},
 indexNumText:{fontSize:10,color:C.cyan,fontWeight:'900'},
 indexTitle:{fontSize:13,color:C.text,fontWeight:'900'},
 indexSub:{fontSize:9,color:C.muted,marginTop:2},
 indexFooter:{padding:14,borderRadius:16,backgroundColor:C.surface2,borderWidth:1,borderColor:C.line},
 indexFooterText:{fontSize:10,color:C.muted,textAlign:'center',lineHeight:15},
});
