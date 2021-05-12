import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  private environmentDisplay;

  constructor() {
    // In index.html we load a javascript file with environment-specific settings,
    // populated from mounted ConfigMap in OpenShift. This file sets window.localStorage settings
    // Locally if empty the local default will be used.

    const envName = window.localStorage.getItem('fom_environment_name');
    this.environmentDisplay = (envName == undefined || envName.length == 0) ? 'local' : envName;
    if (this.environmentDisplay == 'prod') {
      this.environmentDisplay = null;
    }
  }

  // Return the environment to display to users, will be null for production.
  getEnvironmentDisplay(): string {
    return this.environmentDisplay;
  }
}
