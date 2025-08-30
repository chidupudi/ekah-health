// Advanced Drag and Drop Utilities for Professional Calendar
import moment from 'moment';

export class CalendarDragDrop {
  constructor() {
    this.draggedItem = null;
    this.dropTarget = null;
    this.ghostElement = null;
    this.callbacks = {};
  }

  // Initialize drag and drop functionality
  init(callbacks = {}) {
    this.callbacks = {
      onDragStart: callbacks.onDragStart || (() => {}),
      onDragEnd: callbacks.onDragEnd || (() => {}),
      onDrop: callbacks.onDrop || (() => {}),
      onDragOver: callbacks.onDragOver || (() => {}),
      canDrop: callbacks.canDrop || (() => true),
      ...callbacks
    };
  }

  // Create ghost element for drag preview
  createGhostElement(sourceElement, item) {
    const ghost = sourceElement.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.8';
    ghost.style.transform = 'rotate(2deg) scale(0.9)';
    ghost.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
    ghost.style.borderRadius = '8px';
    ghost.style.pointerEvents = 'none';
    
    // Add drag indicator
    const indicator = document.createElement('div');
    indicator.innerHTML = '📅';
    indicator.style.position = 'absolute';
    indicator.style.top = '-10px';
    indicator.style.right = '-10px';
    indicator.style.fontSize = '16px';
    indicator.style.background = 'white';
    indicator.style.borderRadius = '50%';
    indicator.style.width = '24px';
    indicator.style.height = '24px';
    indicator.style.display = 'flex';
    indicator.style.alignItems = 'center';
    indicator.style.justifyContent = 'center';
    indicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    
    ghost.appendChild(indicator);
    document.body.appendChild(ghost);
    
    return ghost;
  }

  // Handle drag start
  handleDragStart(e, item, sourceElement) {
    this.draggedItem = item;
    
    // Create ghost element
    this.ghostElement = this.createGhostElement(sourceElement, item);
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    
    // Custom drag image
    e.dataTransfer.setDragImage(this.ghostElement, 50, 25);
    
    // Add dragging class
    sourceElement.classList.add('dragging');
    
    // Trigger callback
    this.callbacks.onDragStart(item, e);
    
    // Update cursor
    document.body.style.cursor = 'grabbing';
  }

  // Handle drag end
  handleDragEnd(e, sourceElement) {
    // Remove ghost element
    if (this.ghostElement) {
      document.body.removeChild(this.ghostElement);
      this.ghostElement = null;
    }
    
    // Remove dragging class
    sourceElement.classList.remove('dragging');
    
    // Reset cursor
    document.body.style.cursor = '';
    
    // Clear drop target
    this.clearDropTarget();
    
    // Trigger callback
    this.callbacks.onDragEnd(this.draggedItem, e);
    
    // Reset
    this.draggedItem = null;
  }

