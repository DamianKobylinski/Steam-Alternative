# Site Reliability Engineering (SRE) - Standardy i Definicje

Dokument ten definiuje standardy niezawodności (Reliability) dla platformy Steam-Alternative, w tym definicje SLA, SLO, SLI oraz Budżety Błędu.

## 1. Definicje

- **SLI (Service Level Indicator)**: Ilościowa miara poziomu usługi, np. czas odpowiedzi lub wskaźnik błędów. To jest to, co faktycznie mierzymy.
- **SLO (Service Level Objective)**: Docelowa wartość dla SLI, np. "99.9% żądań zakończy się sukcesem". To jest nasz wewnętrzny cel.
- **SLA (Service Level Agreement)**: Formalna umowa z użytkownikiem (lub klientem biznesowym) określająca minimalny poziom usług oraz konsekwencje jego niedotrzymania. Zazwyczaj lżejsza niż SLO.
- **Budżet Błędu (Error Budget)**: Dopuszczalny margines błędu (100% - SLO). Jeśli go wyczerpiemy, wstrzymujemy nowe wdrożenia, aby skupić się na stabilności.

## 2. Zdefiniowane Usługi i Cele

### 2.1. Aplikacja Frontendowa (Next.js)

Główny interfejs dla użytkowników końcowych.

*   **Dostępność (Availability)**
    *   **SLI**: Odsetek żądań HTTP zakończonych kodem innym niż 5xx.
    *   **SLO**: 99.9% w skali miesiąca.
    *   **SLA**: 99.5% w skali miesiąca.
    *   **Budżet Błędu**: ~43 minuty niedostępności miesięcznie (dla SLO 99.9%).

*   **Opóźnienie (Latency)**
    *   **SLI**: Odsetek żądań obsłużonych w czasie poniżej 500ms (P95).
    *   **SLO**: 95% żądań < 500ms.
    *   **SLA**: Brak formalnego SLA dla czasu odpowiedzi, cel internalny.

### 2.2. Baza Danych (PostgreSQL)

Krytyczny komponent przechowujący stan aplikacji.

*   **Dostępność (Availability)**
    *   **SLI**: Odsetek udanych połączeń i zapytań (Query Success Rate).
    *   **SLO**: 99.95% w skali miesiąca.
    *   **SLA**: 99.9% w skali miesiąca.

*   **Wydajność (Performance)**
    *   **SLI**: Czas wykonania zapytania (Query Duration).
    *   **SLO**: 99% zapytań < 1s.

### 2.3. Serwis Zdjęć (Microservice)

Serwis odpowiedzialny za serwowanie statycznych assetów.

*   **Dostępność**
    *   **SLI**: Dostępność endpointu `/health`.
    *   **SLO**: 99.9% w skali miesiąca.

## 3. Polityka Budżetu Błędu

1.  **Stan Zielony (Budżet > 20%)**: Standardowy rozwój funkcji, wdrażanie zmian w dowolnym momencie.
2.  **Stan Żółty (Budżet < 20%)**: Zwiększona ostrożność. Code freeze dla ryzykownych zmian. Wymagane dodatkowe testy/review.
3.  **Stan Czerwony (Budżet Wyczerpany)**:
    *   Całkowite wstrzymanie wdrażania nowych funkcji (feature freeze).
    *   Zespół inżynierski skupia się wyłącznie na poprawie stabilności i niezawodności (Reliability Sprint).
    *   Wyjątkiem są krytyczne poprawki bezpieczeństwa.

## 4. Monitorowanie i Alerty

Monitorowanie odbywa się za pomocą stacku Prometheus + Grafana.

*   **Alerty Szybkie (Fast Burn)**: Gdy budżet błędu zużywa się w tempie, które wyczerpie go w ciągu 1 godziny. Wymaga natychmiastowej reakcji (Page).
*   **Alerty Wolne (Slow Burn)**: Gdy budżet błędu zużywa się w tempie, które wyczerpie go w ciągu 3 dni. Wymaga reakcji w godzinach pracy (Ticket).

---
*Dokument utrzymywany przez zespół SRE.*
