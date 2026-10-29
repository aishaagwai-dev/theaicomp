const services = new Set([
  'UI/UX design', 'Full stack development', 'AI & data solutions',
  'Product or research collaboration', 'Something else'
]);

export function buildEnquiry(fields) {
  const clean = (value, max) => {
    if (value != null && typeof value !== 'string') throw new Error('Please check the form fields and try again.');
    const text = (value ?? '').trim();
    if (text.length > max) throw new Error('One of the form fields is too long. Please shorten it and try again.');
    return text;
  };
  const singleLine = (value, max) => clean(value, max).replace(/[\r\n]+/g, ' ');
  const name = singleLine(fields.name, 100);
  const email = singleLine(fields.email, 254);
  const company = singleLine(fields.company, 120);
  const subject = singleLine(fields.subject, 150);
  const service = clean(fields.service, 100);
  const message = clean(fields.message, 3000);
  if (!name || !subject || !services.has(service) || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please complete your name, a valid email address, service, subject and a message of at least 10 characters.');
  }
  const title = `Project enquiry: ${subject}`;
  const body = [
    'Hello THEAICOMP,', '', message, '',
    `Name: ${name}`, `Email: ${email}`,
    ...(company ? [`Company: ${company}`] : []),
    `Interested in: ${service}`
  ].join('\r\n');
  return {
    name, email, company, service, subject: title, body,
    text: `To: theaicompltd@gmail.com\r\nSubject: ${title}\r\n\r\n${body}`
  };
}
