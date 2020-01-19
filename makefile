PATH :=node_modules/.bin:${PATH}
B_DIR :=app



build_main: clean tsc cp ${B_DIR}/node_modules


clean:
	rm -rf ${B_DIR}
tsc:
	tsc -p main/tsconfig.json
cp: 
	cp -r  main/asserts main/libs main/package.json ${B_DIR}
${B_DIR}/node_modules:
	cp -r main/node_modules ${B_DIR}/node_modules