  // Handle drag over
  handleDragOver(e, targetElement, dropData) {
    e.preventDefault();
    
    if (!this.draggedItem || !this.callbacks.canDrop(this.draggedItem, dropData)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    // Update drop target
    this.setDropTarget(targetElement, dropData);
    
    // Trigger callback
    this.callbacks.onDragOver(this.draggedItem, dropData, e);
  }

  // Handle drop
  async handleDrop(e, targetElement, dropData) {
    e.preventDefault();
    
    if (!this.draggedItem) return;
    
    // Check if drop is allowed
    if (!this.callbacks.canDrop(this.draggedItem, dropData)) {
      this.showDropError('Cannot drop item here');
      return;
    }
    
    // Show loading state
    this.showDropLoading(targetElement);
    
    try {
      // Trigger drop callback
      await this.callbacks.onDrop(this.draggedItem, dropData, e);
      this.showDropSuccess(targetElement);
    } catch (error) {
      this.showDropError('Drop failed: ' + error.message);
    } finally {
      this.hideDropLoading(targetElement);
      this.clearDropTarget();
    }
  }

  // Set drop target visual feedback
  setDropTarget(element, data) {
    this.clearDropTarget();
    this.dropTarget = { element, data };
    element.classList.add('drop-target');
  }

  // Clear drop target visual feedback
  clearDropTarget() {
    if (this.dropTarget) {
      this.dropTarget.element.classList.remove('drop-target');
      this.dropTarget = null;
    }
  }

  // Show drop loading state
  showDropLoading(element) {
    element.classList.add('drop-loading');
    const spinner = document.createElement('div');
    spinner.className = 'drop-spinner';
    spinner.innerHTML = '⟳';
    element.appendChild(spinner);
  }

  // Hide drop loading state
  hideDropLoading(element) {
    element.classList.remove('drop-loading');
    const spinner = element.querySelector('.drop-spinner');
    if (spinner) {
      element.removeChild(spinner);
    }
  }

  // Show drop success animation
  showDropSuccess(element) {
    element.classList.add('drop-success');
    setTimeout(() => {
      element.classList.remove('drop-success');
    }, 1000);
  }

  // Show drop error
  showDropError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'drop-error-toast';
    toast.innerHTML = `❌ ${message}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.background = '#ff4d4f';
    toast.style.color = 'white';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = '10000';
    toast.style.boxShadow = '0 4px 12px rgba(255,77,79,0.3)';
    toast.style.animation = 'slideInRight 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Validate drop operation
  validateDrop(draggedItem, dropTarget) {
    // Basic validation rules
    const validations = [
      {
        condition: !draggedItem || !dropTarget,
        message: 'Invalid drag or drop target'
      },
      {
        condition: draggedItem.type === 'booking' && dropTarget.type === 'booking',
        message: 'Cannot drop booking on another booking'
      },
      {
        condition: draggedItem.type === 'slot' && dropTarget.type === 'booked_slot',
        message: 'Cannot drop on occupied slot'
      },
      {
        condition: this.isSameLocation(draggedItem, dropTarget),
        message: 'Cannot drop on same location'
      }
    ];

    for (const validation of validations) {
      if (validation.condition) {
        throw new Error(validation.message);
      }
    }

    return true;
  }

  // Check if drag and drop are at same location
  isSameLocation(draggedItem, dropTarget) {
    if (draggedItem.date && draggedItem.time && dropTarget.date && dropTarget.time) {
      return draggedItem.date === dropTarget.date && draggedItem.time === dropTarget.time;
    }
    return false;
  }

  // Get drop suggestions
  getDropSuggestions(draggedItem) {
    const suggestions = [];
    
    if (draggedItem.type === 'booking') {
      suggestions.push({
        action: 'reschedule',
        icon: '📅',
        title: 'Reschedule Appointment',
        description: 'Move to available time slot'
      });
    } else if (draggedItem.type === 'slot') {
      suggestions.push({
        action: 'move_slot',
        icon: '⏰',
        title: 'Move Time Slot',
        description: 'Relocate available slot'
      });
    }
    
    return suggestions;
  }

  // Cleanup
  destroy() {
    this.clearDropTarget();
    if (this.ghostElement && document.body.contains(this.ghostElement)) {
      document.body.removeChild(this.ghostElement);
    }
    document.body.style.cursor = '';
    this.callbacks = {};
  }
}

// Multi-select drag and drop handler
export class MultiSelectDragDrop extends CalendarDragDrop {
  constructor() {
    super();
    this.selectedItems = new Set();
  }

  // Handle multi-select drag start
  handleMultiDragStart(e, items, sourceElements) {
    this.draggedItems = items;
    
    // Create composite ghost element
    this.ghostElement = this.createMultiGhostElement(sourceElements, items);
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(items));
    e.dataTransfer.setDragImage(this.ghostElement, 50, 25);
    
    // Add dragging class to all elements
    sourceElements.forEach(el => el.classList.add('dragging'));
    
    document.body.style.cursor = 'grabbing';
  }

  // Create ghost element for multiple items
  createMultiGhostElement(sourceElements, items) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-1000px';
    container.style.left = '-1000px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '2px';
    container.style.opacity = '0.8';
    container.style.transform = 'rotate(1deg) scale(0.9)';
    container.style.pointerEvents = 'none';
    
    // Add count badge
    const badge = document.createElement('div');
    badge.innerHTML = `${items.length} items`;
    badge.style.background = '#1890ff';
    badge.style.color = 'white';
    badge.style.padding = '4px 8px';
    badge.style.borderRadius = '12px';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = 'bold';
    badge.style.textAlign = 'center';
    badge.style.marginBottom = '4px';
    badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    
    container.appendChild(badge);
    
    // Add preview of items (max 3)
    const previewItems = sourceElements.slice(0, 3);
    previewItems.forEach((el, index) => {
      const preview = el.cloneNode(true);
      preview.style.width = '100px';
      preview.style.height = '30px';
      preview.style.marginBottom = index < previewItems.length - 1 ? '1px' : '0';
      preview.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      preview.style.borderRadius = '4px';
      container.appendChild(preview);
    });
    
    document.body.appendChild(container);
    return container;
  }

  // Handle multi-item drop
  async handleMultiDrop(e, targetElement, dropData) {
    e.preventDefault();
    
    if (!this.draggedItems || this.draggedItems.length === 0) return;
    
    this.showDropLoading(targetElement);
    
    try {
      // Process each item
      for (const item of this.draggedItems) {
        await this.callbacks.onDrop(item, dropData, e);
      }
      
      this.showDropSuccess(targetElement);
    } catch (error) {
      this.showDropError(`Multi-drop failed: ${error.message}`);
    } finally {
      this.hideDropLoading(targetElement);
      this.clearDropTarget();
    }
  }
}

// Auto-scroll during drag
export class DragAutoScroll {
  constructor(container) {
    this.container = container;
    this.isScrolling = false;
    this.scrollSpeed = 2;
    this.scrollZone = 50; // pixels from edge
  }

  startAutoScroll(e) {
    if (this.isScrolling) return;
    
    const rect = this.container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const containerHeight = rect.height;
    
    if (mouseY < this.scrollZone) {
      // Scroll up
      this.isScrolling = true;
      this.scroll(-this.scrollSpeed);
    } else if (mouseY > containerHeight - this.scrollZone) {
      // Scroll down
      this.isScrolling = true;
      this.scroll(this.scrollSpeed);
    }
  }

  scroll(speed) {
    if (!this.isScrolling) return;
    
    this.container.scrollTop += speed;
    requestAnimationFrame(() => this.scroll(speed));
  }

  stopAutoScroll() {
    this.isScrolling = false;
  }
}

// Utility functions
export const DragDropUtils = {
  // Get drop zone from coordinates
  getDropZoneFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element?.closest('[data-drop-zone]');
  },
  
  // Check if point is in drop zone
  isInDropZone(x, y, dropZone) {
    const rect = dropZone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && 
           y >= rect.top && y <= rect.bottom;
  },
  
  // Calculate drop position
  calculateDropPosition(mouseY, slotHeight, containerTop) {
    const relativeY = mouseY - containerTop;
    return Math.floor(relativeY / slotHeight);
  },
  
  // Get time from drop position
  getTimeFromPosition(position, startHour = 9, slotDuration = 30) {
    const totalMinutes = position * slotDuration;
    const hour = startHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return moment().hour(hour).minute(minute).format('HH:mm');
  }
};

// CSS for drag and drop animations (to be added to CSS file)
export const DRAG_DROP_STYLES = `
.dragging {
  opacity: 0.5 !important;
  transform: rotate(2deg) scale(0.95) !important;
  z-index: 1000 !important;
  transition: all 0.2s ease !important;
}

.drop-target {
  background: linear-gradient(135deg, #f0f9ff 0%, #d1ecf1 100%) !important;
  border: 2px dashed #1890ff !important;
  animation: dropTargetPulse 1s infinite !important;
}

@keyframes dropTargetPulse {
  0%, 100% { box-shadow: inset 0 0 8px rgba(24, 144, 255, 0.1); }
  50% { box-shadow: inset 0 0 16px rgba(24, 144, 255, 0.2); }
}

.drop-loading {
  position: relative;
  pointer-events: none;
}

.drop-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  animation: spin 1s linear infinite;
}

.drop-success {
  animation: dropSuccess 1s ease-out;
}

@keyframes dropSuccess {
  0% { background-color: #52c41a; }
  100% { background-color: inherit; }
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
`;