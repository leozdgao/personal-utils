/*获取函数形参列表*/
function test( a, c, b ) {}

var match = /\(\s*([\s\S]*?)\s*\)/.exec(test), args;
if(match && match.length > 1) {
	args = match[1].split(/\s*,\s*/);
}

console.log(args);