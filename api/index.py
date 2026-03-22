import asyncio
from core.gateway.gateway_bridge import GatewayBridge, FinancialIntent

# 1. Имитация твоего семантического ядра (AIO.CORE)
class SemanticEngine:
    async def parse_user_request(self, text: str) -> FinancialIntent:
        # Здесь в реальности будет вызов твоей LLM или поиск по индексам
        # Для примера имитируем распознавание запроса: "Обменяй 500 USD на TON"
        print(f"Семантический анализ запроса: '{text}'...")
        
        # Моделируем результат распознавания
        return FinancialIntent(
            action="swap",
            amount=500.0,
            asset_source="USD",
            asset_target="TON",
            destination_address="EQB...your_wallet"
        )

# 2. Главная логика платформы
async def start_platform():
    # Инициализируем модули
    semantic_brain = SemanticEngine()
    finance_gateway = GatewayBridge()

    print("--- AIO.CORE: Semantic Financial Infrastructure started ---")

    # Пример входящего запроса (от пользователя или через API)
    user_input = "Я хочу сконвертировать 500 баксов в TON и отправить на свой кошелек"

    # Шаг 1: Понимаем, что хочет пользователь
    intent = await semantic_brain.parse_user_request(user_input)

    # Шаг 2: Выполняем финансовую операцию через шлюз
    result = await finance_gateway.execute(intent)

    # Шаг 3: Выводим результат
    print(f"\nРезультат операции: {result}")

if __name__ == "__main__":
    asyncio.run(start_platform())
