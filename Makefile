install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint . --fix

link:
	npm link

test:
	node --experimental-vm-modules node_modules/.bin/jest