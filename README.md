# Design Patterns

## 1. Adapter

📌 “Make incompatible things work together”

Why asked: Legacy code + new SDKs is everyday reality.

Where used:

    1. API response normalization
    2. Analytics / logging SDKs
    3. Payment gateways
    4. Browser API wrappers

Typical question:
How would you integrate a third-party SDK without breaking existing code?

## 2. Strategy

📌 “Swap behavior at runtime”

Why asked: Shows clean separation of logic.

Where used:

    1. Pricing rules
    2. Feature flags
    3. Validation rules
    4. Sorting / filtering logic

Typical question:
How do you avoid giant if-else blocks?

## 3.  Factory (Simple / Abstract)

📌 “Create objects without exposing creation logic”

Why asked: Tests architecture thinking.

Where used:

    1. DB clients
    2. API clients
    3. Environment-based services
    4. UI component creation

Typical question:
How do you decide which implementation to instantiate?

## 4.  Observer

📌 “One-to-many dependency”

Why asked: Core to frontend and async systems.

Where used:

    1. Event listeners
    2. RxJS
    3. WebSockets
    4. Pub/Sub systems
    5. State management

Typical question:
How does React know when to re-render?

## 5.  Decorator

📌 “Add behavior without modifying original class”

Why asked: Subtle difference from inheritance.

Where used:

    1. Logging
    2. Authorization
    3. Caching
    4. Middleware
    5. React HOCs

Typical question:
How do you add features without touching existing code?

## 6.  Facade

📌 “Simplify a complex subsystem”

Why asked: Clean API design skill.

Where used:

    1. Service layers
    2. SDK wrappers
    3. Complex backend calls
    4. BFF layers

Typical question:
How do you reduce coupling with complex systems?

## 7.  Singleton

📌 “Single instance globally”

Why asked: Thread-safety & lifecycle discussions.

Where used (carefully):

    1. Config
    2. Logger
    3. DB connection pool
    4. Feature flag client

Typical question:
Why are singletons dangerous?
(They want you to say testability + hidden state.)

## 8.  Command

📌 “Encapsulate actions as objects”

Why asked: Undo/Redo & decoupling.

Where used:

    1. Editor undo/redo
    2. Button actions
    3. Job queues
    4. CQRS

Typical question:
How would you implement undo/redo?

## 9.  State

📌 “Behavior changes based on state”

Why asked: Real-world complexity modeling.

Where used:

    1. UI workflows
    2. Order processing
    3. Payment lifecycle
    4. Finite state machines

Typical question:
How do you avoid complex conditional logic for state transitions?

## 10.  Builder

📌 “Step-by-step object creation”

Why asked: Clean APIs & immutability.

Where used:

    1. HTTP request builders
    2. Test data builders
    3. Complex configs
    

Typical question:
How do you construct complex objects cleanly?


## ⚠️ Patterns You Should Know of but Rarely Code
    1. Flyweight
    2. Memento
    3. Prototype
    4. Visitor
    5. Chain of Responsibility (except middleware)
