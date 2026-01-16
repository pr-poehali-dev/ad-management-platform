import json
import os
import requests
from typing import Optional, Dict, Any, List


def handler(event: dict, context) -> dict:
    """
    API для синхронизации с Яндекс Директ.
    Получает данные о кампаниях, статистику и метрики.
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    yandex_token = os.environ.get('YANDEX_DIRECT_TOKEN')
    if not yandex_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'YANDEX_DIRECT_TOKEN not configured',
                'message': 'Добавьте токен Яндекс Директ в настройках проекта'
            }),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', 'campaigns')
    
    try:
        if action == 'campaigns':
            result = get_campaigns(yandex_token)
        elif action == 'stats':
            campaign_ids = query_params.get('campaign_ids', '').split(',')
            result = get_campaign_stats(yandex_token, campaign_ids)
        elif action == 'sync':
            result = sync_all_data(yandex_token)
        else:
            result = {'error': f'Unknown action: {action}'}
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e),
                'message': 'Ошибка при работе с API Яндекс Директ'
            }),
            'isBase64Encoded': False
        }


def get_campaigns(token: str) -> Dict[str, Any]:
    """Получить список кампаний из Яндекс Директ"""
    url = 'https://api.direct.yandex.com/json/v5/campaigns'
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept-Language': 'ru'
    }
    
    payload = {
        'method': 'get',
        'params': {
            'SelectionCriteria': {},
            'FieldNames': ['Id', 'Name', 'Status', 'State', 'StatusPayment', 'StartDate']
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    
    data = response.json()
    
    if 'error' in data:
        raise Exception(f"Yandex API Error: {data['error']}")
    
    campaigns = data.get('result', {}).get('Campaigns', [])
    
    return {
        'success': True,
        'campaigns': campaigns,
        'total': len(campaigns)
    }


def get_campaign_stats(token: str, campaign_ids: List[str]) -> Dict[str, Any]:
    """Получить статистику по кампаниям"""
    url = 'https://api.direct.yandex.com/json/v5/reports'
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept-Language': 'ru',
        'returnMoneyInMicros': 'false',
        'skipReportHeader': 'true',
        'skipReportSummary': 'true'
    }
    
    payload = {
        'params': {
            'SelectionCriteria': {
                'Filter': [
                    {
                        'Field': 'CampaignId',
                        'Operator': 'IN',
                        'Values': [cid for cid in campaign_ids if cid]
                    }
                ]
            },
            'FieldNames': [
                'CampaignId',
                'CampaignName',
                'Impressions',
                'Clicks',
                'Cost',
                'Conversions',
                'ConversionRate',
                'CostPerConversion'
            ],
            'ReportName': 'Campaign Stats Report',
            'ReportType': 'CAMPAIGN_PERFORMANCE_REPORT',
            'DateRangeType': 'LAST_WEEK',
            'Format': 'TSV',
            'IncludeVAT': 'NO',
            'IncludeDiscount': 'NO'
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 201 or response.status_code == 202:
        return {
            'success': False,
            'message': 'Report is being generated. Try again in a few seconds.'
        }
    
    response.raise_for_status()
    
    lines = response.text.strip().split('\n')
    if not lines:
        return {'success': True, 'stats': []}
    
    headers_line = lines[0].split('\t')
    stats = []
    
    for line in lines[1:]:
        values = line.split('\t')
        if len(values) == len(headers_line):
            stat = dict(zip(headers_line, values))
            stats.append(stat)
    
    return {
        'success': True,
        'stats': stats,
        'total': len(stats)
    }


def sync_all_data(token: str) -> Dict[str, Any]:
    """Синхронизировать все данные: кампании + статистика"""
    campaigns_result = get_campaigns(token)
    
    if not campaigns_result.get('success'):
        return campaigns_result
    
    campaigns = campaigns_result.get('campaigns', [])
    campaign_ids = [str(c['Id']) for c in campaigns[:10]]
    
    if campaign_ids:
        stats_result = get_campaign_stats(token, campaign_ids)
    else:
        stats_result = {'success': True, 'stats': []}
    
    return {
        'success': True,
        'campaigns': campaigns,
        'stats': stats_result.get('stats', []),
        'synced_at': context.request_id if 'context' in globals() else 'unknown'
    }
