import { DOMParser as XmldomParser, DOMImplementation } from '@xmldom/xmldom';

type GlobalWithDomParser = typeof globalThis & {
  DOMParser?: typeof XmldomParser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Node?: any;
};

const globalWithDomParser = globalThis as GlobalWithDomParser;

// Polyfill DOMParser
if (typeof globalWithDomParser.DOMParser === 'undefined') {
  globalWithDomParser.DOMParser = XmldomParser;
}

// Polyfill Node (necessário para o AWS SDK)
if (typeof globalWithDomParser.Node === 'undefined') {
  const domImpl = new DOMImplementation();
  const doc = domImpl.createDocument(null, 'root', null);

  if (doc.documentElement) {
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(doc.documentElement));
    const NodeConstructor = proto.constructor;

    // Define Node constants
    NodeConstructor.ELEMENT_NODE = 1;
    NodeConstructor.ATTRIBUTE_NODE = 2;
    NodeConstructor.TEXT_NODE = 3;
    NodeConstructor.CDATA_SECTION_NODE = 4;
    NodeConstructor.PROCESSING_INSTRUCTION_NODE = 7;
    NodeConstructor.COMMENT_NODE = 8;
    NodeConstructor.DOCUMENT_NODE = 9;
    NodeConstructor.DOCUMENT_TYPE_NODE = 10;
    NodeConstructor.DOCUMENT_FRAGMENT_NODE = 11;

    globalWithDomParser.Node = NodeConstructor;
  }
}
