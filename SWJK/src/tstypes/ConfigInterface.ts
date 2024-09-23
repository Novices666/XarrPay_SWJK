// config.ts
import config from './config.json';

interface AppConfig {
  apiUrl: string;
}

const Config: AppConfig = config;

export default Config;
