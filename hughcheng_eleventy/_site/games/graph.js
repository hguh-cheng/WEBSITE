document.addEventListener('DOMContentLoaded', () => {
    // Initialize each graph container separately
    document.querySelectorAll('.graph-container').forEach(container => {
        const tooltip = container.querySelector('.tooltip');
        const lineSegments = container.querySelectorAll('.line-segment');

        function updateTooltipPosition(e, element) {
            const containerRect = container.getBoundingClientRect();
            const svgRect = container.querySelector('svg').getBoundingClientRect();
            
            // Calculate position relative to the specific container
            const x = e.clientX - containerRect.left;
            const y = e.clientY - containerRect.top - 30;
            
            // Keep tooltip within container bounds
            const boundedX = Math.max(0, Math.min(x, containerRect.width));
            const boundedY = Math.max(0, Math.min(y, containerRect.height));
            
            tooltip.style.left = `${boundedX}px`;
            tooltip.style.top = `${boundedY}px`;
        }

        lineSegments.forEach(segment => {
            segment.addEventListener('mousemove', (e) => {
                tooltip.textContent = segment.dataset.tooltip;
                tooltip.style.opacity = '1';
                updateTooltipPosition(e, segment);
            });

            segment.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });
    });
});