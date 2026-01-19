/**
 * MEMENTO PATTERN - Production Implementation
 * Use Case: Document editor with undo/redo and checkpoint support
 */

// ============================================================================
// 1. MEMENTO - The snapshot container
// ============================================================================

interface DocumentState {
  content: string;
  fontSize: number;
  lineSpacing: number;
  fontFamily: string;
}

class DocumentMemento {
  private readonly timestamp: number;
  private readonly state: DocumentState;

  constructor(state: DocumentState) {
    this.state = { ...state }; // Deep copy to ensure immutability
    this.timestamp = Date.now();
  }

  // Memento exposes state but in a controlled way
  getState(): DocumentState {
    return { ...this.state };
  }

  getTimestamp(): number {
    return this.timestamp;
  }
}

// ============================================================================
// 2. ORIGINATOR - The object whose state we capture
// ============================================================================

class Document {
  private content: string = "";
  private fontSize: number = 12;
  private lineSpacing: number = 1.5;
  private fontFamily: string = "Arial";

  // Public API for document operations
  setText(content: string): void {
    this.content = content;
  }

  getText(): string {
    return this.content;
  }

  setFontSize(size: number): void {
    this.fontSize = size;
  }

  getFontSize(): number {
    return this.fontSize;
  }

  setLineSpacing(spacing: number): void {
    this.lineSpacing = spacing;
  }

  getLineSpacing(): number {
    return this.lineSpacing;
  }

  setFontFamily(family: string): void {
    this.fontFamily = family;
  }

  getFontFamily(): string {
    return this.fontFamily;
  }

  // Core memento functionality
  createMemento(): DocumentMemento {
    return new DocumentMemento({
      content: this.content,
      fontSize: this.fontSize,
      lineSpacing: this.lineSpacing,
      fontFamily: this.fontFamily,
    });
  }

  restoreFromMemento(memento: DocumentMemento): void {
    const state = memento.getState();
    this.content = state.content;
    this.fontSize = state.fontSize;
    this.lineSpacing = state.lineSpacing;
    this.fontFamily = state.fontFamily;
  }

  // For debugging/testing
  getState(): DocumentState {
    return {
      content: this.content,
      fontSize: this.fontSize,
      lineSpacing: this.lineSpacing,
      fontFamily: this.fontFamily,
    };
  }
}

// ============================================================================
// 3. CARETAKER - Manages mementos and undo/redo
// ============================================================================

class UndoRedoManager {
  private undoStack: DocumentMemento[] = [];
  private redoStack: DocumentMemento[] = [];
  private checkpoints: Map<string, DocumentMemento> = new Map();

  // Save current state to undo history
  saveState(document: Document): void {
    // When we perform a new action, clear the redo stack
    this.redoStack = [];
    this.undoStack.push(document.createMemento());
  }

  undo(document: Document): boolean {
    if (this.undoStack.length === 0) {
      return false;
    }

    // Save current state to redo stack before undoing
    this.redoStack.push(document.createMemento());
    const memento = this.undoStack.pop()!;
    document.restoreFromMemento(memento);
    return true;
  }

  redo(document: Document): boolean {
    if (this.redoStack.length === 0) {
      return false;
    }

    this.undoStack.push(document.createMemento());
    const memento = this.redoStack.pop()!;
    document.restoreFromMemento(memento);
    return true;
  }

  // Create a named checkpoint
  createCheckpoint(name: string, document: Document): void {
    this.checkpoints.set(name, document.createMemento());
  }

  // Jump to a specific checkpoint
  restoreCheckpoint(name: string, document: Document): boolean {
    const memento = this.checkpoints.get(name);
    if (!memento) {
      return false;
    }

    // Save current state to undo stack
    this.undoStack.push(document.createMemento());
    this.redoStack = []; // Clear redo stack when jumping
    document.restoreFromMemento(memento);
    return true;
  }

  // List all available checkpoints
  listCheckpoints(): string[] {
    return Array.from(this.checkpoints.keys());
  }

  deleteCheckpoint(name: string): boolean {
    return this.checkpoints.delete(name);
  }

  // Clear all history
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.checkpoints.clear();
  }

  // Get history stats (useful for memory monitoring)
  getStats(): {
    undoStackSize: number;
    redoStackSize: number;
    checkpointCount: number;
  } {
    return {
      undoStackSize: this.undoStack.length,
      redoStackSize: this.redoStack.length,
      checkpointCount: this.checkpoints.size,
    };
  }
}

// ============================================================================
// 4. USAGE EXAMPLE & TEST SCENARIOS
// ============================================================================

