### 1. healthcheck / cluster info,...  -> using _cat API
curl -X GET "localhost:9200/_cat/health?v&pretty"
# list nodes
curl -X GET "localhost:9200/_cat/nodes?v&pretty"
# list indices
curl -X GET "localhost:9200/_cat/indices?v&pretty"


### 2. Basic usage
# create index customer
curl -X PUT "localhost:9200/customer?pretty&pretty"

curl -X GET "localhost:9200/_cat/indices?v&pretty"

# insert a customer index with type=external
curl -X PUT "localhost:9200/customer/external/1?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "name": "John Doe"
}
'

# get
curl -X GET "localhost:9200/customer/external/1?pretty&pretty"

# delete
curl -X DELETE "localhost:9200/customer?pretty&pretty"
curl -X GET "localhost:9200/_cat/indices?v&pretty"

# conclusion -->  <REST Verb> /<Index>/<Type>/<ID>

# indexing/replacing
curl -X PUT "localhost:9200/customer/external/1?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "name": "Jane Doe"
}
'

curl -X PUT "localhost:9200/customer/external/2?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "name": "Jane Doe"
}
'

# if not provide :id param -> using POST method and es auto gererate an id
curl -X POST "localhost:9200/customer/external?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "name": "Jane Doe 2"
}
'

# updating (by field, not re-index)
curl -X POST "localhost:9200/customer/external/1/_update?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "doc": { "name": "Jane Doe" }
}
'

curl -X POST "localhost:9200/customer/external/1/_update?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "doc": { "name": "Jane Doe", "age": 21 }
}
'

# using script for increasing age by 5
curl -X POST "localhost:9200/customer/external/1/_update?pretty&pretty" -H 'Content-Type: application/json' -d'
{
  "script" : "ctx._source.age += 5"
}
'

# del
curl -X DELETE "localhost:9200/customer/external/2?pretty&pretty"

# batch
curl -X POST "localhost:9200/customer/external/_bulk?pretty&pretty" -H 'Content-Type: application/json' -d'
{"index":{"_id":"1"}}
{"name": "John Doe" }
{"index":{"_id":"2"}}
{"name": "Jane Doe" }
'

curl -X POST "localhost:9200/customer/external/_bulk?pretty&pretty" -H 'Content-Type: application/json' -d'
{"update":{"_id":"1"}}
{"doc": { "name": "John Doe becomes Jane Doe" } }
{"delete":{"_id":"2"}}
'


### working with search api
# bulk bank index
curl -H "Content-Type: application/json" -XPOST "localhost:9200/bank/account/_bulk?pretty&refresh" --data-binary "@dataset/accounts.json"

# search
curl -X GET "localhost:9200/bank/_search?q=*&sort=account_number:asc&pretty&pretty"

# if size not set -> default 20
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "sort": [
    { "account_number": "asc" }
  ],
  "from": 10,
  "size": 5
}
'

curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "sort": { "balance": { "order": "desc" } }
}
'

# using _source for select returned field
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "_source": ["account_number", "balance"]
}
'

# match for equal
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "account_number": 20 } }
}
'
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "address": "mill" } }
}
'
# address contain either "mill" and "lane"
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "address": "mill lane" } }
}
'

# address must contain both "mill" and "lane"
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
'

#
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "should": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
'

# must not equal both "mill" and "lane"
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must_not": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
}
'

# combining together
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "match": { "age": "40" } }
      ],
      "must_not": [
        { "match": { "state": "ID" } }
      ]
    }
  }
}
'


# filter
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": { "match_all": {} },
      "filter": {
        "range": {
          "balance": {
            "gte": 20000,
            "lte": 30000
          }
        }
      }
    }
  }
}
'

### aggreation
# groups all the accounts by state, and then returns the top 10 (default) states sorted by count descending (also default)
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      }
    }
  }
}
'

# 
curl -X GET "localhost:9200/bank/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
'












