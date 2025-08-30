// Professional Calendar Keyboard Shortcuts System
import { message } from 'antd';

export class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.context = 'global';
    this.helpVisible = false;
  }

  // Register a keyboard shortcut
  register(keys, callback, options = {}) {
    const shortcut = {
      keys: this.normalizeKeys(keys),
      callback,
      description: options.description || '',
      context: options.context || 'global',
      preventDefault: options.preventDefault !== false,
      category: options.category || 'General'
    };
    
    this.shortcuts.set(keys, shortcut);
    return this;
  }

  // Normalize key combinations
  normalizeKeys(keys) {
    return keys.toLowerCase()
      .replace(/\s/g, '')
      .replace(/cmd/g, 'meta')
      .replace(/ctrl/g, 'control')
      .split('+')
      .sort()
      .join('+');
  }

  // Initialize default calendar shortcuts
  initCalendarShortcuts(calendarCallbacks) {
    const shortcuts = [
      // Navigation
      {
        keys: 'alt+left',
        callback: () => calendarCallbacks.navigatePrevious(),
        description: 'Previous time period',
        category: 'Navigation'
      },
      {
        keys: 'alt+right',
        callback: () => calendarCallbacks.navigateNext(),
        description: 'Next time period',
        category: 'Navigation'
      },
      {
        keys: 't',
        callback: () => calendarCallbacks.goToToday(),
        description: 'Go to today',
        category: 'Navigation'
      },
      {
        keys: 'g',
        callback: () => calendarCallbacks.showGoToDate(),
        description: 'Go to specific date',
        category: 'Navigation'
      },
      
      // View Controls
      {
        keys: '1',
        callback: () => calendarCallbacks.setView('day'),
        description: 'Day view',
        category: 'Views'
      },
      {
        keys: '2',
        callback: () => calendarCallbacks.setView('week'),
        description: 'Week view',
        category: 'Views'
      },
      {
        keys: '3',
        callback: () => calendarCallbacks.setView('month'),
        description: 'Month view',
        category: 'Views'
      },
      
      // Selection
      {
        keys: 'ctrl+a',
        callback: () => calendarCallbacks.selectAll(),
        description: 'Select all slots',
        category: 'Selection'
      },
      {
        keys: 'ctrl+shift+a',
        callback: () => calendarCallbacks.clearSelection(),
        description: 'Clear selection',
        category: 'Selection'
      },
      {
        keys: 'ctrl+i',
        callback: () => calendarCallbacks.invertSelection(),
        description: 'Invert selection',
        category: 'Selection'
      },
      
      // Slot Operations
      {
        keys: 'n',
        callback: () => calendarCallbacks.createNewSlot(),
        description: 'Create new slot',
        category: 'Slot Management'
      },
      {
        keys: 'r',
        callback: () => calendarCallbacks.showRecurringSlots(),
        description: 'Create recurring slots',
        category: 'Slot Management'
      },
      {
        keys: 'b',
        callback: () => calendarCallbacks.blockSelected(),
        description: 'Block selected slots',
        category: 'Slot Management'
      },
      {
        keys: 'u',
        callback: () => calendarCallbacks.unblockSelected(),
        description: 'Unblock selected slots',
        category: 'Slot Management'
      },
      {
        keys: 'delete',
        callback: () => calendarCallbacks.deleteSelected(),
        description: 'Delete selected slots',
        category: 'Slot Management'
      },
      {
        keys: 'backspace',
        callback: () => calendarCallbacks.deleteSelected(),
        description: 'Delete selected slots',
        category: 'Slot Management'
      },
      
      // Copy/Paste
      {
        keys: 'ctrl+c',
        callback: () => calendarCallbacks.copySelected(),
        description: 'Copy selected slots',
        category: 'Clipboard'
      },
      {
        keys: 'ctrl+v',
        callback: () => calendarCallbacks.pasteSlots(),
        description: 'Paste slots',
        category: 'Clipboard'
      },
      {
        keys: 'ctrl+x',
        callback: () => calendarCallbacks.cutSelected(),
        description: 'Cut selected slots',
        category: 'Clipboard'
      },
      
      // Bulk Operations
      {
        keys: 'ctrl+shift+b',
        callback: () => calendarCallbacks.showBulkActions(),
        description: 'Show bulk actions',
        category: 'Bulk Operations'
      },
      {
        keys: 'ctrl+shift+r',
        callback: () => calendarCallbacks.refreshCalendar(),
        description: 'Refresh calendar',
        category: 'Actions'
      },
      
      // Search and Filter
      {
        keys: 'ctrl+f',
        callback: () => calendarCallbacks.showSearch(),
        description: 'Search appointments',
        category: 'Search'
      },
      {
        keys: 'ctrl+shift+f',
        callback: () => calendarCallbacks.showAdvancedFilter(),
        description: 'Advanced filter',
        category: 'Search'
      },
      
      // Quick Actions
      {
        keys: 'f5',
        callback: () => calendarCallbacks.refreshCalendar(),
        description: 'Refresh calendar',
        category: 'Actions'
      },
      {
        keys: 'ctrl+s',
        callback: () => calendarCallbacks.saveChanges(),
        description: 'Save changes',
        category: 'Actions'
      },
      {
        keys: 'ctrl+z',
        callback: () => calendarCallbacks.undo(),
        description: 'Undo last action',
        category: 'Actions'
      },
      {
        keys: 'ctrl+y',
        callback: () => calendarCallbacks.redo(),
        description: 'Redo last action',
        category: 'Actions'
      },
      
      // Help and Accessibility
      {
        keys: 'f1',
        callback: () => this.showHelp(),
        description: 'Show keyboard shortcuts',
        category: 'Help'
      },
      {
        keys: 'shift+/',
        callback: () => this.showHelp(),
        description: 'Show keyboard shortcuts',
        category: 'Help'
      },
      {
        keys: 'escape',
        callback: () => calendarCallbacks.escape(),
        description: 'Cancel current action',
        category: 'General'
      },
      
      // Multi-select mode
      {
        keys: 'm',
        callback: () => calendarCallbacks.toggleMultiSelectMode(),
        description: 'Toggle multi-select mode',
        category: 'Selection'
      },
      
      // Focus management
      {
        keys: 'tab',
        callback: (e) => this.handleTabNavigation(e, calendarCallbacks),
        description: 'Navigate to next element',
        category: 'Navigation',
        preventDefault: false
      },
      {
        keys: 'shift+tab',
        callback: (e) => this.handleShiftTabNavigation(e, calendarCallbacks),
        description: 'Navigate to previous element',
        category: 'Navigation',
        preventDefault: false
      }
    ];

    shortcuts.forEach(shortcut => {
      this.register(shortcut.keys, shortcut.callback, {
        description: shortcut.description,
        category: shortcut.category
      });
    });

    return this;
  }

  // Handle keyboard events
  handleKeyEvent(e) {
    if (!this.isEnabled) return;

    const pressedKeys = this.getPressedKeys(e);
    const shortcut = this.shortcuts.get(pressedKeys);

    if (shortcut && this.isShortcutValid(shortcut, e)) {
      if (shortcut.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      try {
        shortcut.callback(e);
        this.showShortcutFeedback(shortcut);
      } catch (error) {
        console.error('Shortcut execution failed:', error);
        message.error('Shortcut execution failed');
      }
    }
  }

  // Get pressed key combination
  getPressedKeys(e) {
    const keys = [];
    
    if (e.ctrlKey || e.metaKey) keys.push('control');
    if (e.altKey) keys.push('alt');
    if (e.shiftKey) keys.push('shift');
    
    // Handle special keys
    const keyMap = {
      ' ': 'space',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'Delete': 'delete',
      'Backspace': 'backspace',
      'Enter': 'enter',
      'Escape': 'escape',
      'Tab': 'tab',
      'F1': 'f1',
      'F5': 'f5'
    };
    
    const key = keyMap[e.key] || e.key.toLowerCase();
    keys.push(key);
    
    return keys.sort().join('+');
  }

  // Check if shortcut is valid in current context
  isShortcutValid(shortcut, e) {
    // Don't trigger shortcuts when typing in input fields
    const activeElement = document.activeElement;
    const isInInputField = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );

    if (isInInputField && !shortcut.keys.includes('escape')) {
      return false;
    }

    // Check context
    if (shortcut.context !== 'global' && shortcut.context !== this.context) {
      return false;
    }

    return true;
  }

  // Show visual feedback for shortcut execution
  showShortcutFeedback(shortcut) {
    const feedback = document.createElement('div');
    feedback.className = 'shortcut-feedback';
    feedback.innerHTML = shortcut.description;
    feedback.style.cssText = `
      position: fixed;
      top: 50px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      animation: shortcutFeedback 2s ease-out forwards;
    `;

    document.body.appendChild(feedback);
    
    setTimeout(() => {
      if (document.body.contains(feedback)) {
        document.body.removeChild(feedback);
      }
    }, 2000);
  }

  // Show keyboard shortcuts help
  showHelp() {
    if (this.helpVisible) return;
    
    this.helpVisible = true;
    const helpModal = this.createHelpModal();
    document.body.appendChild(helpModal);
  }

  // Create help modal
  createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-shortcuts-help';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    `;

    content.innerHTML = this.generateHelpContent();
    modal.appendChild(content);

    // Close on click outside or ESC
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeHelp(modal);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeHelp(modal);
      }
    });

    return modal;
  }

  // Generate help content
  generateHelpContent() {
    const categories = {};
    
    // Group shortcuts by category
    this.shortcuts.forEach(shortcut => {
      const category = shortcut.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(shortcut);
    });

    let html = '<h2 style="margin: 0 0 20px 0; color: #1890ff;">⌨️ Keyboard Shortcuts</h2>';
    
    Object.entries(categories).forEach(([category, shortcuts]) => {
      html += `<div style="margin-bottom: 24px;">`;
      html += `<h3 style="color: #595959; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${category}</h3>`;
      html += `<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">`;
      
      shortcuts.forEach(shortcut => {
        const keys = this.formatKeys(shortcut.keys);
        html += `
          <div style="display: contents;">
            <div style="font-family: monospace; font-size: 12px; color: #8c8c8c; padding: 4px 8px; background: #f5f5f5; border-radius: 4px; text-align: center;">
              ${keys}
            </div>
            <div style="padding: 4px 0; font-size: 13px; color: #262626;">
              ${shortcut.description}
            </div>
          </div>
        `;
      });
      
      html += `</div></div>`;
    });

    html += `
      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
        <button onclick="this.closest('.keyboard-shortcuts-help').remove(); window.keyboardManager.helpVisible = false;" 
                style="background: #1890ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Close (ESC)
        </button>
      </div>
    `;

    return html;
  }

  // Format keys for display
  formatKeys(keys) {
    return keys
      .split('+')
      .map(key => {
        const keyMap = {
          'control': '⌘/Ctrl',
          'alt': 'Alt',
          'shift': '⇧',
          'left': '←',
          'right': '→',
          'up': '↑',
          'down': '↓',
          'delete': 'Del',
          'backspace': '⌫',
          'enter': '↵',
          'escape': 'Esc',
          'tab': '⇥',
          'space': 'Space'
        };
        return keyMap[key] || key.toUpperCase();
      })
      .join(' + ');
  }

  // Close help modal
  closeHelp(modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 300);
    this.helpVisible = false;
  }

  // Handle tab navigation
  handleTabNavigation(e, callbacks) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    if (nextIndex >= 0) {
      focusableElements[nextIndex].focus();
      e.preventDefault();
    }
  }

  // Handle shift+tab navigation
  handleShiftTabNavigation(e, callbacks) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    
    if (prevIndex >= 0) {
      focusableElements[prevIndex].focus();
      e.preventDefault();
    }
  }

  // Get focusable elements
  getFocusableElements() {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '.calendar-slot-cell[tabindex="0"]'
    ];
    
    return Array.from(document.querySelectorAll(selectors.join(',')));
  }

  // Enable/disable shortcuts
  enable() {
    this.isEnabled = true;
    return this;
  }

  disable() {
    this.isEnabled = false;
    return this;
  }

  // Set context
  setContext(context) {
    this.context = context;
    return this;
  }

  // Initialize event listeners
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyEvent(e));
    
    // Add global reference for help modal
    window.keyboardManager = this;
    
    // Add required CSS
    this.injectCSS();
    
    return this;
  }

  // Inject required CSS
  injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes shortcutFeedback {
        0% { opacity: 0; transform: translateX(100px); }
        15% { opacity: 1; transform: translateX(0); }
        85% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100px); }
      }
      
      .keyboard-shortcuts-help {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      
      .shortcut-feedback {
        user-select: none;
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Cleanup
  destroy() {
    this.shortcuts.clear();
    this.isEnabled = false;
    
    if (window.keyboardManager === this) {
      delete window.keyboardManager;
    }
  }
}

// Export convenience function
export const createKeyboardManager = (calendarCallbacks) => {
  const manager = new KeyboardShortcutManager();
  manager.initCalendarShortcuts(calendarCallbacks).init();
  return manager;
};