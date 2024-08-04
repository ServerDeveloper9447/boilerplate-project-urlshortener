require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns')
const db = new Map()

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/shorturl/:url',(req,res) => {
  if(!db.has(req.params.url)) return res.send(db.get(req.params.url));
  res.redirect(db.get(req.params.url))
})
app.post('/api/shorturl',(req,res) => {
  try {
  const url = new URL(req.body.url)
  dns.lookup(url.host,(err,add) => {
    if(!add) return res.status(400).send({ error: 'invalid url' });
    const size = db.size+1
    db.set(String(size), req.body.url)
    res.send({ original_url : req.body.url, short_url : size})
  })
  } catch(err) {
    res.status(400).send({ error: 'invalid url' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
