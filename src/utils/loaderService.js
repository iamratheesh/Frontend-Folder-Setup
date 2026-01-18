// This is our simple event emitter.
const loaderService = {
  listeners: [],
  loadingCount: 0,

  /**
   * Method for components to subscribe to changes.
   * @param {function(boolean): void} callback - The function to call when the loading state changes.
   * @returns {function(): void} - An unsubscribe function for cleanup.
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Return an unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },

  // Internal method to notify all subscribers with the current loading state.
  emit() {
    const isLoading = this.loadingCount > 0;
    this.listeners.forEach(callback => callback(isLoading));
  },

  // Call this to indicate a process has started.
  show() {
    this.loadingCount++;
    this.emit();
  },

  // Call this to indicate a process has ended.
  hide() {
    // Prevent the count from going below zero.
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.emit();
  },
};

export default loaderService;