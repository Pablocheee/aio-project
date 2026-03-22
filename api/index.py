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
        destination_address="EQCD39VS5jcptHL8vMjEXrzGaRcCV4m_nJ8VLYG72_9FD9ts"
    )
    result = await bridge.execute(intent)
    return {"query": query, "result": result}
