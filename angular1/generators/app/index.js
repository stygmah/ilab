'use strict';
const quantion = require('../../../app/index.js');
const generators = require('yeoman-generator');
const version = require('../../package.json').version;
const mergeJSON = require("merge-json") ;
var fs = require('fs-extra');

module.exports = class extends quantion {

	constructor(args, options) {
    super(args, options);
  }

  initializing() {
    this.options.framework = 'angular1';
    return this.quantionPrompting();
  }
	
  prompting() {

    this.option('sample', {type: Boolean, required: false});

    const prompts = [{
        when: !this.options.sample,
        type: 'list',
        name: 'sample',
        message: 'Do you want a sample app?',
        choices: [
          {name: 'A working landing page', value: 'techs'},
          {name: 'Just a Hello World', value: 'hello'},
          {name: 'TodoMVC', value: 'todoMVC'}
        ]
      }, {
        when: !this.options.router,
        type: 'list',
        name: 'router',
        message: 'Would you like a router?',
        choices: [
          {name: 'Angular UI Router', value: 'uirouter'},
          {name: 'None', value: 'none'}
        ]
      }];

      return this.prompt(prompts).then(props => {
        Object.assign(this.props, props);
      });
    
  }

  configuring() {
    this.config.set('version', version);
    this.config.set('props', this.props);
    mergeJSON.merge('package.json', {
      dependencies: {
        angular: '^1.6.2'
      },
      devDependencies: {
        '@types/angular': '^1.6.6',
        '@types/angular-mocks': '^1.5.9',
        '@types/jquery': '^2.0.40',
        'angular-mocks': '^1.6.2',
        'gulp-angular-templatecache': '^2.0.0'
      }
    });
    if (this.props.router === 'uirouter') {
      mergeJSON.merge('package.json', {
        dependencies: {
          'angular-ui-router': '1.0.0-beta.3'
        },
        devDependencies: {
          '@types/angular-ui-router': '^1.1.36'
        }
      });
    }
  }

  composing() {
    const options = {
      framework: this.props.framework,
      modules: this.props.modules,
      js: this.props.js,
      ci: this.props.ci,
      css: this.props.css,
      router: this.props.router,
      sample: this.props.sample,
      skipInstall: this.props.skipInstall,
      skipCache: this.props.skipCache
    };

    this.composeWith(require.resolve(`../${this.props.sample}/${this.props.modules === 'inject' ? 'inject' : 'modules'}`), options);
  }

  writing() {
	
    if (this.props.router === 'uirouter') {
		   this.fs.copyTpl(this.templatePath('src/routes.js'), this.destinationPath('src/routes.js'), this.props);
    }
    this.fs.copyTpl(this.templatePath('src/layout.html'), this.destinationPath('src/layout.html'), {router: this.props.router});
  }
};
