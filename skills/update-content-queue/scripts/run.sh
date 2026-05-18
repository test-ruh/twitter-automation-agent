#!/usr/bin/env bash
set -euo pipefail
INPUT_FILE="${INPUT_FILE:-/dev/stdin}"
OUTPUT_FILE="${OUTPUT_FILE:-/tmp/update-content-queue_${RUN_ID}.json}"
python3 - "$INPUT_FILE" "$OUTPUT_FILE" <<'PY'
import base64,json,os,subprocess,tempfile,time,urllib.request,urllib.parse,sys
inp,out=sys.argv[1:3]; d=json.load(open(inp)) if inp!='/dev/stdin' else json.load(sys.stdin)
if d.get('status')!='published' or not d.get('tweet_id'): raise SystemExit('Post is not confirmed as published, so the sheet was not marked complete.')
def b64(x): return base64.urlsafe_b64encode(x).rstrip(b'=').decode()
def token():
    now=int(time.time()); claim={"iss":os.environ['GOOGLE_SHEETS_CLIENT_EMAIL'],"scope":"https://www.googleapis.com/auth/spreadsheets","aud":"https://oauth2.googleapis.com/token","iat":now,"exp":now+3600}
    unsigned=b64(json.dumps({"alg":"RS256","typ":"JWT"},separators=(',',':')).encode())+'.'+b64(json.dumps(claim,separators=(',',':')).encode())
    key=os.environ['GOOGLE_SHEETS_PRIVATE_KEY'].replace('\\n','\n')
    with tempfile.NamedTemporaryFile('w',delete=False) as f: f.write(key); kp=f.name
    sig=subprocess.check_output(['openssl','dgst','-sha256','-sign',kp],input=unsigned.encode()); os.unlink(kp)
    body=urllib.parse.urlencode({'grant_type':'urn:ietf:params:oauth:grant-type:jwt-bearer','assertion':unsigned+'.'+b64(sig)}).encode()
    return json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token',data=body))['access_token']
spreadsheet=d.get('spreadsheet_id') or (d.get('source') or {}).get('spreadsheet_id')
row=d.get('row_number') or (d.get('source') or {}).get('row_number')
sheet=d.get('sheet_name') or (d.get('source') or {}).get('sheet_name') or 'Sheet1'
if not spreadsheet or not row: raise SystemExit('Missing Google Sheets spreadsheet_id or row_number for update.')
range_=f"{sheet}!B{row}:E{row}"
values=[["published",d['tweet_id'],d['tweet_url'],d.get('published_at','')]]
url=f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet}/values/{urllib.parse.quote(range_,safe='')}?valueInputOption=USER_ENTERED"
req=urllib.request.Request(url,data=json.dumps({'values':values}).encode(),headers={'Authorization':'Bearer '+token(),'Content-Type':'application/json'},method='PUT')
try: api=json.load(urllib.request.urlopen(req))
except urllib.error.HTTPError as e:
    body=e.read().decode(errors='replace')[:700]; raise SystemExit(f"Google Sheets update failed ({e.code}): {body}")
res={**d,'sheet_update_status':'updated','google_sheets_response':api}
os.makedirs(os.path.dirname(out),exist_ok=True); json.dump(res,open(out,'w'))
PY
