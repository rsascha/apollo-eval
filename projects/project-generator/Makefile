PROJECT = test-project
API = test-api
WEB_UI = test-web-ui

delete:
	rm -rf ../$(PROJECT)/$(API)
	rm -rf ../$(PROJECT)/$(WEB_UI)

test: delete
	mkdir -p ../$(PROJECT)
	pnpm run generate \
		--destinationPath=../$(PROJECT) \
		--apiName=$(API) \
		--webUiName=$(WEB_UI)

publish: 
	pnpm run build
	npm version patch
	npm publish --access public
	git commit -am "Release version $(shell node -p "require('./package.json').version")"
	git push