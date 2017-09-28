var isWin = /^win/.test(process.platform);
var separator = (isWin) ? '\\' : '/';
const generators = require('yeoman-generator');
const fileUtils = require('file-utils');
const techs = require('./techs');
var yosay = require('yosay');
const _ = require('lodash');

module.exports = class Base extends generators {
	
  constructor(args, opts) {
	super(args, opts);
	generators.apply(this, arguments);

	this.option('framework server', {type: String, required: false});
    this.option('framework', {type: String, required: false});
    this.option('modules', {type: String, required: false});
    this.option('css', {type: String, required: false});
    this.option('js', {type: String, required: false});
    this.option('ci', {type: String, required: false});  
	  
  }
  
  initializing() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay());
    }
  }
  
  quantionPrompting() {
    const {framework, modules, js} = this.options;
    const prompts = [{
      when: !this.options.framework,
      type: 'list',
      name: 'framework',
      message: 'Which JavaScript framework do you want?',
      choices: [
        {name: 'React', value: 'react'},
        {name: 'Angular 2', value: 'angular2'},
        {name: 'Angular 1', value: 'angular1'}
      ]
    }, {
      when(responses) {
        return !responses.modules && !modules;
      },
      type: 'list',
      name: 'modules',
      message: 'Which module management do you want?',
      choices(responses) {
        const choices = [
          {name: 'Webpack with NPM', value: 'webpack'},
          {name: 'SystemJS with JSPM', value: 'systemjs'}
        ];
        if (responses.framework !== 'angular2' && framework !== 'angular2') {
          choices.push({name: 'None with Bower and script injection', value: 'inject'});
        }
        return choices;
      }
    }, {
      when(responses) {
        return !responses.js && !js;
      },
      type: 'list',
      name: 'js',
      message: 'Which JS preprocessor do you want?',
      choices(responses) {
        const choices = [];
        if (responses.framework !== 'vue' && framework !== 'vue') {
          choices.push({name: 'Pure old JavaScript', value: 'js'});
          choices.push({name: 'TypeScript', value: 'typescript'});
        }
        return choices;
      }
    }, {
      when: !this.options.css,
      type: 'list',
      name: 'css',
      message: 'Which CSS preprocessor do you want?',
      choices: [
        {name: 'SASS', value: 'scss'},
        {name: 'Stylus', value: 'styl'},
        {name: 'Less', value: 'less'},
        {name: 'CSS', value: 'css'}
      ]
    }, {
      when: this.options.ci === undefined, // TODO open issue to Inquirer because !this.options.ci ==! undefined
      type: 'checkbox',
      name: 'ci',
      message: 'Which Continuous Integration platform do you want?',
      choices: [
        {name: 'Travis', value: 'travis'},
        {name: 'CircleCi', value: 'circleci'},
        {name: 'Jenkins (with Dockerfile)', value: 'jenkins'},
        {name: 'Wercker', value: 'wercker'}
      ]
    }];

    return this.prompt(prompts).then(props => {
      if (!_.isObject(this.props)) {
        this.props = {};
      }
      Object.assign(this.props, _.omit(this.options, ['env', 'skip-install', 'skip-cache']), props);
    });
  }
 
  composing() {
    this.composeWith(require.resolve(`../${this.props.framework}/generators/app`), {
      framework: this.props.framework,
      modules: this.props.modules,
      js: this.props.js,
      ci: this.props.ci,
      css: this.props.css,
      skipInstall: this.props.skipInstall,
      skipCache: this.props.skipCache
    });
  }
};