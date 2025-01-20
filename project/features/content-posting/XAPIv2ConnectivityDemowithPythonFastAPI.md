<!-- https://github.dev/Promptly-Technologies-LLC/X_twitter_api_v2_demo -->


Project Structure:
├── LICENSE
├── README.md
├── app-flow.gif
├── example.env
├── main.py
├── poetry.lock
├── pyproject.toml
├── templates
│   └── index.html
├── uv.lock
└── x_twitter_api_v2_demo
    ├── __init__.py
    ├── auth.py
    ├── media.py
    ├── tweet.py
    └── utils.py


.python-version
```
1 | 3.12
```

main.py
```
1 | import os
2 | import re
3 | import logging
4 | import uuid
5 | from dotenv import load_dotenv
6 | from fastapi import FastAPI, Request, Form, File, UploadFile
7 | from fastapi.responses import HTMLResponse, RedirectResponse
8 | from fastapi.templating import Jinja2Templates
9 |
10 | from x_twitter_api_v2_demo.auth import (
11 |     generate_code_verifier,
12 |     generate_code_challenge,
13 |     create_oauth2_session,
14 | )
15 | from x_twitter_api_v2_demo.tweet import post_tweet
16 | from x_twitter_api_v2_demo.utils import get_temp_dir
17 |
18 | # Configure logging
19 | logger = logging.getLogger("uvicorn.error")
20 | logger.setLevel(logging.INFO)
21 |
22 | # Load environment variables
23 | load_dotenv()
24 |
25 | # FastAPI application
26 | app = FastAPI()
27 | templates = Jinja2Templates(directory="templates")
28 |
29 | # Global state
30 | oauth_states = {}
31 | code_verifier = generate_code_verifier()
32 | code_challenge = generate_code_challenge(code_verifier)
33 |
34 | @app.get("/", response_class=HTMLResponse)
35 | def show_form(request: Request):
36 |     """
37 |     Serve a basic form (index.html) for posting tweets.
38 |     """
39 |     return templates.TemplateResponse("index.html", {"request": request})
40 |
41 |
42 | @app.post("/", response_class=HTMLResponse)
43 | async def start_oauth(
44 |     request: Request,
45 |     text: str = Form(...),
46 |     image: UploadFile = File(None)
47 | ):
48 |     """
49 |     Handle the form submission:
50 |       - Save text and image.
51 |       - Begin OAuth flow with Twitter.
52 |     """
53 |     # Save the text and optional image in a newly generated state
54 |     state = str(uuid.uuid4())
55 |     data_to_store = {"text": text, "image_path": None}
56 |
57 |     if image and image.filename:
58 |         temp_dir = get_temp_dir()
59 |         image_path = os.path.join(temp_dir, image.filename)
60 |         with open(image_path, "wb") as buffer:
61 |             buffer.write(await image.read())
62 |         data_to_store["image_path"] = image_path
63 |
64 |     # Create an OAuth2Session and store relevant data
65 |     twitter_session = create_oauth2_session()
66 |     logger.info(f"Starting OAuth2 flow with Twitter")
67 |     assert code_challenge is not None, "Code challenge is not set"
68 |     authorization_url, oauth_state = twitter_session.authorization_url(
69 |         "https://twitter.com/i/oauth2/authorize",
70 |         code_challenge=code_challenge,
71 |         code_challenge_method="S256"
72 |     )
73 |
74 |     # Store everything in our global map keyed by the state from the library
75 |     oauth_states[oauth_state] = {
76 |         "text": data_to_store["text"],
77 |         "image_path": data_to_store["image_path"],
78 |         "twitter_session": twitter_session
79 |     }
80 |
81 |     # Redirect to Twitter's OAuth page
82 |     return RedirectResponse(authorization_url)
83 |
84 | @app.get("/oauth/callback", response_class=HTMLResponse)
85 | def callback(request: Request, code: str, state: str):
86 |     """
87 |     Callback route after user authenticates with Twitter.
88 |       - Exchange code for token.
89 |       - Post the tweet.
90 |     """
91 |     # Retrieve stored info for this state
92 |     if state not in oauth_states:
93 |         return HTMLResponse(content="Invalid state or session has expired.", status_code=400)
94 |
95 |     stored_data = oauth_states[state]
96 |     text = stored_data["text"]
97 |     image_path = stored_data["image_path"]
98 |     twitter_session = stored_data["twitter_session"]
99 |
100 |     # Exchange code for token
101 |     assert code_verifier is not None, "Code verifier is not set"
102 |     token = twitter_session.fetch_token(
103 |         token_url="https://api.x.com/2/oauth2/token",
104 |         client_id=os.environ.get("X_CLIENT_ID"),
105 |         client_secret=os.environ.get("X_CLIENT_SECRET"),
106 |         code_verifier=code_verifier,
107 |         code=code
108 |     )
109 |
110 |     # Post the tweet
111 |     response = post_tweet(text=text, media_path=image_path, new_token=token)
112 |
113 |     message = None
114 |     if response.ok:
115 |         message = "Tweet posted successfully!"
116 |     else:
117 |         try:
118 |             error_details = response.json()
119 |             if 'errors' in error_details:
120 |                 # Handle Twitter API specific error format
121 |                 error_messages = [error['message'] for error in error_details['errors']]
122 |                 message = f"Twitter API Error: {'; '.join(error_messages)}"
123 |             else:
124 |                 # Handle general API errors
125 |                 status_code = response.status_code
126 |                 if status_code == 429:
127 |                     message = "Rate limit exceeded. Please wait a few minutes and try again."
128 |                 else:
129 |                     # Get the most meaningful error detail
130 |                     detail = error_details.get('detail') or error_details.get('title') or response.reason
131 |                     message = f"Error ({status_code}): {detail}"
132 |         except ValueError:
133 |             message = f"Error ({response.status_code}): {response.reason}"
134 |
135 |         logger.error(f"Failed to post tweet: {response.status_code} {response.reason} - {response.text}")
136 |
137 |     # Attempt to extract the short t.co or x.com link from the returned tweet text
138 |     tweet_text = response.json().get("data", {}).get("text", "")
139 |     tweet_link_match = re.search(r"https://(?:t\.co|x\.com)/\w+", tweet_text)
140 |     tweet_link = tweet_link_match.group(0) if tweet_link_match else None
141 |
142 |     # Remove state data to avoid re-use or memory leaks
143 |     del oauth_states[state]
144 |
145 |     return templates.TemplateResponse(
146 |         "index.html",
147 |         {
148 |             "request": request,
149 |             "tweet_link": tweet_link,
150 |             "message": message
151 |         }
152 |     )
153 |
154 | # To run this app:
155 | #   uvicorn tweet:app --host 0.0.0.0 --port 5000
156 | if __name__ == "__main__":
157 |     import uvicorn
158 |     uvicorn.run(app, host="0.0.0.0", port=5000)
```

