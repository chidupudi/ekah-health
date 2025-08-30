// Professional Calendar Performance Optimizations
import { debounce, throttle } from 'lodash';
import moment from 'moment';

// Performance monitoring
export class CalendarPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.memoryThreshold = 50 * 1024 * 1024; // 50MB
    this.isMonitoring = false;
  }

  // Start monitoring
  startMonitoring() {
    this.isMonitoring = true;
    this.startMemoryMonitoring();
    this.startRenderTimeMonitoring();
    this.startUserInteractionMonitoring();
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Memory monitoring
  startMemoryMonitoring() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      if (!this.isMonitoring) return;

      const memory = performance.memory;
      this.recordMetric('memory', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });

      // Warn if memory usage is high
      if (memory.usedJSHeapSize > this.memoryThreshold) {
        console.warn('High memory usage detected:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
        this.triggerMemoryCleanup();
      }

      setTimeout(checkMemory, 5000); // Check every 5 seconds
    };

    checkMemory();
  }

  // Render time monitoring
  startRenderTimeMonitoring() {
    const observer = new PerformanceObserver((list) => {
      if (!this.isMonitoring) return;

      list.getEntries().forEach(entry => {
        if (entry.name.includes('calendar') || entry.name.includes('render')) {
          this.recordMetric('render', {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            timestamp: Date.now()
          });

          // Warn about slow renders
          if (entry.duration > 16) { // 60fps threshold
            console.warn('Slow render detected:', entry.name, entry.duration + 'ms');
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
    this.observers.push(observer);
  }

  // User interaction monitoring
  startUserInteractionMonitoring() {
    const interactionStart = performance.now();
    
    const trackInteraction = throttle((type) => {
      const duration = performance.now() - interactionStart;
      this.recordMetric('interaction', {
        type,
        duration,
        timestamp: Date.now()
      });
    }, 100);

    // Track various interactions
    document.addEventListener('click', () => trackInteraction('click'));
    document.addEventListener('scroll', () => trackInteraction('scroll'));
    document.addEventListener('keydown', () => trackInteraction('keydown'));
  }

  // Record metric
  recordMetric(type, data) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }

    const metrics = this.metrics.get(type);
    metrics.push(data);

    // Keep only last 100 entries
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  // Get metrics
  getMetrics(type) {
    return this.metrics.get(type) || [];
  }

  // Trigger memory cleanup
  triggerMemoryCleanup() {
    // Force garbage collection if available
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }

    // Clear unused caches
    this.clearUnusedCaches();
  }

  // Clear unused caches
  clearUnusedCaches() {
    // Clear old localStorage items
    const now = Date.now();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calendar_cache_')) {
        const item = localStorage.getItem(key);
        try {
          const data = JSON.parse(item);
          if (data.timestamp && now - data.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}

// Caching system
export class CalendarCacheManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  // Set cache item
  set(key, data, ttl = this.ttl) {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get cache item
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Clear expired items
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.calculateHitRate()
    };
  }

  // Calculate cache hit rate
  calculateHitRate() {
    // This would need to be tracked during get operations
    return 0; // Placeholder
  }
}

// Virtual scrolling for large datasets
export class VirtualScrollManager {
  constructor(container, itemHeight = 40) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.scrollTop = 0;
    this.items = [];
    this.renderCallback = null;
  }

  // Set items to virtualize
  setItems(items, renderCallback) {
    this.items = items;
    this.renderCallback = renderCallback;
    this.updateScrollHeight();
    this.render();
  }

  // Update scroll height
  updateScrollHeight() {
    const totalHeight = this.items.length * this.itemHeight;
    this.container.style.height = `${totalHeight}px`;
  }

  // Handle scroll
  onScroll = throttle(() => {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }, 16);

  // Render visible items
  render() {
    if (!this.renderCallback) return;

    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleItems, this.items.length);
    
    const visibleItems = this.items.slice(startIndex, endIndex);
    const offsetY = startIndex * this.itemHeight;

    this.renderCallback(visibleItems, offsetY, startIndex);
  }

  // Initialize
  init() {
    this.container.addEventListener('scroll', this.onScroll);
    return this;
  }

  // Destroy
  destroy() {
    this.container.removeEventListener('scroll', this.onScroll);
  }
}

// Optimized debounced functions
export const OptimizedCallbacks = {
  // Search debounce
  createDebouncedSearch: (callback, delay = 300) => {
    return debounce(callback, delay, {
      leading: false,
      trailing: true,
      maxWait: 1000
    });
  },

  // Resize throttle
  createThrottledResize: (callback, delay = 100) => {
    return throttle(callback, delay, {
      leading: true,
      trailing: true
    });
  },

  // Scroll throttle
  createThrottledScroll: (callback, delay = 16) => {
    return throttle(callback, delay, {
      leading: true,
      trailing: false
    });
  },

  // API call throttle
  createThrottledApiCall: (callback, delay = 500) => {
    return throttle(callback, delay, {
      leading: false,
      trailing: true
    });
  }
};

// Batch operations manager
export class BatchOperationManager {
  constructor() {
    this.batches = new Map();
    this.batchSize = 10;
    this.batchDelay = 100;
  }

  // Add operation to batch
  addToBatch(batchId, operation) {
    if (!this.batches.has(batchId)) {
      this.batches.set(batchId, {
        operations: [],
        timer: null
      });
    }

    const batch = this.batches.get(batchId);
    batch.operations.push(operation);

    // Clear existing timer
    if (batch.timer) {
      clearTimeout(batch.timer);
    }

    // Set new timer
    batch.timer = setTimeout(() => {
      this.executeBatch(batchId);
    }, this.batchDelay);
  }

  // Execute batch
  async executeBatch(batchId) {
    const batch = this.batches.get(batchId);
    if (!batch || batch.operations.length === 0) return;

    const operations = batch.operations.splice(0, this.batchSize);
    
    try {
      // Execute operations in parallel
      await Promise.all(operations.map(op => op()));
    } catch (error) {
      console.error('Batch execution failed:', error);
    }

    // Continue with remaining operations
    if (batch.operations.length > 0) {
      batch.timer = setTimeout(() => {
        this.executeBatch(batchId);
      }, this.batchDelay);
    } else {
      this.batches.delete(batchId);
    }
  }

  // Clear batch
  clearBatch(batchId) {
    const batch = this.batches.get(batchId);
    if (batch && batch.timer) {
      clearTimeout(batch.timer);
    }
    this.batches.delete(batchId);
  }
}

// DOM optimization utilities
export const DOMOptimizations = {
  // Create document fragment for batch DOM operations
  createFragment: () => document.createDocumentFragment(),

  // Batch DOM updates
  batchDOMUpdates: (callback) => {
    requestAnimationFrame(() => {
      callback();
    });
  },

  // Observe element visibility
  createIntersectionObserver: (callback, options = {}) => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  },

  // Optimize list rendering
  optimizeListRendering: (container, items, renderItem) => {
    const fragment = DOMOptimizations.createFragment();
    
    items.forEach(item => {
      const element = renderItem(item);
      fragment.appendChild(element);
    });
    
    container.appendChild(fragment);
  },

  // Lazy load images
  lazyLoadImages: (selector = 'img[data-src]') => {
    const images = document.querySelectorAll(selector);
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
};

// Memory optimization utilities
export const MemoryOptimizations = {
  // Weak references for cleanup
  createWeakMap: () => new WeakMap(),
  createWeakSet: () => new WeakSet(),

  // Object pooling
  createObjectPool: (createFn, resetFn, maxSize = 20) => {
    const pool = [];
    
    return {
      acquire: () => {
        return pool.length > 0 ? resetFn(pool.pop()) : createFn();
      },
      
      release: (obj) => {
        if (pool.length < maxSize) {
          pool.push(obj);
        }
      },
      
      clear: () => {
        pool.length = 0;
      }
    };
  },

  // Event listener cleanup
  createEventCleanup: () => {
    const listeners = [];
    
    return {
      add: (element, event, handler, options) => {
        element.addEventListener(event, handler, options);
        listeners.push({ element, event, handler, options });
      },
      
      removeAll: () => {
        listeners.forEach(({ element, event, handler, options }) => {
          element.removeEventListener(event, handler, options);
        });
        listeners.length = 0;
      }
    };
  }
};

// Bundle all optimizations
export class CalendarOptimizer {
  constructor() {
    this.performanceMonitor = new CalendarPerformanceMonitor();
    this.cacheManager = new CalendarCacheManager();
    this.batchManager = new BatchOperationManager();
    this.eventCleanup = MemoryOptimizations.createEventCleanup();
    this.isOptimized = false;
  }

  // Initialize all optimizations
  init() {
    this.performanceMonitor.startMonitoring();
    this.setupCacheCleanup();
    this.setupMemoryOptimizations();
    this.isOptimized = true;
    
    console.log('🚀 Calendar optimizations initialized');
  }

  // Setup cache cleanup
  setupCacheCleanup() {
    setInterval(() => {
      this.cacheManager.clearExpired();
    }, 60000); // Every minute
  }

  // Setup memory optimizations
  setupMemoryOptimizations() {
    // Lazy load images
    DOMOptimizations.lazyLoadImages();
    
    // Setup batch DOM updates
    this.optimizedRender = DOMOptimizations.batchDOMUpdates;
  }

  // Get optimization stats
  getStats() {
    return {
      performance: {
        memory: this.performanceMonitor.getMetrics('memory').slice(-5),
        render: this.performanceMonitor.getMetrics('render').slice(-5),
        interaction: this.performanceMonitor.getMetrics('interaction').slice(-5)
      },
      cache: this.cacheManager.getStats(),
      batches: this.batchManager.batches.size
    };
  }

  // Cleanup
  destroy() {
    this.performanceMonitor.stopMonitoring();
    this.cacheManager.clear();
    this.eventCleanup.removeAll();
    this.isOptimized = false;
    
    console.log('🧹 Calendar optimizations cleaned up');
  }
}

// Export convenience functions
export const createOptimizer = () => {
  const optimizer = new CalendarOptimizer();
  optimizer.init();
  return optimizer;
};

export const withOptimizations = (component) => {
  const optimizer = createOptimizer();
  
  // Wrap component with optimization cleanup
  const originalComponentWillUnmount = component.componentWillUnmount;
  component.componentWillUnmount = function() {
    optimizer.destroy();
    if (originalComponentWillUnmount) {
      originalComponentWillUnmount.call(this);
    }
  };
  
  return component;
};

// Performance measurement decorators
export const measurePerformance = (name) => {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value;
    
    descriptor.value = function(...args) {
      const start = performance.now();
      const result = method.apply(this, args);
      const duration = performance.now() - start;
      
      console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
      
      return result;
    };
    
    return descriptor;
  };
};