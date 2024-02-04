dev:
	bun --hot run index.ts

test:
	bun test --watch --preload ./preloadMocks.ts