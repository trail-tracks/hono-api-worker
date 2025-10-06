import { DOMParser as XmldomParser } from '@xmldom/xmldom';

interface GlobalWithDomParser {
  DOMParser?: typeof XmldomParser;
}

const globalWithDomParser = globalThis as GlobalWithDomParser;

if (typeof globalWithDomParser.DOMParser === 'undefined') {
  globalWithDomParser.DOMParser = XmldomParser;
}