poetry.lock
```
1 | # This file is automatically @generated by Poetry 1.6.0 and should not be changed by hand.
2 |
3 | [[package]]
4 | name = "blinker"
5 | version = "1.6.3"
6 | description = "Fast, simple object-to-object and broadcast signaling"
7 | optional = false
8 | python-versions = ">=3.7"
9 | files = [
10 |     {file = "blinker-1.6.3-py3-none-any.whl", hash = "sha256:296320d6c28b006eb5e32d4712202dbcdcbf5dc482da298c2f44881c43884aaa"},
11 |     {file = "blinker-1.6.3.tar.gz", hash = "sha256:152090d27c1c5c722ee7e48504b02d76502811ce02e1523553b4cf8c8b3d3a8d"},
12 | ]
13 |
14 | [[package]]
15 | name = "certifi"
16 | version = "2023.7.22"
17 | description = "Python package for providing Mozilla's CA Bundle."
18 | optional = false
19 | python-versions = ">=3.6"
20 | files = [
21 |     {file = "certifi-2023.7.22-py3-none-any.whl", hash = "sha256:92d6037539857d8206b8f6ae472e8b77db8058fec5937a1ef3f54304089edbb9"},
22 |     {file = "certifi-2023.7.22.tar.gz", hash = "sha256:539cc1d13202e33ca466e88b2807e29f4c13049d6d87031a3c110744495cb082"},
23 | ]
24 |
25 | [[package]]
26 | name = "charset-normalizer"
27 | version = "3.3.0"
28 | description = "The Real First Universal Charset Detector. Open, modern and actively maintained alternative to Chardet."
29 | optional = false
30 | python-versions = ">=3.7.0"
31 | files = [
32 |     {file = "charset-normalizer-3.3.0.tar.gz", hash = "sha256:63563193aec44bce707e0c5ca64ff69fa72ed7cf34ce6e11d5127555756fd2f6"},
33 |     {file = "charset_normalizer-3.3.0-cp310-cp310-macosx_10_9_universal2.whl", hash = "sha256:effe5406c9bd748a871dbcaf3ac69167c38d72db8c9baf3ff954c344f31c4cbe"},
34 |     {file = "charset_normalizer-3.3.0-cp310-cp310-macosx_10_9_x86_64.whl", hash = "sha256:4162918ef3098851fcd8a628bf9b6a98d10c380725df9e04caf5ca6dd48c847a"},
35 |     {file = "charset_normalizer-3.3.0-cp310-cp310-macosx_11_0_arm64.whl", hash = "sha256:0570d21da019941634a531444364f2482e8db0b3425fcd5ac0c36565a64142c8"},
36 |     {file = "charset_normalizer-3.3.0-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:5707a746c6083a3a74b46b3a631d78d129edab06195a92a8ece755aac25a3f3d"},
37 |     {file = "charset_normalizer-3.3.0-cp310-cp310-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:278c296c6f96fa686d74eb449ea1697f3c03dc28b75f873b65b5201806346a69"},
38 |     {file = "charset_normalizer-3.3.0-cp310-cp310-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:a4b71f4d1765639372a3b32d2638197f5cd5221b19531f9245fcc9ee62d38f56"},
39 |     {file = "charset_normalizer-3.3.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:f5969baeaea61c97efa706b9b107dcba02784b1601c74ac84f2a532ea079403e"},
40 |     {file = "charset_normalizer-3.3.0-cp310-cp310-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:a3f93dab657839dfa61025056606600a11d0b696d79386f974e459a3fbc568ec"},
41 |     {file = "charset_normalizer-3.3.0-cp310-cp310-musllinux_1_1_aarch64.whl", hash = "sha256:db756e48f9c5c607b5e33dd36b1d5872d0422e960145b08ab0ec7fd420e9d649"},
42 |     {file = "charset_normalizer-3.3.0-cp310-cp310-musllinux_1_1_i686.whl", hash = "sha256:232ac332403e37e4a03d209a3f92ed9071f7d3dbda70e2a5e9cff1c4ba9f0678"},
43 |     {file = "charset_normalizer-3.3.0-cp310-cp310-musllinux_1_1_ppc64le.whl", hash = "sha256:e5c1502d4ace69a179305abb3f0bb6141cbe4714bc9b31d427329a95acfc8bdd"},
44 |     {file = "charset_normalizer-3.3.0-cp310-cp310-musllinux_1_1_s390x.whl", hash = "sha256:2502dd2a736c879c0f0d3e2161e74d9907231e25d35794584b1ca5284e43f596"},
45 |     {file = "charset_normalizer-3.3.0-cp310-cp310-musllinux_1_1_x86_64.whl", hash = "sha256:23e8565ab7ff33218530bc817922fae827420f143479b753104ab801145b1d5b"},
46 |     {file = "charset_normalizer-3.3.0-cp310-cp310-win32.whl", hash = "sha256:1872d01ac8c618a8da634e232f24793883d6e456a66593135aeafe3784b0848d"},
47 |     {file = "charset_normalizer-3.3.0-cp310-cp310-win_amd64.whl", hash = "sha256:557b21a44ceac6c6b9773bc65aa1b4cc3e248a5ad2f5b914b91579a32e22204d"},
48 |     {file = "charset_normalizer-3.3.0-cp311-cp311-macosx_10_9_universal2.whl", hash = "sha256:d7eff0f27edc5afa9e405f7165f85a6d782d308f3b6b9d96016c010597958e63"},
49 |     {file = "charset_normalizer-3.3.0-cp311-cp311-macosx_10_9_x86_64.whl", hash = "sha256:6a685067d05e46641d5d1623d7c7fdf15a357546cbb2f71b0ebde91b175ffc3e"},
50 |     {file = "charset_normalizer-3.3.0-cp311-cp311-macosx_11_0_arm64.whl", hash = "sha256:0d3d5b7db9ed8a2b11a774db2bbea7ba1884430a205dbd54a32d61d7c2a190fa"},
51 |     {file = "charset_normalizer-3.3.0-cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:2935ffc78db9645cb2086c2f8f4cfd23d9b73cc0dc80334bc30aac6f03f68f8c"},
52 |     {file = "charset_normalizer-3.3.0-cp311-cp311-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:9fe359b2e3a7729010060fbca442ca225280c16e923b37db0e955ac2a2b72a05"},
53 |     {file = "charset_normalizer-3.3.0-cp311-cp311-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:380c4bde80bce25c6e4f77b19386f5ec9db230df9f2f2ac1e5ad7af2caa70459"},
54 |     {file = "charset_normalizer-3.3.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:f0d1e3732768fecb052d90d62b220af62ead5748ac51ef61e7b32c266cac9293"},
55 |     {file = "charset_normalizer-3.3.0-cp311-cp311-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:1b2919306936ac6efb3aed1fbf81039f7087ddadb3160882a57ee2ff74fd2382"},
56 |     {file = "charset_normalizer-3.3.0-cp311-cp311-musllinux_1_1_aarch64.whl", hash = "sha256:f8888e31e3a85943743f8fc15e71536bda1c81d5aa36d014a3c0c44481d7db6e"},
57 |     {file = "charset_normalizer-3.3.0-cp311-cp311-musllinux_1_1_i686.whl", hash = "sha256:82eb849f085624f6a607538ee7b83a6d8126df6d2f7d3b319cb837b289123078"},
58 |     {file = "charset_normalizer-3.3.0-cp311-cp311-musllinux_1_1_ppc64le.whl", hash = "sha256:7b8b8bf1189b3ba9b8de5c8db4d541b406611a71a955bbbd7385bbc45fcb786c"},
59 |     {file = "charset_normalizer-3.3.0-cp311-cp311-musllinux_1_1_s390x.whl", hash = "sha256:5adf257bd58c1b8632046bbe43ee38c04e1038e9d37de9c57a94d6bd6ce5da34"},
60 |     {file = "charset_normalizer-3.3.0-cp311-cp311-musllinux_1_1_x86_64.whl", hash = "sha256:c350354efb159b8767a6244c166f66e67506e06c8924ed74669b2c70bc8735b1"},
61 |     {file = "charset_normalizer-3.3.0-cp311-cp311-win32.whl", hash = "sha256:02af06682e3590ab952599fbadac535ede5d60d78848e555aa58d0c0abbde786"},
62 |     {file = "charset_normalizer-3.3.0-cp311-cp311-win_amd64.whl", hash = "sha256:86d1f65ac145e2c9ed71d8ffb1905e9bba3a91ae29ba55b4c46ae6fc31d7c0d4"},
63 |     {file = "charset_normalizer-3.3.0-cp312-cp312-macosx_10_9_universal2.whl", hash = "sha256:3b447982ad46348c02cb90d230b75ac34e9886273df3a93eec0539308a6296d7"},
64 |     {file = "charset_normalizer-3.3.0-cp312-cp312-macosx_10_9_x86_64.whl", hash = "sha256:abf0d9f45ea5fb95051c8bfe43cb40cda383772f7e5023a83cc481ca2604d74e"},
65 |     {file = "charset_normalizer-3.3.0-cp312-cp312-macosx_11_0_arm64.whl", hash = "sha256:b09719a17a2301178fac4470d54b1680b18a5048b481cb8890e1ef820cb80455"},
66 |     {file = "charset_normalizer-3.3.0-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:b3d9b48ee6e3967b7901c052b670c7dda6deb812c309439adaffdec55c6d7b78"},
67 |     {file = "charset_normalizer-3.3.0-cp312-cp312-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:edfe077ab09442d4ef3c52cb1f9dab89bff02f4524afc0acf2d46be17dc479f5"},
68 |     {file = "charset_normalizer-3.3.0-cp312-cp312-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:3debd1150027933210c2fc321527c2299118aa929c2f5a0a80ab6953e3bd1908"},
69 |     {file = "charset_normalizer-3.3.0-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:86f63face3a527284f7bb8a9d4f78988e3c06823f7bea2bd6f0e0e9298ca0403"},
70 |     {file = "charset_normalizer-3.3.0-cp312-cp312-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:24817cb02cbef7cd499f7c9a2735286b4782bd47a5b3516a0e84c50eab44b98e"},
71 |     {file = "charset_normalizer-3.3.0-cp312-cp312-musllinux_1_1_aarch64.whl", hash = "sha256:c71f16da1ed8949774ef79f4a0260d28b83b3a50c6576f8f4f0288d109777989"},
72 |     {file = "charset_normalizer-3.3.0-cp312-cp312-musllinux_1_1_i686.whl", hash = "sha256:9cf3126b85822c4e53aa28c7ec9869b924d6fcfb76e77a45c44b83d91afd74f9"},
73 |     {file = "charset_normalizer-3.3.0-cp312-cp312-musllinux_1_1_ppc64le.whl", hash = "sha256:b3b2316b25644b23b54a6f6401074cebcecd1244c0b8e80111c9a3f1c8e83d65"},
74 |     {file = "charset_normalizer-3.3.0-cp312-cp312-musllinux_1_1_s390x.whl", hash = "sha256:03680bb39035fbcffe828eae9c3f8afc0428c91d38e7d61aa992ef7a59fb120e"},
75 |     {file = "charset_normalizer-3.3.0-cp312-cp312-musllinux_1_1_x86_64.whl", hash = "sha256:4cc152c5dd831641e995764f9f0b6589519f6f5123258ccaca8c6d34572fefa8"},
76 |     {file = "charset_normalizer-3.3.0-cp312-cp312-win32.whl", hash = "sha256:b8f3307af845803fb0b060ab76cf6dd3a13adc15b6b451f54281d25911eb92df"},
77 |     {file = "charset_normalizer-3.3.0-cp312-cp312-win_amd64.whl", hash = "sha256:8eaf82f0eccd1505cf39a45a6bd0a8cf1c70dcfc30dba338207a969d91b965c0"},
78 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-macosx_10_9_x86_64.whl", hash = "sha256:dc45229747b67ffc441b3de2f3ae5e62877a282ea828a5bdb67883c4ee4a8810"},
79 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:2f4a0033ce9a76e391542c182f0d48d084855b5fcba5010f707c8e8c34663d77"},
80 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:ada214c6fa40f8d800e575de6b91a40d0548139e5dc457d2ebb61470abf50186"},
81 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:b1121de0e9d6e6ca08289583d7491e7fcb18a439305b34a30b20d8215922d43c"},
82 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:1063da2c85b95f2d1a430f1c33b55c9c17ffaf5e612e10aeaad641c55a9e2b9d"},
83 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:70f1d09c0d7748b73290b29219e854b3207aea922f839437870d8cc2168e31cc"},
84 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-musllinux_1_1_aarch64.whl", hash = "sha256:250c9eb0f4600361dd80d46112213dff2286231d92d3e52af1e5a6083d10cad9"},
85 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-musllinux_1_1_i686.whl", hash = "sha256:750b446b2ffce1739e8578576092179160f6d26bd5e23eb1789c4d64d5af7dc7"},
86 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-musllinux_1_1_ppc64le.whl", hash = "sha256:fc52b79d83a3fe3a360902d3f5d79073a993597d48114c29485e9431092905d8"},
87 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-musllinux_1_1_s390x.whl", hash = "sha256:588245972aca710b5b68802c8cad9edaa98589b1b42ad2b53accd6910dad3545"},
88 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-musllinux_1_1_x86_64.whl", hash = "sha256:e39c7eb31e3f5b1f88caff88bcff1b7f8334975b46f6ac6e9fc725d829bc35d4"},
89 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-win32.whl", hash = "sha256:abecce40dfebbfa6abf8e324e1860092eeca6f7375c8c4e655a8afb61af58f2c"},
90 |     {file = "charset_normalizer-3.3.0-cp37-cp37m-win_amd64.whl", hash = "sha256:24a91a981f185721542a0b7c92e9054b7ab4fea0508a795846bc5b0abf8118d4"},
91 |     {file = "charset_normalizer-3.3.0-cp38-cp38-macosx_10_9_universal2.whl", hash = "sha256:67b8cc9574bb518ec76dc8e705d4c39ae78bb96237cb533edac149352c1f39fe"},
92 |     {file = "charset_normalizer-3.3.0-cp38-cp38-macosx_10_9_x86_64.whl", hash = "sha256:ac71b2977fb90c35d41c9453116e283fac47bb9096ad917b8819ca8b943abecd"},
93 |     {file = "charset_normalizer-3.3.0-cp38-cp38-macosx_11_0_arm64.whl", hash = "sha256:3ae38d325b512f63f8da31f826e6cb6c367336f95e418137286ba362925c877e"},
94 |     {file = "charset_normalizer-3.3.0-cp38-cp38-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:542da1178c1c6af8873e143910e2269add130a299c9106eef2594e15dae5e482"},
95 |     {file = "charset_normalizer-3.3.0-cp38-cp38-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:30a85aed0b864ac88309b7d94be09f6046c834ef60762a8833b660139cfbad13"},
96 |     {file = "charset_normalizer-3.3.0-cp38-cp38-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:aae32c93e0f64469f74ccc730a7cb21c7610af3a775157e50bbd38f816536b38"},
97 |     {file = "charset_normalizer-3.3.0-cp38-cp38-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:15b26ddf78d57f1d143bdf32e820fd8935d36abe8a25eb9ec0b5a71c82eb3895"},
98 |     {file = "charset_normalizer-3.3.0-cp38-cp38-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:7f5d10bae5d78e4551b7be7a9b29643a95aded9d0f602aa2ba584f0388e7a557"},
99 |     {file = "charset_normalizer-3.3.0-cp38-cp38-musllinux_1_1_aarch64.whl", hash = "sha256:249c6470a2b60935bafd1d1d13cd613f8cd8388d53461c67397ee6a0f5dce741"},
100 |     {file = "charset_normalizer-3.3.0-cp38-cp38-musllinux_1_1_i686.whl", hash = "sha256:c5a74c359b2d47d26cdbbc7845e9662d6b08a1e915eb015d044729e92e7050b7"},
101 |     {file = "charset_normalizer-3.3.0-cp38-cp38-musllinux_1_1_ppc64le.whl", hash = "sha256:b5bcf60a228acae568e9911f410f9d9e0d43197d030ae5799e20dca8df588287"},
102 |     {file = "charset_normalizer-3.3.0-cp38-cp38-musllinux_1_1_s390x.whl", hash = "sha256:187d18082694a29005ba2944c882344b6748d5be69e3a89bf3cc9d878e548d5a"},
103 |     {file = "charset_normalizer-3.3.0-cp38-cp38-musllinux_1_1_x86_64.whl", hash = "sha256:81bf654678e575403736b85ba3a7867e31c2c30a69bc57fe88e3ace52fb17b89"},
104 |     {file = "charset_normalizer-3.3.0-cp38-cp38-win32.whl", hash = "sha256:85a32721ddde63c9df9ebb0d2045b9691d9750cb139c161c80e500d210f5e26e"},
105 |     {file = "charset_normalizer-3.3.0-cp38-cp38-win_amd64.whl", hash = "sha256:468d2a840567b13a590e67dd276c570f8de00ed767ecc611994c301d0f8c014f"},
106 |     {file = "charset_normalizer-3.3.0-cp39-cp39-macosx_10_9_universal2.whl", hash = "sha256:e0fc42822278451bc13a2e8626cf2218ba570f27856b536e00cfa53099724828"},
107 |     {file = "charset_normalizer-3.3.0-cp39-cp39-macosx_10_9_x86_64.whl", hash = "sha256:09c77f964f351a7369cc343911e0df63e762e42bac24cd7d18525961c81754f4"},
108 |     {file = "charset_normalizer-3.3.0-cp39-cp39-macosx_11_0_arm64.whl", hash = "sha256:12ebea541c44fdc88ccb794a13fe861cc5e35d64ed689513a5c03d05b53b7c82"},
109 |     {file = "charset_normalizer-3.3.0-cp39-cp39-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:805dfea4ca10411a5296bcc75638017215a93ffb584c9e344731eef0dcfb026a"},
110 |     {file = "charset_normalizer-3.3.0-cp39-cp39-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:96c2b49eb6a72c0e4991d62406e365d87067ca14c1a729a870d22354e6f68115"},
111 |     {file = "charset_normalizer-3.3.0-cp39-cp39-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:aaf7b34c5bc56b38c931a54f7952f1ff0ae77a2e82496583b247f7c969eb1479"},
112 |     {file = "charset_normalizer-3.3.0-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:619d1c96099be5823db34fe89e2582b336b5b074a7f47f819d6b3a57ff7bdb86"},
113 |     {file = "charset_normalizer-3.3.0-cp39-cp39-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:a0ac5e7015a5920cfce654c06618ec40c33e12801711da6b4258af59a8eff00a"},
114 |     {file = "charset_normalizer-3.3.0-cp39-cp39-musllinux_1_1_aarch64.whl", hash = "sha256:93aa7eef6ee71c629b51ef873991d6911b906d7312c6e8e99790c0f33c576f89"},
115 |     {file = "charset_normalizer-3.3.0-cp39-cp39-musllinux_1_1_i686.whl", hash = "sha256:7966951325782121e67c81299a031f4c115615e68046f79b85856b86ebffc4cd"},
116 |     {file = "charset_normalizer-3.3.0-cp39-cp39-musllinux_1_1_ppc64le.whl", hash = "sha256:02673e456dc5ab13659f85196c534dc596d4ef260e4d86e856c3b2773ce09843"},
117 |     {file = "charset_normalizer-3.3.0-cp39-cp39-musllinux_1_1_s390x.whl", hash = "sha256:c2af80fb58f0f24b3f3adcb9148e6203fa67dd3f61c4af146ecad033024dde43"},
118 |     {file = "charset_normalizer-3.3.0-cp39-cp39-musllinux_1_1_x86_64.whl", hash = "sha256:153e7b6e724761741e0974fc4dcd406d35ba70b92bfe3fedcb497226c93b9da7"},
119 |     {file = "charset_normalizer-3.3.0-cp39-cp39-win32.whl", hash = "sha256:d47ecf253780c90ee181d4d871cd655a789da937454045b17b5798da9393901a"},
120 |     {file = "charset_normalizer-3.3.0-cp39-cp39-win_amd64.whl", hash = "sha256:d97d85fa63f315a8bdaba2af9a6a686e0eceab77b3089af45133252618e70884"},
121 |     {file = "charset_normalizer-3.3.0-py3-none-any.whl", hash = "sha256:e46cd37076971c1040fc8c41273a8b3e2c624ce4f2be3f5dfcb7a430c1d3acc2"},
122 | ]
123 |
124 | [[package]]
125 | name = "click"
126 | version = "8.1.7"
127 | description = "Composable command line interface toolkit"
128 | optional = false
129 | python-versions = ">=3.7"
130 | files = [
131 |     {file = "click-8.1.7-py3-none-any.whl", hash = "sha256:ae74fb96c20a0277a1d615f1e4d73c8414f5a98db8b799a7931d1582f3390c28"},
132 |     {file = "click-8.1.7.tar.gz", hash = "sha256:ca9853ad459e787e2192211578cc907e7594e294c7ccc834310722b41b9ca6de"},
133 | ]
134 |
135 | [package.dependencies]
136 | colorama = {version = "*", markers = "platform_system == \"Windows\""}
137 |
138 | [[package]]
139 | name = "colorama"
140 | version = "0.4.6"
141 | description = "Cross-platform colored terminal text."
142 | optional = false
143 | python-versions = "!=3.0.*,!=3.1.*,!=3.2.*,!=3.3.*,!=3.4.*,!=3.5.*,!=3.6.*,>=2.7"
144 | files = [
145 |     {file = "colorama-0.4.6-py2.py3-none-any.whl", hash = "sha256:4f1d9991f5acc0ca119f9d443620b77f9d6b33703e51011c16baf57afb285fc6"},
146 |     {file = "colorama-0.4.6.tar.gz", hash = "sha256:08695f5cb7ed6e0531a20572697297273c47b8cae5a63ffc6d6ed5c201be6e44"},
147 | ]
148 |
149 | [[package]]
150 | name = "flask"
151 | version = "3.0.0"
152 | description = "A simple framework for building complex web applications."
153 | optional = false
154 | python-versions = ">=3.8"
155 | files = [
156 |     {file = "flask-3.0.0-py3-none-any.whl", hash = "sha256:21128f47e4e3b9d597a3e8521a329bf56909b690fcc3fa3e477725aa81367638"},
157 |     {file = "flask-3.0.0.tar.gz", hash = "sha256:cfadcdb638b609361d29ec22360d6070a77d7463dcb3ab08d2c2f2f168845f58"},
158 | ]
159 |
160 | [package.dependencies]
161 | blinker = ">=1.6.2"
162 | click = ">=8.1.3"
163 | itsdangerous = ">=2.1.2"
164 | Jinja2 = ">=3.1.2"
165 | Werkzeug = ">=3.0.0"
166 |
167 | [package.extras]
168 | async = ["asgiref (>=3.2)"]
169 | dotenv = ["python-dotenv"]
170 |
171 | [[package]]
172 | name = "idna"
173 | version = "3.4"
174 | description = "Internationalized Domain Names in Applications (IDNA)"
175 | optional = false
176 | python-versions = ">=3.5"
177 | files = [
178 |     {file = "idna-3.4-py3-none-any.whl", hash = "sha256:90b77e79eaa3eba6de819a0c442c0b4ceefc341a7a2ab77d7562bf49f425c5c2"},
179 |     {file = "idna-3.4.tar.gz", hash = "sha256:814f528e8dead7d329833b91c5faa87d60bf71824cd12a7530b5526063d02cb4"},
180 | ]
181 |
182 | [[package]]
183 | name = "itsdangerous"
184 | version = "2.1.2"
185 | description = "Safely pass data to untrusted environments and back."
186 | optional = false
187 | python-versions = ">=3.7"
188 | files = [
189 |     {file = "itsdangerous-2.1.2-py3-none-any.whl", hash = "sha256:2c2349112351b88699d8d4b6b075022c0808887cb7ad10069318a8b0bc88db44"},
190 |     {file = "itsdangerous-2.1.2.tar.gz", hash = "sha256:5dbbc68b317e5e42f327f9021763545dc3fc3bfe22e6deb96aaf1fc38874156a"},
191 | ]
192 |
193 | [[package]]
194 | name = "jinja2"
195 | version = "3.1.2"
196 | description = "A very fast and expressive template engine."
197 | optional = false
198 | python-versions = ">=3.7"
199 | files = [
200 |     {file = "Jinja2-3.1.2-py3-none-any.whl", hash = "sha256:6088930bfe239f0e6710546ab9c19c9ef35e29792895fed6e6e31a023a182a61"},
201 |     {file = "Jinja2-3.1.2.tar.gz", hash = "sha256:31351a702a408a9e7595a8fc6150fc3f43bb6bf7e319770cbc0db9df9437e852"},
202 | ]
203 |
204 | [package.dependencies]
205 | MarkupSafe = ">=2.0"
206 |
207 | [package.extras]
208 | i18n = ["Babel (>=2.7)"]
209 |
210 | [[package]]
211 | name = "markupsafe"
212 | version = "2.1.3"
213 | description = "Safely add untrusted strings to HTML/XML markup."
214 | optional = false
215 | python-versions = ">=3.7"
216 | files = [
217 |     {file = "MarkupSafe-2.1.3-cp310-cp310-macosx_10_9_universal2.whl", hash = "sha256:cd0f502fe016460680cd20aaa5a76d241d6f35a1c3350c474bac1273803893fa"},
218 |     {file = "MarkupSafe-2.1.3-cp310-cp310-macosx_10_9_x86_64.whl", hash = "sha256:e09031c87a1e51556fdcb46e5bd4f59dfb743061cf93c4d6831bf894f125eb57"},
219 |     {file = "MarkupSafe-2.1.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:68e78619a61ecf91e76aa3e6e8e33fc4894a2bebe93410754bd28fce0a8a4f9f"},
220 |     {file = "MarkupSafe-2.1.3-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:65c1a9bcdadc6c28eecee2c119465aebff8f7a584dd719facdd9e825ec61ab52"},
221 |     {file = "MarkupSafe-2.1.3-cp310-cp310-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:525808b8019e36eb524b8c68acdd63a37e75714eac50e988180b169d64480a00"},
222 |     {file = "MarkupSafe-2.1.3-cp310-cp310-musllinux_1_1_aarch64.whl", hash = "sha256:962f82a3086483f5e5f64dbad880d31038b698494799b097bc59c2edf392fce6"},
223 |     {file = "MarkupSafe-2.1.3-cp310-cp310-musllinux_1_1_i686.whl", hash = "sha256:aa7bd130efab1c280bed0f45501b7c8795f9fdbeb02e965371bbef3523627779"},
224 |     {file = "MarkupSafe-2.1.3-cp310-cp310-musllinux_1_1_x86_64.whl", hash = "sha256:c9c804664ebe8f83a211cace637506669e7890fec1b4195b505c214e50dd4eb7"},
225 |     {file = "MarkupSafe-2.1.3-cp310-cp310-win32.whl", hash = "sha256:10bbfe99883db80bdbaff2dcf681dfc6533a614f700da1287707e8a5d78a8431"},
226 |     {file = "MarkupSafe-2.1.3-cp310-cp310-win_amd64.whl", hash = "sha256:1577735524cdad32f9f694208aa75e422adba74f1baee7551620e43a3141f559"},
227 |     {file = "MarkupSafe-2.1.3-cp311-cp311-macosx_10_9_universal2.whl", hash = "sha256:ad9e82fb8f09ade1c3e1b996a6337afac2b8b9e365f926f5a61aacc71adc5b3c"},
228 |     {file = "MarkupSafe-2.1.3-cp311-cp311-macosx_10_9_x86_64.whl", hash = "sha256:3c0fae6c3be832a0a0473ac912810b2877c8cb9d76ca48de1ed31e1c68386575"},
229 |     {file = "MarkupSafe-2.1.3-cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:b076b6226fb84157e3f7c971a47ff3a679d837cf338547532ab866c57930dbee"},
230 |     {file = "MarkupSafe-2.1.3-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:bfce63a9e7834b12b87c64d6b155fdd9b3b96191b6bd334bf37db7ff1fe457f2"},
231 |     {file = "MarkupSafe-2.1.3-cp311-cp311-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:338ae27d6b8745585f87218a3f23f1512dbf52c26c28e322dbe54bcede54ccb9"},
232 |     {file = "MarkupSafe-2.1.3-cp311-cp311-musllinux_1_1_aarch64.whl", hash = "sha256:e4dd52d80b8c83fdce44e12478ad2e85c64ea965e75d66dbeafb0a3e77308fcc"},
233 |     {file = "MarkupSafe-2.1.3-cp311-cp311-musllinux_1_1_i686.whl", hash = "sha256:df0be2b576a7abbf737b1575f048c23fb1d769f267ec4358296f31c2479db8f9"},
234 |     {file = "MarkupSafe-2.1.3-cp311-cp311-musllinux_1_1_x86_64.whl", hash = "sha256:5bbe06f8eeafd38e5d0a4894ffec89378b6c6a625ff57e3028921f8ff59318ac"},
235 |     {file = "MarkupSafe-2.1.3-cp311-cp311-win32.whl", hash = "sha256:dd15ff04ffd7e05ffcb7fe79f1b98041b8ea30ae9234aed2a9168b5797c3effb"},
236 |     {file = "MarkupSafe-2.1.3-cp311-cp311-win_amd64.whl", hash = "sha256:134da1eca9ec0ae528110ccc9e48041e0828d79f24121a1a146161103c76e686"},
237 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-macosx_10_9_x86_64.whl", hash = "sha256:8e254ae696c88d98da6555f5ace2279cf7cd5b3f52be2b5cf97feafe883b58d2"},
238 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:cb0932dc158471523c9637e807d9bfb93e06a95cbf010f1a38b98623b929ef2b"},
239 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:9402b03f1a1b4dc4c19845e5c749e3ab82d5078d16a2a4c2cd2df62d57bb0707"},
240 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:ca379055a47383d02a5400cb0d110cef0a776fc644cda797db0c5696cfd7e18e"},
241 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-musllinux_1_1_aarch64.whl", hash = "sha256:b7ff0f54cb4ff66dd38bebd335a38e2c22c41a8ee45aa608efc890ac3e3931bc"},
242 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-musllinux_1_1_i686.whl", hash = "sha256:c011a4149cfbcf9f03994ec2edffcb8b1dc2d2aede7ca243746df97a5d41ce48"},
243 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-musllinux_1_1_x86_64.whl", hash = "sha256:56d9f2ecac662ca1611d183feb03a3fa4406469dafe241673d521dd5ae92a155"},
244 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-win32.whl", hash = "sha256:8758846a7e80910096950b67071243da3e5a20ed2546e6392603c096778d48e0"},
245 |     {file = "MarkupSafe-2.1.3-cp37-cp37m-win_amd64.whl", hash = "sha256:787003c0ddb00500e49a10f2844fac87aa6ce977b90b0feaaf9de23c22508b24"},
246 |     {file = "MarkupSafe-2.1.3-cp38-cp38-macosx_10_9_universal2.whl", hash = "sha256:2ef12179d3a291be237280175b542c07a36e7f60718296278d8593d21ca937d4"},
247 |     {file = "MarkupSafe-2.1.3-cp38-cp38-macosx_10_9_x86_64.whl", hash = "sha256:2c1b19b3aaacc6e57b7e25710ff571c24d6c3613a45e905b1fde04d691b98ee0"},
248 |     {file = "MarkupSafe-2.1.3-cp38-cp38-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:8afafd99945ead6e075b973fefa56379c5b5c53fd8937dad92c662da5d8fd5ee"},
249 |     {file = "MarkupSafe-2.1.3-cp38-cp38-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:8c41976a29d078bb235fea9b2ecd3da465df42a562910f9022f1a03107bd02be"},
250 |     {file = "MarkupSafe-2.1.3-cp38-cp38-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:d080e0a5eb2529460b30190fcfcc4199bd7f827663f858a226a81bc27beaa97e"},
251 |     {file = "MarkupSafe-2.1.3-cp38-cp38-musllinux_1_1_aarch64.whl", hash = "sha256:69c0f17e9f5a7afdf2cc9fb2d1ce6aabdb3bafb7f38017c0b77862bcec2bbad8"},
252 |     {file = "MarkupSafe-2.1.3-cp38-cp38-musllinux_1_1_i686.whl", hash = "sha256:504b320cd4b7eff6f968eddf81127112db685e81f7e36e75f9f84f0df46041c3"},
253 |     {file = "MarkupSafe-2.1.3-cp38-cp38-musllinux_1_1_x86_64.whl", hash = "sha256:42de32b22b6b804f42c5d98be4f7e5e977ecdd9ee9b660fda1a3edf03b11792d"},
254 |     {file = "MarkupSafe-2.1.3-cp38-cp38-win32.whl", hash = "sha256:ceb01949af7121f9fc39f7d27f91be8546f3fb112c608bc4029aef0bab86a2a5"},
255 |     {file = "MarkupSafe-2.1.3-cp38-cp38-win_amd64.whl", hash = "sha256:1b40069d487e7edb2676d3fbdb2b0829ffa2cd63a2ec26c4938b2d34391b4ecc"},
256 |     {file = "MarkupSafe-2.1.3-cp39-cp39-macosx_10_9_universal2.whl", hash = "sha256:8023faf4e01efadfa183e863fefde0046de576c6f14659e8782065bcece22198"},
257 |     {file = "MarkupSafe-2.1.3-cp39-cp39-macosx_10_9_x86_64.whl", hash = "sha256:6b2b56950d93e41f33b4223ead100ea0fe11f8e6ee5f641eb753ce4b77a7042b"},
258 |     {file = "MarkupSafe-2.1.3-cp39-cp39-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:9dcdfd0eaf283af041973bff14a2e143b8bd64e069f4c383416ecd79a81aab58"},
259 |     {file = "MarkupSafe-2.1.3-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:05fb21170423db021895e1ea1e1f3ab3adb85d1c2333cbc2310f2a26bc77272e"},
260 |     {file = "MarkupSafe-2.1.3-cp39-cp39-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:282c2cb35b5b673bbcadb33a585408104df04f14b2d9b01d4c345a3b92861c2c"},
261 |     {file = "MarkupSafe-2.1.3-cp39-cp39-musllinux_1_1_aarch64.whl", hash = "sha256:ab4a0df41e7c16a1392727727e7998a467472d0ad65f3ad5e6e765015df08636"},
262 |     {file = "MarkupSafe-2.1.3-cp39-cp39-musllinux_1_1_i686.whl", hash = "sha256:7ef3cb2ebbf91e330e3bb937efada0edd9003683db6b57bb108c4001f37a02ea"},
263 |     {file = "MarkupSafe-2.1.3-cp39-cp39-musllinux_1_1_x86_64.whl", hash = "sha256:0a4e4a1aff6c7ac4cd55792abf96c915634c2b97e3cc1c7129578aa68ebd754e"},
264 |     {file = "MarkupSafe-2.1.3-cp39-cp39-win32.whl", hash = "sha256:fec21693218efe39aa7f8599346e90c705afa52c5b31ae019b2e57e8f6542bb2"},
265 |     {file = "MarkupSafe-2.1.3-cp39-cp39-win_amd64.whl", hash = "sha256:3fd4abcb888d15a94f32b75d8fd18ee162ca0c064f35b11134be77050296d6ba"},
266 |     {file = "MarkupSafe-2.1.3.tar.gz", hash = "sha256:af598ed32d6ae86f1b747b82783958b1a4ab8f617b06fe68795c7f026abbdcad"},
267 | ]
268 |
269 | [[package]]
270 | name = "oauthlib"
271 | version = "3.2.2"
272 | description = "A generic, spec-compliant, thorough implementation of the OAuth request-signing logic"
273 | optional = false
274 | python-versions = ">=3.6"
275 | files = [
276 |     {file = "oauthlib-3.2.2-py3-none-any.whl", hash = "sha256:8139f29aac13e25d502680e9e19963e83f16838d48a0d71c287fe40e7067fbca"},
277 |     {file = "oauthlib-3.2.2.tar.gz", hash = "sha256:9859c40929662bec5d64f34d01c99e093149682a3f38915dc0655d5a633dd918"},
278 | ]
279 |
280 | [package.extras]
281 | rsa = ["cryptography (>=3.0.0)"]
282 | signals = ["blinker (>=1.4.0)"]
283 | signedtoken = ["cryptography (>=3.0.0)", "pyjwt (>=2.0.0,<3)"]
284 |
285 | [[package]]
286 | name = "python-dotenv"
287 | version = "1.0.0"
288 | description = "Read key-value pairs from a .env file and set them as environment variables"
289 | optional = false
290 | python-versions = ">=3.8"
291 | files = [
292 |     {file = "python-dotenv-1.0.0.tar.gz", hash = "sha256:a8df96034aae6d2d50a4ebe8216326c61c3eb64836776504fcca410e5937a3ba"},
293 |     {file = "python_dotenv-1.0.0-py3-none-any.whl", hash = "sha256:f5971a9226b701070a4bf2c38c89e5a3f0d64de8debda981d1db98583009122a"},
294 | ]
295 |
296 | [package.extras]
297 | cli = ["click (>=5.0)"]
298 |
299 | [[package]]
300 | name = "requests"
301 | version = "2.31.0"
302 | description = "Python HTTP for Humans."
303 | optional = false
304 | python-versions = ">=3.7"
305 | files = [
306 |     {file = "requests-2.31.0-py3-none-any.whl", hash = "sha256:58cd2187c01e70e6e26505bca751777aa9f2ee0b7f4300988b709f44e013003f"},
307 |     {file = "requests-2.31.0.tar.gz", hash = "sha256:942c5a758f98d790eaed1a29cb6eefc7ffb0d1cf7af05c3d2791656dbd6ad1e1"},
308 | ]
309 |
310 | [package.dependencies]
311 | certifi = ">=2017.4.17"
312 | charset-normalizer = ">=2,<4"
313 | idna = ">=2.5,<4"
314 | urllib3 = ">=1.21.1,<3"
315 |
316 | [package.extras]
317 | socks = ["PySocks (>=1.5.6,!=1.5.7)"]
318 | use-chardet-on-py3 = ["chardet (>=3.0.2,<6)"]
319 |
320 | [[package]]
321 | name = "requests-oauthlib"
322 | version = "1.3.1"
323 | description = "OAuthlib authentication support for Requests."
324 | optional = false
325 | python-versions = ">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*"
326 | files = [
327 |     {file = "requests-oauthlib-1.3.1.tar.gz", hash = "sha256:75beac4a47881eeb94d5ea5d6ad31ef88856affe2332b9aafb52c6452ccf0d7a"},
328 |     {file = "requests_oauthlib-1.3.1-py2.py3-none-any.whl", hash = "sha256:2577c501a2fb8d05a304c09d090d6e47c306fef15809d102b327cf8364bddab5"},
329 | ]
330 |
331 | [package.dependencies]
332 | oauthlib = ">=3.0.0"
333 | requests = ">=2.0.0"
334 |
335 | [package.extras]
336 | rsa = ["oauthlib[signedtoken] (>=3.0.0)"]
337 |
338 | [[package]]
339 | name = "tweepy"
340 | version = "4.14.0"
341 | description = "Twitter library for Python"
342 | optional = false
343 | python-versions = ">=3.7"
344 | files = [
345 |     {file = "tweepy-4.14.0-py3-none-any.whl", hash = "sha256:db6d3844ccc0c6d27f339f12ba8acc89912a961da513c1ae50fa2be502a56afb"},
346 |     {file = "tweepy-4.14.0.tar.gz", hash = "sha256:1f9f1707d6972de6cff6c5fd90dfe6a449cd2e0d70bd40043ffab01e07a06c8c"},
347 | ]
348 |
349 | [package.dependencies]
350 | oauthlib = ">=3.2.0,<4"
351 | requests = ">=2.27.0,<3"
352 | requests-oauthlib = ">=1.2.0,<2"
353 |
354 | [package.extras]
355 | async = ["aiohttp (>=3.7.3,<4)", "async-lru (>=1.0.3,<3)"]
356 | dev = ["coverage (>=4.4.2)", "coveralls (>=2.1.0)", "tox (>=3.21.0)"]
357 | docs = ["myst-parser (==0.15.2)", "readthedocs-sphinx-search (==0.1.1)", "sphinx (==4.2.0)", "sphinx-hoverxref (==0.7b1)", "sphinx-rtd-theme (==1.0.0)", "sphinx-tabs (==3.2.0)"]
358 | socks = ["requests[socks] (>=2.27.0,<3)"]
359 | test = ["vcrpy (>=1.10.3)"]
360 |
361 | [[package]]
362 | name = "urllib3"
363 | version = "2.0.7"
364 | description = "HTTP library with thread-safe connection pooling, file post, and more."
365 | optional = false
366 | python-versions = ">=3.7"
367 | files = [
368 |     {file = "urllib3-2.0.7-py3-none-any.whl", hash = "sha256:fdb6d215c776278489906c2f8916e6e7d4f5a9b602ccbcfdf7f016fc8da0596e"},
369 |     {file = "urllib3-2.0.7.tar.gz", hash = "sha256:c97dfde1f7bd43a71c8d2a58e369e9b2bf692d1334ea9f9cae55add7d0dd0f84"},
370 | ]
371 |
372 | [package.extras]
373 | brotli = ["brotli (>=1.0.9)", "brotlicffi (>=0.8.0)"]
374 | secure = ["certifi", "cryptography (>=1.9)", "idna (>=2.0.0)", "pyopenssl (>=17.1.0)", "urllib3-secure-extra"]
375 | socks = ["pysocks (>=1.5.6,!=1.5.7,<2.0)"]
376 | zstd = ["zstandard (>=0.18.0)"]
377 |
378 | [[package]]
379 | name = "werkzeug"
380 | version = "3.0.0"
381 | description = "The comprehensive WSGI web application library."
382 | optional = false
383 | python-versions = ">=3.8"
384 | files = [
385 |     {file = "werkzeug-3.0.0-py3-none-any.whl", hash = "sha256:cbb2600f7eabe51dbc0502f58be0b3e1b96b893b05695ea2b35b43d4de2d9962"},
386 |     {file = "werkzeug-3.0.0.tar.gz", hash = "sha256:3ffff4dcc32db52ef3cc94dff3000a3c2846890f3a5a51800a27b909c5e770f0"},
387 | ]
388 |
389 | [package.dependencies]
390 | MarkupSafe = ">=2.1.1"
391 |
392 | [package.extras]
393 | watchdog = ["watchdog (>=2.3)"]
394 |
395 | [metadata]
396 | lock-version = "2.0"
397 | python-versions = "^3.11"
398 | content-hash = "25fa7d766b8d0d329c058033e24c0eaec22340494caa6308d6ab41c985ca4c32"
```

