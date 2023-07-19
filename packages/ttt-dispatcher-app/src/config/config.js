import * as Colors from '@mui/material/colors';
import log from '../Shared/utils/logger';

const storageKey = 'lcConfig';

export const getAppConfig = () => {
    try {
        let config = getlocalStorageConfig();
        return config
            ? config
            : require('./config.local.json');
    } catch (e) {
        log.warn('Loading default config');
        return require('./config.default.json');
    }
}

export const jmriHosts = [
    'http://tamarackpi:12080/json/',
    'http://traincontrol:12080/json/',
    'http://localhost:12080/json/',
    'http://tamarackjunctionmbp.local:12080/json/'
];

// export const apiHosts = [
//     'http://tamarackpi:5000',
//     'http://traincontrol:5000',
//     'http://localhost:5000',
//     'http://tamarackjunctionmbp.local:5000'
// ];

export const apiHosts = [
    'ws://localhost:8080',
    'ws://tamarackjunctionmbp.local:8080',
    'ws://tamarackpi:8080',
    'ws://traincontrol:8080'
];

export const layoutIds = [
    'tam',
    'traincontrol',
    'betatrack'
];

export const updateConfig = newConfig =>
    window.localStorage.setItem(storageKey, JSON.stringify(newConfig));

const getlocalStorageConfig = () => {
    const config = window.localStorage.getItem(storageKey);
    return config ? JSON.parse(config) : null;
}

const defaultColor = Colors.grey[500];

export const linesConfig = [
    { lineId: 'Mainline Red', color: Colors.red[500] },
    { lineId: 'Mainline Green', color: Colors.green[500] },
    { lineId: 'Tamarack Station', color: Colors.cyan[500] }
];
  
export const sectionsConfig = [
    { sectionId: 'Tamarack South', color: Colors.blueGrey[500] },
    { sectionId: 'Tamarack North', color: Colors.purple[500] },
    { sectionId: 'Tamarack Plaza', color: Colors.teal[500] },
    { sectionId: 'City North', color: Colors.orange[500] }
];
  
export const effectsConfig = [
    { effectId: 'Light', color: Colors.red[500] },
    { effectId: 'Lighting Animation', color: Colors.amber[500] },
    { effectId: 'Sound Loop', color: Colors.teal[500] },
    { effectId: 'Sound', color: Colors.indigo[500] },
    { effectId: 'Signal', color: Colors.green[500] }
];

export const getSectionColor = sectionId => {
    const section = sectionsConfig.find(s => s.sectionId === sectionId);
    return section ? section.color : defaultColor;
}

export const getLineColor = lineId => {
    const line = linesConfig.find(s => s.lineId === lineId);
    return line ? line.color : defaultColor;
}

export const getEffectColor = effectId => {
    const effect = effectsConfig.find(s => s.effectId === effectId);
    return effect ? effect.color : defaultColor;
}

export default getAppConfig;