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
      'src/index.js',
      'src/index.css',
      'src/app/hello.js',
      'src/app/hello.spec.js',
      'src/app/hello.html'
    ].map(file => 
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file),this.props))
  }
};