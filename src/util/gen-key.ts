import {randomUUID} from 'crypto';

export const genRandomFileName = () => `temp${randomUUID()}.json`