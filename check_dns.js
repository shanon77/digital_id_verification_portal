const dns = require('dns');

const srvRecord = '_mongodb._tcp.cluster0.qzeyx02.mongodb.net';

dns.resolveSrv(srvRecord, (err, addresses) => {
  if (err) {
    console.error('DNS SRV Resolution Error:', err);
    return;
  }
  console.log('SRV Addresses:', JSON.stringify(addresses, null, 2));
});
