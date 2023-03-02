---
to: cypress/fixtures/<%= Name %>/getCollection.json
root: <%= root %>
---
{
  "body": [
  ],
  "headers": {
    "x-first-page": "/<%= root %>/api/<%= name %>?_page=1",
    "x-last-page": "/<%= root %>/api/<%= name %>?_page=1",
    "x-next-page": "/<%= root %>/api/<%= name %>?_page=1",
    "x-total-items": "1",
    "x-total-pages": "1"
  },
  "statusCode": 200
}
