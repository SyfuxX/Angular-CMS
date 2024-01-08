import * as process from 'process';
import { ConfigInterface } from './config.interface';
import developmentConfig from './development.config';
import productionConfig from './production.config';

export class ConfigService {
    public get config(): ConfigInterface {
        const isProduction: boolean = process.env.NODE_ENV === 'production';
        
        return isProduction ? productionConfig : developmentConfig;
    }
}
