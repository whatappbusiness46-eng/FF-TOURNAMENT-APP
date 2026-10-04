const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
const PORT = process.env.PORT || 10000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const defaultRulesText = [
  'Slot নেওয়ার সময় সঠিক Game ID ব্যবহার করুন।',
  'Game ID level কমপক্ষে 80 না হলে ম্যাচে অংশ নেওয়া যাবে না।',
  'Network বা game glitch হলে প্রমাণ ছাড়া refund দাবি করা যাবে না।',
  'Custom Room-এ সময়মতো Join না করলে refund প্রযোজ্য নয়।',
  'Room-এ ঢোকার পর নিজের ID দিয়ে সঠিকভাবে খেলুন।',
  'নিজের পরিচয় গোপন করে অন্যের account ব্যবহার করা নিষিদ্ধ।',
  'Sniper/অন্য নিষিদ্ধ অস্ত্র ব্যবহার করা যাবে না যদি match rule-এ নিষেধ থাকে।',
  'Victor/অন্যান্য নিষিদ্ধ bug বা exploit ব্যবহার করা যাবে না।',
  'BR ম্যাচে kill অনুযায়ী per-kill reward প্রযোজ্য হবে।',
  'অস্বাভাবিক গাড়ি/গ্লিচ/third-party exploit ব্যবহার করা যাবে না।',
  'অভিযোগ থাকলে screenshot/video proof সহ support-এ যোগাযোগ করুন।',
  'অন্য player-এর সাথে team-up/teaming করলে match থেকে বাদ দেওয়া হবে।',
  'যে কোনো cheating বা abnormal gameplay প্রমাণিত হলে account ban হতে পারে।',
  'Match চলাকালীন ভুল Room/ID ব্যবহার করলে দায় player-এর।',
  'Match শেষ হওয়ার পর result যাচাই করে winner-এর prize wallet-এ যোগ করা হবে।'
];

const defaults = {
  settings: {
    appName: 'ZyroX Arena', currency: 'BDT', referralPercent: 5,
    supportTelegram: '', bkashNumber: '01742166737', nagadNumber: '01730649062',
    bannerText: 'PLAY • COMPETE • WIN'
  },
  modes: [
    { id:'br', name:'BR MATCH', game:'Free Fire', enabled:true },
    { id:'cs', name:'CS 4 VS 4', game:'Free Fire', enabled:true },
    { id:'lw', name:'LONE WOLF', game:'Free Fire', enabled:true },
    { id:'clash', name:'CLASH SQUAD', game:'Free Fire', enabled:true },
    { id:'headshot', name:'HEADSHOT', game:'Free Fire', enabled:true },
    { id:'survival', name:'SURVIVAL', game:'Free Fire', enabled:true },
    { id:'pro', name:'PRO LEAGUE', game:'Free Fire', enabled:true },
    { id:'ludo', name:'LUDO', game:'Ludo', enabled:true }
  ],
  rules: {
    br:{entryFee:5, perKill:2.5, rewards:[{rank:'1',amount:50},{rank:'2',amount:30},{rank:'3',amount:20},{rank:'4-5',amount:10}]},
    cs:{entryFee:25, winnerReward:40, secondReward:0},
    lw:{entryFee:30, winnerReward:30},
    clash:{entryFee:25, winnerReward:40},
    headshot:{entryFee:10, perKill:5},
    survival:{entryFee:10, winnerReward:50},
    pro:{entryFee:20, winnerReward:100},
    ludo:{entryFee:10, winnerReward:18}
  },
  rulesText: defaultRulesText,
  matches: [], users: [], withdrawals: [], deposits: [], statements: [], notifications: []
};
function save(db){fs.writeFileSync(DATA_FILE, JSON.stringify(db,null,2));}
function load(){
  if(!fs.existsSync(DATA_FILE)){save(defaults);return JSON.parse(JSON.stringify(defaults));}
  try {
    const db=JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
    db.settings={...defaults.settings,...(db.settings||{})}; db.modes=db.modes||defaults.modes; db.rules={...defaults.rules,...(db.rules||{})};
    db.rulesText=db.rulesText||defaultRulesText; db.matches=db.matches||[]; db.users=db.users||[]; db.withdrawals=db.withdrawals||[]; db.deposits=db.deposits||[]; db.statements=db.statements||[]; db.notifications=db.notifications||[];
    db.matches.forEach(m=>{m.players=m.players||[];m.results=m.results||[];m.maxPlayers=Number(m.maxPlayers||48);m.filled=m.players.length;m.status=m.status||'open';m.createdAt=m.createdAt||Date.now();});
    save(db); return db;
  } catch(e){save(defaults);return JSON.parse(JSON.stringify(defaults));}
}
let db=load();
const id=(p)=>p+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
function userById(uid){return db.users.find(u=>u.id===uid);}
function auth(req,res,next){const h=req.headers.authorization||'';const t=h.startsWith('Bearer ')?h.slice(7):'';try{req.user=jwt.verify(t,JWT_SECRET);next();}catch(e){return res.status(401).json({error:'Login required'});}}
function admin(req,res,next){if(!ADMIN_TOKEN||req.headers['x-admin-token']!==ADMIN_TOKEN)return res.status(401).json({error:'Invalid admin token'});next();}
function modeFor(id){return db.modes.find(m=>m.id===id);}
function publicMatch(m){const copy={...m,players:undefined,rulesText:db.rulesText};copy.filled=(m.players||[]).length; if(m.status==='open') {copy.roomId='';copy.roomPassword='';} return copy;}
function notify(text){db.notifications.push({id:id('n'),text,ts:Date.now()});db.notifications=db.notifications.slice(-100);}

