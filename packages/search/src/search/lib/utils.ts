export function getThreadScrollArea() {
  const threadViewport = document.querySelector('[data-thread-viewport]');
  const threadScrollArea = threadViewport?.querySelector('[data-radix-scroll-area-viewport]');
  return threadScrollArea;
}
