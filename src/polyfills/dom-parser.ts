import { DOMParser as XmldomParser } from '@xmldom/xmldom';

type GlobalWithDomParser = typeof globalThis & {
  DOMParser?: typeof XmldomParser;
};

const globalWithDomParser = globalThis as GlobalWithDomParser;

if (typeof globalWithDomParser.DOMParser === 'undefined') {
  globalWithDomParser.DOMParser = XmldomParser;
}
