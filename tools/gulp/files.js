module.exports = {
	js: [
		'src/js/*.js'
	],
	css: [
		'src/css/global.css',
		'src/css/*.css'
	],
	views: [
		'views/**/*.hbs'
	],
	monignore: [
		'assets/*',
		'docs/*',
		'src/*',
		'test/*',
		'views/*'
	],
	destJs: 'script.js',
	destCss: 'style.css',
	destLib: './assets/release',
	release: './assets/release'
};