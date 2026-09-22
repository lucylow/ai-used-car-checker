import {AI_FINDINGS,AI_PIPELINE} from '../data/aiFixtures';
import {COMPARABLE_LISTINGS,MARKET_SERIES} from '../data/marketFixtures';
import {DOCUMENTS,DOCUMENT_FIELDS} from '../data/documentFixtures';
import {COPILOT_THREAD} from '../data/copilotFixtures';
import {REPORT_ACTIVITY,REPORT_STATS} from '../data/reportFixtures';
import {VEHICLES} from '../data/vehicleFixtures';

const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

export const mockApi={
 async getVehicle(){await wait(240);return VEHICLES[0];},
 async getHistory(){await wait(260);return VEHICLES;},
 async getMarket(){await wait(380);return {series:MARKET_SERIES,listings:COMPARABLE_LISTINGS,center:21100,range:{low:19800,high:23900}};},
 async getFindings(){await wait(420);return AI_FINDINGS;},
 async getDocuments(){await wait(280);return {documents:DOCUMENTS,fields:DOCUMENT_FIELDS};},
 async getReport(){await wait(360);return {stats:REPORT_STATS,activity:REPORT_ACTIVITY};},
 async getCopilot(){await wait(300);return COPILOT_THREAD;},
 async startAi(onProgress){
  const output=[];
  for(const step of AI_PIPELINE){await wait(step.ms);output.push(step.id);onProgress?.({step,complete:output.slice()});}
  return AI_FINDINGS;
 },
 async saveEvidence(input){await wait(180);return {id:`e-${Date.now()}`,saved:true,...input};},
 async createOffer(input){await wait(220);return {id:`offer-${Date.now()}`,created:true,...input};},
 async generateContract(input){await wait(520);return {id:`contract-${Date.now()}`,status:'draft',...input};},
 async createCertificate(input){await wait(460);return {id:`cert-${Date.now()}`,status:'ready',hash:'a8c1-demo-90bf',...input};},
};
