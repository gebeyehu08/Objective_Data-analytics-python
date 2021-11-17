import glob
import re
from os import path, makedirs
import json
from typing import Dict, List
from lxml import html, etree

"""
Copyright Objectiv B.V. 2021

Used to import Sphinx generated python docs into docusaurus. This script does the following:
- find all html pages in build/html
- extract the "body" from the page
- fix links in the "modules"
- extract toc from the html
- preserve order of left navbar, by extracting/saving that (using sidebar_order)
- write the static html to docusaurus/static/_{module}
- generate .mdx files, and write those to {docs}/{module}

"""

# html build dir / output of sphinx
html_dir = 'build/html/'

# root of docusaurus install
docusaurus_dir = '../../../objectiv.io/docs'
# where are the docs at
docs = 'docs'
# where to put static content
static = 'static'

# base dir of these docs (relative to docusaurus_dir/docs/
module = 'modeling'

docs_target = f'{docusaurus_dir}/{docs}/{module}'
# full path to base for the static files. note the `_` here. This is needed
# so docusaurus doesn't break this in a full build
static_target = f'{docusaurus_dir}/{static}/_{module}'

# the actual index page, as `index.html` should contain the index, that is main navigation/ toctree
index_page = 'intro'

# these categories only get a toplevel entry in the sidebar
# but no submenus for the headers
skip_categories = ['Introduction', 'Core Concepts', 'Examples']

# whitelist of pages to consider
patterns = [
    '^intro.html$'
]

# list of special cases, where we have a subdir, with an introduction at toplevel
# eg /dataframe.html and /dataframe/
for fn in glob.glob(f'{html_dir}/*'):
    dn = fn.replace('.html', '').lower()
    if path.isfile(fn) and path.isdir(dn):
        patterns.extend([f'{path.basename(dn)}.*', f'{path.basename(fn).replace(".html", "")}.*'])


def a_to_toc(a: html.Element, level: int) -> Dict:
    """
    provided an anchor HTML element, return a docusaurus toc item
    :param a: html.Element
    :param level: level of indentation in the toc, should be either 2 or 3
    :return: Dictionary with toc_item
    """
    return {
        'value': a.text.strip(),
        'id': a.get('href')[1:],
        'children': [],
        'level': level
    }


"""
structure of main navigation as in index.html
<div id=bd-docs-nav>
    <div>
        <ul>
            <li>
                <a href=#>
                    DataFrame
                </a>
                <ul>
                    <li>
                        <a href=dataframe/bach.DataFrame.html>
                            bach.DataFrame
                        </a>
                        <ul>
                            <li>
                                <a href=dataframe/bach.DataFrame.agg.html>
                                    bach.DataFrame.agg
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href=dataframe/bach.DataFrame.from_table.html>
                            bach.DataFrame.from_table
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>k
</div>

"""


def parse_ul_menu(ul: html.Element) -> List:
    menu_items = []
    for element in ul:
        item = {
            'children': []
        }
        if element.tag == 'ul':
            return parse_ul_menu(element)
        if element.tag == 'li':
            for sub_element in element:
                if sub_element.tag == 'a':
                    item['href'] = sub_element.get('href')
                    item['text'] = sub_element.text.strip()
                elif sub_element.tag == 'ul':
                    item['children'] += parse_ul_menu(sub_element)
                else:
                    print(f'unknown tag in sub_element: {sub_element.tag}')
        else:
            print(f'unknown tag in element: {element.tag}')
        menu_items.append(item)
    return menu_items


def menu_list_to_sidebar(menu_items: list, level: int = 0) -> List[Dict[str, str]]:
    sb = []
    for menu_item in menu_items:
        items = []
        href = menu_item['href']
        if '#' in href:
            if menu_item['href'].startswith('intro'):
                # intro is the "index" page, so correct path
                href = menu_item['href'].replace('intro', '')

            if level > 0 or len(menu_item['children']) == 0 or menu_item['text'] in skip_categories:
                href = href.replace('.html', '')

                items = [{
                    'type': 'link',
                    'label': menu_item['text'],
                    'href': f"/modeling/{href}"
                }]
        else:
            href = href.replace('.html', '')
            label = menu_item['text']

            # if this is a deeper nested item, and a method name, let's remove the classname
            # for better readability.
            parts = label.split('.')
            if level > 1 and len(parts) > 1:
                label = parts[-1]

            items = [{
                'type': 'doc',
                'label': label,
                'id': f'modeling/{href}'
            }]
        if len(menu_item['children']) > 0 and menu_item['text'] not in skip_categories:
            menu_item_children = []
            if level > 0:
                print(f'moving parent {menu_item["text"]} into children')
                # get parent, and put in here
                menu_item_children = [i for i in items]
                items = []
            menu_item_children += menu_list_to_sidebar(menu_item['children'], level=level + 1)

            items.append({
                'type': 'category',
                'label': menu_item['text'],
                'items': menu_item_children
            })
        if len(items) > 0:
            sb += items
    return sb


