import httpx
from pydantic import BaseModel, Field
from typing import Optional

# Модель данных для финансовых команд
class FinancialIntent(BaseModel):
    action: str
    amount: float
    asset_source: str
    asset_target: Optional[str] = None
    destination_address: Optional[str] = None

# Класс-шлюз для работы с внешними API
class GatewayBridge:
    def __init__(self):
        # Публичный API TON для проверки баланса
        self.ton_api_url = "https://toncenter.com/api/v2/getAddressBalance"

    async def execute(self, intent: FinancialIntent):
        print(f"--- Gateway: Исполнение {intent.action} ---")
        
        # Если команда - проверить баланс TON
        if intent.asset_source.upper() == "TON" and intent.destination_address:
            balance = await self._get_ton_balance(intent.destination_address)
            return {
                "status": "success",
                "asset": "TON",
                "address": intent.destination_address,
                "balance_ton": int(balance) / 10**9 if balance else 0
            }
        
        return {"status": "error", "message": "Unsupported asset or missing address"}

    async def _get_ton_balance(self, address: str):
        async with httpx.AsyncClient() as client:
            params = {"address": address}
            try:
                response = await client.get(self.ton_api_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("result", "0")
            except Exception as e:
                print(f"Ошибка сети: {e}")
            return "0"

async def calculate_quote(self, base_price: float, global_scale: float):
        """
        Рассчитывает стоимость продукта в зависимости от его глобальности.
        global_scale: от 1 (локальный) до 10 (мировой)
        """
        total = base_price * (1 + (global_scale * 0.5))
        return {
            "base_usd": base_price,
            "global_index": global_scale,
            "final_price_usd": total,
            "ton_equivalent": total / 5.2  # Примерный курс TON
        }