pyproject.toml
```
1 | [project]
2 | name = "x-twitter-api-v2-demo"
3 | version = "0.1.0"
4 | description = "A demo illustrating how to tweet via X's new Twitter v2 API using Python Flask"
5 | readme = "README.md"
6 | requires-python = ">=3.12"
7 | dependencies = [
8 |     "python-dotenv>=1.0.1",
9 |     "requests-oauthlib>=1.3.1",
10 |     "requests>=2.32.3",
11 |     "uvicorn>=0.34.0",
12 |     "fastapi>=0.115.6",
13 |     "python-multipart>=0.0.20",
14 |     "jinja2>=3.1.5",
15 |     "mypy>=1.14.1",
16 |     "types-requests>=2.32.0.20241016",
17 | ]
```

uv.lock
```
1 | version = 1
2 | requires-python = ">=3.12"
3 |
4 | [[package]]
5 | name = "annotated-types"
6 | version = "0.7.0"
7 | source = { registry = "https://pypi.org/simple" }
8 | sdist = { url = "https://files.pythonhosted.org/packages/ee/67/531ea369ba64dcff5ec9c3402f9f51bf748cec26dde048a2f973a4eea7f5/annotated_types-0.7.0.tar.gz", hash = "sha256:aff07c09a53a08bc8cfccb9c85b05f1aa9a2a6f23728d790723543408344ce89", size = 16081 }
9 | wheels = [
10 |     { url = "https://files.pythonhosted.org/packages/78/b6/6307fbef88d9b5ee7421e68d78a9f162e0da4900bc5f5793f6d3d0e34fb8/annotated_types-0.7.0-py3-none-any.whl", hash = "sha256:1f02e8b43a8fbbc3f3e0d4f0f4bfc8131bcb4eebe8849b8e5c773f3a1c582a53", size = 13643 },
11 | ]
12 |
13 | [[package]]
14 | name = "anyio"
15 | version = "4.8.0"
16 | source = { registry = "https://pypi.org/simple" }
17 | dependencies = [
18 |     { name = "idna" },
19 |     { name = "sniffio" },
20 |     { name = "typing-extensions", marker = "python_full_version < '3.13'" },
21 | ]
22 | sdist = { url = "https://files.pythonhosted.org/packages/a3/73/199a98fc2dae33535d6b8e8e6ec01f8c1d76c9adb096c6b7d64823038cde/anyio-4.8.0.tar.gz", hash = "sha256:1d9fe889df5212298c0c0723fa20479d1b94883a2df44bd3897aa91083316f7a", size = 181126 }
23 | wheels = [
24 |     { url = "https://files.pythonhosted.org/packages/46/eb/e7f063ad1fec6b3178a3cd82d1a3c4de82cccf283fc42746168188e1cdd5/anyio-4.8.0-py3-none-any.whl", hash = "sha256:b5011f270ab5eb0abf13385f851315585cc37ef330dd88e27ec3d34d651fd47a", size = 96041 },
25 | ]
26 |
27 | [[package]]
28 | name = "certifi"
29 | version = "2024.12.14"
30 | source = { registry = "https://pypi.org/simple" }
31 | sdist = { url = "https://files.pythonhosted.org/packages/0f/bd/1d41ee578ce09523c81a15426705dd20969f5abf006d1afe8aeff0dd776a/certifi-2024.12.14.tar.gz", hash = "sha256:b650d30f370c2b724812bee08008be0c4163b163ddaec3f2546c1caf65f191db", size = 166010 }
32 | wheels = [
33 |     { url = "https://files.pythonhosted.org/packages/a5/32/8f6669fc4798494966bf446c8c4a162e0b5d893dff088afddf76414f70e1/certifi-2024.12.14-py3-none-any.whl", hash = "sha256:1275f7a45be9464efc1173084eaa30f866fe2e47d389406136d332ed4967ec56", size = 164927 },
34 | ]
35 |
36 | [[package]]
37 | name = "charset-normalizer"
38 | version = "3.4.1"
39 | source = { registry = "https://pypi.org/simple" }
40 | sdist = { url = "https://files.pythonhosted.org/packages/16/b0/572805e227f01586461c80e0fd25d65a2115599cc9dad142fee4b747c357/charset_normalizer-3.4.1.tar.gz", hash = "sha256:44251f18cd68a75b56585dd00dae26183e102cd5e0f9f1466e6df5da2ed64ea3", size = 123188 }
41 | wheels = [
42 |     { url = "https://files.pythonhosted.org/packages/0a/9a/dd1e1cdceb841925b7798369a09279bd1cf183cef0f9ddf15a3a6502ee45/charset_normalizer-3.4.1-cp312-cp312-macosx_10_13_universal2.whl", hash = "sha256:73d94b58ec7fecbc7366247d3b0b10a21681004153238750bb67bd9012414545", size = 196105 },
43 |     { url = "https://files.pythonhosted.org/packages/d3/8c/90bfabf8c4809ecb648f39794cf2a84ff2e7d2a6cf159fe68d9a26160467/charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:dad3e487649f498dd991eeb901125411559b22e8d7ab25d3aeb1af367df5efd7", size = 140404 },
44 |     { url = "https://files.pythonhosted.org/packages/ad/8f/e410d57c721945ea3b4f1a04b74f70ce8fa800d393d72899f0a40526401f/charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:c30197aa96e8eed02200a83fba2657b4c3acd0f0aa4bdc9f6c1af8e8962e0757", size = 150423 },
45 |     { url = "https://files.pythonhosted.org/packages/f0/b8/e6825e25deb691ff98cf5c9072ee0605dc2acfca98af70c2d1b1bc75190d/charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:2369eea1ee4a7610a860d88f268eb39b95cb588acd7235e02fd5a5601773d4fa", size = 143184 },
46 |     { url = "https://files.pythonhosted.org/packages/3e/a2/513f6cbe752421f16d969e32f3583762bfd583848b763913ddab8d9bfd4f/charset_normalizer-3.4.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:bc2722592d8998c870fa4e290c2eec2c1569b87fe58618e67d38b4665dfa680d", size = 145268 },
47 |     { url = "https://files.pythonhosted.org/packages/74/94/8a5277664f27c3c438546f3eb53b33f5b19568eb7424736bdc440a88a31f/charset_normalizer-3.4.1-cp312-cp312-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:ffc9202a29ab3920fa812879e95a9e78b2465fd10be7fcbd042899695d75e616", size = 147601 },
48 |     { url = "https://files.pythonhosted.org/packages/7c/5f/6d352c51ee763623a98e31194823518e09bfa48be2a7e8383cf691bbb3d0/charset_normalizer-3.4.1-cp312-cp312-musllinux_1_2_aarch64.whl", hash = "sha256:804a4d582ba6e5b747c625bf1255e6b1507465494a40a2130978bda7b932c90b", size = 141098 },
49 |     { url = "https://files.pythonhosted.org/packages/78/d4/f5704cb629ba5ab16d1d3d741396aec6dc3ca2b67757c45b0599bb010478/charset_normalizer-3.4.1-cp312-cp312-musllinux_1_2_i686.whl", hash = "sha256:0f55e69f030f7163dffe9fd0752b32f070566451afe180f99dbeeb81f511ad8d", size = 149520 },
50 |     { url = "https://files.pythonhosted.org/packages/c5/96/64120b1d02b81785f222b976c0fb79a35875457fa9bb40827678e54d1bc8/charset_normalizer-3.4.1-cp312-cp312-musllinux_1_2_ppc64le.whl", hash = "sha256:c4c3e6da02df6fa1410a7680bd3f63d4f710232d3139089536310d027950696a", size = 152852 },
51 |     { url = "https://files.pythonhosted.org/packages/84/c9/98e3732278a99f47d487fd3468bc60b882920cef29d1fa6ca460a1fdf4e6/charset_normalizer-3.4.1-cp312-cp312-musllinux_1_2_s390x.whl", hash = "sha256:5df196eb874dae23dcfb968c83d4f8fdccb333330fe1fc278ac5ceeb101003a9", size = 150488 },
52 |     { url = "https://files.pythonhosted.org/packages/13/0e/9c8d4cb99c98c1007cc11eda969ebfe837bbbd0acdb4736d228ccaabcd22/charset_normalizer-3.4.1-cp312-cp312-musllinux_1_2_x86_64.whl", hash = "sha256:e358e64305fe12299a08e08978f51fc21fac060dcfcddd95453eabe5b93ed0e1", size = 146192 },
53 |     { url = "https://files.pythonhosted.org/packages/b2/21/2b6b5b860781a0b49427309cb8670785aa543fb2178de875b87b9cc97746/charset_normalizer-3.4.1-cp312-cp312-win32.whl", hash = "sha256:9b23ca7ef998bc739bf6ffc077c2116917eabcc901f88da1b9856b210ef63f35", size = 95550 },
54 |     { url = "https://files.pythonhosted.org/packages/21/5b/1b390b03b1d16c7e382b561c5329f83cc06623916aab983e8ab9239c7d5c/charset_normalizer-3.4.1-cp312-cp312-win_amd64.whl", hash = "sha256:6ff8a4a60c227ad87030d76e99cd1698345d4491638dfa6673027c48b3cd395f", size = 102785 },
55 |     { url = "https://files.pythonhosted.org/packages/38/94/ce8e6f63d18049672c76d07d119304e1e2d7c6098f0841b51c666e9f44a0/charset_normalizer-3.4.1-cp313-cp313-macosx_10_13_universal2.whl", hash = "sha256:aabfa34badd18f1da5ec1bc2715cadc8dca465868a4e73a0173466b688f29dda", size = 195698 },
56 |     { url = "https://files.pythonhosted.org/packages/24/2e/dfdd9770664aae179a96561cc6952ff08f9a8cd09a908f259a9dfa063568/charset_normalizer-3.4.1-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:22e14b5d70560b8dd51ec22863f370d1e595ac3d024cb8ad7d308b4cd95f8313", size = 140162 },
57 |     { url = "https://files.pythonhosted.org/packages/24/4e/f646b9093cff8fc86f2d60af2de4dc17c759de9d554f130b140ea4738ca6/charset_normalizer-3.4.1-cp313-cp313-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:8436c508b408b82d87dc5f62496973a1805cd46727c34440b0d29d8a2f50a6c9", size = 150263 },
58 |     { url = "https://files.pythonhosted.org/packages/5e/67/2937f8d548c3ef6e2f9aab0f6e21001056f692d43282b165e7c56023e6dd/charset_normalizer-3.4.1-cp313-cp313-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:2d074908e1aecee37a7635990b2c6d504cd4766c7bc9fc86d63f9c09af3fa11b", size = 142966 },
59 |     { url = "https://files.pythonhosted.org/packages/52/ed/b7f4f07de100bdb95c1756d3a4d17b90c1a3c53715c1a476f8738058e0fa/charset_normalizer-3.4.1-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:955f8851919303c92343d2f66165294848d57e9bba6cf6e3625485a70a038d11", size = 144992 },
60 |     { url = "https://files.pythonhosted.org/packages/96/2c/d49710a6dbcd3776265f4c923bb73ebe83933dfbaa841c5da850fe0fd20b/charset_normalizer-3.4.1-cp313-cp313-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:44ecbf16649486d4aebafeaa7ec4c9fed8b88101f4dd612dcaf65d5e815f837f", size = 147162 },
61 |     { url = "https://files.pythonhosted.org/packages/b4/41/35ff1f9a6bd380303dea55e44c4933b4cc3c4850988927d4082ada230273/charset_normalizer-3.4.1-cp313-cp313-musllinux_1_2_aarch64.whl", hash = "sha256:0924e81d3d5e70f8126529951dac65c1010cdf117bb75eb02dd12339b57749dd", size = 140972 },
62 |     { url = "https://files.pythonhosted.org/packages/fb/43/c6a0b685fe6910d08ba971f62cd9c3e862a85770395ba5d9cad4fede33ab/charset_normalizer-3.4.1-cp313-cp313-musllinux_1_2_i686.whl", hash = "sha256:2967f74ad52c3b98de4c3b32e1a44e32975e008a9cd2a8cc8966d6a5218c5cb2", size = 149095 },
63 |     { url = "https://files.pythonhosted.org/packages/4c/ff/a9a504662452e2d2878512115638966e75633519ec11f25fca3d2049a94a/charset_normalizer-3.4.1-cp313-cp313-musllinux_1_2_ppc64le.whl", hash = "sha256:c75cb2a3e389853835e84a2d8fb2b81a10645b503eca9bcb98df6b5a43eb8886", size = 152668 },
64 |     { url = "https://files.pythonhosted.org/packages/6c/71/189996b6d9a4b932564701628af5cee6716733e9165af1d5e1b285c530ed/charset_normalizer-3.4.1-cp313-cp313-musllinux_1_2_s390x.whl", hash = "sha256:09b26ae6b1abf0d27570633b2b078a2a20419c99d66fb2823173d73f188ce601", size = 150073 },
65 |     { url = "https://files.pythonhosted.org/packages/e4/93/946a86ce20790e11312c87c75ba68d5f6ad2208cfb52b2d6a2c32840d922/charset_normalizer-3.4.1-cp313-cp313-musllinux_1_2_x86_64.whl", hash = "sha256:fa88b843d6e211393a37219e6a1c1df99d35e8fd90446f1118f4216e307e48cd", size = 145732 },
66 |     { url = "https://files.pythonhosted.org/packages/cd/e5/131d2fb1b0dddafc37be4f3a2fa79aa4c037368be9423061dccadfd90091/charset_normalizer-3.4.1-cp313-cp313-win32.whl", hash = "sha256:eb8178fe3dba6450a3e024e95ac49ed3400e506fd4e9e5c32d30adda88cbd407", size = 95391 },
67 |     { url = "https://files.pythonhosted.org/packages/27/f2/4f9a69cc7712b9b5ad8fdb87039fd89abba997ad5cbe690d1835d40405b0/charset_normalizer-3.4.1-cp313-cp313-win_amd64.whl", hash = "sha256:b1ac5992a838106edb89654e0aebfc24f5848ae2547d22c2c3f66454daa11971", size = 102702 },
68 |     { url = "https://files.pythonhosted.org/packages/0e/f6/65ecc6878a89bb1c23a086ea335ad4bf21a588990c3f535a227b9eea9108/charset_normalizer-3.4.1-py3-none-any.whl", hash = "sha256:d98b1668f06378c6dbefec3b92299716b931cd4e6061f3c875a71ced1780ab85", size = 49767 },
69 | ]
70 |
71 | [[package]]
72 | name = "click"
73 | version = "8.1.8"
74 | source = { registry = "https://pypi.org/simple" }
75 | dependencies = [
76 |     { name = "colorama", marker = "platform_system == 'Windows'" },
77 | ]
78 | sdist = { url = "https://files.pythonhosted.org/packages/b9/2e/0090cbf739cee7d23781ad4b89a9894a41538e4fcf4c31dcdd705b78eb8b/click-8.1.8.tar.gz", hash = "sha256:ed53c9d8990d83c2a27deae68e4ee337473f6330c040a31d4225c9574d16096a", size = 226593 }
79 | wheels = [
80 |     { url = "https://files.pythonhosted.org/packages/7e/d4/7ebdbd03970677812aac39c869717059dbb71a4cfc033ca6e5221787892c/click-8.1.8-py3-none-any.whl", hash = "sha256:63c132bbbed01578a06712a2d1f497bb62d9c1c0d329b7903a866228027263b2", size = 98188 },
81 | ]
82 |
83 | [[package]]
84 | name = "colorama"
85 | version = "0.4.6"
86 | source = { registry = "https://pypi.org/simple" }
87 | sdist = { url = "https://files.pythonhosted.org/packages/d8/53/6f443c9a4a8358a93a6792e2acffb9d9d5cb0a5cfd8802644b7b1c9a02e4/colorama-0.4.6.tar.gz", hash = "sha256:08695f5cb7ed6e0531a20572697297273c47b8cae5a63ffc6d6ed5c201be6e44", size = 27697 }
88 | wheels = [
89 |     { url = "https://files.pythonhosted.org/packages/d1/d6/3965ed04c63042e047cb6a3e6ed1a63a35087b6a609aa3a15ed8ac56c221/colorama-0.4.6-py2.py3-none-any.whl", hash = "sha256:4f1d9991f5acc0ca119f9d443620b77f9d6b33703e51011c16baf57afb285fc6", size = 25335 },
90 | ]
91 |
92 | [[package]]
93 | name = "fastapi"
94 | version = "0.115.6"
95 | source = { registry = "https://pypi.org/simple" }
96 | dependencies = [
97 |     { name = "pydantic" },
98 |     { name = "starlette" },
99 |     { name = "typing-extensions" },
100 | ]
101 | sdist = { url = "https://files.pythonhosted.org/packages/93/72/d83b98cd106541e8f5e5bfab8ef2974ab45a62e8a6c5b5e6940f26d2ed4b/fastapi-0.115.6.tar.gz", hash = "sha256:9ec46f7addc14ea472958a96aae5b5de65f39721a46aaf5705c480d9a8b76654", size = 301336 }
102 | wheels = [
103 |     { url = "https://files.pythonhosted.org/packages/52/b3/7e4df40e585df024fac2f80d1a2d579c854ac37109675db2b0cc22c0bb9e/fastapi-0.115.6-py3-none-any.whl", hash = "sha256:e9240b29e36fa8f4bb7290316988e90c381e5092e0cbe84e7818cc3713bcf305", size = 94843 },
104 | ]
105 |
106 | [[package]]
107 | name = "h11"
108 | version = "0.14.0"
109 | source = { registry = "https://pypi.org/simple" }
110 | sdist = { url = "https://files.pythonhosted.org/packages/f5/38/3af3d3633a34a3316095b39c8e8fb4853a28a536e55d347bd8d8e9a14b03/h11-0.14.0.tar.gz", hash = "sha256:8f19fbbe99e72420ff35c00b27a34cb9937e902a8b810e2c88300c6f0a3b699d", size = 100418 }
111 | wheels = [
112 |     { url = "https://files.pythonhosted.org/packages/95/04/ff642e65ad6b90db43e668d70ffb6736436c7ce41fcc549f4e9472234127/h11-0.14.0-py3-none-any.whl", hash = "sha256:e3fe4ac4b851c468cc8363d500db52c2ead036020723024a109d37346efaa761", size = 58259 },
113 | ]
114 |
115 | [[package]]
116 | name = "idna"
117 | version = "3.10"
118 | source = { registry = "https://pypi.org/simple" }
119 | sdist = { url = "https://files.pythonhosted.org/packages/f1/70/7703c29685631f5a7590aa73f1f1d3fa9a380e654b86af429e0934a32f7d/idna-3.10.tar.gz", hash = "sha256:12f65c9b470abda6dc35cf8e63cc574b1c52b11df2c86030af0ac09b01b13ea9", size = 190490 }
120 | wheels = [
121 |     { url = "https://files.pythonhosted.org/packages/76/c6/c88e154df9c4e1a2a66ccf0005a88dfb2650c1dffb6f5ce603dfbd452ce3/idna-3.10-py3-none-any.whl", hash = "sha256:946d195a0d259cbba61165e88e65941f16e9b36ea6ddb97f00452bae8b1287d3", size = 70442 },
122 | ]
123 |
124 | [[package]]
125 | name = "jinja2"
126 | version = "3.1.5"
127 | source = { registry = "https://pypi.org/simple" }
128 | dependencies = [
129 |     { name = "markupsafe" },
130 | ]
131 | sdist = { url = "https://files.pythonhosted.org/packages/af/92/b3130cbbf5591acf9ade8708c365f3238046ac7cb8ccba6e81abccb0ccff/jinja2-3.1.5.tar.gz", hash = "sha256:8fefff8dc3034e27bb80d67c671eb8a9bc424c0ef4c0826edbff304cceff43bb", size = 244674 }
132 | wheels = [
133 |     { url = "https://files.pythonhosted.org/packages/bd/0f/2ba5fbcd631e3e88689309dbe978c5769e883e4b84ebfe7da30b43275c5a/jinja2-3.1.5-py3-none-any.whl", hash = "sha256:aba0f4dc9ed8013c424088f68a5c226f7d6097ed89b246d7749c2ec4175c6adb", size = 134596 },
134 | ]
135 |
136 | [[package]]
137 | name = "markupsafe"
138 | version = "3.0.2"
139 | source = { registry = "https://pypi.org/simple" }
140 | sdist = { url = "https://files.pythonhosted.org/packages/b2/97/5d42485e71dfc078108a86d6de8fa46db44a1a9295e89c5d6d4a06e23a62/markupsafe-3.0.2.tar.gz", hash = "sha256:ee55d3edf80167e48ea11a923c7386f4669df67d7994554387f84e7d8b0a2bf0", size = 20537 }
141 | wheels = [
142 |     { url = "https://files.pythonhosted.org/packages/22/09/d1f21434c97fc42f09d290cbb6350d44eb12f09cc62c9476effdb33a18aa/MarkupSafe-3.0.2-cp312-cp312-macosx_10_13_universal2.whl", hash = "sha256:9778bd8ab0a994ebf6f84c2b949e65736d5575320a17ae8984a77fab08db94cf", size = 14274 },
143 |     { url = "https://files.pythonhosted.org/packages/6b/b0/18f76bba336fa5aecf79d45dcd6c806c280ec44538b3c13671d49099fdd0/MarkupSafe-3.0.2-cp312-cp312-macosx_11_0_arm64.whl", hash = "sha256:846ade7b71e3536c4e56b386c2a47adf5741d2d8b94ec9dc3e92e5e1ee1e2225", size = 12348 },
144 |     { url = "https://files.pythonhosted.org/packages/e0/25/dd5c0f6ac1311e9b40f4af06c78efde0f3b5cbf02502f8ef9501294c425b/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:1c99d261bd2d5f6b59325c92c73df481e05e57f19837bdca8413b9eac4bd8028", size = 24149 },
145 |     { url = "https://files.pythonhosted.org/packages/f3/f0/89e7aadfb3749d0f52234a0c8c7867877876e0a20b60e2188e9850794c17/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:e17c96c14e19278594aa4841ec148115f9c7615a47382ecb6b82bd8fea3ab0c8", size = 23118 },
146 |     { url = "https://files.pythonhosted.org/packages/d5/da/f2eeb64c723f5e3777bc081da884b414671982008c47dcc1873d81f625b6/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:88416bd1e65dcea10bc7569faacb2c20ce071dd1f87539ca2ab364bf6231393c", size = 22993 },
147 |     { url = "https://files.pythonhosted.org/packages/da/0e/1f32af846df486dce7c227fe0f2398dc7e2e51d4a370508281f3c1c5cddc/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_aarch64.whl", hash = "sha256:2181e67807fc2fa785d0592dc2d6206c019b9502410671cc905d132a92866557", size = 24178 },
148 |     { url = "https://files.pythonhosted.org/packages/c4/f6/bb3ca0532de8086cbff5f06d137064c8410d10779c4c127e0e47d17c0b71/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_i686.whl", hash = "sha256:52305740fe773d09cffb16f8ed0427942901f00adedac82ec8b67752f58a1b22", size = 23319 },
149 |     { url = "https://files.pythonhosted.org/packages/a2/82/8be4c96ffee03c5b4a034e60a31294daf481e12c7c43ab8e34a1453ee48b/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_x86_64.whl", hash = "sha256:ad10d3ded218f1039f11a75f8091880239651b52e9bb592ca27de44eed242a48", size = 23352 },
150 |     { url = "https://files.pythonhosted.org/packages/51/ae/97827349d3fcffee7e184bdf7f41cd6b88d9919c80f0263ba7acd1bbcb18/MarkupSafe-3.0.2-cp312-cp312-win32.whl", hash = "sha256:0f4ca02bea9a23221c0182836703cbf8930c5e9454bacce27e767509fa286a30", size = 15097 },
151 |     { url = "https://files.pythonhosted.org/packages/c1/80/a61f99dc3a936413c3ee4e1eecac96c0da5ed07ad56fd975f1a9da5bc630/MarkupSafe-3.0.2-cp312-cp312-win_amd64.whl", hash = "sha256:8e06879fc22a25ca47312fbe7c8264eb0b662f6db27cb2d3bbbc74b1df4b9b87", size = 15601 },
152 |     { url = "https://files.pythonhosted.org/packages/83/0e/67eb10a7ecc77a0c2bbe2b0235765b98d164d81600746914bebada795e97/MarkupSafe-3.0.2-cp313-cp313-macosx_10_13_universal2.whl", hash = "sha256:ba9527cdd4c926ed0760bc301f6728ef34d841f405abf9d4f959c478421e4efd", size = 14274 },
153 |     { url = "https://files.pythonhosted.org/packages/2b/6d/9409f3684d3335375d04e5f05744dfe7e9f120062c9857df4ab490a1031a/MarkupSafe-3.0.2-cp313-cp313-macosx_11_0_arm64.whl", hash = "sha256:f8b3d067f2e40fe93e1ccdd6b2e1d16c43140e76f02fb1319a05cf2b79d99430", size = 12352 },
154 |     { url = "https://files.pythonhosted.org/packages/d2/f5/6eadfcd3885ea85fe2a7c128315cc1bb7241e1987443d78c8fe712d03091/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:569511d3b58c8791ab4c2e1285575265991e6d8f8700c7be0e88f86cb0672094", size = 24122 },
155 |     { url = "https://files.pythonhosted.org/packages/0c/91/96cf928db8236f1bfab6ce15ad070dfdd02ed88261c2afafd4b43575e9e9/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:15ab75ef81add55874e7ab7055e9c397312385bd9ced94920f2802310c930396", size = 23085 },
156 |     { url = "https://files.pythonhosted.org/packages/c2/cf/c9d56af24d56ea04daae7ac0940232d31d5a8354f2b457c6d856b2057d69/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:f3818cb119498c0678015754eba762e0d61e5b52d34c8b13d770f0719f7b1d79", size = 22978 },
157 |     { url = "https://files.pythonhosted.org/packages/2a/9f/8619835cd6a711d6272d62abb78c033bda638fdc54c4e7f4272cf1c0962b/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_aarch64.whl", hash = "sha256:cdb82a876c47801bb54a690c5ae105a46b392ac6099881cdfb9f6e95e4014c6a", size = 24208 },
158 |     { url = "https://files.pythonhosted.org/packages/f9/bf/176950a1792b2cd2102b8ffeb5133e1ed984547b75db47c25a67d3359f77/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_i686.whl", hash = "sha256:cabc348d87e913db6ab4aa100f01b08f481097838bdddf7c7a84b7575b7309ca", size = 23357 },
159 |     { url = "https://files.pythonhosted.org/packages/ce/4f/9a02c1d335caabe5c4efb90e1b6e8ee944aa245c1aaaab8e8a618987d816/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_x86_64.whl", hash = "sha256:444dcda765c8a838eaae23112db52f1efaf750daddb2d9ca300bcae1039adc5c", size = 23344 },
160 |     { url = "https://files.pythonhosted.org/packages/ee/55/c271b57db36f748f0e04a759ace9f8f759ccf22b4960c270c78a394f58be/MarkupSafe-3.0.2-cp313-cp313-win32.whl", hash = "sha256:bcf3e58998965654fdaff38e58584d8937aa3096ab5354d493c77d1fdd66d7a1", size = 15101 },
161 |     { url = "https://files.pythonhosted.org/packages/29/88/07df22d2dd4df40aba9f3e402e6dc1b8ee86297dddbad4872bd5e7b0094f/MarkupSafe-3.0.2-cp313-cp313-win_amd64.whl", hash = "sha256:e6a2a455bd412959b57a172ce6328d2dd1f01cb2135efda2e4576e8a23fa3b0f", size = 15603 },
162 |     { url = "https://files.pythonhosted.org/packages/62/6a/8b89d24db2d32d433dffcd6a8779159da109842434f1dd2f6e71f32f738c/MarkupSafe-3.0.2-cp313-cp313t-macosx_10_13_universal2.whl", hash = "sha256:b5a6b3ada725cea8a5e634536b1b01c30bcdcd7f9c6fff4151548d5bf6b3a36c", size = 14510 },
163 |     { url = "https://files.pythonhosted.org/packages/7a/06/a10f955f70a2e5a9bf78d11a161029d278eeacbd35ef806c3fd17b13060d/MarkupSafe-3.0.2-cp313-cp313t-macosx_11_0_arm64.whl", hash = "sha256:a904af0a6162c73e3edcb969eeeb53a63ceeb5d8cf642fade7d39e7963a22ddb", size = 12486 },
164 |     { url = "https://files.pythonhosted.org/packages/34/cf/65d4a571869a1a9078198ca28f39fba5fbb910f952f9dbc5220afff9f5e6/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:4aa4e5faecf353ed117801a068ebab7b7e09ffb6e1d5e412dc852e0da018126c", size = 25480 },
165 |     { url = "https://files.pythonhosted.org/packages/0c/e3/90e9651924c430b885468b56b3d597cabf6d72be4b24a0acd1fa0e12af67/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:c0ef13eaeee5b615fb07c9a7dadb38eac06a0608b41570d8ade51c56539e509d", size = 23914 },
166 |     { url = "https://files.pythonhosted.org/packages/66/8c/6c7cf61f95d63bb866db39085150df1f2a5bd3335298f14a66b48e92659c/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:d16a81a06776313e817c951135cf7340a3e91e8c1ff2fac444cfd75fffa04afe", size = 23796 },
167 |     { url = "https://files.pythonhosted.org/packages/bb/35/cbe9238ec3f47ac9a7c8b3df7a808e7cb50fe149dc7039f5f454b3fba218/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_aarch64.whl", hash = "sha256:6381026f158fdb7c72a168278597a5e3a5222e83ea18f543112b2662a9b699c5", size = 25473 },
168 |     { url = "https://files.pythonhosted.org/packages/e6/32/7621a4382488aa283cc05e8984a9c219abad3bca087be9ec77e89939ded9/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_i686.whl", hash = "sha256:3d79d162e7be8f996986c064d1c7c817f6df3a77fe3d6859f6f9e7be4b8c213a", size = 24114 },
169 |     { url = "https://files.pythonhosted.org/packages/0d/80/0985960e4b89922cb5a0bac0ed39c5b96cbc1a536a99f30e8c220a996ed9/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_x86_64.whl", hash = "sha256:131a3c7689c85f5ad20f9f6fb1b866f402c445b220c19fe4308c0b147ccd2ad9", size = 24098 },
170 |     { url = "https://files.pythonhosted.org/packages/82/78/fedb03c7d5380df2427038ec8d973587e90561b2d90cd472ce9254cf348b/MarkupSafe-3.0.2-cp313-cp313t-win32.whl", hash = "sha256:ba8062ed2cf21c07a9e295d5b8a2a5ce678b913b45fdf68c32d95d6c1291e0b6", size = 15208 },
171 |     { url = "https://files.pythonhosted.org/packages/4f/65/6079a46068dfceaeabb5dcad6d674f5f5c61a6fa5673746f42a9f4c233b3/MarkupSafe-3.0.2-cp313-cp313t-win_amd64.whl", hash = "sha256:e444a31f8db13eb18ada366ab3cf45fd4b31e4db1236a4448f68778c1d1a5a2f", size = 15739 },
172 | ]
173 |
174 | [[package]]
175 | name = "mypy"
176 | version = "1.14.1"
177 | source = { registry = "https://pypi.org/simple" }
178 | dependencies = [
179 |     { name = "mypy-extensions" },
180 |     { name = "typing-extensions" },
181 | ]
182 | sdist = { url = "https://files.pythonhosted.org/packages/b9/eb/2c92d8ea1e684440f54fa49ac5d9a5f19967b7b472a281f419e69a8d228e/mypy-1.14.1.tar.gz", hash = "sha256:7ec88144fe9b510e8475ec2f5f251992690fcf89ccb4500b214b4226abcd32d6", size = 3216051 }
183 | wheels = [
184 |     { url = "https://files.pythonhosted.org/packages/43/1b/b38c079609bb4627905b74fc6a49849835acf68547ac33d8ceb707de5f52/mypy-1.14.1-cp312-cp312-macosx_10_13_x86_64.whl", hash = "sha256:30ff5ef8519bbc2e18b3b54521ec319513a26f1bba19a7582e7b1f58a6e69f14", size = 11266668 },
185 |     { url = "https://files.pythonhosted.org/packages/6b/75/2ed0d2964c1ffc9971c729f7a544e9cd34b2cdabbe2d11afd148d7838aa2/mypy-1.14.1-cp312-cp312-macosx_11_0_arm64.whl", hash = "sha256:cb9f255c18052343c70234907e2e532bc7e55a62565d64536dbc7706a20b78b9", size = 10254060 },
186 |     { url = "https://files.pythonhosted.org/packages/a1/5f/7b8051552d4da3c51bbe8fcafffd76a6823779101a2b198d80886cd8f08e/mypy-1.14.1-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.manylinux_2_28_aarch64.whl", hash = "sha256:8b4e3413e0bddea671012b063e27591b953d653209e7a4fa5e48759cda77ca11", size = 11933167 },
187 |     { url = "https://files.pythonhosted.org/packages/04/90/f53971d3ac39d8b68bbaab9a4c6c58c8caa4d5fd3d587d16f5927eeeabe1/mypy-1.14.1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.manylinux_2_28_x86_64.whl", hash = "sha256:553c293b1fbdebb6c3c4030589dab9fafb6dfa768995a453d8a5d3b23784af2e", size = 12864341 },
188 |     { url = "https://files.pythonhosted.org/packages/03/d2/8bc0aeaaf2e88c977db41583559319f1821c069e943ada2701e86d0430b7/mypy-1.14.1-cp312-cp312-musllinux_1_2_x86_64.whl", hash = "sha256:fad79bfe3b65fe6a1efaed97b445c3d37f7be9fdc348bdb2d7cac75579607c89", size = 12972991 },
189 |     { url = "https://files.pythonhosted.org/packages/6f/17/07815114b903b49b0f2cf7499f1c130e5aa459411596668267535fe9243c/mypy-1.14.1-cp312-cp312-win_amd64.whl", hash = "sha256:8fa2220e54d2946e94ab6dbb3ba0a992795bd68b16dc852db33028df2b00191b", size = 9879016 },
190 |     { url = "https://files.pythonhosted.org/packages/9e/15/bb6a686901f59222275ab228453de741185f9d54fecbaacec041679496c6/mypy-1.14.1-cp313-cp313-macosx_10_13_x86_64.whl", hash = "sha256:92c3ed5afb06c3a8e188cb5da4984cab9ec9a77ba956ee419c68a388b4595255", size = 11252097 },
191 |     { url = "https://files.pythonhosted.org/packages/f8/b3/8b0f74dfd072c802b7fa368829defdf3ee1566ba74c32a2cb2403f68024c/mypy-1.14.1-cp313-cp313-macosx_11_0_arm64.whl", hash = "sha256:dbec574648b3e25f43d23577309b16534431db4ddc09fda50841f1e34e64ed34", size = 10239728 },
192 |     { url = "https://files.pythonhosted.org/packages/c5/9b/4fd95ab20c52bb5b8c03cc49169be5905d931de17edfe4d9d2986800b52e/mypy-1.14.1-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.manylinux_2_28_aarch64.whl", hash = "sha256:8c6d94b16d62eb3e947281aa7347d78236688e21081f11de976376cf010eb31a", size = 11924965 },
193 |     { url = "https://files.pythonhosted.org/packages/56/9d/4a236b9c57f5d8f08ed346914b3f091a62dd7e19336b2b2a0d85485f82ff/mypy-1.14.1-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.manylinux_2_28_x86_64.whl", hash = "sha256:d4b19b03fdf54f3c5b2fa474c56b4c13c9dbfb9a2db4370ede7ec11a2c5927d9", size = 12867660 },
194 |     { url = "https://files.pythonhosted.org/packages/40/88/a61a5497e2f68d9027de2bb139c7bb9abaeb1be1584649fa9d807f80a338/mypy-1.14.1-cp313-cp313-musllinux_1_2_x86_64.whl", hash = "sha256:0c911fde686394753fff899c409fd4e16e9b294c24bfd5e1ea4675deae1ac6fd", size = 12969198 },
195 |     { url = "https://files.pythonhosted.org/packages/54/da/3d6fc5d92d324701b0c23fb413c853892bfe0e1dbe06c9138037d459756b/mypy-1.14.1-cp313-cp313-win_amd64.whl", hash = "sha256:8b21525cb51671219f5307be85f7e646a153e5acc656e5cebf64bfa076c50107", size = 9885276 },
196 |     { url = "https://files.pythonhosted.org/packages/a0/b5/32dd67b69a16d088e533962e5044e51004176a9952419de0370cdaead0f8/mypy-1.14.1-py3-none-any.whl", hash = "sha256:b66a60cc4073aeb8ae00057f9c1f64d49e90f918fbcef9a977eb121da8b8f1d1", size = 2752905 },
197 | ]
198 |
199 | [[package]]
200 | name = "mypy-extensions"
201 | version = "1.0.0"
202 | source = { registry = "https://pypi.org/simple" }
203 | sdist = { url = "https://files.pythonhosted.org/packages/98/a4/1ab47638b92648243faf97a5aeb6ea83059cc3624972ab6b8d2316078d3f/mypy_extensions-1.0.0.tar.gz", hash = "sha256:75dbf8955dc00442a438fc4d0666508a9a97b6bd41aa2f0ffe9d2f2725af0782", size = 4433 }
204 | wheels = [
205 |     { url = "https://files.pythonhosted.org/packages/2a/e2/5d3f6ada4297caebe1a2add3b126fe800c96f56dbe5d1988a2cbe0b267aa/mypy_extensions-1.0.0-py3-none-any.whl", hash = "sha256:4392f6c0eb8a5668a69e23d168ffa70f0be9ccfd32b5cc2d26a34ae5b844552d", size = 4695 },
206 | ]
207 |
208 | [[package]]
209 | name = "oauthlib"
210 | version = "3.2.2"
211 | source = { registry = "https://pypi.org/simple" }
212 | sdist = { url = "https://files.pythonhosted.org/packages/6d/fa/fbf4001037904031639e6bfbfc02badfc7e12f137a8afa254df6c4c8a670/oauthlib-3.2.2.tar.gz", hash = "sha256:9859c40929662bec5d64f34d01c99e093149682a3f38915dc0655d5a633dd918", size = 177352 }
213 | wheels = [
214 |     { url = "https://files.pythonhosted.org/packages/7e/80/cab10959dc1faead58dc8384a781dfbf93cb4d33d50988f7a69f1b7c9bbe/oauthlib-3.2.2-py3-none-any.whl", hash = "sha256:8139f29aac13e25d502680e9e19963e83f16838d48a0d71c287fe40e7067fbca", size = 151688 },
215 | ]
216 |
217 | [[package]]
218 | name = "pydantic"
219 | version = "2.10.5"
220 | source = { registry = "https://pypi.org/simple" }
221 | dependencies = [
222 |     { name = "annotated-types" },
223 |     { name = "pydantic-core" },
224 |     { name = "typing-extensions" },
225 | ]
226 | sdist = { url = "https://files.pythonhosted.org/packages/6a/c7/ca334c2ef6f2e046b1144fe4bb2a5da8a4c574e7f2ebf7e16b34a6a2fa92/pydantic-2.10.5.tar.gz", hash = "sha256:278b38dbbaec562011d659ee05f63346951b3a248a6f3642e1bc68894ea2b4ff", size = 761287 }
227 | wheels = [
228 |     { url = "https://files.pythonhosted.org/packages/58/26/82663c79010b28eddf29dcdd0ea723439535fa917fce5905885c0e9ba562/pydantic-2.10.5-py3-none-any.whl", hash = "sha256:4dd4e322dbe55472cb7ca7e73f4b63574eecccf2835ffa2af9021ce113c83c53", size = 431426 },
229 | ]
230 |
231 | [[package]]
232 | name = "pydantic-core"
233 | version = "2.27.2"
234 | source = { registry = "https://pypi.org/simple" }
235 | dependencies = [
236 |     { name = "typing-extensions" },
237 | ]
238 | sdist = { url = "https://files.pythonhosted.org/packages/fc/01/f3e5ac5e7c25833db5eb555f7b7ab24cd6f8c322d3a3ad2d67a952dc0abc/pydantic_core-2.27.2.tar.gz", hash = "sha256:eb026e5a4c1fee05726072337ff51d1efb6f59090b7da90d30ea58625b1ffb39", size = 413443 }
239 | wheels = [
240 |     { url = "https://files.pythonhosted.org/packages/d6/74/51c8a5482ca447871c93e142d9d4a92ead74de6c8dc5e66733e22c9bba89/pydantic_core-2.27.2-cp312-cp312-macosx_10_12_x86_64.whl", hash = "sha256:9e0c8cfefa0ef83b4da9588448b6d8d2a2bf1a53c3f1ae5fca39eb3061e2f0b0", size = 1893127 },
241 |     { url = "https://files.pythonhosted.org/packages/d3/f3/c97e80721735868313c58b89d2de85fa80fe8dfeeed84dc51598b92a135e/pydantic_core-2.27.2-cp312-cp312-macosx_11_0_arm64.whl", hash = "sha256:83097677b8e3bd7eaa6775720ec8e0405f1575015a463285a92bfdfe254529ef", size = 1811340 },
242 |     { url = "https://files.pythonhosted.org/packages/9e/91/840ec1375e686dbae1bd80a9e46c26a1e0083e1186abc610efa3d9a36180/pydantic_core-2.27.2-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:172fce187655fece0c90d90a678424b013f8fbb0ca8b036ac266749c09438cb7", size = 1822900 },
243 |     { url = "https://files.pythonhosted.org/packages/f6/31/4240bc96025035500c18adc149aa6ffdf1a0062a4b525c932065ceb4d868/pydantic_core-2.27.2-cp312-cp312-manylinux_2_17_armv7l.manylinux2014_armv7l.whl", hash = "sha256:519f29f5213271eeeeb3093f662ba2fd512b91c5f188f3bb7b27bc5973816934", size = 1869177 },
244 |     { url = "https://files.pythonhosted.org/packages/fa/20/02fbaadb7808be578317015c462655c317a77a7c8f0ef274bc016a784c54/pydantic_core-2.27.2-cp312-cp312-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:05e3a55d124407fffba0dd6b0c0cd056d10e983ceb4e5dbd10dda135c31071d6", size = 2038046 },
245 |     { url = "https://files.pythonhosted.org/packages/06/86/7f306b904e6c9eccf0668248b3f272090e49c275bc488a7b88b0823444a4/pydantic_core-2.27.2-cp312-cp312-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:9c3ed807c7b91de05e63930188f19e921d1fe90de6b4f5cd43ee7fcc3525cb8c", size = 2685386 },
246 |     { url = "https://files.pythonhosted.org/packages/8d/f0/49129b27c43396581a635d8710dae54a791b17dfc50c70164866bbf865e3/pydantic_core-2.27.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:6fb4aadc0b9a0c063206846d603b92030eb6f03069151a625667f982887153e2", size = 1997060 },
247 |     { url = "https://files.pythonhosted.org/packages/0d/0f/943b4af7cd416c477fd40b187036c4f89b416a33d3cc0ab7b82708a667aa/pydantic_core-2.27.2-cp312-cp312-manylinux_2_5_i686.manylinux1_i686.whl", hash = "sha256:28ccb213807e037460326424ceb8b5245acb88f32f3d2777427476e1b32c48c4", size = 2004870 },
248 |     { url = "https://files.pythonhosted.org/packages/35/40/aea70b5b1a63911c53a4c8117c0a828d6790483f858041f47bab0b779f44/pydantic_core-2.27.2-cp312-cp312-musllinux_1_1_aarch64.whl", hash = "sha256:de3cd1899e2c279b140adde9357c4495ed9d47131b4a4eaff9052f23398076b3", size = 1999822 },
249 |     { url = "https://files.pythonhosted.org/packages/f2/b3/807b94fd337d58effc5498fd1a7a4d9d59af4133e83e32ae39a96fddec9d/pydantic_core-2.27.2-cp312-cp312-musllinux_1_1_armv7l.whl", hash = "sha256:220f892729375e2d736b97d0e51466252ad84c51857d4d15f5e9692f9ef12be4", size = 2130364 },
250 |     { url = "https://files.pythonhosted.org/packages/fc/df/791c827cd4ee6efd59248dca9369fb35e80a9484462c33c6649a8d02b565/pydantic_core-2.27.2-cp312-cp312-musllinux_1_1_x86_64.whl", hash = "sha256:a0fcd29cd6b4e74fe8ddd2c90330fd8edf2e30cb52acda47f06dd615ae72da57", size = 2158303 },
251 |     { url = "https://files.pythonhosted.org/packages/9b/67/4e197c300976af185b7cef4c02203e175fb127e414125916bf1128b639a9/pydantic_core-2.27.2-cp312-cp312-win32.whl", hash = "sha256:1e2cb691ed9834cd6a8be61228471d0a503731abfb42f82458ff27be7b2186fc", size = 1834064 },
252 |     { url = "https://files.pythonhosted.org/packages/1f/ea/cd7209a889163b8dcca139fe32b9687dd05249161a3edda62860430457a5/pydantic_core-2.27.2-cp312-cp312-win_amd64.whl", hash = "sha256:cc3f1a99a4f4f9dd1de4fe0312c114e740b5ddead65bb4102884b384c15d8bc9", size = 1989046 },
253 |     { url = "https://files.pythonhosted.org/packages/bc/49/c54baab2f4658c26ac633d798dab66b4c3a9bbf47cff5284e9c182f4137a/pydantic_core-2.27.2-cp312-cp312-win_arm64.whl", hash = "sha256:3911ac9284cd8a1792d3cb26a2da18f3ca26c6908cc434a18f730dc0db7bfa3b", size = 1885092 },
254 |     { url = "https://files.pythonhosted.org/packages/41/b1/9bc383f48f8002f99104e3acff6cba1231b29ef76cfa45d1506a5cad1f84/pydantic_core-2.27.2-cp313-cp313-macosx_10_12_x86_64.whl", hash = "sha256:7d14bd329640e63852364c306f4d23eb744e0f8193148d4044dd3dacdaacbd8b", size = 1892709 },
255 |     { url = "https://files.pythonhosted.org/packages/10/6c/e62b8657b834f3eb2961b49ec8e301eb99946245e70bf42c8817350cbefc/pydantic_core-2.27.2-cp313-cp313-macosx_11_0_arm64.whl", hash = "sha256:82f91663004eb8ed30ff478d77c4d1179b3563df6cdb15c0817cd1cdaf34d154", size = 1811273 },
256 |     { url = "https://files.pythonhosted.org/packages/ba/15/52cfe49c8c986e081b863b102d6b859d9defc63446b642ccbbb3742bf371/pydantic_core-2.27.2-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:71b24c7d61131bb83df10cc7e687433609963a944ccf45190cfc21e0887b08c9", size = 1823027 },
257 |     { url = "https://files.pythonhosted.org/packages/b1/1c/b6f402cfc18ec0024120602bdbcebc7bdd5b856528c013bd4d13865ca473/pydantic_core-2.27.2-cp313-cp313-manylinux_2_17_armv7l.manylinux2014_armv7l.whl", hash = "sha256:fa8e459d4954f608fa26116118bb67f56b93b209c39b008277ace29937453dc9", size = 1868888 },
258 |     { url = "https://files.pythonhosted.org/packages/bd/7b/8cb75b66ac37bc2975a3b7de99f3c6f355fcc4d89820b61dffa8f1e81677/pydantic_core-2.27.2-cp313-cp313-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:ce8918cbebc8da707ba805b7fd0b382816858728ae7fe19a942080c24e5b7cd1", size = 2037738 },
259 |     { url = "https://files.pythonhosted.org/packages/c8/f1/786d8fe78970a06f61df22cba58e365ce304bf9b9f46cc71c8c424e0c334/pydantic_core-2.27.2-cp313-cp313-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:eda3f5c2a021bbc5d976107bb302e0131351c2ba54343f8a496dc8783d3d3a6a", size = 2685138 },
260 |     { url = "https://files.pythonhosted.org/packages/a6/74/d12b2cd841d8724dc8ffb13fc5cef86566a53ed358103150209ecd5d1999/pydantic_core-2.27.2-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:bd8086fa684c4775c27f03f062cbb9eaa6e17f064307e86b21b9e0abc9c0f02e", size = 1997025 },
261 |     { url = "https://files.pythonhosted.org/packages/a0/6e/940bcd631bc4d9a06c9539b51f070b66e8f370ed0933f392db6ff350d873/pydantic_core-2.27.2-cp313-cp313-manylinux_2_5_i686.manylinux1_i686.whl", hash = "sha256:8d9b3388db186ba0c099a6d20f0604a44eabdeef1777ddd94786cdae158729e4", size = 2004633 },
262 |     { url = "https://files.pythonhosted.org/packages/50/cc/a46b34f1708d82498c227d5d80ce615b2dd502ddcfd8376fc14a36655af1/pydantic_core-2.27.2-cp313-cp313-musllinux_1_1_aarch64.whl", hash = "sha256:7a66efda2387de898c8f38c0cf7f14fca0b51a8ef0b24bfea5849f1b3c95af27", size = 1999404 },
263 |     { url = "https://files.pythonhosted.org/packages/ca/2d/c365cfa930ed23bc58c41463bae347d1005537dc8db79e998af8ba28d35e/pydantic_core-2.27.2-cp313-cp313-musllinux_1_1_armv7l.whl", hash = "sha256:18a101c168e4e092ab40dbc2503bdc0f62010e95d292b27827871dc85450d7ee", size = 2130130 },
264 |     { url = "https://files.pythonhosted.org/packages/f4/d7/eb64d015c350b7cdb371145b54d96c919d4db516817f31cd1c650cae3b21/pydantic_core-2.27.2-cp313-cp313-musllinux_1_1_x86_64.whl", hash = "sha256:ba5dd002f88b78a4215ed2f8ddbdf85e8513382820ba15ad5ad8955ce0ca19a1", size = 2157946 },
265 |     { url = "https://files.pythonhosted.org/packages/a4/99/bddde3ddde76c03b65dfd5a66ab436c4e58ffc42927d4ff1198ffbf96f5f/pydantic_core-2.27.2-cp313-cp313-win32.whl", hash = "sha256:1ebaf1d0481914d004a573394f4be3a7616334be70261007e47c2a6fe7e50130", size = 1834387 },
266 |     { url = "https://files.pythonhosted.org/packages/71/47/82b5e846e01b26ac6f1893d3c5f9f3a2eb6ba79be26eef0b759b4fe72946/pydantic_core-2.27.2-cp313-cp313-win_amd64.whl", hash = "sha256:953101387ecf2f5652883208769a79e48db18c6df442568a0b5ccd8c2723abee", size = 1990453 },
267 |     { url = "https://files.pythonhosted.org/packages/51/b2/b2b50d5ecf21acf870190ae5d093602d95f66c9c31f9d5de6062eb329ad1/pydantic_core-2.27.2-cp313-cp313-win_arm64.whl", hash = "sha256:ac4dbfd1691affb8f48c2c13241a2e3b60ff23247cbcf981759c768b6633cf8b", size = 1885186 },
268 | ]
269 |
270 | [[package]]
271 | name = "python-dotenv"
272 | version = "1.0.1"
273 | source = { registry = "https://pypi.org/simple" }
274 | sdist = { url = "https://files.pythonhosted.org/packages/bc/57/e84d88dfe0aec03b7a2d4327012c1627ab5f03652216c63d49846d7a6c58/python-dotenv-1.0.1.tar.gz", hash = "sha256:e324ee90a023d808f1959c46bcbc04446a10ced277783dc6ee09987c37ec10ca", size = 39115 }
275 | wheels = [
276 |     { url = "https://files.pythonhosted.org/packages/6a/3e/b68c118422ec867fa7ab88444e1274aa40681c606d59ac27de5a5588f082/python_dotenv-1.0.1-py3-none-any.whl", hash = "sha256:f7b63ef50f1b690dddf550d03497b66d609393b40b564ed0d674909a68ebf16a", size = 19863 },
277 | ]
278 |
279 | [[package]]
280 | name = "python-multipart"
281 | version = "0.0.20"
282 | source = { registry = "https://pypi.org/simple" }
283 | sdist = { url = "https://files.pythonhosted.org/packages/f3/87/f44d7c9f274c7ee665a29b885ec97089ec5dc034c7f3fafa03da9e39a09e/python_multipart-0.0.20.tar.gz", hash = "sha256:8dd0cab45b8e23064ae09147625994d090fa46f5b0d1e13af944c331a7fa9d13", size = 37158 }
284 | wheels = [
285 |     { url = "https://files.pythonhosted.org/packages/45/58/38b5afbc1a800eeea951b9285d3912613f2603bdf897a4ab0f4bd7f405fc/python_multipart-0.0.20-py3-none-any.whl", hash = "sha256:8a62d3a8335e06589fe01f2a3e178cdcc632f3fbe0d492ad9ee0ec35aab1f104", size = 24546 },
286 | ]
287 |
288 | [[package]]
289 | name = "requests"
290 | version = "2.32.3"
291 | source = { registry = "https://pypi.org/simple" }
292 | dependencies = [
293 |     { name = "certifi" },
294 |     { name = "charset-normalizer" },
295 |     { name = "idna" },
296 |     { name = "urllib3" },
297 | ]
298 | sdist = { url = "https://files.pythonhosted.org/packages/63/70/2bf7780ad2d390a8d301ad0b550f1581eadbd9a20f896afe06353c2a2913/requests-2.32.3.tar.gz", hash = "sha256:55365417734eb18255590a9ff9eb97e9e1da868d4ccd6402399eaf68af20a760", size = 131218 }
299 | wheels = [
300 |     { url = "https://files.pythonhosted.org/packages/f9/9b/335f9764261e915ed497fcdeb11df5dfd6f7bf257d4a6a2a686d80da4d54/requests-2.32.3-py3-none-any.whl", hash = "sha256:70761cfe03c773ceb22aa2f671b4757976145175cdfca038c02654d061d6dcc6", size = 64928 },
301 | ]
302 |
303 | [[package]]
304 | name = "requests-oauthlib"
305 | version = "1.3.1"
306 | source = { registry = "https://pypi.org/simple" }
307 | dependencies = [
308 |     { name = "oauthlib" },
309 |     { name = "requests" },
310 | ]
311 | sdist = { url = "https://files.pythonhosted.org/packages/95/52/531ef197b426646f26b53815a7d2a67cb7a331ef098bb276db26a68ac49f/requests-oauthlib-1.3.1.tar.gz", hash = "sha256:75beac4a47881eeb94d5ea5d6ad31ef88856affe2332b9aafb52c6452ccf0d7a", size = 52027 }
312 | wheels = [
313 |     { url = "https://files.pythonhosted.org/packages/6f/bb/5deac77a9af870143c684ab46a7934038a53eb4aa975bc0687ed6ca2c610/requests_oauthlib-1.3.1-py2.py3-none-any.whl", hash = "sha256:2577c501a2fb8d05a304c09d090d6e47c306fef15809d102b327cf8364bddab5", size = 23892 },
314 | ]
315 |
316 | [[package]]
317 | name = "sniffio"
318 | version = "1.3.1"
319 | source = { registry = "https://pypi.org/simple" }
320 | sdist = { url = "https://files.pythonhosted.org/packages/a2/87/a6771e1546d97e7e041b6ae58d80074f81b7d5121207425c964ddf5cfdbd/sniffio-1.3.1.tar.gz", hash = "sha256:f4324edc670a0f49750a81b895f35c3adb843cca46f0530f79fc1babb23789dc", size = 20372 }
321 | wheels = [
322 |     { url = "https://files.pythonhosted.org/packages/e9/44/75a9c9421471a6c4805dbf2356f7c181a29c1879239abab1ea2cc8f38b40/sniffio-1.3.1-py3-none-any.whl", hash = "sha256:2f6da418d1f1e0fddd844478f41680e794e6051915791a034ff65e5f100525a2", size = 10235 },
323 | ]
324 |
325 | [[package]]
326 | name = "starlette"
327 | version = "0.41.3"
328 | source = { registry = "https://pypi.org/simple" }
329 | dependencies = [
330 |     { name = "anyio" },
331 | ]
332 | sdist = { url = "https://files.pythonhosted.org/packages/1a/4c/9b5764bd22eec91c4039ef4c55334e9187085da2d8a2df7bd570869aae18/starlette-0.41.3.tar.gz", hash = "sha256:0e4ab3d16522a255be6b28260b938eae2482f98ce5cc934cb08dce8dc3ba5835", size = 2574159 }
333 | wheels = [
334 |     { url = "https://files.pythonhosted.org/packages/96/00/2b325970b3060c7cecebab6d295afe763365822b1306a12eeab198f74323/starlette-0.41.3-py3-none-any.whl", hash = "sha256:44cedb2b7c77a9de33a8b74b2b90e9f50d11fcf25d8270ea525ad71a25374ff7", size = 73225 },
335 | ]
336 |
337 | [[package]]
338 | name = "types-requests"
339 | version = "2.32.0.20241016"
340 | source = { registry = "https://pypi.org/simple" }
341 | dependencies = [
342 |     { name = "urllib3" },
343 | ]
344 | sdist = { url = "https://files.pythonhosted.org/packages/fa/3c/4f2a430c01a22abd49a583b6b944173e39e7d01b688190a5618bd59a2e22/types-requests-2.32.0.20241016.tar.gz", hash = "sha256:0d9cad2f27515d0e3e3da7134a1b6f28fb97129d86b867f24d9c726452634d95", size = 18065 }
345 | wheels = [
346 |     { url = "https://files.pythonhosted.org/packages/d7/01/485b3026ff90e5190b5e24f1711522e06c79f4a56c8f4b95848ac072e20f/types_requests-2.32.0.20241016-py3-none-any.whl", hash = "sha256:4195d62d6d3e043a4eaaf08ff8a62184584d2e8684e9d2aa178c7915a7da3747", size = 15836 },
347 | ]
348 |
349 | [[package]]
350 | name = "typing-extensions"
351 | version = "4.12.2"
352 | source = { registry = "https://pypi.org/simple" }
353 | sdist = { url = "https://files.pythonhosted.org/packages/df/db/f35a00659bc03fec321ba8bce9420de607a1d37f8342eee1863174c69557/typing_extensions-4.12.2.tar.gz", hash = "sha256:1a7ead55c7e559dd4dee8856e3a88b41225abfe1ce8df57b7c13915fe121ffb8", size = 85321 }
354 | wheels = [
355 |     { url = "https://files.pythonhosted.org/packages/26/9f/ad63fc0248c5379346306f8668cda6e2e2e9c95e01216d2b8ffd9ff037d0/typing_extensions-4.12.2-py3-none-any.whl", hash = "sha256:04e5ca0351e0f3f85c6853954072df659d0d13fac324d0072316b67d7794700d", size = 37438 },
356 | ]
357 |
358 | [[package]]
359 | name = "urllib3"
360 | version = "2.3.0"
361 | source = { registry = "https://pypi.org/simple" }
362 | sdist = { url = "https://files.pythonhosted.org/packages/aa/63/e53da845320b757bf29ef6a9062f5c669fe997973f966045cb019c3f4b66/urllib3-2.3.0.tar.gz", hash = "sha256:f8c5449b3cf0861679ce7e0503c7b44b5ec981bec0d1d3795a07f1ba96f0204d", size = 307268 }
363 | wheels = [
364 |     { url = "https://files.pythonhosted.org/packages/c8/19/4ec628951a74043532ca2cf5d97b7b14863931476d117c471e8e2b1eb39f/urllib3-2.3.0-py3-none-any.whl", hash = "sha256:1cee9ad369867bfdbbb48b7dd50374c0967a0bb7710050facf0dd6911440e3df", size = 128369 },
365 | ]
366 |
367 | [[package]]
368 | name = "uvicorn"
369 | version = "0.34.0"
370 | source = { registry = "https://pypi.org/simple" }
371 | dependencies = [
372 |     { name = "click" },
373 |     { name = "h11" },
374 | ]
375 | sdist = { url = "https://files.pythonhosted.org/packages/4b/4d/938bd85e5bf2edeec766267a5015ad969730bb91e31b44021dfe8b22df6c/uvicorn-0.34.0.tar.gz", hash = "sha256:404051050cd7e905de2c9a7e61790943440b3416f49cb409f965d9dcd0fa73e9", size = 76568 }
376 | wheels = [
377 |     { url = "https://files.pythonhosted.org/packages/61/14/33a3a1352cfa71812a3a21e8c9bfb83f60b0011f5e36f2b1399d51928209/uvicorn-0.34.0-py3-none-any.whl", hash = "sha256:023dc038422502fa28a09c7a30bf2b6991512da7dcdb8fd35fe57cfc154126f4", size = 62315 },
378 | ]
379 |
380 | [[package]]
381 | name = "x-twitter-api-v2-demo"
382 | version = "0.1.0"
383 | source = { virtual = "." }
384 | dependencies = [
385 |     { name = "fastapi" },
386 |     { name = "jinja2" },
387 |     { name = "mypy" },
388 |     { name = "python-dotenv" },
389 |     { name = "python-multipart" },
390 |     { name = "requests" },
391 |     { name = "requests-oauthlib" },
392 |     { name = "types-requests" },
393 |     { name = "uvicorn" },
394 | ]
395 |
396 | [package.metadata]
397 | requires-dist = [
398 |     { name = "fastapi", specifier = ">=0.115.6" },
399 |     { name = "jinja2", specifier = ">=3.1.5" },
400 |     { name = "mypy", specifier = ">=1.14.1" },
401 |     { name = "python-dotenv", specifier = ">=1.0.1" },
402 |     { name = "python-multipart", specifier = ">=0.0.20" },
403 |     { name = "requests", specifier = ">=2.32.3" },
404 |     { name = "requests-oauthlib", specifier = ">=1.3.1" },
405 |     { name = "types-requests", specifier = ">=2.32.0.20241016" },
406 |     { name = "uvicorn", specifier = ">=0.34.0" },
407 | ]
```

