PROJECT = test-project
API = test-api
WEB_UI = test-web-ui

delete:
	rm -rf ../$(PROJECT)/$(API)
	rm -rf ../$(PROJECT)/$(WEB_UI)

test: delete
	pnpm run generate \
		--destinationPath=../$(PROJECT) \
		--apiName=$(API) \
		--webUiName=$(WEB_UI)
