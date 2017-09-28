'use strict';

const quantion = require('../../../../app/index.js');
var fs = require('fs-extra');

module.exports = class extends quantion {

  constructor(args, options) {
    super(args, options);
  }

  initializing() {
    return this.quantionPrompting();
  }

  writing() {
    const files = [
      'src/app.js',
      'src/app.css',
      'hello/helloController.js',
      'hello/helloController.spec.js',
      'hello/helloView.html',
      'hello/helloRouting.js',
      'hello/helloService.js'
    ];

    files.forEach(file => {
      const prefix = this.options.modules === 'systemjs' ? 'src/' : '';
      const templateUrl = file.replace(
        /^src\/(.*\/[^.]*).*$/,
        `${prefix}$1.html`
      );
      this.fs.copyTpl(file, file, {templateUrl});
    });
  }
};
