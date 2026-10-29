import {buildEnquiry} from './contact-message.mjs';

// Web3Forms submission keys are designed for public HTML forms. This one
// belongs to the owner's existing form; never accept a recipient from visitors.
export async function submitEnquiry(fields, {key, signal, send = fetch}) {
  const enquiry = buildEnquiry(fields);
  if (fields.website) throw new Error('Please reload the page and try again.');
  if (!/^[0-9a-f-]{36}$/i.test(key || '')) throw new Error('Sending is unavailable. Please copy your message below and email us.');
  const payload = {
    access_key:key,
    name:enquiry.name,
    email:enquiry.email,
    company:enquiry.company,
    service:enquiry.service,
    subject:enquiry.subject,
    message:fields.message.trim(),
    from_name:'THEAICOMP Website',
    botcheck:false
  };
  const response = await send('https://api.web3forms.com/submit', {
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(payload),
    signal
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 429) throw new Error('Too many attempts. Please wait a little before trying again, or email us directly.');
  if (!response.ok || result.success !== true) {
    throw new Error('We could not submit your enquiry. Please try again or copy your message below and email us.');
  }
  return {ok:true};
}
