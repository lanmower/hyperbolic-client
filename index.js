const sni = require("sni");
const net = require("net");
const b32 = require("hi-base32");
const DHT = require("@hyperswarm/dht");
const pump = require('pump');
const node = new DHT();
const fs = require('fs');
const http = require('http');
const httpProxy = require('http-proxy');

const path =  require("path");
const { WindowsToaster } = require("node-notifier");
const AppName = "hyperbolic-gate";
const executable = process.argv[0];
const SysTray = require('systray').default;
const systray = new SysTray({
    menu: {
        icon: "AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAnf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AXv8AhP8AXv8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AhP8AhP8AXv8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AhP8AhP8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AhP8AhP8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AhP8AhP8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AhP8AhP8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AhP8AhP8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AXv8AXv8AXv8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8Anf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        title: "",
        tooltip: "hyperbolic gateway",
        items: [{
            title: "Exit",
            tooltip: "exit hyperbolic gateway",
            checked: false,
            enabled: true
        }]
    },
    debug: false,
    copyDir: true,
})
 
systray.onClick(action => {
  console.log('test');
    if (action.seq_id === 0) {
        systray.kill();
    }
})
 
const snoreToastPath = executable.endsWith(".exe") ? path.resolve(executable, "../", "snoretoast-x64.exe") : null;
let notifierOptions = { withFallback: false, customPath: snoreToastPath };
const notifier = new WindowsToaster(notifierOptions);
const notification = { title: `${AppName}`, message: "Hyperbolic gate is running in the taskbar." };
notifier.notify(notification);

const node = new DHT({});

const http = require('http');
const httpProxy = require('http-proxy');

const child = require('child_process').exec(
    '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --host-resolver-rules="MAP *.matic.ml localhost"',
    function () { }
);


async function toArray(iterable) {
  const result = []
  for await (const data of iterable) result.push(data)
  return result
}
let mod = 0;
const tunnels = {};
const agent = new http.Agent(
  {
    maxSockets: Number.MAX_VALUE,
    keepAlive: true,
    keepAliveMsecs: 720000,
    timeout: 360000
  }
);
var proxy = httpProxy.createProxyServer({
  ws: true,
  agent: agent,
  timeout: 360000
});
const doServer = async function (req, res) {
  if (!req.headers.host) return;
  const split = req.headers.host.split('.');
  const publicKey = await getKey(split[split.length - 3]);
  if (!tunnels[publicKey]) {
    const port = 1337 + ((mod++) % 1000);
    try {
      var server = net.createServer(function (local) {
        const socket = node.connect(publicKey);
        socket.write('http');
        pump(local, socket, local);
      });
      server.listen(port, "127.0.0.1");
      tunnels[publicKey] = port;
      target = 'http://127.0.0.1:' + port;
    } catch (e) {
      console.trace(e);
      console.error(e);
    }
  } else {
    target = 'http://127.0.0.1:' + tunnels[publicKey]
  }
  proxy.web(req, res, {
    target
  }, function (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Cannot reach node ' + e.message);
  });

}
var server = http.createServer(doServer);
server.listen(80);
const known = {};
const getKey = async (name) => {
  let publicKey;
  let decoded = '';
  try { decoded = b32.decode.asBytes(name.toUpperCase()) } catch (e) {
    console.error(e)
  }
  if (decoded.length == 32) publicKey = Buffer.from(decoded);
  else {
    if(!known[name]) {
      try {
        known[name] = JSON.parse(fs.readFileSync('known/'+name));
        known[name].key = Buffer.from(known[name].key, 'hex');
      } catch(e) {}
    }
    if(known[name] && new Date().getTime() - known[name].last < 15*60*1000) {
	    return known[name].key;
    }
    const target = DHT.hash(Buffer.from(name));
    const result = await toArray(node.lookup(target));
    if (result.length > 0) {
      if(known[name]) {
        let foundknown;
        for(res of result) {
          for(peer of res.peers) {
              if(known[name.key] == peer.publicKey) {
                known[name].last = new Date().getTime();
                foundknown = true;
                known[name].key =known[name].key.toString('hex');
                fs.writeFileSync('known/'+name, JSON.stringify(known[name]));
              }
          }
        }
        if(!foundknown && new Date().getTime() - known[name].last > 60*60^1000*24) {
          known[name].key = Buffer.from(result[0].peers[0].publicKey);
          known[name].last = new Date().getTime();
          known[name].key =known[name].key.toString('hex');
          fs.writeFileSync('known/'+name, JSON.stringify(known[name]));
        }
      } else {
        known[name]={};
        known[name].key = Buffer.from(result[0].peers[0].publicKey);
        known[name].last = new Date().getTime();
        known[name].key =known[name].key.toString('hex');
        fs.writeFileSync('known/'+name, JSON.stringify(known[name]));
      }
      if(known[name]) return known[name].key;
    } else {
      console.log('no results');
    }
  }
  return publicKey;
}

net.createServer(function (local) {
  local.once("data", async function (data) {
    const server = sni(data);
    if (server) {
      const split = server.split('.');
      if (split[split.length - 3]) {
        const publicKey = await getKey(split[split.length - 3]);
        if (!publicKey) return;
        console.log(publicKey);
        const socket = node.connect(publicKey);
        socket.write('https');
        socket.write(data);
        pump(local, socket, local);
      }
    }
  });
}).listen(443);
console.log('created server')