app.get('/api/health',(req,res)=>res.json({ok:true,app:'ZyroX Arena',time:new Date().toISOString()}));
app.get('/api/public/config',(req,res)=>res.json({settings:db.settings,modes:db.modes,rules:db.rules,rulesText:db.rulesText}));
app.get('/api/matches',(req,res)=>{const status=req.query.status;let rows=db.matches;if(status)rows=rows.filter(m=>m.status===status);res.json(rows.map(publicMatch).sort((a,b)=>String(a.startAt).localeCompare(String(b.startAt))));});
app.get('/api/matches/:id',(req,res)=>{const m=db.matches.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:'Match not found'});res.json(publicMatch(m));});
app.get('/api/leaderboard',(req,res)=>res.json(db.users.map(u=>({name:u.name,winnings:Number(u.winnings||0),matches:Number(u.matches||0)})).sort((a,b)=>b.winnings-a.winnings).slice(0,50)));

app.post('/api/auth/demo',(req,res)=>{const name=String(req.body.name||'Player').trim().slice(0,30);if(name.length<2)return res.status(400).json({error:'Enter a valid player name'});let u=db.users.find(x=>x.name.toLowerCase()===name.toLowerCase());if(!u){u={id:id('u'),name,balance:0,winnings:0,matches:0,referrals:0,referralCode:'ZX'+Math.random().toString(36).slice(2,8).toUpperCase()};db.users.push(u);save(db);}const token=jwt.sign({uid:u.id},JWT_SECRET,{expiresIn:'30d'});res.json({token,user:u});});
app.get('/api/me',auth,(req,res)=>res.json(userById(req.user.uid)||null));
app.get('/api/statements',auth,(req,res)=>res.json(db.statements.filter(s=>s.uid===req.user.uid).sort((a,b)=>b.ts-a.ts)));
app.get('/api/my-matches',auth,(req,res)=>res.json(db.matches.filter(m=>(m.players||[]).includes(req.user.uid)).map(publicMatch).sort((a,b)=>b.createdAt-a.createdAt)));
app.get('/api/notifications',auth,(req,res)=>res.json(db.notifications.slice(-50).reverse()));

