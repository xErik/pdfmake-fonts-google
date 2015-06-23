// This file is just a dummy.
//
// Do not use require('pdfmake-fonts-google'), as no functionality is provided.
// And dynamic font switching via browserify seems not to be possible.

module.exports = {
	data: require('./build/browserified/apache/roboto.js'),
	styles: require('./build/browserified/apache/roboto.map.js')
};
