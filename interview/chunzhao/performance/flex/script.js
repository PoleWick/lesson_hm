function measureRenderTime() {
    const start = performance.now();
    const checkFirstElement = setInterval(() => {
        const firstElement = document.getElementById('firstElement');
        if (firstElement) {
            const end = performance.now();
            console.log(`Render time: ${end - start}ms`);
            clearInterval(checkFirstElement);
        }
    }, 50);
}

measureRenderTime();