import json
from urllib.parse import quote_plus
from pymongo import MongoClient
import os

MONGO_DB = "Products"
COLLECTION_NAME = "Smyk"

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

CONNECTION_STRING = "mongodb+srv://{}:{}@bazarclubcluster.h20ah.mongodb.net/"

def get_database():
    user = quote_plus(MONGO_USER)
    password = quote_plus(MONGO_PASSWORD)
    client = MongoClient(CONNECTION_STRING.format(user, password))
    return client[MONGO_DB]

def get_available_ribbons(collection):
    try:
        pipeline = [
            {"$unwind": "$ribbons"},
            {"$group": {"_id": "$ribbons.label"}},
            {"$sort": {"_id": 1}}
        ]
        result = list(collection.aggregate(pipeline))
        return [item["_id"] for item in result if item["_id"]]
    except Exception as e:
        print(f"Error fetching ribbons: {e}")
        return []

def get_data(collection, limit=100, offset=0, sort="price", order=1, ribbon=None, minSizes=None):
    limit, offset, order = map(int, (limit, offset, order))
    if minSizes:
        minSizes = int(minSizes)

    # Build filter query
    filter_query = {}
    if ribbon:
        filter_query["ribbons.label"] = ribbon
    if minSizes and minSizes > 0:
        filter_query["$expr"] = {"$gte": [{"$size": "$availableSizes"}, minSizes]}
    
    total_count = collection.count_documents(filter_query)

    # If sorting by a numeric field that's stored as a string, cast it
    if sort == "salePercent":
        pipeline = [
            {"$match": filter_query},
            {
                "$addFields": {
                    "salePercentNumeric": {"$toDouble": "$salePercent"}
                }
            },
            {"$sort": {"salePercentNumeric": order}},
            {"$skip": offset},
            {"$limit": limit}
        ]
        items = list(collection.aggregate(pipeline))
    else:
        items = list(collection.find(filter_query).sort(sort, order).skip(offset).limit(limit))

    # Get available ribbons
    available_ribbons = get_available_ribbons(collection)
    
    return {
        'items': items,
        'total': total_count,
        'pages': (total_count + limit - 1) // limit,
        'ribbons': available_ribbons
    }

def extract_params_from_event(event):
    params = {}
    if event.get("queryStringParameters"):
        params = event.get("queryStringParameters")
    if event.get("pathParameters"):
        params.update(event.get("pathParameters"))
    return params

def lambda_handler(event, context):
    try:
        dbname = get_database()
        collection = dbname[COLLECTION_NAME]
        params = extract_params_from_event(event)
        print(f"{params=}")
        
        result = get_data(collection, **params)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'products': result['items'],
                'total': result['total'],
                'pages': result['pages'],
                'ribbons': result['ribbons']
            })
        }
    
    except Exception as e:
        print(f"Error retrieving data: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error retrieving data: {e}")
        }

# For local testing
if __name__ == "__main__":
    os.environ["MONGO_USER"] = "ivanowdenys"
    os.environ["MONGO_PASSWORD"] = "9NLmEk6pEcBPTa@"
    lambda_handler({}, None)
