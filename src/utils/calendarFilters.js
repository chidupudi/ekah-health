// Advanced Calendar Filtering and Search System
import moment from 'moment';

export class CalendarFilterManager {
  constructor() {
    this.filters = new Map();
    this.searchHistory = [];
    this.maxHistoryItems = 20;
  }

  // Register a filter
  registerFilter(name, filterFn, options = {}) {
    this.filters.set(name, {
      fn: filterFn,
      description: options.description || '',
      category: options.category || 'General',
      icon: options.icon || '🔍'
    });
    return this;
  }

  // Initialize default filters
  initDefaultFilters() {
    // Status Filters
    this.registerFilter('available_only', 
      (items) => items.filter(item => item.status === 'available'),
      { description: 'Show only available slots', category: 'Status', icon: '✅' }
    );

    this.registerFilter('booked_only', 
      (items) => items.filter(item => item.status === 'booked' || item.bookingId),
      { description: 'Show only booked slots', category: 'Status', icon: '📅' }
    );

    this.registerFilter('blocked_only', 
      (items) => items.filter(item => item.status === 'blocked'),
      { description: 'Show only blocked slots', category: 'Status', icon: '🚫' }
    );

    // Time Filters
    this.registerFilter('morning_slots', 
      (items) => items.filter(item => {
        const time = moment(item.time, 'HH:mm');
        return time.hour() < 12;
      }),
      { description: 'Morning slots (before 12 PM)', category: 'Time', icon: '🌅' }
    );

    this.registerFilter('afternoon_slots', 
      (items) => items.filter(item => {
        const time = moment(item.time, 'HH:mm');
        return time.hour() >= 12 && time.hour() < 17;
      }),
      { description: 'Afternoon slots (12-5 PM)', category: 'Time', icon: '☀️' }
    );

    this.registerFilter('evening_slots', 
      (items) => items.filter(item => {
        const time = moment(item.time, 'HH:mm');
        return time.hour() >= 17;
      }),
      { description: 'Evening slots (after 5 PM)', category: 'Time', icon: '🌇' }
    );

    // Date Filters
    this.registerFilter('today_only', 
      (items) => items.filter(item => 
        moment(item.date).isSame(moment(), 'day')
      ),
      { description: 'Today\'s slots only', category: 'Date', icon: '📍' }
    );

    this.registerFilter('this_week', 
      (items) => items.filter(item => 
        moment(item.date).isSame(moment(), 'week')
      ),
      { description: 'This week\'s slots', category: 'Date', icon: '📊' }
    );

    this.registerFilter('next_week', 
      (items) => items.filter(item => 
        moment(item.date).isSame(moment().add(1, 'week'), 'week')
      ),
      { description: 'Next week\'s slots', category: 'Date', icon: '⏭️' }
    );

    // Duration Filters
    this.registerFilter('short_slots', 
      (items) => items.filter(item => (item.duration || 30) <= 30),
      { description: '30 minutes or less', category: 'Duration', icon: '⚡' }
    );

    this.registerFilter('long_slots', 
      (items) => items.filter(item => (item.duration || 30) > 60),
      { description: 'More than 1 hour', category: 'Duration', icon: '🕐' }
    );

    // Patient/Service Filters
    this.registerFilter('vip_patients', 
      (items) => items.filter(item => 
        item.patientTags && item.patientTags.includes('VIP')
      ),
      { description: 'VIP patients only', category: 'Patient', icon: '⭐' }
    );

    this.registerFilter('new_patients', 
      (items) => items.filter(item => 
        item.isNewPatient || (item.notes && item.notes.includes('new patient'))
      ),
      { description: 'New patients only', category: 'Patient', icon: '🆕' }
    );

    // Recent Activity
    this.registerFilter('recent_changes', 
      (items) => items.filter(item => {
        const updatedAt = moment(item.updatedAt);
        return updatedAt.isAfter(moment().subtract(24, 'hours'));
      }),
      { description: 'Modified in last 24 hours', category: 'Activity', icon: '🔄' }
    );

    this.registerFilter('created_today', 
      (items) => items.filter(item => {
        const createdAt = moment(item.createdAt);
        return createdAt.isSame(moment(), 'day');
      }),
      { description: 'Created today', category: 'Activity', icon: '🎯' }
    );

    return this;
  }

  // Apply multiple filters
  applyFilters(items, filterNames = []) {
    let filteredItems = [...items];
    
    filterNames.forEach(filterName => {
      const filter = this.filters.get(filterName);
      if (filter) {
        filteredItems = filter.fn(filteredItems);
      }
    });

    return filteredItems;
  }

