
## Synopsis

[Google Fonts](https://www.google.com/fonts/) made available for [pdfmake](http://pdfmake.org/).

## Installation


Check out the [Google Fonts](https://www.google.com/fonts/) examples. Then use the font you like, by selecting it in the `build` folder.

If you want to use pdfmake with the script-tag (the regular pdfmake way) go to the `script` subdirectory. If you want to use the browserified version, choose the `browserified` folder.

### A

Cloning the repository will make the transcoded [Google Fonts](https://www.google.com/fonts/) available locally. Be warned: this repo is big and Google Fonts itself is included in the `lib` folder.

```console
git clone git://github.com/xErik/pdfmake-fonts-google.git
```

### B

Another way is to simply download the specific font file and its corresponding map file from github.

## Usage

**Note 1**: Styles like `bold` have no effect for some fonts. Because the font does not provide the style in question, a substitution has been added, pointing to the `normal` style. pdfmake/pdfkit requires a certain set of styles to be present and throws an error if these styles are missing. If in doubt, check the corresponding `*.map.js` file of the font you are using and modify it to your liking.

**Note 2**: The regular font name (e.g. `Times New Roman`) is is needed for declaration of the `defaultStyle`. It can be found in the corresponding `*.map.js` file.

### Browserified pdfmake (AngularJS, ...)

Note the `browserified` folder in the path, when selecting a font.

```javascript
var createPdf = require('pdfmake-browserified');
var map = require('<path to>/pdfmake-fonts-google/build/browserified/ofl/junge.map.js'); // font style mapping
var data = require('<path to>//pdfmake-fonts-google/build/browserified/ofl/junge.js'); // font data
var defaultFont = Object.keys(map)[0];

var dd = {
	content: [
		/* your content */
	],
	styles: {
		/* your styles */
	},
	defaultStyle: {
		font: defaultFont // important, don't forget to set!
	}

};
createPdf(dd, map, data).open();
```

### Regular pdfmake
Note the `script` folder in the path, when selecting a font.

(The working example below is to be found in the `test/` folder.)

```html
<!doctype html>
 <html lang='en'>
 <head>
 	<meta charset='utf-8'>
 	<title>Google Fonts with regular pdfmake</title>
 	<script src='pdfmake.min.js'></script>
 	<script src='../build/script/ofl/junge.js'></script><!-- the font data -->
 	<script src='../build/script/ofl/junge.map.js'></script><!-- the font-style mapping -->
 </head>
 <body>
    <input type="button" onclick="openPdf()" value="Open PDF"></input>
     <script type="">
        /* Do not forget to set the defaultStyle to the font name you included above */
        function openPdf() {
            var docDefinition = {
                content: 'Lorem ipsum dolor sit amet...',
                defaultStyle: {
            		font: Object.keys(pdfMake.fonts)[0]
            	}
            };
            pdfMake.createPdf(docDefinition).open();
        }
     </script>
 </body>
</html>

```

## Build

(The Git repository includes the build already, re-build if necessary.)

Install node dependencies:

```
npm install
```

Build the Google Fonts, which live in `lib/`:
```console
grunt
```

## Contributors

xErik

### Other Projects

[**NPM pdfmake-browserified** MIT License](https://www.npmjs.com/package/pdfmake-browserified)

[**GIT pdfmake-browserified** MIT License](https://github.com/xErik/pdfmake-browserified)

[**pdfmake** MIT License](http://pdfmake.org/)

[**Google Fonts** Apache/MIT/ODF Licenses](https://www.google.com/fonts/)

## Fonts Licenses

The fonts have various licenses, which are to be found in the `lib/` folder.


## License

MIT

## TODO

Clean up the `Gruntfile.js`