templates/index.html
```
1 | <!DOCTYPE html>
2 | <html lang="en">
3 | <head>
4 |     <meta charset="UTF-8">
5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0">
6 |     <title>Twitter Poster</title>
7 |     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
8 | </head>
9 | <body>
10 |     <div class="container mt-5">
11 |         {% if message %}
12 |         <div class="row justify-content-center">
13 |             <div class="alert {% if 'success' in message %}alert-success{% else %}alert-danger{% endif %} alert-dismissible fade show mt-3 col-md-8">
14 |                 <strong>{{ message }}</strong>
15 |                 {% if tweet_link and 'success' in message %}
16 |                     <br/>View your tweet here: <a href="{{ tweet_link }}" target="_blank">{{ tweet_link }}</a>
17 |                 {% endif %}
18 |                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
19 |             </div>
20 |         </div>
21 |         {% endif %}
22 |         <div class="row justify-content-center">
23 |             <div class="col-md-4">
24 |                 <form action="/" method="post" enctype="multipart/form-data">
25 |                     <div class="mb-3">
26 |                         <label for="text" class="form-label">Tweet Text:</label>
27 |                         <textarea name="text" id="text" class="form-control" rows="5"></textarea>
28 |                     </div>
29 |                     <div class="mb-3">
30 |                         <label for="image" class="form-label">Select Image:</label>
31 |                         <input type="file" name="image" id="image" class="form-control">
32 |                     </div>
33 |                     <button type="submit" class="btn btn-primary">Post Tweet</button>
34 |                 </form>
35 |             </div>
36 |         </div>
37 |     </div>
38 |     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
39 | </body>
40 | </html>
```

