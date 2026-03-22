from pydantic import BaseModel, Field
from typing import Optional, Union

# 1. Определяем структуру "Намерения" (Intent)
class FinancialIntent(BaseModel):
    action: str = Field(..., description="Тип действия: swap, transfer, deposit")
    amount: float = Field(..., description="Сумма операции")
    asset_source: str = Field(..., description="Исходная валюта (например, USD, RUB, USDT)")
    asset_target: Optional[str] = Field(None, description="Целевая валюта для обмена")
    destination_address: Optional[str] = Field(None, description="Адрес кошелька или номер счета")

# 2. Мост-диспетчер
class GatewayBridge:
    def __init__(self):
        # Здесь в будущем будут API-ключи от Stripe, MoonPay или Web3-провайдеров
        self.supported_assets = ["USDT", "ETH", "TON", "USD", "EUR"]

    async def execute(self, intent: FinancialIntent):
        """
        Главный метод, который решает: отправить запрос в банк (Fiat) 
        или в смарт-контракт (Crypto).
        """
        print(f"Обработка намерения: {intent.action} {intent.amount} {intent.asset_source}")
        
        if self._is_crypto(intent.asset_source) and self._is_crypto(intent.asset_target):
            return await self._process_on_chain(intent)
        else:
            return await self._process_fiat_gateway(intent)

    def _is_crypto(self, asset: str) -> bool:
        return asset.upper() in ["USDT", "ETH", "TON", "BTC"]

    async def _process_on_chain(self, intent: FinancialIntent):
        # Тут будет логика взаимодействия с Web3.py или Li.Fi SDK
        return {"status": "success", "provider": "DeFi_Aggregator", "tx_hash": "0x..."}

    async def _process_fiat_gateway(self, intent: FinancialIntent):
        # Тут будет вызов фиатного шлюза (например, Stripe или Checkout)
        return {"status": "pending", "provider": "Fiat_Provider", "url": "https://pay..."}

# Пример использования:
# bridge = GatewayBridge()
# await bridge.execute(FinancialIntent(action="swap", amount=100, asset_source="USD", asset_target="USDT"))