app.post('/api/deposit',auth,(req,res)=>{const amount=Number(req.body.amount),method=String(req.body.method||''),trx=String(req.body.trxId||'').trim();if(!(amount>0)||!['bKash','Nagad'].includes(method)||!trx)return res.status(400).json({error:'Amount, method and transaction ID are required'});const d={id:id('dep'),uid:req.user.uid,amount,method,trxId:trx,status:'pending',ts:Date.now()};db.deposits.push(d);save(db);res.json(d);});
app.post('/api/withdraw',auth,(req,res)=>{const amount=Number(req.body.amount),method=String(req.body.method||''),number=String(req.body.number||'').trim(),u=userById(req.user.uid);if(!(amount>=1)||!['bKash','Nagad'].includes(method)||!/^01\d{9}$/.test(number))return res.status(400).json({error:'Enter valid amount and Bangladesh mobile number'});if(u.balance<amount)return res.status(400).json({error:'Insufficient balance'});u.balance-=amount;const w={id:id('wd'),uid:u.id,amount,method,number,status:'pending',ts:Date.now()};db.withdrawals.push(w);db.statements.push({uid:u.id,type:'withdraw',amount:-amount,note:`${method} withdrawal request`,ts:Date.now()});save(db);res.json(w);});

app.post('/api/matches/:matchId/join',auth,(req,res)=>{const m=db.matches.find(x=>x.id===req.params.matchId),u=userById(req.user.uid);if(!m||!u)return res.status(404).json({error:'Match unavailable'});if(!['open'].includes(m.status))return res.status(400).json({error:'Match is no longer open'});if((m.players||[]).includes(u.id))return res.status(400).json({error:'Already joined'});if(m.players.length>=m.maxPlayers)return res.status(400).json({error:'Seats full'});if(u.balance<m.entryFee)return res.status(400).json({error:'Insufficient balance. Deposit first.'});u.balance-=m.entryFee;u.matches=(u.matches||0)+1;m.players.push(u.id);m.filled=m.players.length;db.statements.push({uid:u.id,type:'entry',amount:-m.entryFee,note:`Joined ${m.title}`,ts:Date.now()});save(db);res.json({ok:true,match:publicMatch(m),roomId:m.status==='started'?m.roomId:null,roomPassword:m.status==='started'?m.roomPassword:null});});
app.get('/api/matches/:matchId/room',auth,(req,res)=>{const m=db.matches.find(x=>x.id===req.params.matchId);if(!m||(m.players||[]).indexOf(req.user.uid)<0)return res.status(403).json({error:'You are not a participant'});if(!['started','finished'].includes(m.status))return res.status(400).json({error:'Room details are not released yet'});res.json({roomId:m.roomId||'',roomPassword:m.roomPassword||'',status:m.status});});

