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

async def calculate_quote(self, price: float, scale: float):
        """
        Рассчитывает стоимость проекта.
        price: Базовая цена (например, 500$)
        scale: Глобальность от 1 (локальный) до 10 (мировой масштаб)
        """
        # Логика: чем выше глобальность, тем больше множитель сложности
        multiplier = 1 + (scale * 0.2) 
        final_usd = price * multiplier
        
        # Для AIO-эффекта добавим эквивалент в TON (возьмем средний курс 5.3)
        ton_price = final_usd / 5.3 

        return {
            "status": "calculated",
            "base_price": price,
            "global_scale": scale,
            "total_usd": round(final_usd, 2),
            "total_ton": round(ton_price, 2)
        }