function demonstrateMemento(): void {
  console.log("=== MEMENTO PATTERN DEMONSTRATION ===\n");

  const document = new Document();
  const undoManager = new UndoRedoManager();

  // Scenario 1: Basic undo/redo
  console.log("--- Scenario 1: Basic Undo/Redo ---");
  document.setText("Hello");
  undoManager.saveState(document);
  console.log("After first edit:", document.getText()); // Hello

  document.setText("Hello World");
  undoManager.saveState(document);
  console.log("After second edit:", document.getText()); // Hello World

  document.setText("Hello World!");
  undoManager.saveState(document);
  console.log("After third edit:", document.getText()); // Hello World!

  undoManager.undo(document);
  console.log("After undo:", document.getText()); // Hello World

  undoManager.undo(document);
  console.log("After second undo:", document.getText()); // Hello

  undoManager.redo(document);
  console.log("After redo:", document.getText()); // Hello World

  // Scenario 2: Checkpoints
  console.log("\n--- Scenario 2: Checkpoints ---");
  undoManager.clearHistory();

  document.setText("Version 1");
  document.setFontSize(12);
  undoManager.createCheckpoint("v1", document);
  console.log("Created checkpoint 'v1'");

  document.setText("Version 2 - Major Changes");
  document.setFontSize(14);
  document.setLineSpacing(2);
  undoManager.saveState(document);
  console.log("Current state:", document.getText(), "| Size:", document.getFontSize());

  document.setText("Version 3 - More Changes");
  document.setFontSize(16);
  undoManager.saveState(document);
  console.log("Current state:", document.getText(), "| Size:", document.getFontSize());

  undoManager.restoreCheckpoint("v1", document);
  console.log(
    "After jumping to v1:",
    document.getText(),
    "| Size:",
    document.getFontSize()
  );

  // Scenario 3: Complex state with multiple properties
  console.log("\n--- Scenario 3: Complex State ---");
  undoManager.clearHistory();

  document.setText("The Quick Brown Fox");
  document.setFontSize(12);
  document.setFontFamily("Arial");
  document.setLineSpacing(1.5);
  undoManager.saveState(document);

  console.log("State 1:", document.getState());

  document.setFontSize(18);
  document.setFontFamily("Georgia");
  document.setLineSpacing(2);
  undoManager.saveState(document);

  console.log("State 2:", document.getState());

  undoManager.undo(document);
  console.log("After undo:", document.getState());

  // Scenario 4: Memory stats
  console.log("\n--- Scenario 4: History Stats ---");
  console.log("Undo/Redo Stats:", undoManager.getStats());

  // Scenario 5: Interview question - What happens if we modify redo after undo?
  console.log("\n--- Scenario 5: Redo Stack Behavior ---");
  undoManager.clearHistory();

  document.setText("State A");
  undoManager.saveState(document);
  document.setText("State B");
  undoManager.saveState(document);
  document.setText("State C");
  undoManager.saveState(document);

  console.log("Current:", document.getText()); // State C

  undoManager.undo(document);
  console.log("After 1st undo:", document.getText()); // State B

  // Now perform a NEW edit instead of redo
  document.setText("State B (Modified)");
  undoManager.saveState(document);

  console.log(
    "After new edit (redo stack should be cleared):",
    document.getText()
  );
  console.log("Stats:", undoManager.getStats()); // redoStackSize should be 0
}

// Run the demonstration
demonstrateMemento();

// ============================================================================
// 5. INTERVIEW TALKING POINTS
// ============================================================================

/*
KEY POINTS TO MENTION IN AN INTERVIEW:

1. ENCAPSULATION
   - The Document class controls what gets saved and how it's restored
   - External systems (UndoManager) never directly access private fields
   - If Document structure changes, only Document needs to change

2. SINGLE RESPONSIBILITY
   - Document: manages content
   - DocumentMemento: stores snapshots
   - UndoRedoManager: manages history
   - Each class has one reason to change

3. REAL-WORLD TRADE-OFFS
   - Memory: Storing many mementos can consume significant memory
   - Solution: Implement state compression, delta storage, or cap history size
   - This is where interviewers will probe your thinking!

4. WHEN TO USE
   - Undo/redo functionality
   - Transactional rollback
   - Saving/restoring application state
   - Version control systems

5. WHEN NOT TO USE
   - Simple state that can be reconstructed cheaply
   - Real-time systems where capturing state is expensive
   - Large objects with infrequent changes (use other patterns like flyweight)

6. RELATED PATTERNS
   - Command Pattern: Often works WITH Memento (commands store mementos)
   - Prototype Pattern: Alternative for copying state
   - Observer Pattern: Can notify listeners when state changes
*/