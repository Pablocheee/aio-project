import os
import sys
from fastapi import FastAPI

# Магия путей, чтобы видеть папку core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.gateway.gateway_bridge import GatewayBridge, FinancialIntent

app = FastAPI()
bridge = GatewayBridge()

@app.get("/api/process")
async def process_request(query: str = "check", wallet: str = None):
    # Если кошелек передан в запросе, используем его, иначе — тестовый
    target_wallet = wallet or "UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY"
    
    intent = FinancialIntent(
        action="check_balance", 
        amount=0, 
        asset_source="TON", 
        destination_address=target_wallet
    )
    
    result = await bridge.execute(intent)
    
    # ТУТ ЛОГИКА ДЛЯ ТВОЕГО ТЕЛЕГРАМА:
    # Формируем строку для отправки (саму отправку оставь в своем боте)
    status_msg = f"Заказ принят. Баланс клиента: {result.get('balance_ton', 0)} TON"
    
    return {
        "query": query, 
        "result": result,
        "telegram_ready_msg": status_msg
    }

@app.get("/api/calculate")
async def get_quote(price: float, scale: float):
    # Этот запрос будет вызывать твой 3D интерфейс
    # Убедись, что метод calculate_quote добавлен в gateway_bridge.py!
    quote = await bridge.calculate_quote(price, scale)
    return quote
