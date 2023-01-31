---
to: cypress/fixtures/<%= Name %>/post.json
root: <%= root %>
---
{
  "request": {
  },
  "response": {
    "body": {
    },
    "headers": {
      "Content-Type": "application/json; charset=utf-8"
    },
    "statusCode": 201
  },
  "matchingRules": {
    "$.body.id": {
      "match": "type"
    }
  }
}
