var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

	/**
	 * Writes files with named styles, each style refering a specific font.
	 * The styles get slightly renamed, to be compatible with pdfmake/pdfkit:
	 * - italic -> italics
	 * - regular -> normal
	 * - bolditalic -> bolditalics
	 */
	function getMapFile(mapFile, fontNames) {
		var resultMap = {};

		for (var i = 0; i < fontNames.length; i++) {

			fontName = fontNames[i]; // reuse
			var fontNamePlain = fontName.substring(0, fontName.lastIndexOf('.'));

			var parts = fontNamePlain.split('-');
			var baseName = parts[0];
			if(parts.length > 2) {
				for(var k = 1; k < parts.length -1; k++) {
					baseName += '-' + parts[k];
				}
			}
			if (resultMap[baseName] === undefined) {
				resultMap[baseName] = {};
			}

			if (parts.length === 1) {
				resultMap[baseName].normal = fontName;
			// } else if (parts.length === 2) {
			// 	var style = parts[1].toLowerCase();
			// 	style = style.replace(/italic/, 'italics');
			// 	style = style.replace(/regular/, 'normal');
			// 	resultMap[baseName][style] = fontName;
			} else {
				// this code could be used for the case "parts.length === 2", too!
				// But lets deal with irregular font and style naming separatly
				// in this code branch.
				var style = parts[parts.length-1].toLowerCase();

				style = style.replace(/italic/, 'italics');
				style = style.replace(/regular/, 'normal');
				resultMap[baseName][style] = fontName;
			}
		}
		return resultMap;
	}

	/**
	 * Expected font styles to be available:
	 * - normal
     * - bold
     * - italic
     * - bolditalic
	 */
	function completeMissingFontStyles(vfs) {

		var font = Object.keys(vfs)[0];

		if(vfs[font].normal === undefined) {
			// Grab first font style and use as "normal" font style
			// Introduces redundancy, but results in an usable font.
			var firstStyle = Object.keys(vfs[font])[0];
			vfs[font].normal = vfs[font].firstStyle;
			// grunt.log.warn('Added misisng "normal" font style by using font style: ' + firstStyle);
		}

		if(vfs[font].bold === undefined) {
			vfs[font].bold = vfs[font].normal;
		}
		if(vfs[font].italics === undefined) {
			vfs[font].italics = vfs[font].normal;
		}
		if(vfs[font].bolditalics === undefined) {
			vfs[font].bolditalics = vfs[font].bold;
		}
		grunt.log.warn(JSON.stringify(vfs));
		return vfs;
	}

	grunt.registerTask('my_dump_dir', 'Goes over all directories', function() {

		var options = {
			licenses: {
				apache: {
					in : 'lib/apache/*',
					out: 'build/browserified/apache/',
					pre_font: 'module.exports = ',
					post_font: ';',
					pre_style: 'module.exports = ',
					post_style: ';'
				},
				ofl: { in : 'lib/ofl/*',
					out: 'build/browserified/ofl/',
					pre_font: 'module.exports = ',
					post_font: ';',
					pre_style: 'module.exports = ',
					post_style: ';'
				},
				ufl: { in : 'lib/ufl/*',
					out: 'build/browserified/ufl/',
					pre_font: 'module.exports = ',
					post_font: ';',
					pre_style: 'module.exports = ',
					post_style: ';'
				},
				apache2: {
					in : 'lib/apache/*',
					out: 'build/script/apache/',
					pre_font: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.vfs = ',
					post_font: ';',
					pre_style: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.fonts = ',
					post_style: ';'
				},
				ofl2: { in : 'lib/ofl/*',
					out: 'build/script/ofl/',
					pre_font: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.vfs = ',
					post_font: ';',
					pre_style: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.fonts = ',
					post_style: ';'
				},
				ufl2: { in : 'lib/ufl/*',
					out: 'build/script/ufl/',
					pre_font: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.vfs = ',
					post_font: ';',
					pre_style: 'window.pdfMake = window.pdfMake || {}; window.pdfMake.fonts = ',
					post_style: ';'
				}
			}
		};

		var keys = Object.keys(options.licenses);

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];

			var input = options.licenses[key].in;
			var output = options.licenses[key].out;
			var pre_font = options.licenses[key].pre_font;
			var post_font = options.licenses[key].post_font;
			var pre_style = options.licenses[key].pre_style;
			var post_style = options.licenses[key].post_style;

			grunt.file.expand(input).forEach(function(fontPath) {

				var fontName = fontPath.substring(fontPath.lastIndexOf(path.sep) + 1);
				var buildFile = [output, fontName, '.js'].join('');
				var sourceFiles = [fontPath, path.sep, '*.ttf'].join('');
				var mapFile = [output, fontName, '.map.js'].join('');

				// Put all fonts in object

				var result = {};
				grunt.file.expand(sourceFiles).forEach(function(singleFontPath) {
					var key = singleFontPath.substring(singleFontPath.lastIndexOf(path.sep) + 1);
					result[key] = fs.readFileSync(singleFontPath).toString('base64');
				});

				var fontNames = Object.keys(result);
				var fileMap = getMapFile(mapFile, fontNames);

				try {
					fileMap = completeMissingFontStyles(fileMap);

					// Write Style Mapping

					grunt.file.write(mapFile, pre_style + JSON.stringify(fileMap) + post_style);

					// Write Fonts

					grunt.file.write(buildFile, pre_font + JSON.stringify(result) + post_font);
				} catch(e) {
					grunt.log.warn(e);
				}
			});
		}
	});

	grunt.registerTask('default', ['my_dump_dir']);
};
