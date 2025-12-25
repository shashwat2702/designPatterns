## designPatterns

1. Adapter

📌 “Make incompatible things work together”

Why asked: Legacy code + new SDKs is everyday reality.
Where used:
    API response normalization
    Analytics / logging SDKs
    Payment gateways
    Browser API wrappers
Typical question:
How would you integrate a third-party SDK without breaking existing code?

2. Strategy

📌 “Swap behavior at runtime”

Why asked: Shows clean separation of logic.
Where used:
    Pricing rules
    Feature flags
    Validation rules
    Sorting / filtering logic
Typical question:
How do you avoid giant if-else blocks?

3.  Factory (Simple / Abstract)

📌 “Create objects without exposing creation logic”

Why asked: Tests architecture thinking.
Where used:
    DB clients
    API clients
    Environment-based services
    UI component creation
Typical question:
How do you decide which implementation to instantiate?

4.  Observer

📌 “One-to-many dependency”

Why asked: Core to frontend and async systems.
Where used:
    Event listeners
    RxJS
    WebSockets
    Pub/Sub systems
    State management
Typical question:
How does React know when to re-render?

5.  Decorator

📌 “Add behavior without modifying original class”

Why asked: Subtle difference from inheritance.
Where used:
    Logging
    Authorization
    Caching
    Middleware
    React HOCs
Typical question:
How do you add features without touching existing code?

6.  Facade

📌 “Simplify a complex subsystem”

Why asked: Clean API design skill.
Where used:
    Service layers
    SDK wrappers
    Complex backend calls
    BFF layers
Typical question:
How do you reduce coupling with complex systems?

7.  Singleton

📌 “Single instance globally”

Why asked: Thread-safety & lifecycle discussions.
Where used (carefully):
    Config
    Logger
    DB connection pool
    Feature flag client
Typical question:
Why are singletons dangerous?
(They want you to say testability + hidden state.)

8.  Command

📌 “Encapsulate actions as objects”

Why asked: Undo/Redo & decoupling.
Where used:
    Editor undo/redo
    Button actions
    Job queues
    CQRS
Typical question:
How would you implement undo/redo?

9.  State

📌 “Behavior changes based on state”

Why asked: Real-world complexity modeling.
Where used:
    UI workflows
    Order processing
    Payment lifecycle
    Finite state machines
Typical question:
How do you avoid complex conditional logic for state transitions?

10.  Builder

📌 “Step-by-step object creation”

Why asked: Clean APIs & immutability.
Where used:
    HTTP request builders
    Test data builders
    Complex configs
Typical question:
How do you construct complex objects cleanly?


⚠️ Patterns You Should Know of but Rarely Code
    1. Flyweight
    2. Memento
    3. Prototype
    4. Visitor
    5. Chain of Responsibility (except middleware)
