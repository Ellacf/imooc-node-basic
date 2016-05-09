ISTANBUL=./node_modules/.bin/istanbul
_MOCHA=./node_modules/.bin/_mocha
MOCHA=./node_modules/.bin/mocha
OPTS:=--recursive --reporter spec
test:
	@$(MOCHA) $(OPTS)
cover:
	$(ISTANBUL) cover $(_MOCHA) -- $(OPTS)
testDemo:
	$(MOCHA) 'test/demo.js' --reporter nyan
testUser:testDemo
	$(MOCHA) 'test/user/user.js'
.PHONY:test cover testDemo testUser
