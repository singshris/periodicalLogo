const authString = btoa(`9856edcd-6dbd-4fea-98a1-6d48cabaf291:007a258d38c6c658ad221eeaa671c063a2b3e0a4f21c955b2f692454323944780089919d92a71ffbc5acfb7e5afa52dfee27155958aa7eda2efb3ed054e5bed78909cbb4985e4ae1b7417bb9bf4b44b04b2988c80ed46ebedf3e586b61acd942fc1bd70e4161907f43010133b4baf28b`);

curl --location --request GET 'https://api.astronomyapi.com/api/v2/bodies/positions' \
--header "Authorization: Basic ${authString}" \
--data '{
  "observer": {
    "from": 2020-12-20T09:00:00.000-05:00,
    "to": 2020-12-23T09:00:00.000-05:00,
    "latitude": -22.05546,
    "longitude": 54.36588
  }'
 
