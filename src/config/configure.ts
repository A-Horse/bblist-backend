import * as yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';
import * as R from 'ramda';

class Configure {
  private configMap: {
    DISABLE_SIGNUP: boolean | null;
    SERVE_PORT: number;
    JWT_EXP_HOURS: number;
    SERCET_KEY: string;
  };
  private customConfigMap: any;

  constructor() {
    this.configMap = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../../config.yaml'), 'utf8')
    );
    this.customConfigMap = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../../custom-config.yaml'), 'utf8')
    );

    this.overrideConfigKeyFromCustomConfig();
    this.overrideConfigKeyFromEnv();
  }

  public getConfig() {
    return this.configMap;
  }

  public getConfigByKey(key: string) {
    return this.configMap[key];
  }

  public get(key: string): any {
    return this.configMap[key];
  }

  private overrideConfigKeyFromCustomConfig() {
    this.configMap = R.mapObjIndexed((value: string, key: string, config: any) => {
      if (this.customConfigMap[key]) {
        config[key] = this.customConfigMap[key];
      }
      return config[key];
    }, this.configMap);
  }

  private overrideConfigKeyFromEnv() {
    this.configMap = R.mapObjIndexed((value: string, key: string, config: any) => {
      if (process.env['OCTO_' + key]) {
        config[key] = process.env['OCTO_' + key];
      }
      return config[key];
    }, this.configMap);
  }
}

export const configure = new Configure();