import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEnquiry} from '../public/assets/contact-message.mjs';
import {submitEnquiry} from '../public/assets/contact-submit.mjs';
const key='00000000-0000-4000-8000-000000000000';
const fields={name:'Test Visitor',email:'visitor@example.com',company:'Example',service:'AI & data solutions',subject:'A product & data enquiry',message:'Please discuss this example project with me.',website:''};
const noSend=()=>{throw new Error('Provider must not be called');};
test('sends only the intended form fields to the existing provider without redirect',async()=>{
  let outgoing;
  const result=await submitEnquiry({...fields,ccemail:'unwanted@example.com',redirect:'https://example.com',webhook:'https://example.com',access_key:'visitor-supplied'}, {key,send:async(url,options)=>{
    assert.equal(url,'https://api.web3forms.com/submit');outgoing=JSON.parse(options.body);
    return Response.json({success:true});
  }});
  assert.deepEqual(result,{ok:true});
  assert.equal(outgoing.access_key,key);
  assert.equal(outgoing.email,fields.email);
  assert.equal(outgoing.subject,'Project enquiry: '+fields.subject);
  assert.equal(outgoing.botcheck,false);
  for(const field of ['ccemail','redirect','webhook']) assert.equal(outgoing[field],undefined);
});
test('invalid required fields and honeypot never submit',async()=>{
  for(const change of [{email:'invalid'},{service:'Other invalid value'},{name:{}},{message:'short'},{message:'a'.repeat(3001)},{website:'spam'}]){
    await assert.rejects(submitEnquiry({...fields,...change},{key,send:noSend}));
  }
});
test('missing public key fails without claiming submission',async()=>{
  await assert.rejects(submitEnquiry(fields,{key:'',send:noSend}),/unavailable/);
});
test('provider rejection, malformed response and rate limiting report failure',async()=>{
  for(const response of [Response.json({success:false}),Response.json({success:true},{status:500}),new Response('bad json'),Response.json({success:false},{status:429})]){
    await assert.rejects(submitEnquiry(fields,{key,send:async()=>response}));
  }
});
test('network failure and cancellation propagate for the form fallback',async()=>{
  await assert.rejects(submitEnquiry(fields,{key,send:async()=>{throw new TypeError('network');}}),TypeError);
  const controller=new AbortController();controller.abort();
  await assert.rejects(submitEnquiry(fields,{key,signal:controller.signal,send:async(url,options)=>{options.signal.throwIfAborted();}}),{name:'AbortError'});
});
test('Unicode and multiline message are preserved; subject stays on one line',()=>{
  const result=buildEnquiry({...fields,subject:'A project\r\nwith data',message:'أهلاً — building useful tools\nWith a second line.'});
  assert.equal(result.subject,'Project enquiry: A project with data');
  assert.match(result.text,/أهلاً/);
  assert.match(result.text,/With a second line/);
});