x_twitter_api_v2_demo/__init__.py
```
```

x_twitter_api_v2_demo/auth.py
```
1 | import base64
2 | import hashlib
3 | import os
4 | import secrets
5 | from requests_oauthlib import OAuth1, OAuth2Session
6 |
7 | # Define the scopes needed for the OAuth2 flow
8 | SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access", "media.write"]
9 |
10 | def generate_code_verifier() -> str:
11 |     """Generates a random code verifier string."""
12 |     return secrets.token_urlsafe(100)
13 |
14 | def generate_code_challenge(code_verifier: str) -> str:
15 |     """Generates the code challenge from the code verifier."""
16 |     code_challenge: bytes = hashlib.sha256(code_verifier.encode()).digest()
17 |     code_challenge_b64: str = base64.urlsafe_b64encode(code_challenge).decode()
18 |     return code_challenge_b64.rstrip("=")
19 |
20 | def create_oauth1_auth() -> OAuth1:
21 |     """Create OAuth1 authentication object for media uploads."""
22 |     return OAuth1(
23 |         os.environ.get("X_API_KEY"),
24 |         os.environ.get("X_API_SECRET"),
25 |         os.environ.get("X_ACCESS_TOKEN"),
26 |         os.environ.get("X_ACCESS_TOKEN_SECRET")
27 |     )
28 |
29 | def create_oauth2_session() -> OAuth2Session:
30 |     """Create OAuth2 session for tweet posting."""
31 |     return OAuth2Session(
32 |         client_id=os.environ.get("X_CLIENT_ID"),
33 |         redirect_uri=os.environ.get("X_REDIRECT_URI"),
34 |         scope=SCOPES
35 |     )
```

