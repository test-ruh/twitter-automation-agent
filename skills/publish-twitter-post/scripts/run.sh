#!/usr/bin/env bash
set -euo pipefail
INPUT_FILE="${INPUT_FILE:-/dev/stdin}"
OUTPUT_FILE="${OUTPUT_FILE:-/tmp/publish-twitter-post_${RUN_ID}.json}"
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
python3 - "$INPUT_FILE" "$OUTPUT_FILE" <<'PY'
import base64,hashlib,hmac,json,os,random,string,time,urllib.parse,urllib.request,datetime,sys
inp,out=sys.argv[1:3]; data=json.load(open(inp)) if inp!='/dev/stdin' else json.load(sys.stdin)
if not data.get('eligible'): raise SystemExit('Queue row is not eligible for publishing.')
text=(data.get('content') or '').strip()
if not text: raise SystemExit('Queue row has no post content.')
url='https://api.twitter.com/2/tweets'; method='POST'
ck,cs,tk,ts=[os.environ[x] for x in ['TWITTER_API_KEY','TWITTER_API_SECRET','TWITTER_ACCESS_TOKEN','TWITTER_ACCESS_TOKEN_SECRET']]
oauth={'oauth_consumer_key':ck,'oauth_nonce':''.join(random.choice(string.ascii_letters+string.digits) for _ in range(32)),'oauth_signature_method':'HMAC-SHA1','oauth_timestamp':str(int(time.time())),'oauth_token':tk,'oauth_version':'1.0'}
base='&'.join([method,urllib.parse.quote(url,''),urllib.parse.quote('&'.join(f"{urllib.parse.quote(k,'')}={urllib.parse.quote(oauth[k],'')}" for k in sorted(oauth)),'')])
key=urllib.parse.quote(cs,'')+'&'+urllib.parse.quote(ts,''); oauth['oauth_signature']=base64.b64encode(hmac.new(key.encode(),base.encode(),hashlib.sha1).digest()).decode()
auth='OAuth '+', '.join(f'{k}="{urllib.parse.quote(v,"")}"' for k,v in oauth.items())
req=urllib.request.Request(url,data=json.dumps({'text':text}).encode(),headers={'Authorization':auth,'Content-Type':'application/json'},method='POST')
try: resp=json.load(urllib.request.urlopen(req))
except urllib.error.HTTPError as e:
    body=e.read().decode(errors='replace')[:700]; raise SystemExit(f"Twitter/X publish failed ({e.code}): {body}")
tid=str((resp.get('data') or {}).get('id') or '')
if not tid: raise SystemExit('Twitter/X did not return a tweet ID.')
res={**data,'status':'published','tweet_id':tid,'tweet_url':f'https://twitter.com/i/web/status/{tid}','published_at':datetime.datetime.utcnow().replace(microsecond=0).isoformat()+'Z','metadata':resp}
os.makedirs(os.path.dirname(out),exist_ok=True); json.dump(res,open(out,'w'))
PY
