import os
import sys
import httpx
from fastapi import FastAPI

# Магия путей
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.gateway.gateway_bridge import GatewayBridge, FinancialIntent

app = FastAPI()
bridge = GatewayBridge()

# НАСТРОЙКИ ТЕЛЕГРАМА (Вставь свои данные)
TG_TOKEN = "8552516975:AAF3AArF0cWXJj8yrbM3SWVnnZAohwzmeXc"
MY_ID = "7318415778"

async def send_to_tg(text: str):
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": MY_ID, "text": text, "parse_mode": "HTML"})

@app.get("/api/process")
async def process_request(query: str = "check", wallet: str = None):
    target_wallet = wallet or "UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY"
    
    # 1. Проверяем кошелек через AIO Bridge
    intent = FinancialIntent(
        action="check_balance", 
        amount=0, 
        asset_source="TON", 
        destination_address=target_wallet
    )
    result = await bridge.execute(intent)
    balance = result.get('balance_ton', 0)

    # 2. Формируем отчет для тебя
    report = (
        f"<b>🚀 Новый запрос AIO.CORE</b>\n"
        f"Запрос: {query}\n"
        f"Кошелек: <code>{target_wallet}</code>\n"
        f"Баланс: <b>{balance} TON</b>"
    )

    # 3. Отправляем в Telegram автоматически
    try:
        await send_to_tg(report)
        tg_status = "Sent to Admin"
    except Exception as e:
        tg_status = f"Error: {e}"
    
    return {
        "status": "success",
        "telegram": tg_status,
        "data": result
    }

@app.get("/api/calculate")
async def get_quote(price: float, scale: float):
    # Убедись, что метод calculate_quote есть в gateway_bridge.py
    quote = await bridge.calculate_quote(price, scale)
    return quote
