PROJECT = test-project

delete:
	rm -rf ../$(PROJECT)
	mkdir -p ../$(PROJECT)
	echo "*" > ../$(PROJECT)/.gitignore

test: delete
	pnpm run generate \
		--destinationPath=../$(PROJECT) \
		--apiName=test-api \
		--webUiName=test-web-ui 
