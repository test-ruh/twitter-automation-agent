#!/usr/bin/env bash
set -euo pipefail
INPUT_FILE="${INPUT_FILE:-/dev/stdin}"
OUTPUT_FILE="${OUTPUT_FILE:-/tmp/read-content-queue_${RUN_ID}.json}"
python3 - "$INPUT_FILE" "$OUTPUT_FILE" <<'PY'
import base64,json,os,subprocess,tempfile,time,urllib.request,urllib.parse,sys
inp,out=sys.argv[1:3]
payload=json.load(open(inp)) if inp!='/dev/stdin' else json.load(sys.stdin)
def b64(x): return base64.urlsafe_b64encode(x).rstrip(b'=').decode()
def token():
    now=int(time.time()); claim={"iss":os.environ['GOOGLE_SHEETS_CLIENT_EMAIL'],"scope":"https://www.googleapis.com/auth/spreadsheets","aud":"https://oauth2.googleapis.com/token","iat":now,"exp":now+3600}
    unsigned=b64(json.dumps({"alg":"RS256","typ":"JWT"},separators=(',',':')).encode())+'.'+b64(json.dumps(claim,separators=(',',':')).encode())
    key=os.environ['GOOGLE_SHEETS_PRIVATE_KEY'].replace('\\n','\n')
    with tempfile.NamedTemporaryFile('w',delete=False) as f: f.write(key); kp=f.name
    sig=subprocess.check_output(['openssl','dgst','-sha256','-sign',kp],input=unsigned.encode()); os.unlink(kp)
    data=urllib.parse.urlencode({'grant_type':'urn:ietf:params:oauth:grant-type:jwt-bearer','assertion':unsigned+'.'+b64(sig)}).encode()
    r=urllib.request.urlopen('https://oauth2.googleapis.com/token',data=data); return json.load(r)['access_token']
row=payload.get('row') or payload
if payload.get('spreadsheet_id') and payload.get('range'):
    req=urllib.request.Request(f"https://sheets.googleapis.com/v4/spreadsheets/{payload['spreadsheet_id']}/values/{urllib.parse.quote(payload['range'],safe='')}",headers={'Authorization':'Bearer '+token()})
    try: vals=json.load(urllib.request.urlopen(req)).get('values',[]); row = vals[0] if vals else row
    except urllib.error.HTTPError as e:
        body=e.read().decode(errors='replace')[:500]; raise SystemExit(f"Google Sheets read failed ({e.code}): {body}")
if isinstance(row,list):
    content=row[0] if len(row)>0 else ''; status=row[1] if len(row)>1 else ''
else:
    content=row.get('content') or row.get('post') or row.get('text') or ''; status=row.get('status','')
eligible=bool(content.strip()) and str(status).lower() in ('','queued','ready','pending')
res={"eligible":eligible,"sheet_row_id":str(payload.get('sheet_row_id') or payload.get('row_number') or payload.get('range') or ''),"content":content,"status":status,"spreadsheet_id":payload.get('spreadsheet_id'),"sheet_name":payload.get('sheet_name'),"row_number":payload.get('row_number'),"source":payload}
os.makedirs(os.path.dirname(out),exist_ok=True); json.dump(res,open(out,'w'))
PY
