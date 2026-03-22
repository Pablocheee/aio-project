import os
import sys
from fastapi import FastAPI

# Эта магия помогает Python найти папку core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.gateway.gateway_bridge import GatewayBridge, FinancialIntent

app = FastAPI()
bridge = GatewayBridge()

@app.get("/api/process")
async def process_request(query: str = "check"):
    intent = FinancialIntent(
        action="check_balance", 
        amount=0, 
        asset_source="TON", 
        destination_address="UQAVTMHfwYcMn7ttJNXiJVaoA-jjRTeJHc2sjpkAVzc84oSY"
    )
    result = await bridge.execute(intent)
    return {"query": query, "result": result}

@app.get("/api/calculate")
async def get_quote(price: float, scale: float):
    # Этот запрос будет вызывать твой 3D интерфейс
    quote = await bridge.calculate_quote(price, scale)
    return quote