  // Smart search with multiple criteria
  search(items, query, options = {}) {
    if (!query || query.trim() === '') return items;

    const searchQuery = query.toLowerCase().trim();
    this.addToSearchHistory(searchQuery);

    const searchFields = options.fields || [
      'patientName', 'patientEmail', 'serviceType', 'notes', 
      'confirmationNumber', 'phone', 'status'
    ];

    const results = items.filter(item => {
      // Exact match search
      if (searchQuery.startsWith('"') && searchQuery.endsWith('"')) {
        const exactQuery = searchQuery.slice(1, -1);
        return searchFields.some(field => 
          item[field] && item[field].toLowerCase().includes(exactQuery)
        );
      }

      // Tag search (#tag)
      if (searchQuery.startsWith('#')) {
        const tag = searchQuery.slice(1);
        return item.tags && item.tags.some(t => 
          t.toLowerCase().includes(tag)
        );
      }

      // Date search (today, tomorrow, monday, etc.)
      if (this.isDateQuery(searchQuery)) {
        return this.matchesDateQuery(item, searchQuery);
      }

      // Time search (morning, afternoon, 2pm, etc.)
      if (this.isTimeQuery(searchQuery)) {
        return this.matchesTimeQuery(item, searchQuery);
      }

      // Status search (available, booked, blocked)
      if (['available', 'booked', 'blocked', 'pending', 'confirmed'].includes(searchQuery)) {
        return item.status === searchQuery;
      }

      // Multi-word search (all words must match)
      const words = searchQuery.split(' ').filter(w => w.length > 0);
      return words.every(word => 
        searchFields.some(field => 
          item[field] && item[field].toLowerCase().includes(word)
        )
      );
    });

    return this.rankSearchResults(results, searchQuery);
  }

  // Check if query is a date query
  isDateQuery(query) {
    const dateKeywords = [
      'today', 'tomorrow', 'yesterday', 'monday', 'tuesday', 
      'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'week', 'month', 'next', 'last'
    ];
    
    return dateKeywords.some(keyword => query.includes(keyword)) ||
           moment(query, ['MM/DD/YYYY', 'YYYY-MM-DD', 'MM-DD'], true).isValid();
  }

  // Match date queries
  matchesDateQuery(item, query) {
    const itemDate = moment(item.date);
    
    // Handle relative dates
    if (query === 'today') {
      return itemDate.isSame(moment(), 'day');
    }
    if (query === 'tomorrow') {
      return itemDate.isSame(moment().add(1, 'day'), 'day');
    }
    if (query === 'yesterday') {
      return itemDate.isSame(moment().subtract(1, 'day'), 'day');
    }
    
    // Handle day names
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = dayNames.indexOf(query.toLowerCase());
    if (dayIndex !== -1) {
      return itemDate.day() === dayIndex;
    }
    
    // Handle "next week", "this week"
    if (query.includes('this week')) {
      return itemDate.isSame(moment(), 'week');
    }
    if (query.includes('next week')) {
      return itemDate.isSame(moment().add(1, 'week'), 'week');
    }
    
    // Handle specific dates
    const parsedDate = moment(query, ['MM/DD/YYYY', 'YYYY-MM-DD', 'MM-DD'], true);
    if (parsedDate.isValid()) {
      return itemDate.isSame(parsedDate, 'day');
    }
    
    return false;
  }

  // Check if query is a time query
  isTimeQuery(query) {
    const timeKeywords = ['morning', 'afternoon', 'evening', 'night', 'am', 'pm'];
    return timeKeywords.some(keyword => query.includes(keyword)) ||
           moment(query, ['h:mm A', 'HH:mm', 'ha'], true).isValid();
  }

  // Match time queries
  matchesTimeQuery(item, query) {
    const itemTime = moment(item.time, 'HH:mm');
    
    if (query.includes('morning')) {
      return itemTime.hour() < 12;
    }
    if (query.includes('afternoon')) {
      return itemTime.hour() >= 12 && itemTime.hour() < 17;
    }
    if (query.includes('evening') || query.includes('night')) {
      return itemTime.hour() >= 17;
    }
    
    // Handle specific times
    const parsedTime = moment(query, ['h:mm A', 'HH:mm', 'ha'], true);
    if (parsedTime.isValid()) {
      return itemTime.isSame(parsedTime, 'minute');
    }
    
    return false;
  }