x_twitter_api_v2_demo/media.py
```
1 | import logging
2 | import requests
3 | from .auth import create_oauth1_auth
4 |
5 | logger = logging.getLogger("uvicorn.error")
6 |
7 | def create_media_payload(path: str | None) -> dict[str, dict[str, list[str]]]:
8 |     """Upload media using OAuth1 authentication and return a payload containing the media ID."""
9 |     if not path:
10 |         return {"media": {"media_ids": []}}
11 |
12 |     auth = create_oauth1_auth()
13 |     upload_url = "https://upload.twitter.com/1.1/media/upload.json"
14 |
15 |     try:
16 |         with open(path, "rb") as file:
17 |             files = {"media": file}
18 |             logger.info(f"Uploading media to {upload_url}")
19 |             response = requests.post(upload_url, auth=auth, files=files)
20 |             response.raise_for_status()
21 |             media_id = response.json().get("media_id_string")
22 |             if media_id:
23 |                 return {"media": {"media_ids": [media_id]}}
24 |     except Exception as e:
25 |         logger.error(f"Error uploading media: {e}")
26 |
27 |     return {"media": {"media_ids": []}}
```

x_twitter_api_v2_demo/tweet.py
```
1 | import logging
2 | import requests
3 | from .media import create_media_payload
4 |
5 | logger = logging.getLogger("uvicorn.error")
6 |
7 | def create_text_payload(text: str) -> dict[str, str]:
8 |     return {"text": text}
9 |
10 | def create_tweet_payload(text: str, media_path: str | None = None) -> dict:
11 |     text_payload = create_text_payload(text=text)
12 |     if media_path is None:
13 |         return text_payload
14 |     media_payload = create_media_payload(path=media_path)
15 |     return {**text_payload, **media_payload}
16 |
17 | def post_tweet(text: str, media_path: str | None = None, new_token: dict | None = None) -> requests.Response:
18 |     if not new_token:
19 |         raise ValueError("Token is required")
20 |
21 |     tweet_payload = create_tweet_payload(text=text, media_path=media_path)
22 |     logger.info(f"Posting tweet with payload: {tweet_payload}")
23 |
24 |     return requests.request(
25 |         method="POST",
26 |         url="https://api.x.com/2/tweets",
27 |         json=tweet_payload,
28 |         headers={
29 |             "Authorization": f"Bearer {new_token['access_token']}",
30 |             "Content-Type": "application/json",
31 |         },
32 |     )
```

x_twitter_api_v2_demo/utils.py
```
1 | import os
2 | import tempfile
3 | import shutil
4 | import atexit
5 |
6 | # In-memory path for the temp directory
7 | temp_dir_path = None
8 |
9 | def get_temp_dir() -> str:
10 |     global temp_dir_path
11 |     if not temp_dir_path:
12 |         temp_dir_path = tempfile.mkdtemp()
13 |     return temp_dir_path
14 |
15 | def cleanup_temp_dir() -> None:
16 |     global temp_dir_path
17 |     if temp_dir_path and os.path.exists(temp_dir_path):
18 |         shutil.rmtree(temp_dir_path)
19 |         temp_dir_path = None
20 |
21 | # Register cleanup function
22 | atexit.register(cleanup_temp_dir)
```