# generate docusaurus sidebar
doc = html.parse(f'{html_dir}/index.html')

menu_list = doc.xpath('//div[@class="toctree-wrapper compound"]/ul')
menu = parse_ul_menu(menu_list)

sidebar = menu_list_to_sidebar(menu)
sidebars = [{
    'type': 'link',
    'href': '/modeling/',
    'label': 'Introduction'
}]
sidebar_js = f"""
module.exports = {json.dumps(sidebar, indent=4)}
"""

# now write html body
html_path = f'{docs_target}/sidebar.js'
with open(html_path, 'w') as target_handle:
    target_handle.write(sidebar_js)

# sort urls alphabetically, remove .html
urls = glob.glob(f"{html_dir}/**/*.html", recursive=True)
for url in urls:
    # this is the url to the original html fragment
    # it's an absolute url, docusaurus will take care of the rest
    real_url = url.replace(html_dir, "")
    page = path.basename(url).replace('.html', '')

    print(f'{url} -> {real_url} {page}')

    match = False
    for pattern in patterns:
        if re.match(pattern, real_url):
            match = True
    if not match:
        print(f'ignoring {real_url}')
        continue

    # dir where .mdx will be stored
    docs_target_dir = f'{docs_target}/{path.dirname(real_url)}'
    mdx_path = f'{docs_target}/{real_url.replace(".html", ".mdx")}'

    static_target_dir = f'{static_target}/{path.dirname(real_url)}'

    # create dir if needed
    if not path.isdir(docs_target_dir):
        print(f'creating {docs_target_dir}')
        makedirs(docs_target_dir)

    # create dir if needed
    if not path.isdir(static_target_dir):
        print(f'creating {static_target_dir}')
        makedirs(static_target_dir)

    doc = html.parse(url)

    # here we get the body
    # we look for <main role="main"....>
    body_element: html.Element = doc.xpath('//main[@role="main"]/div')[0]

    body = etree.tostring(body_element).decode('utf-8')

    # get title from <title> text </title>
    title = doc.xpath('//title/text()')[0]

    toc = []
    # get toc from:
    # <nav id="bd-toc-nav">/ul
    # contains an unordered list (<ul> of toc items)
    # this is typically only 2 layers deep, so no need for recursion here
    toc_containers = doc.xpath('//nav[@id="bd-toc-nav"]/ul')

    if len(toc_containers) > 0:
        toc_container = toc_containers[0]
        toc_item = None
        for l1_item in toc_container:
            children = []
            for l2_item in l1_item:
                if l2_item.tag == 'a':
                    # this is a toplevel menu item
                    toc_item = a_to_toc(l2_item, 2)
                elif l2_item.tag == 'ul':
                    for l3_item in l2_item.findall('li/a'):
                        children.append(a_to_toc(l3_item, 3))
            if toc_item:
                toc_item['children'] = children
                toc.append(toc_item)

    if page == index_page:
        # special case where we map the index to Introduction
        slug = f'/{module}'
        sidebar_label = 'Introduction'

    else:
        slug = f'/{module}/{real_url.replace(".html", "")}'
        # don't override sidebar_label by default, so we can set it from the sidebar.js
        sidebar_label = None

    # template for the mdx file
    # please leave the whitespace as is (it's part of the markdown)
    mdx = \
        f"""---
id: {real_url.replace('.html', '').split('/')[-1]}
title: {title}
hide_title: true
slug: {slug}
{f"sidebar_label: {sidebar_label}" if sidebar_label else ''}

---

export const toc = {json.dumps(toc, indent=4)};


import SphinxPages from '@site/src/components/sphinx-page'
import useBaseUrl from '@docusaurus/useBaseUrl'


<SphinxPages url={{useBaseUrl('{module}/{real_url}')}} />
"""

    print(f'writing to {mdx_path}')
    with open(mdx_path, 'w') as target_handle:
        target_handle.write(mdx)

    # now write html body
    html_path = f'{static_target}/{real_url}'
    with open(html_path, 'w') as target_handle:
        target_handle.write(body)
