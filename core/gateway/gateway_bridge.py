import httpx
from pydantic import BaseModel
from typing import Optional

# Описание того, как выглядит финансовая команда
class FinancialIntent(BaseModel):
    action: str
    amount: float
    asset_source: str
    asset_target: Optional[str] = None
    destination_address: Optional[str] = None

# Сам механизм связи с блокчейном
class GatewayBridge:
    def __init__(self):
        # Публичный адрес для проверки баланса TON
        self.ton_api_url = "https://toncenter.com/api/v2/getAddressBalance"

    async def execute(self, intent: FinancialIntent):
        # Если команда - проверить баланс в сети TON
        if intent.asset_source.upper() == "TON" and intent.destination_address:
            balance = await self._get_ton_balance(intent.destination_address)
            return {
                "status": "success",
                "asset": "TON",
                "address": intent.destination_address,
                "balance_ton": int(balance) / 10**9 if balance else 0
            }
        
        return {"status": "error", "message": "Asset not supported or address missing"}

    async def _get_ton_balance(self, address: str):
        async with httpx.AsyncClient() as client:
            params = {"address": address}
            try:
                response = await client.get(self.ton_api_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("result", "0")
            except Exception:
                return "0"
