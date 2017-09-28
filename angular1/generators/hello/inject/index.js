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
    [
      'src/app.js',
      'src/app.css',
      'hello/helloController.js',
      'hello/helloController.spec.js',
      'hello/helloView.html',
      'hello/helloRouting.js',
      'hello/helloService.js'
    ].map(file => 
	  this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this.props))
  }
};