app.post('/api/admin/login',(req,res)=>{if(!ADMIN_TOKEN||req.body.token!==ADMIN_TOKEN)return res.status(401).json({error:'Invalid admin token'});res.json({ok:true});});
app.get('/api/admin/overview',admin,(req,res)=>res.json({settings:db.settings,modes:db.modes,rules:db.rules,rulesText:db.rulesText,matches:db.matches,users:db.users,withdrawals:db.withdrawals,deposits:db.deposits}));
app.put('/api/admin/settings',admin,(req,res)=>{db.settings={...db.settings,...req.body};save(db);res.json(db.settings);});
app.put('/api/admin/rules',admin,(req,res)=>{db.rules={...db.rules,...req.body};save(db);res.json(db.rules);});
app.put('/api/admin/rules-text',admin,(req,res)=>{db.rulesText=Array.isArray(req.body.rulesText)?req.body.rulesText.map(String).slice(0,30):db.rulesText;save(db);res.json(db.rulesText);});
app.put('/api/admin/modes',admin,(req,res)=>{db.modes=Array.isArray(req.body)?req.body.map(x=>({...x,id:String(x.id),name:String(x.name),game:String(x.game||'Free Fire'),enabled:Boolean(x.enabled)})):db.modes;save(db);res.json(db.modes);});
app.post('/api/admin/matches',admin,(req,res)=>{const modeId=String(req.body.modeId||'br');const r=db.rules[modeId]||{};const m={id:id('m'),title:String(req.body.title||`${modeFor(modeId)?.name||'MATCH'} #${db.matches.length+1}`),modeId,entryFee:Number(req.body.entryFee!=null?req.body.entryFee:(r.entryFee||0)),prize:Number(req.body.prize||0),perKill:Number(req.body.perKill!=null?req.body.perKill:(r.perKill||0)),maxPlayers:Number(req.body.maxPlayers||48),filled:0,players:[],startAt:String(req.body.startAt||''),roomId:String(req.body.roomId||''),roomPassword:String(req.body.roomPassword||''),status:'open',results:[],createdAt:Date.now()};db.matches.push(m);save(db);res.json(m);});
app.patch('/api/admin/matches/:id',admin,(req,res)=>{const m=db.matches.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:'Not found'});const allowed=['title','modeId','entryFee','prize','perKill','maxPlayers','startAt','roomId','roomPassword','status'];for(const k of allowed)if(req.body[k]!==undefined)m[k]=k==='maxPlayers'||k==='entryFee'||k==='prize'||k==='perKill'?Number(req.body[k]):String(req.body[k]);if(req.body.status==='started'&&!m.startedAt)m.startedAt=Date.now();if(req.body.status==='finished')m.finishedAt=Date.now();m.filled=m.players.length;save(db);res.json(m);});
app.post('/api/admin/matches/:id/start',admin,(req,res)=>{const m=db.matches.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:'Not found'});if(!m.roomId||!m.roomPassword)return res.status(400).json({error:'Add Room ID and Password before starting'});m.status='started';m.startedAt=Date.now();save(db);notify(`${m.title} has started. Room details are now available to joined players.`);save(db);res.json(m);});
app.post('/api/admin/matches/:id/finish',admin,(req,res)=>{const m=db.matches.find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:'Not found'});m.status='finished';m.finishedAt=Date.now();m.results=Array.isArray(req.body.results)?req.body.results.map(x=>({uid:String(x.uid),rank:Number(x.rank||0),kills:Number(x.kills||0),prize:Number(x.prize||0)})):m.results||[];for(const result of m.results){const u=userById(result.uid);if(!u)continue;const prize=Math.max(0,Number(result.prize||0));u.winnings=(u.winnings||0)+prize;if(prize>0){u.balance+=prize;db.statements.push({uid:u.id,type:'prize',amount:prize,note:`Prize: ${m.title}`,ts:Date.now()});}}save(db);notify(`${m.title} result published.`);save(db);res.json(m);});
app.post('/api/admin/deposits/:id/approve',admin,(req,res)=>{const d=db.deposits.find(x=>x.id===req.params.id);if(!d)return res.status(404).json({error:'Not found'});if(d.status!=='pending')return res.status(400).json({error:'Already processed'});d.status='approved';const u=userById(d.uid);u.balance+=d.amount;db.statements.push({uid:u.id,type:'deposit',amount:d.amount,note:`${d.method} deposit approved`,ts:Date.now()});save(db);res.json(d);});
app.post('/api/admin/deposits/:id/reject',admin,(req,res)=>{const d=db.deposits.find(x=>x.id===req.params.id);if(!d)return res.status(404).json({error:'Not found'});d.status='rejected';save(db);res.json(d);});
app.post('/api/admin/withdrawals/:id/approve',admin,(req,res)=>{const w=db.withdrawals.find(x=>x.id===req.params.id);if(!w)return res.status(404).json({error:'Not found'});w.status='approved';save(db);res.json(w);});
app.post('/api/admin/withdrawals/:id/reject',admin,(req,res)=>{const w=db.withdrawals.find(x=>x.id===req.params.id);if(!w)return res.status(404).json({error:'Not found'});if(w.status==='pending'){const u=userById(w.uid);u.balance+=w.amount;db.statements.push({uid:u.id,type:'refund',amount:w.amount,note:'Withdrawal rejected/refunded',ts:Date.now()});}w.status='rejected';save(db);res.json(w);});

app.use(express.static(path.join(__dirname,'public')));
app.listen(PORT,()=>console.log(`ZyroX Arena API listening on ${PORT}`));
