'use strict';

function blocksToHtml(blocks) {
    let htmlBlocks = '';
    htmlBlocks += '<div class="editorjs-show">';
    htmlBlocks += '<div class="editorjs-show__html">';

    let startBlock = () => {
        return '<div class="ce-block"><div class="ce-block__content">';
    };
    let endBlock = () => {
        return '</div></div>';
    };

    let html = '';

    htmlBlocks += blocks.map(block => {
        switch (block.type) {
            case 'code':
                return `<pre><code>${ block.data.code }</pre></code>`;

            case 'heading':
            case 'header':
                return `<h${ block.data.level }>${ block.data.text }</h${ block.data.level }>`;

            case 'image':
                let classes = []
                if (block.data.stretched) {
                    classes.push('stretched');
                }
                if (block.data.withBorder) {
                    classes.push('border');
                }
                if (block.data.withBackground) {
                    classes.push('bg-light');
                }
                return startBlock()
                    + '<figure>'
                    + `<img class="${ classes.join(' ') }" src="${ block.data.file.url }" style="max-width: 100%; margin: 0 auto; display: block;">${ block.data.caption }`
                    + '</figure>'
                    + endBlock();

            case 'list':
                let ul = '';
                let listItems = block.data.items.map(item => {
                    return `<li>${ item }</li>`;
                })
                if (block.data.style === 'ordered') {
                    ul = `<ol>${ listItems.join('') }</ol>`;
                } else if (block.data.style === 'unordered') {
                    ul = `<ul>${ listItems.join('') }</ul>`;
                }
                if(ul.length>0) {
                    ul = startBlock() + ul + endBlock();
                }
                return ul;

            case 'paragraph':
                return startBlock()
                    + `<p>${ block.data.text }</p>`
                    + endBlock();

            case 'delimiter':
                return startBlock()
                    + '<div class="ce-delimiter cdx-block"></div>'
                    + endBlock();

            case 'checklist':
                let checklist = '';
                block.data.items.map((item) => {
                    let checked_ext = '';
                    if ( item.checked ) {
                        checked_ext = '--checked'
                    }
                    checklist += '<div class="cdx-checklist__item cdx-checklist__item'
                        + checked_ext
                        + '">'
                        + '<span class="cdx-checklist__item-checkbox"></span>'
                        + '<div class="cdx-checklist__item-text">'
                        + item.text
                        + '</div>'
                        + '</div>';
                });
                return startBlock()
                    + '<div class="cdx-block cdx-checklist">'
                    + checklist
                    + '</div>'
                    + endBlock();

            case 'quote':
                let caption = '';
                if (block.data.caption) {
                    caption = `<footer>${ block.data.caption }</footer>`;
                }
                return startBlock()
                    + `<blockquote>${ block.data.text }${ caption }</blockquote>`
                    + endBlock();

            case 'raw':
                return startBlock() + block.data.html + endBlock();

            case 'table':
                let tableRows = block.data.content.map(row => {
                    let tableCells = row.map(cell => {
                        `<td class="tc-table__cell"><div class="tc-table__area">${ cell }</div></td>`
                    });
                    return `<tr>${ tableCells.join('') }</tr>`
                });
                return startBlock()
                    + '<div class="tc-editor cdx-block"><div class="tc-table__wrap">'
                    + `<table class="tc-table"><tbody>${ tableRows.join('') }</tbody></table>`
                    + '</div></div>'
                    + endBlock();

            case 'attaches':
                return startBlock()
                    + `<a href="${block.data.file.url}">${block.data.file.name}</a>`
                    + endBlock();

            case 'linkTool':
                if(blocksToHtml(block.data.link)) {
                    return '';
                }
                html = startBlock()
                    + '<div class="link_block">'
                    + `<a href="${block.data.link}" title="${ block.data.meta.title }" class="link_block__content" target="_blank">`
                    + '<figure class="link_block__content--rendered">';
                // + `<div class="link_block__image" style="background-image: url(${ block.data.meta.image.url })"></div>`;
                // + `<div class="link_block__title">${ block.data.caption }</div>`
                // + `<div class="link_block__description">${ block.data.meta.description }</div>`
                // + `<div class="link_block__anchor">${ block.data.meta.anchor }</div>`
                // + `<img src="${ block.data.meta.image.url }" style="max-width: 100%;">${ block.data.caption }`
                // + '</figure>';
                if(!blocksToHtml(block.data.meta?.image?.url)) {
                    html += `<div class="link_block__image" style="background-image: url(${ block.data.meta.image.url })"></div>`;
                }
                if(!blocksToHtml(block.data.meta.title)) {
                    html += `<div class="link_block__title">${ block.data.meta.title }</div>`;
                }
                if(!blocksToHtml(block.data.meta.description)) {
                    html += `<div class="link_block__description">${ block.data.meta.description }</div>`;
                }
                if(!blocksToHtml(block.data.link)) {
                    let url = new URL(block.data.link);
                    console.log(url);
                    html += `<div class="link_block__anchor">${ url.hostname }</div>`;
                }
                html += `</figure></a></div>` + endBlock();
                return html;

            case 'embed':
                console.log(block.data.embed);
                html = startBlock()
                    + '<div class="cdx-block embed-tool embed_block">'
                    + `<iframe 
                            style="width:100%;" 
                            width="${ block.data.width ?? '640' }" 
                            height="${ block.data.height ?? '320' }" 
                            src="${ block.data.embed }" 
                            class="embed-tool__content"
                            frameborder="0" 
                            allow="accelerometer; 
                            encrypted-media; 
                            gyroscope; 
                            picture-in-picture" 
                            allowfullscreen></iframe>`;
                if(!blocksToHtml(block.data.caption)) {
                    html += `<p class="embed_block__title">${block.data.caption}</p>`;
                }
                html +='</div>' + endBlock();
                return html;

            default: return '';
        }
    }).join('');

    htmlBlocks += '</div>';
    htmlBlocks += '</div>';

    return htmlBlocks;
}

module.exports = blocksToHtml;

// Allow use of default import syntax in TypeScript
module.exports.default = blocksToHtml;