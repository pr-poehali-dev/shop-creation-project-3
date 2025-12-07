import json
import os
import psycopg2
import uuid
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Создание заказа и генерация ссылки на оплату
    Принимает: данные заказа (товары, доставка, контакты, способ оплаты)
    Возвращает: order_id и payment_url для оплаты
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        items = body_data.get('items', [])
        delivery_method = body_data.get('delivery_method', '')
        payment_method = body_data.get('payment_method', '')
        customer_name = body_data.get('customer_name', '')
        customer_email = body_data.get('customer_email', '')
        customer_phone = body_data.get('customer_phone', '')
        delivery_address = body_data.get('delivery_address', '')
        total = body_data.get('total', 0)
        user_id = body_data.get('user_id')
        
        if not all([items, delivery_method, payment_method, customer_name, customer_email, customer_phone]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Не все обязательные поля заполнены'}),
                'isBase64Encoded': False
            }
        
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute(
            """
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone,
                delivery_address, delivery_method, payment_method, 
                payment_status, total_amount, items, user_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                order_number, customer_name, customer_email, customer_phone,
                delivery_address, delivery_method, payment_method,
                'pending', total, json.dumps(items), user_id
            )
        )
        
        order_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        payment_url = None
        if payment_method == 'card':
            payment_url = f"https://payment-demo.example.com/card/{order_number}"
        elif payment_method == 'sbp':
            payment_url = f"https://payment-demo.example.com/sbp/{order_number}"
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Заказ успешно создан',
                'order_id': order_id,
                'order_number': order_number,
                'payment_url': payment_url
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }