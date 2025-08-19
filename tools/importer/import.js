/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero4Parser from './parsers/hero4.js';
import accordion5Parser from './parsers/accordion5.js';
import columns7Parser from './parsers/columns7.js';
import accordion10Parser from './parsers/accordion10.js';
import cards11Parser from './parsers/cards11.js';
import cards17Parser from './parsers/cards17.js';
import hero13Parser from './parsers/hero13.js';
import cards14Parser from './parsers/cards14.js';
import columns9Parser from './parsers/columns9.js';
import columns3Parser from './parsers/columns3.js';
import cardsNoImages19Parser from './parsers/cardsNoImages19.js';
import columns18Parser from './parsers/columns18.js';
import cards23Parser from './parsers/cards23.js';
import columns25Parser from './parsers/columns25.js';
import hero26Parser from './parsers/hero26.js';
import columns6Parser from './parsers/columns6.js';
import tabs29Parser from './parsers/tabs29.js';
import cards30Parser from './parsers/cards30.js';
import tabs12Parser from './parsers/tabs12.js';
import cards28Parser from './parsers/cards28.js';
import cards1Parser from './parsers/cards1.js';
import embedVideo34Parser from './parsers/embedVideo34.js';
import columns31Parser from './parsers/columns31.js';
import columns8Parser from './parsers/columns8.js';
import cards33Parser from './parsers/cards33.js';
import cards2Parser from './parsers/cards2.js';
import columns21Parser from './parsers/columns21.js';
import columns37Parser from './parsers/columns37.js';
import columns39Parser from './parsers/columns39.js';
import accordion42Parser from './parsers/accordion42.js';
import accordion41Parser from './parsers/accordion41.js';
import table27Parser from './parsers/table27.js';
import cards45Parser from './parsers/cards45.js';
import tabs35Parser from './parsers/tabs35.js';
import carousel24Parser from './parsers/carousel24.js';
import columns38Parser from './parsers/columns38.js';
import hero49Parser from './parsers/hero49.js';
import columns50Parser from './parsers/columns50.js';
import tabs48Parser from './parsers/tabs48.js';
import cards53Parser from './parsers/cards53.js';
import columns54Parser from './parsers/columns54.js';
import columns47Parser from './parsers/columns47.js';
import cards57Parser from './parsers/cards57.js';
import cards52Parser from './parsers/cards52.js';
import cards58Parser from './parsers/cards58.js';
import cards60Parser from './parsers/cards60.js';
import cards59Parser from './parsers/cards59.js';
import table36Parser from './parsers/table36.js';
import tabs32Parser from './parsers/tabs32.js';
import columns51Parser from './parsers/columns51.js';
import columns46Parser from './parsers/columns46.js';
import columns64Parser from './parsers/columns64.js';
import carousel63Parser from './parsers/carousel63.js';
import cards65Parser from './parsers/cards65.js';
import columns40Parser from './parsers/columns40.js';
import accordion71Parser from './parsers/accordion71.js';
import columns73Parser from './parsers/columns73.js';
import cards74Parser from './parsers/cards74.js';
import embedVideo72Parser from './parsers/embedVideo72.js';
import search70Parser from './parsers/search70.js';
import search67Parser from './parsers/search67.js';
import accordion76Parser from './parsers/accordion76.js';
import cards83Parser from './parsers/cards83.js';
import tableBordered79Parser from './parsers/tableBordered79.js';
import cards84Parser from './parsers/cards84.js';
import search68Parser from './parsers/search68.js';
import columns75Parser from './parsers/columns75.js';
import cards86Parser from './parsers/cards86.js';
import cards89Parser from './parsers/cards89.js';
import columns43Parser from './parsers/columns43.js';
import columns92Parser from './parsers/columns92.js';
import columns94Parser from './parsers/columns94.js';
import columns95Parser from './parsers/columns95.js';
import cards96Parser from './parsers/cards96.js';
import columns91Parser from './parsers/columns91.js';
import cards98Parser from './parsers/cards98.js';
import tableBordered80Parser from './parsers/tableBordered80.js';
import hero99Parser from './parsers/hero99.js';
import columns77Parser from './parsers/columns77.js';
import embedVideo100Parser from './parsers/embedVideo100.js';
import tabs102Parser from './parsers/tabs102.js';
import columns105Parser from './parsers/columns105.js';
import cards97Parser from './parsers/cards97.js';
import accordion56Parser from './parsers/accordion56.js';
import accordion103Parser from './parsers/accordion103.js';
import columns61Parser from './parsers/columns61.js';
import accordion88Parser from './parsers/accordion88.js';
import accordion101Parser from './parsers/accordion101.js';
import cards82Parser from './parsers/cards82.js';
import tabs93Parser from './parsers/tabs93.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero4: hero4Parser,
  accordion5: accordion5Parser,
  columns7: columns7Parser,
  accordion10: accordion10Parser,
  cards11: cards11Parser,
  cards17: cards17Parser,
  hero13: hero13Parser,
  cards14: cards14Parser,
  columns9: columns9Parser,
  columns3: columns3Parser,
  cardsNoImages19: cardsNoImages19Parser,
  columns18: columns18Parser,
  cards23: cards23Parser,
  columns25: columns25Parser,
  hero26: hero26Parser,
  columns6: columns6Parser,
  tabs29: tabs29Parser,
  cards30: cards30Parser,
  tabs12: tabs12Parser,
  cards28: cards28Parser,
  cards1: cards1Parser,
  embedVideo34: embedVideo34Parser,
  columns31: columns31Parser,
  columns8: columns8Parser,
  cards33: cards33Parser,
  cards2: cards2Parser,
  columns21: columns21Parser,
  columns37: columns37Parser,
  columns39: columns39Parser,
  accordion42: accordion42Parser,
  accordion41: accordion41Parser,
  table27: table27Parser,
  cards45: cards45Parser,
  tabs35: tabs35Parser,
  carousel24: carousel24Parser,
  columns38: columns38Parser,
  hero49: hero49Parser,
  columns50: columns50Parser,
  tabs48: tabs48Parser,
  cards53: cards53Parser,
  columns54: columns54Parser,
  columns47: columns47Parser,
  cards57: cards57Parser,
  cards52: cards52Parser,
  cards58: cards58Parser,
  cards60: cards60Parser,
  cards59: cards59Parser,
  table36: table36Parser,
  tabs32: tabs32Parser,
  columns51: columns51Parser,
  columns46: columns46Parser,
  columns64: columns64Parser,
  carousel63: carousel63Parser,
  cards65: cards65Parser,
  columns40: columns40Parser,
  accordion71: accordion71Parser,
  columns73: columns73Parser,
  cards74: cards74Parser,
  embedVideo72: embedVideo72Parser,
  search70: search70Parser,
  search67: search67Parser,
  accordion76: accordion76Parser,
  cards83: cards83Parser,
  tableBordered79: tableBordered79Parser,
  cards84: cards84Parser,
  search68: search68Parser,
  columns75: columns75Parser,
  cards86: cards86Parser,
  cards89: cards89Parser,
  columns43: columns43Parser,
  columns92: columns92Parser,
  columns94: columns94Parser,
  columns95: columns95Parser,
  cards96: cards96Parser,
  columns91: columns91Parser,
  cards98: cards98Parser,
  tableBordered80: tableBordered80Parser,
  hero99: hero99Parser,
  columns77: columns77Parser,
  embedVideo100: embedVideo100Parser,
  tabs102: tabs102Parser,
  columns105: columns105Parser,
  cards97: cards97Parser,
  accordion56: accordion56Parser,
  accordion103: accordion103Parser,
  columns61: columns61Parser,
  accordion88: accordion88Parser,
  accordion101: accordion101Parser,
  cards82: cards82Parser,
  tabs93: tabs93Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
