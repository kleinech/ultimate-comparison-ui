import { ChangeDetectorRef, Component } from '@angular/core';

import { ElectronService } from 'ngx-electron';

import * as Path from 'path';
import * as YAML from 'js-yaml';

import { isNullOrUndefined } from 'util';

import { HighlightJS } from 'ngx-highlightjs';
import { Configuration, Data } from './model/model.module';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  public configurationYaml = '';
  public configuration: Configuration = new Configuration();
  public defaultConfiguration;
  public description = '';
  public data = new Data([]);

  public requiredFiles = [];

  stepperIndex = 0;
  filePath = '';
  path = {
    configurationPath: '',
    distPath: '',
    defaultConfig: '',
    config: '',
    autoConfig: '',
    description: '',
    data: '',
    dataElements: ''
  };

  constructor(private electronService: ElectronService,
              private changeDetector: ChangeDetectorRef,
              private hljs: HighlightJS) {
    this.getYamlHtml();
    this.loadRequiredFiles();
  }

  static makeDir(path, callback) {
    window.fs.exists(path, (result) => {
      if (result) {
        callback();
      } else {
        AppComponent.makeDir(Path.dirname(path), () => {
          window.fs.mkdir(path, () => callback());
        })
      }
    });
  }

  public loadRequiredFiles() {
    let assetPath = '';
    if (environment.production) {
      assetPath = Path.join(this.electronService.process.resourcesPath, 'app', 'assets');
    } else {
      assetPath = Path.join('./', 'dist', 'assets');
    }

    const files = [
      'comparison-default.yml',
      '.editorconfig',
      '.travis.yml',
      'gitignore.template',
      'LICENSE',
      'package.json',
      'README.md'
    ];
    Promise.all(files.map(file => Path.join(assetPath, file)).map(this.readFileAsync)).then((fileContents: Array<string>) => {
      this.requiredFiles = files.map(file => {
        switch (file) {
          case 'gitignore.template':
            return '.gitignore';
          case 'comparison-default.yml':
            return Path.join('configuration', file);
          default:
            return file;
        }
      })
        .map((file, index) => [file, fileContents[index], false]);
    });
  }

  public openDirectory() {
    this.selectFilePath(() => this.loadFiles());
  }

  public close() {
    this.electronService.remote.getCurrentWindow().close();
  }

  readFileAsync(filename) {
    return new Promise(function (resolve, reject) {
      window.fs.readFile(filename, 'utf8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        }
        else {
          if (err) {
            console.log(err);
          }
          resolve(data);
        }
      });
    });
  }

  deletePathAsync(path, pattern) {
    return new Promise(function (resolve, reject) {
      window.fs.readdir(path, (err, files) => {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        }
        else {
          if (err) {
            console.log(err);
          }
          Promise.all((files || []).filter(fileName => pattern.test(fileName))
            .map(fileName => window.fs.unlink(Path.join(path, fileName), (err) => {
              if (err) throw err;
              console.log(`${Path.join(path, fileName)} was deleted`);
            }))).then((files) => resolve());
        }
      });
    });
  }

  writeFileAsync(file: { filename: string, content?: string, overwrite?: boolean }) {
    if (isNullOrUndefined(file.overwrite)) {
      file.overwrite = true;
    }
    return new Promise((resolve, reject) =>
      AppComponent.makeDir(Path.dirname(file.filename), () =>
        window.fs.exists(file.filename, (result) => file.overwrite || !result ?
          window.fs.writeFile(file.filename, file.content, 'utf8', function (err) {
            if (err && err.code !== 'ENOENT') {
              reject(err);
            } else {
              if (err) {
                console.log(err);
              }
              resolve();
            }
          }) : resolve()
        )
      )
    );
  }

  selectFilePath(callback?) {
    this.electronService.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (result) => {
      this.filePath = (result && result.length > 0) ? result[0] : this.filePath;
      this.path.configurationPath = Path.join(this.filePath, 'configuration');
      this.path.distPath = Path.join(this.filePath, 'dist');
      this.path.dataElements = Path.join(this.filePath, 'data');

      this.path.defaultConfig = Path.join(this.path.configurationPath, 'comparison-default.yml');
      this.path.config = Path.join(this.path.configurationPath, 'comparison.yml');
      this.path.autoConfig = Path.join(this.path.configurationPath, 'comparison-auto-config.yml');
      this.path.description = Path.join(this.path.configurationPath, 'description.md');
      this.path.data = Path.join(this.path.distPath, 'data.json');

      if (callback) {
        callback();
      }
    })
  }

  save() {
    if (this.filePath.length > 0) {
      let data = JSON.stringify(this.data.json());

      // Delete data files before saving
      this.deletePathAsync(this.path.dataElements, /.*\.md/).then(() => console.log('Data files deleted successfully!'));

      Promise.all([
        {filename: this.path.config, content: YAML.safeDump(this.configuration.json())},
        {filename: this.path.description, content: this.description},
        {filename: this.path.data, content: data},
        ...(this.data.dataElements.map((element) => {
          return {
            filename: Path.join(this.path.dataElements, element.name.replace(new RegExp(' ', 'g'), '') + '.md'),
            content: element.markdown()
          }
        }))
      ].map(this.writeFileAsync)).then(() => console.log('Files written successfully!')).catch((err) => console.log(err));

      Promise.all(
        this.requiredFiles
          .map(file => {
            if (file[0] === 'package.json') {
              file[1] = file[1].replace('##name', this.configuration.title.replace(new RegExp(' ', 'g'), '-'));
              file[1] = file[1].replace('##description', ' ');
              file[1] = file[1].replace('##version', '1.0.0');
            }

            return {filename: Path.join(this.filePath, file[0]), content: file[1], overwrite: file[2]};
          })
          .map(this.writeFileAsync)
      ).then(() => console.log('Required files written successfully!')).catch((err) => console.log(err));
    }

  }

  change(event?) {
    this.getYamlHtml();
    this.changeDetector.detectChanges();
  }

  getYamlHtml() {
    this.configurationYaml = this.hljs.highlightAuto(YAML.safeDump(this.configuration.json(), {
      'styles': {
        '!!undefined': '' // dump null as ~
      }
    }), ['yaml']).value;
  }

  private loadFiles() {
    if (!isNullOrUndefined(this.filePath) && this.filePath.length > 0) {
      // Load comparison.yml
      Promise.all([
        this.path.defaultConfig,
        this.path.config,
        this.path.autoConfig,
        this.path.description,
        this.path.data
      ].map(this.readFileAsync)).then((files: Array<string>) => {
        this.setConfig(files.slice(0, 3));
        this.change();
        this.description = files[3];
        this.data = Data.loadJson(JSON.parse(files[4]), this.configuration);
        this.changeDetector.detectChanges();
      });
    }
  }

  private setConfig(configurations: Array<string>) {
    const [defaultConfiguration, configuration, autoConfiguration] =
      configurations
        .map((configuration) => YAML.safeLoad(configuration))
        .map(value => (String(value) === 'undefined') ? undefined : value);
    let result = Configuration.load(configuration, defaultConfiguration);
    if (!isNullOrUndefined(autoConfiguration)) {
      result = result.combine(Configuration.load(autoConfiguration, defaultConfiguration, false));
    }

    this.configuration = result;
    this.defaultConfiguration = defaultConfiguration;
  }
}