  // Rank search results by relevance
  rankSearchResults(results, query) {
    return results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      return scoreB - scoreA;
    });
  }

  // Calculate relevance score
  calculateRelevanceScore(item, query) {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Higher score for exact matches in important fields
    if (item.patientName && item.patientName.toLowerCase().includes(queryLower)) {
      score += item.patientName.toLowerCase() === queryLower ? 100 : 50;
    }
    
    if (item.patientEmail && item.patientEmail.toLowerCase().includes(queryLower)) {
      score += 30;
    }
    
    if (item.confirmationNumber && item.confirmationNumber.toLowerCase().includes(queryLower)) {
      score += 80;
    }
    
    if (item.serviceType && item.serviceType.toLowerCase().includes(queryLower)) {
      score += 40;
    }
    
    // Boost for recent items
    const itemDate = moment(item.updatedAt || item.createdAt);
    const daysSinceUpdate = moment().diff(itemDate, 'days');
    score += Math.max(0, 10 - daysSinceUpdate);
    
    return score;
  }

  // Add to search history
  addToSearchHistory(query) {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    
    // Add to beginning
    this.searchHistory.unshift(query);
    
    // Limit history size
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }
  }

  // Get search suggestions
  getSearchSuggestions(query) {
    if (!query || query.length < 2) {
      return this.searchHistory.slice(0, 5);
    }
    
    const queryLower = query.toLowerCase();
    const suggestions = [];
    
    // Add matching history items
    this.searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: historyItem,
          type: 'history',
          icon: '🕒'
        });
      }
    });
    
    // Add filter suggestions
    this.filters.forEach((filter, name) => {
      if (name.toLowerCase().includes(queryLower) || 
          filter.description.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: name.replace(/_/g, ' '),
          type: 'filter',
          icon: filter.icon,
          description: filter.description
        });
      }
    });
    
    // Add common search patterns
    const commonPatterns = [
      { text: 'today', type: 'date', icon: '📅' },
      { text: 'tomorrow', type: 'date', icon: '📅' },
      { text: 'this week', type: 'date', icon: '📊' },
      { text: 'morning', type: 'time', icon: '🌅' },
      { text: 'afternoon', type: 'time', icon: '☀️' },
      { text: 'available', type: 'status', icon: '✅' },
      { text: 'booked', type: 'status', icon: '📋' }
    ];
    
    commonPatterns.forEach(pattern => {
      if (pattern.text.includes(queryLower)) {
        suggestions.push(pattern);
      }
    });
    
    return suggestions.slice(0, 8);
  }

  // Advanced filtering with multiple conditions
  createAdvancedFilter(conditions) {
    return (items) => {
      return items.filter(item => {
        return conditions.every(condition => {
          const { field, operator, value } = condition;
          
          switch (operator) {
            case 'equals':
              return item[field] === value;
            case 'contains':
              return item[field] && item[field].toLowerCase().includes(value.toLowerCase());
            case 'starts_with':
              return item[field] && item[field].toLowerCase().startsWith(value.toLowerCase());
            case 'greater_than':
              return moment(item[field]).isAfter(moment(value));
            case 'less_than':
              return moment(item[field]).isBefore(moment(value));
            case 'between':
              return moment(item[field]).isBetween(moment(value.start), moment(value.end), 'day', '[]');
            case 'in':
              return Array.isArray(value) && value.includes(item[field]);
            case 'not_empty':
              return item[field] && item[field].toString().trim() !== '';
            case 'empty':
              return !item[field] || item[field].toString().trim() === '';
            default:
              return true;
          }
        });
      });
    };
  }

  // Get available filters by category
  getFiltersByCategory() {
    const categories = {};
    
    this.filters.forEach((filter, name) => {
      const category = filter.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        name,
        ...filter
      });
    });
    
    return categories;
  }

  // Clear search history
  clearSearchHistory() {
    this.searchHistory = [];
  }

  // Export search/filter settings
  exportSettings() {
    return {
      searchHistory: this.searchHistory,
      customFilters: Array.from(this.filters.entries()).filter(([name]) => 
        !this.isDefaultFilter(name)
      )
    };
  }

  // Import search/filter settings
  importSettings(settings) {
    if (settings.searchHistory) {
      this.searchHistory = settings.searchHistory.slice(0, this.maxHistoryItems);
    }
    
    if (settings.customFilters) {
      settings.customFilters.forEach(([name, filter]) => {
        this.filters.set(name, filter);
      });
    }
  }

  // Check if filter is default
  isDefaultFilter(name) {
    const defaultFilters = [
      'available_only', 'booked_only', 'blocked_only',
      'morning_slots', 'afternoon_slots', 'evening_slots',
      'today_only', 'this_week', 'next_week',
      'short_slots', 'long_slots',
      'vip_patients', 'new_patients',
      'recent_changes', 'created_today'
    ];
    
    return defaultFilters.includes(name);
  }
}

// Quick filter presets
export const QUICK_FILTERS = {
  'Today Available': ['available_only', 'today_only'],
  'This Week Booked': ['booked_only', 'this_week'],
  'Morning Slots': ['morning_slots'],
  'VIP Patients': ['vip_patients'],
  'Recent Changes': ['recent_changes']
};

// Export convenience function
export const createFilterManager = () => {
  const manager = new CalendarFilterManager();
  manager.initDefaultFilters();
  return manager;
};