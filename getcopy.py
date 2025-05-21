import json


from urllib.parse import quote_plus
from pymongo import MongoClient
import os


MONGO_DB = "Products"
COLLECTION_NAME = "Smyk"  # Назва таблиці


# MONGO_USER="ivanowdenys"
# MONGO_PASSWORD="9NLmEk6pEcBPTa@"

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

CONNECTION_STRING = "mongodb+srv://{}:{}@bazarclubcluster.h20ah.mongodb.net/"



def get_database():
    user = quote_plus(MONGO_USER)
    password = quote_plus(MONGO_PASSWORD)
    client = MongoClient(CONNECTION_STRING.format(user, password))
    return client[MONGO_DB]


def get_data(collection, limit=100, offset=0, sort="price", order=1):
    limit, offset, order = map(int, (limit, offset, order))
    items = collection.find().sort(sort, order).skip(offset).limit(limit)
    return items


def extract_params_from_event(event):
    params = {}
    if event.get("queryStringParameters"):
        params = event.get("queryStringParameters")
    if event.get("pathParameters"):
        params.update(event.get("pathParameters"))
    return params




def lambda_handler(event, context):
    dbname = get_database()
    collection = dbname[COLLECTION_NAME]
    params = extract_params_from_event(event)
    print(f"{params=}")
    # items = collection.find()
    items = get_data(collection, **params)
    
    try:
        # Сканирование всей таблицы
        # items = collection.find()

        
        # Пагинация, если таблица большая
        # while 'LastEvaluatedKey' in response:
        #     response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        #     items.extend(response.get('Items', []))
        
        # Возврат данных в формате JSON
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(list(items))
        }
    
    except Exception as e:
        print(f"Error retrieving data: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error retrieving data: {e}")
        }
    

if __name__ == "__main__":
    MONGO_USER="ivanowdenys"
    MONGO_PASSWORD="9NLmEk6pEcBPTa@"
    lambda_handler(None, None)