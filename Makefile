clean:
	find . -type d -name "node_modules" -prune -exec rm -rf '{}' +

dev: 
	npx concurrently \
		-n SHD,GEN,API,WEB \
		-c yellow,cyan,green,blue \
		"pnpm --filter @apollo-eval/codegen dev \
		"pnpm --filter @apollo-eval/shared dev" \
		"pnpm --filter @apollo-eval/api dev" \
		"pnpm --filter @apollo-eval/web-ui dev" 